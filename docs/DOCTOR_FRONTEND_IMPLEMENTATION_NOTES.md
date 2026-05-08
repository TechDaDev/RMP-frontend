# Doctor Frontend Implementation Notes (Phase 5.0B Handoff)

## Backend Contract Reference

- `RMP_backend/alrafidain_backend/docs/DOCTOR_WORKFLOW_CONTRACT.md`
- `RMP_backend/alrafidain_backend/docs/API_REFERENCE.md`
- `RMP_backend/alrafidain_backend/docs/ENDPOINT_INVENTORY.md`
- `RMP_backend/alrafidain_backend/docs/FRONTEND_INTEGRATION_GUIDE.md`

## Endpoint List (Doctor Workflow)

Consultations:
- `GET /api/consultations/doctor/pending/`
- `GET /api/consultations/doctor/assigned/`
- `GET /api/consultations/{consultation_id}/`
- `POST /api/consultations/{consultation_id}/accept/`
- `POST /api/consultations/{consultation_id}/responses/`
- `POST /api/consultations/{consultation_id}/close/`

Messaging:
- `GET /api/consultations/{consultation_id}/messages/`
- `POST /api/consultations/{consultation_id}/messages/`
- `POST /api/consultations/{consultation_id}/messages/mark-read/`

Prescriptions:
- `POST /api/consultations/{consultation_id}/prescriptions/`
- `GET /api/prescriptions/doctor/{prescription_id}/`
- `POST /api/prescriptions/doctor/{prescription_id}/cancel/`

Lab orders/results:
- `POST /api/consultations/{consultation_id}/lab-orders/`
- `GET /api/lab-orders/doctor/{lab_order_id}/`
- `POST /api/lab-orders/doctor/{lab_order_id}/cancel/`
- `GET /api/lab-orders/doctor/results/{lab_result_id}/`
- `POST /api/lab-orders/doctor/results/{lab_result_id}/review/`
- `POST /api/lab-orders/doctor/results/{lab_result_id}/release/`
- `POST /api/lab-orders/doctor/results/{lab_result_id}/link-medical-record/`

Patient records:
- `GET /api/patient-records/patients/{patient_id}/`

## Planned Route Map

- `/app/doctor`
- `/app/doctor/consultations/pending`
- `/app/doctor/consultations/assigned`
- `/app/doctor/consultations/[id]`
- `/app/doctor/consultations/[id]/prescriptions/new`
- `/app/doctor/consultations/[id]/lab-orders/new`
- `/app/doctor/lab-results/[id]`
- `/app/doctor/patients/[patientId]/record`

## Status Action Matrix

| Status | Accept | Message Send | Message Read | Respond | Close | Prescription | Lab Order |
|---|---|---|---|---|---|---|---|
| submitted | yes | no | no | no | no | no | no |
| accepted | no | yes | yes | yes | yes | yes | yes |
| doctor_responded | no | yes | yes | yes | yes | yes | yes |
| closed | no | no | yes | no | no | no | no |
| cancelled | no | no | no | no | no | no | no |
| rejected | no | no | no | no | no | no | no |

## Verification Restrictions

- Clinical actions must be disabled for non-approved doctors
- Show verification-pending/rejected/suspended state in UI
- Keep route guard strict (`doctor` role only)

## Privacy Rules

- Unassigned doctors cannot access consultation detail/messages
- Patient record access only for authorized consultation relationship
- Keep backend serializer boundaries; do not infer hidden fields

## Known Backend Gaps / Constraints

- No reject endpoint for consultation workflow
- Pending queue uses exact specialty matching
- Messaging send restricted to accepted and doctor_responded statuses

## Explicit Exclusions For Phase 5.x Initial Build

- No reject action
- No RAG integration
- No WebSocket integration

## Phase 5.1 Implementation Notes (Completed)

Implemented frontend screens and behavior:
- Doctor dashboard implemented at `/app/doctor`
- Pending queue implemented at `/app/doctor/consultations/pending`
- Assigned queue implemented at `/app/doctor/consultations/assigned`
- Accept action implemented (`POST /api/consultations/{id}/accept/`)
- Consultation detail placeholder implemented at `/app/doctor/consultations/[id]`
- Doctor-only navigation in portal shell now includes Dashboard, Pending, Assigned, Profile
- Verification-aware action lock implemented (accept disabled when doctor is not approved)
- Reject action remains unavailable (no backend endpoint)

Deferred to Phase 5.2:
- Full consultation workspace actions (messaging, response, close)
- Prescription and lab-order creation flows from workspace

## Phase 5.2 Implementation Notes (Completed)

Implemented frontend consultation workspace at `/app/doctor/consultations/[id]`:
- Replaced placeholder detail screen with a full doctor consultation workspace
- Added patient summary, symptoms/routing, and clinical flags panels
- Implemented status-gated doctor messaging (list/read/send) with mark-read behavior
- Implemented doctor response form (`response_text`, optional `recommendation_type`)
- Implemented close consultation action with confirmation prompt
- Added verification-aware action lock across message/response/close actions
- Added disabled placeholders for prescriptions/lab orders (Phase 5.3/5.4)
- Preserved status/action matrix behavior (no reject action, no websocket/rag)

Manual QA summary (browser):
- Login as approved doctor succeeded
- Consultation workspace rendered live detail/messaging data
- Message send succeeded and refreshed list
- Close consultation succeeded and transitioned UI to read-only/disabled action state
- Response submit flow rendered correctly; endpoint returned 400 for the closed/previously-responded seed state (error UI verified)

## Deferred Task Reminder

- Patient incomplete-profile consultation gate is deferred and must be backend-first before frontend enforcement

## Phase 5.4 Implementation Notes (Completed)

Implemented doctor lab-order workflow:
- Create lab-order screen from consultation context at `/app/doctor/consultations/[id]/lab-orders/new`
- Doctor lab-order detail route at `/app/doctor/lab-orders/[id]`
- Doctor lab-order cancel action integrated with backend cancel endpoint
- Consultation workspace action now links to create-lab-order when consultation status is `accepted` or `doctor_responded`
- Verification-aware guard preserved: only approved doctors can perform lab-order actions

Contract alignment and privacy notes:
- Lab-order create is consultation-scoped and uses `POST /api/consultations/{consultation_id}/lab-orders/`
- Doctor detail uses `GET /api/lab-orders/doctor/{lab_order_id}/` with full item list and completion records
- Cancel uses `POST /api/lab-orders/doctor/{lab_order_id}/cancel/` and surfaces blocked states safely
- Patient lab-order privacy remains intact; patient endpoints continue to hide test item details

Deferred from this phase:
- Doctor lab-result review/release/link flows are intentionally deferred to the next phase

## Phase 5.5 Implementation Notes (Completed)

Implemented doctor lab-result workflow:
- Added doctor lab-result detail route at `/app/doctor/lab-results/[id]`
- Added doctor review action using `POST /api/lab-orders/doctor/results/{id}/review/`
- Added doctor release action using `POST /api/lab-orders/doctor/results/{id}/release/`
- Added link-to-medical-record action using `POST /api/lab-orders/doctor/results/{id}/link-medical-record/`

Contract alignment:
- Doctor detail uses full `LabResultSerializer` payload (includes doctor/laboratorian notes)
- Patient lab-result views remain release-gated and exclude `doctor_notes` and `laboratorian_notes`
- Link-to-medical-record action supports optional `notes` in serializer; service currently links using backend-generated notes

Lab order detail integration:
- Lab-order detail now checks for result identifiers in completion records and links to doctor lab-result details when present
- If result identifiers are not present in the payload, UI shows neutral fallback text (no fake IDs)
