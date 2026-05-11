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

## Phase 9 — Admin / Staff Portal ✅ COMPLETE

1. Audited backend against ENDPOINT_INVENTORY + openapi schema — no generic admin CRUD APIs for users/verification exist. ✅
2. Chosen implementation path: documented staff/admin endpoints only (Knowledge Base + RAG Admin). ✅
3. Implemented admin route guard layout using `RequireRole role="admin"`. ✅
4. Implemented admin dashboard: live stats from `GET /api/rag/admin/analytics/summary/`, document count, pending feedback count, dataset export action. ✅
5. Implemented knowledge documents list: `GET /api/knowledge-base/documents/`. ✅
6. Implemented knowledge document detail with workflow actions: process / approve / reject / archive / embed / chunks. ✅
7. Implemented RAG feedback review list with review status actions: reviewed / dismissed / escalated. ✅
8. Added `types/admin.ts` and `lib/admin/adminService.ts` with contract-accurate models and service methods. ✅
9. Added `admin` endpoint group to `lib/api/endpoints.ts`. ✅
10. Updated portal navigation for admin role. ✅
11. Added admin i18n keys across Arabic, Kurdish, English. ✅
12. Added `common.retry` translation key across all locales and i18n type contract. ✅
13. Validation: TypeScript ✅ | ESLint ✅ | Build ✅ (admin routes: `/app/admin`, `/app/admin/knowledge-base`, `/app/admin/knowledge-base/[id]`, `/app/admin/rag-feedback`).

See `docs/ADMIN_STAFF_PORTAL_IMPLEMENTATION_NOTES.md` for full contract audit, scope, and QA details.

## Phase 9B — Admin Verification Review UI ✅ COMPLETE

1. Implemented verification queue route `/app/admin/verifications` against backend Phase 9A endpoints only. ✅
2. Implemented verification detail route `/app/admin/verifications/[role]/[id]` with approve/reject/suspend UI actions. ✅
3. Added verification endpoint wiring in frontend admin service:
   - `GET /api/admin/verifications/`
   - `GET /api/admin/verifications/{role}/{id}/`
   - `POST /api/admin/verifications/{role}/{id}/approve/`
   - `POST /api/admin/verifications/{role}/{id}/reject/`
   - `POST /api/admin/verifications/{role}/{id}/suspend/`
4. Preserved privacy contract: no credentials, tokens, OTPs, QR tokens, or private clinical data are surfaced in verification UI. ✅
5. Admin access stabilization fix applied:
   - backend `/api/accounts/me/` does not expose `is_staff`/`is_superuser`.
   - frontend currently derives effective admin access via successful documented admin endpoint capability check.
6. Final UI QA closure completed:
   - mobile at `390px` across `/app/admin`, `/app/admin/verifications`, `/app/admin/verifications/[role]/[id]`
   - filters and detail form validation checks
   - Arabic RTL, Kurdish RTL, English LTR re-check
   - light/dark theme re-check
   - no horizontal overflow observed in closure pass

Notes:
- No backend/API contract changes were introduced.
- No existing patient/doctor/laboratory/pharmacist workflows were changed.
- Backend improvement requested: expose `is_staff`/`is_superuser` in `/api/accounts/me/`.

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

### Phase 6.2B — Laboratory QR Scan Live QA + Docs Finalization ✅ COMPLETE

- Manual QR scan on `/app/lab/scan` validated against live backend.
- Empty token blocked client-side.
- Invalid token path validated (`400`) with safe UI error messaging.
- Valid token path validated with order summary and pending/completed item rendering.
- Role guards confirmed for patient/doctor/laboratorian access.
- i18n (ar/ku/en) and theme behavior validated on scan page.
- Documentation updated for scan implementation and QA status.

### Phase 6.3 — Laboratory Item Completion ✅ COMPLETE

- Implemented per-item completion controls inside scanned-order workflow on `/app/lab/scan`.
- Integrated `POST /api/lab-orders/{id}/complete/` using frontend service contract.
- Added optional completion note support.
- Added completion-state refresh path with in-memory token rescan fallback.
- Kept result creation deferred and non-interactive for this phase boundary.
- Updated i18n keys and laboratory workflow docs to reflect completion behavior.

### Phase 6.4 — Laboratory Result Creation ✅ COMPLETE

- Implemented route `/app/lab/items/[itemId]/results/new`.
- Added dynamic value-type result form (`numeric`, `text`, `blood_group`, `positive_negative`, `file_only`).
- Integrated `POST /api/lab-orders/items/{item_id}/results/` with envelope handling.
- Added FormData upload handling for `file_only` with `result_file`.
- Added completed-item create-result action from scanned-order completed section.
- Preserved phase boundary: correction UI deferred to Phase 6.5.

### Phase 6.5 — Laboratory Result Correction ✅ COMPLETE

- Implemented route `/app/lab/results/[resultId]` for result detail viewing.
- Implemented route `/app/lab/results/[resultId]/correct` for result correction workflow.
- Added dynamic correction form with required reason field.
- Integrated `POST /api/lab-orders/results/{result_id}/correct/` with envelope handling.
- Added FormData upload handling for file corrections (if backend supports).
- Added result detail panel showing current values and correction action availability.
- Added correction success panel with result summary.
- Wired create-result panel with links to view and correct result.
- Added status gating: correction allowed for `submitted`/`corrected`, blocked for `reviewed`/`released`.
- Added role gating: patient/doctor redirected away from correction routes.
- Added verification gating: unapproved laboratorians see pending message with disabled form.
- Updated i18n keys for all languages (Arabic, Kurdish, English).

### Phase 6.6 — Laboratory Portal Final QA ✅ COMPLETE

- Phase 6.6.1 stabilization pass closed the completed-item handoff blocker in live flow.
- Root cause:
   - backend completion and rescan payloads can return only `remaining_items` and status flags without any `completed_items` detail.
   - previous UI logic allowed this minimal payload shape to leave completed section empty in some real paths.
- Fix strategy:
   - added scan-state normalization to preserve prior scanned item details, infer completed items from removed `remaining_items`, merge backend + inferred completed data, and prevent empty rescan payloads from wiping inferred completed state.
   - updated completion callback chain to pass explicit completed item id(s) from button -> list -> panel -> scan page handler.
   - updated create-result availability rule so completed items can still create results when order status is `fully_completed` (while still blocking cancelled/expired).
- Live E2E closure achieved:
   - scan -> complete item -> completed count updates -> create result -> duplicate create safe error -> result detail -> correction validation -> corrected result detail state.
- Guard/privacy sanity re-verified:
   - laboratorian allowed; patient and doctor redirected from lab routes.

See `docs/LABORATORY_PORTAL_FINAL_QA.md` for full evidence and Phase 6.6.1 addendum details.

### Phase 6.7B — Frontend Laboratory Portal Hardening After Backend Scan Payload Fix ✅ COMPLETE

- Backend Phase 6.7A deployed: scan endpoint now returns `lab_order.completed_items` for partially_completed and fully_completed orders.
- Frontend verified clean consumption of backend payload on cold rescan (fresh order → complete → scan-another → rescan same token without local state).
- Cold rescan test: PASS
   - Remaining items: 0
   - Completed items: 1 (from backend payload)
   - Order locked as `fully_completed`
   - Backend payload consumed directly; fallback normalization remains defensive layer.
- Fallback normalization (`lib/laboratory/laboratoryScanState.ts`) kept unchanged per user requirement; defensive inference still necessary.
- Backend-origin message localization added:
   - Created `lib/laboratory/laboratoryErrorMessages.ts` mapper to translate known backend English messages to i18n keys.
   - Updated `LaboratoryScannedOrderPanel` to localize backend messages (e.g., `"This lab order is no longer available for completion."` now renders in user's locale).
   - Mapper extensible for new messages as they emerge.
- Mobile responsive layout already validated; no redesign needed.
- Validation: TypeScript ✅, ESLint ✅, Build ✅ (26/26 routes).
- Files changed: 1 modified (LaboratoryScannedOrderPanel.tsx), 1 created (laboratoryErrorMessages.ts).

See `docs/LABORATORY_PORTAL_FINAL_QA.md` Phase 6.7B addendum for full details.

## Phase 7.0B — Pharmacist Portal Workflow Planning ✅ COMPLETE (Current)

1. ✅ Backend pharmacist workflow contract audited (backend commit 6639d66).
2. ✅ Pharmacist frontend workflow plan documented (see `docs/PHARMACIST_FRONTEND_WORKFLOW_PLAN.md`).
3. ✅ Route map defined: `/app/pharmacist`, `/app/pharmacist/scan`, `/app/pharmacist/prescriptions/[id]`, `/app/pharmacist/prescriptions/[id]/dispense`, `/app/pharmacist/history` (deferred).
4. ✅ Endpoint constants added: `pharmacistPrescriptions` group in `lib/api/endpoints.ts`.
5. ✅ Pharmacist TypeScript types created: `types/pharmacist.ts` with request/response contracts, UI models, and dispensing records.
6. ✅ Pharmacist status/action helpers created: `lib/pharmacist/pharmacistStatus.ts` with deterministic permission functions.
7. ✅ Pharmacist service skeleton created: `lib/pharmacist/pharmacistService.ts` with scan, detail (placeholder), and dispense stubs.
8. ✅ Pharmacist i18n keys added (ar/ku/en): ~80 keys covering dashboard, scan, detail, dispensing, and status messaging.
9. ✅ Role route matrix and API mapping updated with Phase 7 routes and endpoint mappings.
10. ✅ Pharmacist implementation notes created (see `docs/PHARMACIST_FRONTEND_IMPLEMENTATION_NOTES.md`).

**No UI screens implemented yet.** All code (types, helpers, service, i18n, docs) is prepared for Phase 7.1+ to consume.

Reference docs:
- `docs/PHARMACIST_FRONTEND_WORKFLOW_PLAN.md` — Complete workflow plan, privacy rules, UI states
- `docs/PHARMACIST_FRONTEND_IMPLEMENTATION_NOTES.md` — Technical handoff for Phase 7.1

## Phase 7.1 — Pharmacist Dashboard + Verification Gate ✅ COMPLETE

1. Implemented real `/app/pharmacist` dashboard page (replaced preview-only cards).
2. Implemented verification-first UX with status badge and verification notice (approved/pending/rejected/suspended).
3. Implemented pharmacy identity summary from real auth/profile payload (`user`, `user_profile`, `role_profile`).
4. Implemented workflow quick-action cards for scan/detail/dispense/history with phase-safe disabled states.
5. Implemented pharmacist privacy/safety notice (no patient-visible internal notes, locked status rules, audit reminder).
6. Kept Phase 7.1 scope boundary: no scan/detail/dispense API calls wired to UI yet.

QA highlights:

- Pharmacist login redirects to `/app/pharmacist` and dashboard renders with live profile/verification data.
- Role guard redirects non-pharmacist users away from `/app/pharmacist`:
   - patient -> `/app/patient`
   - doctor -> `/app/doctor`
   - laboratorian -> `/app/lab`
- i18n verified on dashboard in Arabic, English, and Kurdish.
- Theme toggle verified on dashboard.

Remaining limitations for next phases:

- `/app/pharmacist/scan` deferred to Phase 7.2.
- `/app/pharmacist/prescriptions/[id]` deferred to Phase 7.2.
- `/app/pharmacist/prescriptions/[id]/dispense` deferred to Phase 7.3.
- `/app/pharmacist/history` deferred until backend adds a history endpoint.

## Phase 7.2 — Prescription QR Scan and Detail ✅ COMPLETE

1. ✅ Implemented `/app/pharmacist/scan` page with manual QR token entry.
2. ✅ Integrated `POST /api/prescriptions/scan/` through `scanPrescription` service.
3. ✅ Implemented pharmacist-safe scanned prescription detail panel from scan payload.
4. ✅ Implemented `remaining_items` list and status badge rendering.
5. ✅ Added approved-only verification gate on scan page (read-only blocked state when unapproved).
6. ✅ Wired dashboard scan card to live route for approved pharmacists.
7. ✅ Kept dispensing deferred to Phase 7.3 (no dispense submit workflow enabled in Phase 7.2).

Expected output delivered: Manual scan + pharmacist-safe prescription detail view ready for Phase 7.3 dispensing.

## Phase 7.3 — Prescription Dispensing Workflow

✅ **COMPLETE** — Commit: `feat: add pharmacist prescription dispensing workflow`

1. ✅ Built `PharmacistDispensingForm` inline on the scan page (no separate route).
2. ✅ Per-item checkboxes with status toggle (dispensed/unavailable).
3. ✅ Optional fields: dispensed_quantity, note per item.
4. ✅ Integrated `POST /api/prescriptions/{id}/dispense/` via `dispensePrescription` service.
5. ✅ Response updates remaining_items, prescription status, locked flag in-memory.
6. ✅ Partial dispensing: form re-renders with remaining items; dispensed items shown above.
7. ✅ Error states: locked, cancelled, expired, validation errors all handled.

Expected output delivered: Dispensing workflow with partial dispensing support, fully integrated into scan page.

## Phase 7.4 — Dispensing History and Status Review (Optional)

1. Build `/app/pharmacist/history` page if backend supports endpoint.
2. Display past dispensing actions with pharmacist, timestamp, status, quantity, note.
3. Add filter/search by date range or prescription ID.

**Note**: Backend Phase 7.0A does not have a dedicated pharmacist history endpoint. Live probe of `GET /api/prescriptions/pharmacist/history/` returned 404, so Phase 7.4 remains backend-blocked until the endpoint exists.

## Phase 7.3B — Live QA and Stabilization

- Completed live browser QA of the pharmacist dispensing workflow against the real backend.
- Confirmed partial dispense transitions the prescription to `partially_dispensed` and keeps the remaining item available.
- Confirmed full dispense transitions the prescription to `fully_dispensed`, hides/locks dispense controls, and keeps rescan locked.
- Fixed duplicate dispensed-item rendering and stale remaining-item selection state during QA.
- No QR token persistence was added; token stays in runtime memory only.

## Phase 7.5 — Pharmacist Portal Final QA Pass

1. End-to-end QA of all screens and workflows.
2. Verification gate testing (pending vs approved pharmacist).
3. Error state validation (all error cases from plan).
4. i18n validation (ar/ku/en, RTL/LTR correctness).
5. Theme validation (dark/light mode).
6. Mobile/responsive design check.
7. Privacy compliance (no patient data exposure).
8. Doctor notification side effects verification.
9. Performance and accessibility audit.

Expected output: QA report + fixes + final commit for pharmacist portal.

### Phase 7.5 Status Update

- Completed final pharmacist QA run on 2026-05-09 against live backend/frontend.
- Runtime, role-guard, locale/theme, mobile, and dispensing-flow checks were executed.
- Stabilization fixes were applied for dashboard copy, approved verification messaging, locale-aware history timestamps, and locked-message localization mapping.
- See `docs/PHARMACIST_PORTAL_FINAL_QA.md` for detailed evidence and outcomes.

## Phase 8 — Doctor Lab Result Review/Release

1. Doctor lab result review workflow.
2. Lab result release to patient.
3. Link result to medical record.
4. Verification-gated action enforcement.

### Phase 8.1 — PortalShell and Navigation Polish

- PortalShell was split into focused shell, sidebar, topbar, mobile drawer, nav item, and nav model modules.
- Role navigation is centralized through one typed nav structure and one active-route resolver.
- Laboratory and pharmacist nav now include already-implemented scan/history child routes.
- Sticky header visual weight was reduced and inactive notification/message/settings controls were removed from the shell.
- Mobile drawer semantics were improved with dialog markup, modal state, Escape close, overlay close, and locale-aware side placement.
- No API, auth, permission, route guard, backend contract, or workflow behavior changes were made.
- QA covered role portal navigation, RTL/LTR language switching, theme switching, mobile drawer behavior, and build validation.

### Phase 8.2 — Dashboard Layout Unification

- Shared dashboard layout primitives were added for sections, grids, stat cards, workflow cards, and loading/error/empty state cards.
- Patient, doctor, laboratory, and pharmacist dashboard structures now follow the same section rhythm and card hierarchy.
- Summary/identity cards and workflow cards were visually aligned while preserving all existing data, links, disabled states, and role gates.
- Loading/error/empty dashboard wrappers were standardized where practical.
- No API, auth, permission, route guard, backend contract, or workflow behavior changes were made.
- QA covered the four role dashboard pages across desktop, mobile, RTL/LTR language direction, theme switching, and build validation.

### Phase 8.3 — Patient Portal UI Polish

- Patient consultation, prescription, lab order, lab result, and medical record pages were polished with consistent list/detail/form layout patterns.
- Patient-specific UI helpers were added for page spacing, reusable label/value rows, and list cards.
- Loading, error, and empty states now use consistent dashboard state wrappers where practical.
- New consultation form and medical record sections were visually tightened without changing validation, payloads, service calls, or visibility rules.
- No API, auth, permission, route guard, backend contract, or workflow behavior changes were made.
- QA covered patient list/detail/form pages across desktop, mobile, RTL/LTR language direction, and build validation.

### Phase 8.4 — Doctor Portal UI Polish

- Doctor pending and assigned consultation queues were polished with consistent section, list-card, and loading/error/empty state patterns.
- Doctor consultation workspace sections were visually grouped for patient context, clinical review, messages, response/close actions, and prescription/lab/record actions.
- Doctor prescription, lab order, lab result, and patient-record detail pages now share consistent detail rhythm, badges, back actions, and label/value rows.
- No API, auth, permission, route guard, status lifecycle, backend contract, or workflow behavior changes were made.
- QA covered doctor queue/detail/workspace pages across desktop, mobile, RTL/LTR language direction, and build validation.

### Phase 8.5 — Laboratory Portal UI Polish

- Laboratory scan, scanned-order, item-completion, result-creation, result-detail, and result-correction screens were polished with consistent section, card, badge, and state-card patterns.
- Laboratory-specific UI helpers were added for page spacing, reusable label/value rows, and item cards.
- Manual QR entry, completion controls, locked-order messaging, and result action states keep the same runtime behavior and backend calls.
- Loading, error, empty, unavailable, and success states now use consistent dashboard wrappers where practical.
- No API, auth, permission, QR scan, completion, result creation/correction/release, backend contract, or workflow behavior changes were made.
- QA covered laboratory dashboard and scan/result pages across desktop, mobile, RTL/LTR language direction, and build validation.

### Phase 8.6 — Pharmacist Portal UI Polish

- Pharmacist scan, scanned-prescription, dispensing-form, and dispensing-history screens were polished with consistent section, card, badge, and state-card patterns.
- Pharmacist-specific UI helpers were added for page spacing, reusable label/value rows, and scan/history item cards.
- Manual token entry, prescription scan, dispensing controls, partial/full dispensing states, and history loading remain on the existing frontend services and conditions.
- History remains read-only and does not expose QR tokens, internal notes, private patient fields, or dispensing actions.
- No API, auth, permission, prescription scan, dispensing, history, backend contract, or workflow behavior changes were made.
- QA covered pharmacist dashboard, scan, and history pages across desktop, mobile, RTL/LTR language direction, and build validation.

### Phase 8.7 — Mobile + RTL Final Polish

- Executed final mobile/RTL polish pass for shared primitives, PortalShell surfaces, role workflows, and profile forms.
- Addressed final high-impact wrapping and overflow issues:
   - patient lifecycle stepper mobile compression,
   - patient/doctor messaging headers and submit actions,
   - doctor workspace and order/prescription action rows,
   - pharmacist dispensing status toggle wrapping,
   - profile header/text and submit action responsiveness.
- Replaced remaining non-logical spacing utility (`ml-1`) with logical equivalent (`ms-1`) in pharmacist workflow.
- Preserved all existing APIs, auth behavior, route permissions, and workflow logic.
- Added dedicated QA report: `docs/MOBILE_RTL_FINAL_QA.md`.

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
