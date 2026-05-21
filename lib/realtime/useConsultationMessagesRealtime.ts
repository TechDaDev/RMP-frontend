"use client";

import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "@/lib/api/config";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { getAccessToken } from "@/lib/auth/tokenStorage";

type ConnectionState = "idle" | "connecting" | "open" | "closed" | "error";

interface ConsultationUpdatedPayload {
  id: string;
  status?: string;
  created_at?: string;
  accepted_at?: string | null;
  closed_at?: string | null;
  updated_at?: string;
}

interface UseConsultationMessagesRealtimeOptions<TMessage> {
  consultationId?: string;
  enabled: boolean;
  onMessageCreated: (message: TMessage) => void;
  onMessagesRead?: (payload: { consultation_id: string; reader_id?: string; count?: number }) => void;
  onConsultationUpdated?: (consultation: ConsultationUpdatedPayload) => void;
  onFallbackSync?: () => Promise<void> | void;
}

const RECONNECT_DELAY_MS = 3000;
const FALLBACK_POLL_INTERVAL_MS = 10000;
const TOKEN_CHECK_INTERVAL_MS = 2000;

function buildWebSocketUrl(consultationId: string, token: string): string {
  const base = new URL(API_BASE_URL);
  base.protocol = base.protocol === "https:" ? "wss:" : "ws:";
  base.pathname = API_ENDPOINTS.websocket.consultationMessages(consultationId);
  base.search = new URLSearchParams({ token }).toString();
  return base.toString();
}

export function useConsultationMessagesRealtime<TMessage>({
  consultationId,
  enabled,
  onMessageCreated,
  onMessagesRead,
  onConsultationUpdated,
  onFallbackSync,
}: UseConsultationMessagesRealtimeOptions<TMessage>) {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const fallbackPollRef = useRef<number | null>(null);
  const tokenWatcherRef = useRef<number | null>(null);
  const currentTokenRef = useRef<string | null>(null);
  const callbackRef = useRef({
    onMessageCreated,
    onMessagesRead,
    onConsultationUpdated,
    onFallbackSync,
  });
  const [connectionState, setConnectionState] = useState<ConnectionState>("idle");
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    callbackRef.current = {
      onMessageCreated,
      onMessagesRead,
      onConsultationUpdated,
      onFallbackSync,
    };
  }, [onConsultationUpdated, onFallbackSync, onMessageCreated, onMessagesRead]);

  useEffect(() => {
    if (!enabled || !consultationId) {
      return undefined;
    }

    let disposed = false;

    const clearReconnectTimer = () => {
      if (reconnectTimerRef.current !== null) {
        window.clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
    };

    const stopFallbackPolling = () => {
      if (fallbackPollRef.current !== null) {
        window.clearInterval(fallbackPollRef.current);
        fallbackPollRef.current = null;
      }
      setUsingFallback(false);
    };

    const startFallbackPolling = () => {
      if (fallbackPollRef.current !== null) {
        return;
      }

      setUsingFallback(true);
      fallbackPollRef.current = window.setInterval(() => {
        void callbackRef.current.onFallbackSync?.();
      }, FALLBACK_POLL_INTERVAL_MS);
    };

    const closeSocket = () => {
      const socket = socketRef.current;
      socketRef.current = null;
      if (!socket) {
        return;
      }
      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;
      socket.close();
    };

    const scheduleReconnect = () => {
      if (disposed) {
        return;
      }

      clearReconnectTimer();
      startFallbackPolling();
      reconnectTimerRef.current = window.setTimeout(() => {
        void callbackRef.current.onFallbackSync?.();
        connect();
      }, RECONNECT_DELAY_MS);
    };

    const connect = () => {
      if (disposed) {
        return;
      }

      const token = getAccessToken();
      if (!token) {
        console.warn("[consultation-ws] missing access token", { consultationId });
        setConnectionState("closed");
        scheduleReconnect();
        return;
      }

      currentTokenRef.current = token;
      closeSocket();
      clearReconnectTimer();
      setConnectionState("connecting");

      const socket = new WebSocket(buildWebSocketUrl(consultationId, token));
      socketRef.current = socket;

      socket.onopen = () => {
        if (disposed || socketRef.current !== socket) {
          return;
        }
        console.info("[consultation-ws] open", { consultationId });
        setConnectionState("open");
        stopFallbackPolling();
      };

      socket.onmessage = (event) => {
        if (disposed || socketRef.current !== socket) {
          return;
        }

        console.debug("[consultation-ws] message", { consultationId, data: event.data });

        let payload: unknown;
        try {
          payload = JSON.parse(event.data);
        } catch (error) {
          console.error("[consultation-ws] invalid payload", { consultationId, error });
          return;
        }

        if (!payload || typeof payload !== "object" || !("type" in payload)) {
          return;
        }

        const typedPayload = payload as { type?: string };

        switch (typedPayload.type) {
          case "chat.message.created": {
            const messagePayload = payload as unknown as { message?: TMessage };
            if (messagePayload.message) {
              callbackRef.current.onMessageCreated(messagePayload.message);
            }
            break;
          }
          case "chat.messages.read": {
            const readPayload = payload as unknown as {
              consultation_id: string;
              reader_id?: string;
              count?: number;
            };
            callbackRef.current.onMessagesRead?.(readPayload);
            break;
          }
          case "consultation.updated": {
            const consultationPayload = payload as unknown as { consultation?: ConsultationUpdatedPayload };
            if (consultationPayload.consultation) {
              callbackRef.current.onConsultationUpdated?.(consultationPayload.consultation);
            }
            break;
          }
          default:
            console.debug("[consultation-ws] unhandled event", {
              consultationId,
              type: typedPayload.type,
            });
        }
      };

      socket.onerror = (event) => {
        if (disposed || socketRef.current !== socket) {
          return;
        }
        console.error("[consultation-ws] error", { consultationId, event });
        setConnectionState("error");
      };

      socket.onclose = (event) => {
        if (socketRef.current === socket) {
          socketRef.current = null;
        }
        if (disposed) {
          return;
        }
        console.warn("[consultation-ws] close", {
          consultationId,
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        });
        setConnectionState("closed");
        scheduleReconnect();
      };
    };

    connect();

    tokenWatcherRef.current = window.setInterval(() => {
      const nextToken = getAccessToken();
      if (!nextToken || nextToken === currentTokenRef.current) {
        return;
      }

      console.info("[consultation-ws] token updated, reconnecting", { consultationId });
      currentTokenRef.current = nextToken;
      connect();
    }, TOKEN_CHECK_INTERVAL_MS);

    return () => {
      disposed = true;
      clearReconnectTimer();
      stopFallbackPolling();
      if (tokenWatcherRef.current !== null) {
        window.clearInterval(tokenWatcherRef.current);
        tokenWatcherRef.current = null;
      }
      closeSocket();
    };
  }, [consultationId, enabled]);

  return {
    connectionState: enabled && consultationId ? connectionState : "idle",
    usingFallback: enabled && Boolean(consultationId) ? usingFallback : false,
  };
}