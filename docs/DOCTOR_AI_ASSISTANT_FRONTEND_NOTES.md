# Doctor AI Assistant Frontend Notes

## Scope

Phase 10G adds a doctor-only AI assistant panel to the consultation workspace.

This integration intentionally keeps assistant messages separate from doctor-patient chat.

## Implemented Files

- app/(portal)/app/doctor/consultations/[id]/page.tsx
- components/doctor/DoctorConsultationWorkspace.tsx
- components/doctor/assistant/DoctorAIAssistantPanel.tsx
- components/doctor/assistant/DoctorAIAssistantMessageCard.tsx
- components/doctor/assistant/DoctorAIAssistantGenerateCard.tsx
- components/doctor/assistant/DoctorAIAssistantStatusBadge.tsx
- lib/api/endpoints.ts
- lib/doctor/doctorService.ts
- types/doctor.ts
- types/i18n.ts
- lib/i18n.ts

## API Endpoints (Frontend Mapping)

- GET /api/rag/consultations/{consultation_id}/doctor-ai-messages/
  - mapped as API_ENDPOINTS.ragDoctorAssistant.consultationMessages
- POST /api/rag/medical-reports/{report_id}/doctor-ai-message/
  - mapped as API_ENDPOINTS.ragDoctorAssistant.generateFromMedicalReport
- GET /api/rag/doctor-ai-messages/{message_id}/
  - mapped as API_ENDPOINTS.ragDoctorAssistant.detail
- POST /api/rag/doctor-ai-messages/{message_id}/mark-read/
  - mapped as API_ENDPOINTS.ragDoctorAssistant.markRead

## Frontend Behavior

- Consultation page loads assistant messages in dedicated state:
  - assistantMessages
  - assistantLoading
  - assistantError
  - assistantGenerating
- Generating a new assistant message triggers backend generation from report ID, then reloads assistant list.
- Mark read/unread updates local assistant message state and preserves newest-first ordering.
- Existing consultation chat list, send flow, and chat realtime hook remain unchanged.

## Realtime Strategy (Phase 10G.2B)

- Added dedicated doctor assistant realtime hook in `lib/realtime/useDoctorAIAssistantRealtime.ts`.
- WebSocket endpoint used: `/ws/user/?token=<access_token>`.
- Handled events:
  - `doctor_ai.message.created`
  - `doctor_ai.message.updated`
- Event safety filters:
  - ignores all non-assistant websocket events
  - applies assistant updates only when `message.consultation` matches active consultation ID
- Reliability behavior:
  - reconnect on close/error
  - reconnect when access token changes
  - fallback polling sync via existing assistant list API
- Consultation chat websocket remains unchanged in `useConsultationMessagesRealtime`.

## Phase 10G.1 Build Stability

- Removed `next/font/google` usage from `app/layout.tsx` to avoid build-time remote fetch.
- Kept existing font variable strategy and repointed variables in `app/globals.css` to local/system stacks:
  - `--font-sans-latin: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
  - `--font-arabic: Tahoma, Arial, system-ui, sans-serif`
- Preserved RTL/LTR-specific font application and Arabic default direction bootstrapping.
- Production build now succeeds in restricted/offline environments where Google Fonts are unreachable.

## Phase 10G.1 Realtime Decision

- This deferment has been superseded by Phase 10G.2B after backend websocket contract confirmation.

## Phase 10G.2B Authenticated QA Summary

- Doctor login and consultation detail access verified.
- Assistant panel rendered in doctor workspace and remained separate from consultation chat panel.
- Invalid report ID generation path returned safe error UI message.
- Consultation chat still sent and rendered doctor message normally.
- Patient login and consultation detail access verified.
- No assistant panel appeared in patient routes, and patient chat remained standard consultation messaging only.

Observed runtime limitation during live QA:

- Assistant list endpoint returned server error on the tested consultation context, so live mark-read/unread and websocket-created/update event assertions were limited to integration-level verification in frontend code plus fallback sync behavior.

## Safety and Privacy Constraints

- Assistant panel is doctor-only UI.
- Assistant copy explicitly states separation from patient-visible chat.
- Assistant message type is separate from DoctorMessage to prevent contract mixing.
- No patient portal component receives or renders assistant payloads.

## i18n

Added doctor assistant keys in:

- types/i18n.ts
- lib/i18n.ts (Arabic, Kurdish, English)

Covered key groups:

- Panel title/description and safety notices
- Generate form labels and actions
- Loading/error/empty states
- Message metadata labels (sources, confidence, fallback)
- Read/unread actions
- Status/safety badge labels

## Validation Checklist

- ESLint
- TypeScript noEmit
- Production build

All checks should be run after integration changes and before merge.
