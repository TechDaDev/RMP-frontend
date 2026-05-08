# Doctor Frontend Workflow Plan (Phase 5.0B)

## 1. Scope

This phase prepares frontend contract artifacts for Doctor Portal implementation:
- route map
- screen-to-endpoint map
- workflow state/action matrix
- endpoint constants organization
- TypeScript doctor workflow types
- lifecycle/status helper rules
- doctor service skeleton (not wired to UI)

## 2. Non-Scope

- No working doctor workflow screens yet
- No real doctor API calls from UI yet
- No accept/respond/close interactive forms yet
- No prescription creation form yet
- No lab-order creation form yet
- No RAG integration
- No WebSocket integration
- No reject action UI (no backend endpoint)
- No backend changes

## 3. Backend Contract Source

Primary references:
- `RMP_backend/alrafidain_backend/docs/DOCTOR_WORKFLOW_CONTRACT.md`
- `RMP_backend/alrafidain_backend/docs/API_REFERENCE.md`
- `RMP_backend/alrafidain_backend/docs/ENDPOINT_INVENTORY.md`
- `RMP_backend/alrafidain_backend/docs/FRONTEND_INTEGRATION_GUIDE.md`

Contract baseline from backend 5.0A audit:
- Pending queue exists and is exact specialty match
- Assigned queue exists
- Accept/respond/close endpoints exist
- Messaging send allowed only in `accepted` and `doctor_responded`
- Messaging read allowed in `accepted`, `doctor_responded`, `closed`
- Prescription/lab-order creation exists from consultation context
- Lab-result review/release exists
- Authorized patient-record access exists
- No reject endpoint exists

## 4. Doctor Role and Verification Assumptions

- Role required: `user_type = doctor`
- Clinical actions require approved doctor verification
- If verification is pending/rejected/suspended: show verification-pending state and disable clinical actions
- Unassigned/unrelated doctor must not access consultation detail/messages/patient record

## 5. Future Route Map

Planned route tree for implementation phases:

- `/app/doctor`
  - dashboard
  - pending/assigned summary cards
  - verification banner
  - quick links
- `/app/doctor/consultations/pending`
  - pending queue filtered by backend specialty match
  - accept action
  - no reject action
- `/app/doctor/consultations/assigned`
  - assigned queue
  - status filters
- `/app/doctor/consultations/[id]`
  - consultation workspace
  - detail, patient summary, symptoms
  - messages
  - response
  - quick actions: prescription/lab-order
  - close action
- `/app/doctor/consultations/[id]/prescriptions/new`
  - create prescription from consultation
- `/app/doctor/consultations/[id]/lab-orders/new`
  - create lab order from consultation
- `/app/doctor/lab-results/[id]`
  - lab-result detail
  - review/release actions
- `/app/doctor/patients/[patientId]/record`
  - authorized patient record view

## 6. Screen-to-Endpoint Map

| Screen | Endpoint(s) |
|---|---|
| `/app/doctor` | `GET /api/consultations/doctor/pending/`, `GET /api/consultations/doctor/assigned/` |
| `/app/doctor/consultations/pending` | `GET /api/consultations/doctor/pending/`, `POST /api/consultations/{id}/accept/` |
| `/app/doctor/consultations/assigned` | `GET /api/consultations/doctor/assigned/` |
| `/app/doctor/consultations/[id]` | `GET /api/consultations/{id}/`, `GET/POST /api/consultations/{id}/messages/`, `POST /api/consultations/{id}/messages/mark-read/`, `POST /api/consultations/{id}/responses/`, `POST /api/consultations/{id}/close/` |
| `/app/doctor/consultations/[id]/prescriptions/new` | `POST /api/consultations/{id}/prescriptions/` |
| `/app/doctor/consultations/[id]/lab-orders/new` | `POST /api/consultations/{id}/lab-orders/` |
| `/app/doctor/lab-results/[id]` | `GET /api/lab-orders/doctor/results/{id}/`, `POST /api/lab-orders/doctor/results/{id}/review/`, `POST /api/lab-orders/doctor/results/{id}/release/`, `POST /api/lab-orders/doctor/results/{id}/link-medical-record/` |
| `/app/doctor/patients/[patientId]/record` | `GET /api/patient-records/patients/{patientId}/` |

## 7. Consultation Status Lifecycle

Backend lifecycle values:
- `submitted`
- `accepted`
- `doctor_responded`
- `closed`
- `cancelled`
- `rejected`

Implemented transitions:
- patient create -> `submitted`
- doctor accept -> `accepted`
- doctor response -> `doctor_responded`
- doctor close -> `closed`

No backend transition endpoint for reject.

## 8. Status Action Matrix

| Status | Accept | Send message | Read messages | Send response | Close | Create prescription | Create lab order |
|---|---|---|---|---|---|---|---|
| `submitted` | yes | no | no | no | no | no | no |
| `accepted` | no | yes | yes | yes | yes | yes | yes |
| `doctor_responded` | no | yes | yes | yes | yes | yes | yes |
| `closed` | no | no | yes | no | no | no | no |
| `cancelled` | no | no | no | no | no | no | no |
| `rejected` | no | no | no | no | no | no | no |

## 9. Messaging Rules

- Send available only in `accepted` and `doctor_responded`
- Read/list available in `accepted`, `doctor_responded`, and `closed`
- No message send in `submitted`, `closed`, `cancelled`, `rejected`

## 10. Prescription Workflow Plan

- Entry point: consultation workspace quick action
- Create endpoint only from consultation context: `POST /api/consultations/{id}/prescriptions/`
- Follow-up detail/cancel endpoints:
  - `GET /api/prescriptions/doctor/{prescription_id}/`
  - `POST /api/prescriptions/doctor/{prescription_id}/cancel/`

## 11. Lab Order Workflow Plan

- Entry point: consultation workspace quick action
- Create endpoint only from consultation context: `POST /api/consultations/{id}/lab-orders/`
- Follow-up detail/cancel endpoints:
  - `GET /api/lab-orders/doctor/{lab_order_id}/`
  - `POST /api/lab-orders/doctor/{lab_order_id}/cancel/`

## 12. Lab Result Review/Release Plan

- Detail: `GET /api/lab-orders/doctor/results/{lab_result_id}/`
- Review: `POST /api/lab-orders/doctor/results/{lab_result_id}/review/`
- Release: `POST /api/lab-orders/doctor/results/{lab_result_id}/release/`
- Link record: `POST /api/lab-orders/doctor/results/{lab_result_id}/link-medical-record/`

## 13. Patient Record Access Plan

- Route: `/app/doctor/patients/[patientId]/record`
- Endpoint: `GET /api/patient-records/patients/{patient_id}/`
- Access restricted to approved doctors with authorized consultation relationship

## 14. Privacy Rules

- Keep doctor-only data in doctor views only
- Do not expose restricted patient serializer fields where backend hides them
- Keep consultation detail/messages blocked for unassigned doctors
- Keep patient-record view blocked for unauthorized doctor-patient relation

## 15. UI States

Required state surfaces:
- loading
- empty
- error
- forbidden (403)
- not found (404)
- verification pending/rejected/suspended action lock
- status-gated action disabled states

## 16. Error States

- 400: validation feedback
- 401: auth expired -> re-auth flow
- 403: role/verification/relationship denied
- 404: consultation/patient not found or relationship-hidden patient record
- 409/422: business conflict handling where applicable

## 17. Phase Breakdown

- Phase 5.1: dashboard + pending/assigned queues + accept action (no reject)
- Phase 5.2: consultation workspace detail/messages/response/close
- Phase 5.3: prescription create + detail + cancel
- Phase 5.4: lab-order create + detail + cancel + lab-result review/release
- Phase 5.5: authorized patient-record view
- Phase 5.6: doctor portal QA pass

## 18. Known Backend Gaps / Constraints

- No consultation reject endpoint
- Pending queue uses exact specialty matching only
- Clinical actions require approved doctor profile status
- Unassigned doctor denied consultation detail and messaging

## 19. Deferred Future Tasks

- Patient incomplete-profile consultation gate (backend-first, then frontend)
- RAG tooling integration (separate phase)
- WebSocket realtime integration (separate phase)
