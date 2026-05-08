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

## Deferred Task Reminder

- Patient incomplete-profile consultation gate is deferred and must be backend-first before frontend enforcement
