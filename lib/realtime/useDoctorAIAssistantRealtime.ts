"use client";

import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "@/lib/api/config";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { getAccessToken } from "@/lib/auth/tokenStorage";
import type { DoctorAIAssistantMessage } from "@/types/doctor";

type ConnectionState = "idle" | "connecting" | "open" | "closed" | "error";

interface UseDoctorAIAssistantRealtimeOptions {
  consultationId?: string;
  enabled: boolean;
  onMessageCreated: (message: DoctorAIAssistantMessage) => void;
  onMessageUpdated: (message: DoctorAIAssistantMessage) => void;
  onFallbackSync?: () => Promise<void> | void;
}

const RECONNECT_DELAY_MS = 3000;
const FALLBACK_POLL_INTERVAL_MS = 10000;
const TOKEN_CHECK_INTERVAL_MS = 2000;

function buildWebSocketUrl(token: string): string {
  const base = new URL(API_BASE_URL);
  base.protocol = base.protocol === "https:" ? "wss:" : "ws:";
  base.pathname = API_ENDPOINTS.websocket.user;
  base.search = new URLSearchParams({ token }).toString();
  return base.toString();
}

function isAssistantEventPayload(payload: unknown): payload is {
  type: string;
  message: DoctorAIAssistantMessage;
} {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const candidate = payload as { type?: unknown; message?: unknown };
  if (typeof candidate.type !== "string") {
    return false;
  }

  if (!candidate.message || typeof candidate.message !== "object") {
    return false;
  }

  const message = candidate.message as Partial<DoctorAIAssistantMessage>;
  return typeof message.id === "string" && typeof message.consultation === "string";
}

export function useDoctorAIAssistantRealtime({
  consultationId,
  enabled,
  onMessageCreated,
  onMessageUpdated,
  onFallbackSync,
}: UseDoctorAIAssistantRealtimeOptions) {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const fallbackPollRef = useRef<number | null>(null);
  const tokenWatcherRef = useRef<number | null>(null);
  const currentTokenRef = useRef<string | null>(null);
  const callbackRef = useRef({
    onMessageCreated,
    onMessageUpdated,
    onFallbackSync,
  });
  const [connectionState, setConnectionState] = useState<ConnectionState>("idle");
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    callbackRef.current = {
      onMessageCreated,
      onMessageUpdated,
      onFallbackSync,
    };
  }, [onFallbackSync, onMessageCreated, onMessageUpdated]);

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
        console.warn("[doctor-ai-ws] missing access token", { consultationId });
        setConnectionState("closed");
        scheduleReconnect();
        return;
      }

      currentTokenRef.current = token;
      closeSocket();
      clearReconnectTimer();
      setConnectionState("connecting");

      const socket = new WebSocket(buildWebSocketUrl(token));
      socketRef.current = socket;

      socket.onopen = () => {
        if (disposed || socketRef.current !== socket) {
          return;
        }
        console.info("[doctor-ai-ws] open", { consultationId });
        setConnectionState("open");
        stopFallbackPolling();
      };

      socket.onmessage = (event) => {
        if (disposed || socketRef.current !== socket) {
          return;
        }

        let payload: unknown;
        try {
          payload = JSON.parse(event.data);
        } catch (error) {
          console.error("[doctor-ai-ws] invalid payload", { consultationId, error });
          return;
        }

        if (!isAssistantEventPayload(payload)) {
          return;
        }

        if (payload.message.consultation !== consultationId) {
          return;
        }

        switch (payload.type) {
          case "doctor_ai.message.created":
            callbackRef.current.onMessageCreated(payload.message);
            break;
          case "doctor_ai.message.updated":
            callbackRef.current.onMessageUpdated(payload.message);
            break;
          default:
            break;
        }
      };

      socket.onerror = (event) => {
        if (disposed || socketRef.current !== socket) {
          return;
        }
        console.error("[doctor-ai-ws] error", { consultationId, event });
        setConnectionState("error");
      };

      socket.onclose = (event) => {
        if (socketRef.current === socket) {
          socketRef.current = null;
        }
        if (disposed) {
          return;
        }
        console.warn("[doctor-ai-ws] close", {
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

      console.info("[doctor-ai-ws] token updated, reconnecting", { consultationId });
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
