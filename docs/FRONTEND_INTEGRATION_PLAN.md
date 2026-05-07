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

## Phase 5 — Doctor Portal

1. Pending/assigned consultation queues.
2. Accept/respond/close consultation flow.
3. Assigned patient medical record view.
4. Prescription create/detail/cancel workflows.
5. Lab order create/detail/cancel workflows.
6. Lab result review/release workflows.
7. Doctor RAG support tools.

## Phase 6 — Pharmacist Portal

1. Prescription scan workflow.
2. Pending item display and dispensing workflow.
3. Verification-gated action enforcement.

## Phase 7 — Laboratory Portal

1. Lab order scan workflow.
2. Complete lab order items.
3. Create/correct lab results.
4. Verification-gated action enforcement.

## Phase 8 — Admin/Staff Portal

1. Knowledge base document operations.
2. Chunk browsing and search tools.
3. RAG feedback review.
4. RAG analytics and dataset export.
5. Staff-only access control and audit-safe UI.

## Phase 9 — Realtime

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
