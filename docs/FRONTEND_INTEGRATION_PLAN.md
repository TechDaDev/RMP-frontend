# Frontend Integration Plan

This plan defines implementation order after Phase 1 API contract mapping.

## Phase 2 — Auth Integration ✅ COMPLETE (commit f68ae06)

1. Create API base config and request wrapper. ✅
2. Implement auth endpoints: ✅
   - register
   - activate account (OTP)
   - resend activation OTP
   - login
   - password reset request/confirm
3. Add current-user bootstrap (`GET /api/accounts/me/`). ✅
4. Add route guards for authenticated vs anonymous routes. ✅
5. Add role-based redirect from `/app` to role route. ✅
6. Add refresh/logout flow after runtime verification of canonical backend endpoints. ✅
7. Add response normalizer supporting both `status` and `success` envelopes. ✅

## Phase 2.1 — Auth QA and UX Hardening ✅ COMPLETE

- Network error normalization (`ApiError` with `status: 0` for offline/unreachable)
- `non_field_errors` promoted to message in error normalizer
- Token auto-clear on 401 in `AuthProvider`
- `AppLoading` spinner during auth check in `RequireAuth`
- `RequireRole` per-role guard components + per-role layout files
- `PasswordInput` component with show/hide toggle and RTL-safe padding
- `autoComplete` attributes on all auth forms
- `noValidate` + `if (loading) return` guards on all form submit handlers
- Verified badge (green) for approved professionals in PortalShell
- i18n: 4 new strings across ar/ku/en
- See `docs/AUTH_QA_REPORT.md` for full test results and remaining risks

## Phase 3 — Profile and Verification ✅ COMPLETE

1. Build `/app/profile` page and profile completion UX. ✅
2. Integrate `GET /api/profiles/me/` and role profile PATCH endpoints. ✅
3. Add verification status UI and professional guidance. ✅
4. Add non-blocking dashboard profile prompts for incomplete/pending states. ✅
5. Support confirmed image upload fields with multipart PATCH. ✅

See `docs/PROFILE_INTEGRATION_NOTES.md` for the implemented contract and security notes.

## Phase 4 — Patient Portal ✅ COMPLETE

1. Consultation creation, list, detail, and empty-state handling. ✅
2. Consultation messaging and read-state updates. ✅
3. Prescriptions list/detail without medication items. ✅
4. Lab orders and released-only lab results. ✅
5. Patient medical record view. ✅
6. Patient-only navigation and privacy-safe rendering constraints. ✅

Implementation notes:

- Patient route tree is live under `/app/patient/...`
- Sidebar navigation in `PortalShell` switches to patient workflow links for patient users
- Patient portal types/services/components live in `types/patient.ts`, `lib/patient/patientService.ts`, and `components/patient/*`
- See `docs/PATIENT_PORTAL_INTEGRATION_NOTES.md` for runtime contract details and known blockers

Known blocker after implementation:

- Live consultation creation is currently blocked when the backend symptom catalog is empty. The frontend now surfaces this as an explicit unavailable state instead of failing silently.

## Phase 4.1B — Symptom-First Consultation Intake ✅ COMPLETE

1. Removed patient-facing specialty selection from consultation create flow. ✅
2. Consultation form now uses symptom-first intake with multi-select symptoms. ✅
3. Frontend create payload now sends `symptom_ids` and does not send `selected_specialty`. ✅
4. Backend-assigned specialty remains display-only in consultation list/detail screens. ✅
5. Current specialty assignment is deterministic backend routing (rule-based), not AI triage. ✅
6. Local seed command for symptoms documented for development environments. ✅

## Phase 4.5 — Patient Portal Final QA Pass ✅ COMPLETE

1. Full code inspection of all patient portal files. ✅
2. Live API verification against http://localhost:8000. ✅
3. Fixed lifecycle card double-highlight on pending_review. ✅
4. Added missing Lab Orders quick action card to patient dashboard. ✅
5. Fixed duplicate description copy on Request/View Consultations dashboard cards. ✅
6. Fixed new consultation page: hide ConsultationForm when symptom catalog is empty. ✅
7. Added back navigation links to prescription, lab order, and lab result error states. ✅
8. Added `backToPrescriptions`, `backToLabOrders`, `backToLabResults` i18n keys (ar/ku/en). ✅

See `docs/PATIENT_PORTAL_INTEGRATION_NOTES.md` Phase 4.5 section for full details and known limitations.

## Phase 5.0B — Doctor Portal Contract Preparation ✅ COMPLETE

1. Audited backend doctor workflow contract and endpoint inventory. ✅
2. Added doctor workflow route/screen planning docs. ✅
3. Added doctor-specific endpoint constant groups for implementation ergonomics. ✅
4. Added doctor workflow TypeScript models and lifecycle helper. ✅
5. Added doctor service skeleton (not wired to UI yet). ✅

Reference docs:
- `docs/DOCTOR_FRONTEND_WORKFLOW_PLAN.md`
- `docs/DOCTOR_FRONTEND_IMPLEMENTATION_NOTES.md`

## Phase 5.1 — Doctor Dashboard + Pending/Assigned Consultations ✅ COMPLETE

1. Implemented doctor dashboard summary cards and queue quick links. ✅
2. Implemented pending queue from `GET /api/consultations/doctor/pending/`. ✅
3. Implemented assigned queue from `GET /api/consultations/doctor/assigned/`. ✅
4. Implemented accept action from pending queue via `POST /api/consultations/{id}/accept/`. ✅
5. Added lightweight doctor consultation detail placeholder route (`/app/doctor/consultations/[id]`). ✅
6. Added doctor-specific portal navigation (Dashboard, Pending, Assigned, Profile). ✅
7. Enforced verification-aware clinical action lock in doctor queue actions. ✅
8. Reject action remains unavailable (no backend reject endpoint). ✅

## Phase 5.2 — Doctor Consultation Workspace ✅ COMPLETE

1. Implemented consultation detail workspace from `GET /api/consultations/{id}/`. ✅
2. Implemented status-gated messaging (`GET/POST /messages`, `POST /messages/mark-read/`). ✅
3. Implemented doctor response via `POST /api/consultations/{id}/responses/`. ✅
4. Implemented close action via `POST /api/consultations/{id}/close/`. ✅

Implementation notes:
- Added dedicated doctor workspace components for patient summary, symptoms/routing, clinical flags, messages, response form, and close action.
- Enforced verification-aware clinical action lock for messaging/response/close.
- Added disabled placeholders for prescription and lab-order actions for later phases.
- No reject action, no WebSocket, and no RAG integration in this phase.

## Phase 5.3 — Prescriptions From Consultation

1. Implement create-prescription screen from consultation context.
2. Use `POST /api/consultations/{id}/prescriptions/`.
3. Implement doctor prescription detail and cancel flows.

## Phase 5.4 — Lab Orders and Lab Results

1. Implement create-lab-order screen from consultation context.
2. Implement doctor lab-order detail/cancel flows.
3. Implement doctor lab-result detail, review, release, and link-medical-record flows.

## Phase 5.4A — Doctor Lab Orders From Consultation ✅ COMPLETE

1. Implemented create-lab-order screen from consultation context using `POST /api/consultations/{id}/lab-orders/`. ✅
2. Implemented doctor lab-order detail screen using `GET /api/lab-orders/doctor/{id}/`. ✅
3. Implemented doctor lab-order cancel action using `POST /api/lab-orders/doctor/{id}/cancel/`. ✅
4. Wired consultation workspace action with status/verification guard (`accepted` or `doctor_responded`, approved doctor). ✅
5. Preserved patient privacy contract for lab-order list/detail (no test item details in patient views). ✅

Deferred:
- Doctor lab-result review/release/link-medical-record flows move to next phase (Phase 5.5).

## Phase 5.5 — Patient Record Access

1. Implement authorized patient-record view via `GET /api/patient-records/patients/{patient_id}/`.
2. Enforce relationship-based access error handling in UI states.

## Phase 5.5A — Doctor Lab Result Review and Release ✅ COMPLETE

1. Implemented doctor lab-result detail route (`/app/doctor/lab-results/[id]`). ✅
2. Implemented doctor review action (`POST /api/lab-orders/doctor/results/{id}/review/`). ✅
3. Implemented doctor release action (`POST /api/lab-orders/doctor/results/{id}/release/`). ✅
4. Implemented doctor link-to-medical-record action (`POST /api/lab-orders/doctor/results/{id}/link-medical-record/`). ✅
5. Added lab-order detail integration for result links when IDs are present; otherwise fallback informational state. ✅

Notes:
- No dedicated doctor lab-result list endpoint exists; detail route is entry-pointed from known IDs.
- Patient privacy remains backend-enforced and frontend-preserved (released-only visibility, no doctor/laboratorian notes).

## Phase 5.6 — Doctor Patient Record Access ✅ Complete

1. Full doctor route QA pass.
2. Verification-gate QA (pending/rejected/suspended vs approved).
3. Privacy and authorization QA for unassigned doctor access.

## Phase 5.7 — Doctor Portal Final QA Pass ✅ Complete

1. End-to-end QA of all doctor portal routes and components.
2. Fixed duplicate function body in `DoctorPatientRecordPage.tsx`.
3. Fixed invalid i18n key `d.noDataDescription` → `p.loading` on loading state.
4. TypeScript clean: 0 errors. Lint clean: 0 warnings. Build: ✅ pass.
5. See `docs/DOCTOR_PORTAL_FINAL_QA.md` for full report.

## Phase 6 — Laboratory Portal

1. Laboratory dashboard with verification gating.
2. QR scan and lab order processing.
3. Batch item completion.
4. Lab result creation.
5. Lab result correction.
6. Final QA and privacy checks.

## Phase 7 — Pharmacist Portal

1. Prescription scan workflow.
2. Pending item display and dispensing workflow.
3. Verification-gated action enforcement.

## Phase 8 — Laboratory Portal

1. Lab order scan workflow.
2. Complete lab order items.
3. Create/correct lab results.
4. Verification-gated action enforcement.

## Phase 9 — Admin/Staff Portal

1. Knowledge base document operations.
2. Chunk browsing and search tools.
3. RAG feedback review.
4. RAG analytics and dataset export.
5. Staff-only access control and audit-safe UI.

## Phase 10 — Realtime

1. User notification WebSocket integration.
2. Consultation chat WebSocket integration.
3. Event-to-REST revalidation strategy.
4. Fallback polling for degraded socket state.

## Risks and Mitigations

### 1) Token storage policy
- Risk: insecure localStorage token usage.
- Mitigation: use secure token handling strategy defined in Phase 2; clear tokens on failed refresh/logout.

### 2) Envelope inconsistency
- Risk: docs show both `status` and `success` response styles.
- Mitigation: normalize both forms in one frontend response parser.

### 3) Login payload inconsistency
- Risk: tokens may be returned as `data.access`/`data.refresh` or nested under `data.tokens`.
- Mitigation: support both shapes in auth parser until runtime contract is verified.

### 4) Endpoint naming drift
- Risk: older guide paths differ from endpoint inventory.
- Mitigation: implement from API_REFERENCE + ENDPOINT_INVENTORY and maintain a conflict list.

### 5) File upload behavior
- Risk: multipart handling and file size validation mismatch.
- Mitigation: central multipart helper, frontend validation, and clear upload error handling.

### 6) Privacy display rules
- Risk: accidental disclosure of restricted medical details.
- Mitigation: role-based render guards and serializer-driven assumptions documented in mapping.

## Runtime Contract Verification Required at Phase 2 Start

Before coding business logic, verify live backend responses with curl/Postman for:
1. Login response shape (tokens nesting).
2. Envelope fields (`status` vs `success`).
3. Presence and path of refresh/logout endpoints.
4. Any remaining legacy aliases from the integration guide.
