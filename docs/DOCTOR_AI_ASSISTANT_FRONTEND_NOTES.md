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

## Realtime Strategy

- Current codebase has consultation-scoped chat websocket hook only.
- User websocket endpoint exists (`/ws/user/`), but current backend docs only define notification/consultation/prescription/lab order/lab result events.
- No documented `doctor_ai.message.created` websocket event contract exists yet (payload schema + permission scope not specified).
- Phase 10G uses manual refresh and post-action reload for assistant stream consistency.
- Dedicated user-channel realtime support can be added in a future phase.

## Phase 10G.1 Build Stability

- Removed `next/font/google` usage from `app/layout.tsx` to avoid build-time remote fetch.
- Kept existing font variable strategy and repointed variables in `app/globals.css` to local/system stacks:
  - `--font-sans-latin: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
  - `--font-arabic: Tahoma, Arial, system-ui, sans-serif`
- Preserved RTL/LTR-specific font application and Arabic default direction bootstrapping.
- Production build now succeeds in restricted/offline environments where Google Fonts are unreachable.

## Phase 10G.1 Realtime Decision

- Realtime assistant hook intentionally deferred.
- Reason: backend websocket contract does not yet confirm doctor-only assistant event delivery (`doctor_ai.message.created`) on `/ws/user/`.
- Safety rule maintained: no assistant data is routed through consultation chat socket.

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
