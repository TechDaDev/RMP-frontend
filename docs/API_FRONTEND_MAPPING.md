# API Frontend Mapping

This document maps current and planned frontend screens to backend API endpoints.

Sources used (priority order):
1. API_REFERENCE.md
2. ENDPOINT_INVENTORY.md
3. API_RESPONSE_CONTRACT.md
4. ROLE_PERMISSION_MATRIX.md
5. WEBSOCKET_CONTRACT.md
6. FRONTEND_INTEGRATION_GUIDE.md (used where not conflicting)

## Contract Baseline

- Base API path: `/api/`
- Local absolute API base: `http://localhost:8000/api/`
- Auth: Bearer JWT access token
- Canonical role values: `patient`, `doctor`, `pharmacist`, `laboratorian`
- Staff role model: `is_staff=true` or `is_superuser=true`

## 1. Auth Mapping

| Screen | Endpoint | Method | Role | Auth Required | Request Type | Response Type | Frontend Status | Notes |
|---|---|---|---|---|---|---|---|---|
| /login | /api/accounts/login/ | POST | anon | No | JSON | envelope | Phase 2 | Canonical login endpoint |
| /register | /api/accounts/register/ | POST | anon | No | JSON | envelope | Phase 2 | Creates inactive account |
| future activation page | /api/accounts/activate/ | POST | anon | No | JSON | envelope | Phase 2 | OTP activation |
| future resend activation action | /api/accounts/resend-activation-otp/ | POST | anon | No | JSON | envelope | Phase 2 | Generic success message |
| authenticated bootstrap | /api/accounts/me/ | GET | authenticated | Yes | none | envelope | Phase 2 | Current user lookup |
| future password reset request | /api/accounts/password-reset/request/ | POST | anon | No | JSON | envelope | Phase 2 | Generic anti-enumeration response |
| future password reset confirm | /api/accounts/password-reset/confirm/ | POST | anon | No | JSON | envelope | Phase 2 | OTP + new password |
| token refresh (pending verification) | /api/accounts/token/refresh/ | POST | authenticated | token-based | JSON | raw | Phase 2 | Present in integration guide only; verify runtime/backend inventory |
| logout (pending verification) | /api/accounts/logout/ | POST | authenticated | Yes | JSON | envelope/raw | Phase 2 | Present in integration guide only; verify runtime/backend inventory |

## 2. Shared Authenticated User Mapping

| Screen | Endpoint | Method | Role | Auth Required | Request Type | Response Type | Frontend Status | Notes |
|---|---|---|---|---|---|---|---|---|
| /app | /api/accounts/me/ | GET | authenticated | Yes | none | envelope | Phase 2 | Seed role routing |
| future /app/profile | /api/profiles/me/ | GET | authenticated | Yes | none | envelope | Phase 3 | Includes completion/verification status |
| future /app/profile | /api/profiles/me/user-profile/ | PATCH | authenticated | Yes | JSON | envelope | Phase 3 | Shared profile updates |
| future role profile screens | /api/profiles/me/patient/ | PATCH | patient | Yes | JSON | envelope | Phase 3 | Role-specific |
| future role profile screens | /api/profiles/me/doctor/ | PATCH | doctor | Yes | JSON | envelope | Phase 3 | Verification-dependent workflows |
| future role profile screens | /api/profiles/me/pharmacist/ | PATCH | pharmacist | Yes | JSON | envelope | Phase 3 | Verification-dependent workflows |
| future role profile screens | /api/profiles/me/laboratorian/ | PATCH | laboratorian | Yes | JSON | envelope | Phase 3 | Verification-dependent workflows |
| future notifications center | /api/notifications/ | GET | authenticated | Yes | none | envelope | Phase 2 | Own notifications only |
| future notification badge | /api/notifications/unread-count/ | GET | authenticated | Yes | none | envelope | Phase 2 | Count endpoint |
| future notification row action | /api/notifications/<id>/mark-read/ | POST | authenticated | Yes | none | envelope | Phase 2 | Own notifications only |
| future notification bulk action | /api/notifications/mark-all-read/ | POST | authenticated | Yes | none | envelope | Phase 2 | Mark all |

## 3. Patient Portal Mapping

| Screen | Endpoint | Method | Role | Auth Required | Request Type | Response Type | Frontend Status | Notes |
|---|---|---|---|---|---|---|---|---|
| /app/patient (future consultation request) | /api/consultations/ | POST | patient | Yes | JSON | envelope | Phase 4 | Create consultation |
| /app/patient (future consultation list) | /api/consultations/my/ | GET | patient | Yes | none | envelope | Phase 4 | Own consultations |
| /app/patient (future consultation detail) | /api/consultations/<id>/ | GET | patient | Yes | none | envelope | Phase 4 | Own consultation only |
| /app/patient (future chat) | /api/consultations/<id>/messages/ | GET/POST | patient | Yes | JSON | envelope | Phase 4 | Participant only |
| /app/patient (future chat read state) | /api/consultations/<id>/messages/mark-read/ | POST | patient | Yes | none | envelope | Phase 4 | Participant only |
| /app/patient (future prescriptions list) | /api/prescriptions/my/ | GET | patient | Yes | none | envelope | Phase 4 | No medication item details |
| /app/patient (future prescription detail) | /api/prescriptions/my/<id>/ | GET | patient | Yes | none | envelope | Phase 4 | No medication item details |
| /app/patient (future lab orders list) | /api/lab-orders/my/ | GET | patient | Yes | none | envelope | Phase 4 | No test item details |
| /app/patient (future lab order detail) | /api/lab-orders/my/<id>/ | GET | patient | Yes | none | envelope | Phase 4 | No test item details |
| /app/patient (future lab results list) | /api/lab-orders/my-results/ | GET | patient | Yes | none | envelope | Phase 4 | Released-only visibility |
| /app/patient (future lab results list alias) | /api/lab-results/my/ | GET | patient | Yes | none | envelope | Phase 4 | Alias route |
| /app/patient (future lab result detail) | /api/lab-results/my/<id>/ | GET | patient | Yes | none | envelope | Phase 4 | Alias route; released-only |
| /app/patient (future medical record) | /api/patient-records/my/ | GET | patient | Yes | none | envelope | Phase 4 | Own record only |

## 4. Doctor Portal Mapping

Consultation reject is intentionally excluded in frontend mapping because backend has no reject endpoint.

| Screen | Endpoint | Method | Role | Auth Required | Request Type | Response Type | Frontend Status | Notes |
|---|---|---|---|---|---|---|---|---|
| /app/doctor (pending queue) | /api/consultations/doctor/pending/ | GET | doctor-approved | Yes | none | envelope | Phase 5 | Specialty-filtered |
| /app/doctor (assigned queue) | /api/consultations/doctor/assigned/ | GET | doctor-approved | Yes | none | envelope | Phase 5 | Assigned only |
| /app/doctor consultation action | /api/consultations/<id>/accept/ | POST | doctor-approved | Yes | none | envelope | Phase 5 | Accept consultation |
| /app/doctor consultation responses | /api/consultations/<id>/responses/ | POST | doctor-approved | Yes | JSON | envelope | Phase 5 | Assigned consultation |
| /app/doctor consultation close | /api/consultations/<id>/close/ | POST | doctor-approved | Yes | none | envelope | Phase 5 | Assigned consultation |
| /app/doctor consultation chat | /api/consultations/<id>/messages/ | GET/POST | doctor-approved | Yes | JSON | envelope | Phase 5 | Participant only |
| /app/doctor consultation chat read-state | /api/consultations/<id>/messages/mark-read/ | POST | doctor-approved | Yes | none | envelope | Phase 5 | Read marker for allowed statuses |
| /app/doctor patient record | /api/patient-records/patients/<patient_id>/ | GET | doctor-approved | Yes | none | envelope | Phase 5 | Active consultation required |
| /app/doctor prescription create | /api/consultations/<id>/prescriptions/ | POST | doctor-approved | Yes | JSON | envelope | Phase 5 | Assigned consultation |
| /app/doctor prescription detail | /api/prescriptions/doctor/<id>/ | GET | doctor-approved | Yes | none | envelope | Phase 5 | Full prescription detail |
| /app/doctor prescription cancel | /api/prescriptions/doctor/<id>/cancel/ | POST | doctor-approved | Yes | none | envelope | Phase 5 | Creator/assigned constraints |
| /app/doctor lab order create | /api/consultations/<id>/lab-orders/ | POST | doctor-approved | Yes | JSON | envelope | Phase 5 | Assigned consultation |
| /app/doctor lab order detail | /api/lab-orders/doctor/<id>/ | GET | doctor-approved | Yes | none | envelope | Phase 5 | Full order detail |
| /app/doctor lab order cancel | /api/lab-orders/doctor/<id>/cancel/ | POST | doctor-approved | Yes | none | envelope | Phase 5 | Creator/assigned constraints |
| /app/doctor lab result detail | /api/lab-orders/doctor/results/<id>/ | GET | doctor-approved | Yes | none | envelope | Phase 5 | Assigned result access |
| /app/doctor lab result review | /api/lab-orders/doctor/results/<id>/review/ | POST | doctor-approved | Yes | JSON | envelope | Phase 5 | Review + optional release flag |
| /app/doctor lab result release | /api/lab-orders/doctor/results/<id>/release/ | POST | doctor-approved | Yes | none | envelope | Phase 5 | Patient visibility gate |
| /app/doctor RAG general query | /api/rag/doctor/query/ | POST | doctor-approved | Yes | JSON | raw | Phase 12 | Out of scope for initial doctor workflow phases |
| /app/doctor RAG consult support | /api/rag/consultations/<id>/support/ | POST | doctor-approved | Yes | JSON | raw | Phase 12 | Out of scope for initial doctor workflow phases |
| /app/doctor RAG lab support | /api/rag/lab-results/<id>/support/ | POST | doctor-approved | Yes | JSON | raw | Phase 12 | Out of scope for initial doctor workflow phases |

## 5. Pharmacist Portal Mapping (Phase 7.2)

| Screen | Endpoint | Method | Role | Auth Required | Request Type | Response Type | Frontend Status | Notes |
|---|---|---|---|---|---|---|---|---|
| /app/pharmacist | /api/profiles/me/pharmacist/ | GET | pharmacist | Yes | none | envelope | Phase 7.1 | Load verification status for dashboard badge |
| /app/pharmacist/scan | /api/prescriptions/scan/ | POST | pharmacist-approved | Yes | JSON | envelope | Phase 7.2 complete | Manual QR token entry; frontend renders `prescription` + `remaining_items` + `locked` + `message` |
| /app/pharmacist/prescriptions/[id] (from scan) | (data from scan response) | — | pharmacist-approved | — | — | — | Phase 7.2 complete | No separate detail endpoint in Phase 7.0A; detail remains scan-response-driven |
| /app/pharmacist/scan (inline dispense) | /api/prescriptions/<id>/dispense/ | POST | pharmacist-approved | Yes | JSON | envelope | Phase 7.3 complete | Dispense form embedded in scan page; partial dispensing, locked state, per-item status (dispensed/unavailable), optional qty/note |

| /app/pharmacist/scan (QA verified) | /api/prescriptions/scan/ + /api/prescriptions/<id>/dispense/ | POST | pharmacist-approved | Yes | JSON | envelope | Phase 7.3B | Live browser QA confirmed scan → partial dispense → full dispense → locked rescan, with no token persistence |
| /app/pharmacist/history (future) | /api/prescriptions/pharmacist/history/ | GET | pharmacist-approved | Yes | none | envelope | Phase 7.4 blocked | Deferred: live backend probe returned 404; do not implement until endpoint exists |

## 6. Laboratory Portal Mapping

| Screen | Endpoint | Method | Role | Auth Required | Request Type | Response Type | Frontend Status | Notes |
|---|---|---|---|---|---|---|---|---|
| /app/lab (catalog support) | /api/lab-orders/tests/ | GET | doctor/laboratorian | Yes | none | envelope | Phase 7 | Lab test catalog |
| /app/lab/scan | /api/lab-orders/scan/ | POST | laboratorian-approved | Yes | JSON | envelope | Phase 6.2B complete | Manual QR token entry, safe error handling, and scanned order panel are live |
| /app/lab/scan (item completion) | /api/lab-orders/<id>/complete/ | POST | laboratorian-approved | Yes | JSON | envelope | Phase 6.3 complete | Complete selected remaining item with optional note; UI refreshes scanned state after success |
| /app/lab/items/[itemId]/results/new | /api/lab-orders/items/<item_id>/results/ | POST | laboratorian-approved | Yes | JSON/multipart | envelope | Phase 6.4 complete | Dynamic value-type form, file_only multipart upload, and safe validation handling |
| /app/lab/results/[resultId] | /api/lab-orders/results/<id>/ | GET | laboratorian | Yes | none | envelope | Phase 6.5 complete | Result detail display with correction action gating |
| /app/lab/results/[resultId]/correct | /api/lab-orders/results/<id>/correct/ | POST | laboratorian-approved | Yes | JSON | envelope | Phase 6.5 complete | Correction with required reason, immutable file handling |

### 6.1 Laboratory Service Skeleton Mapping (Phase 6.0B)

| Frontend function | Endpoint | Method | Auth Required | Notes |
|---|---|---|---|---|
| `getLabTestCatalog` | `/api/lab-orders/tests/` | GET | Yes | Optional `category` and `search` query params |
| `scanLabOrder` | `/api/lab-orders/scan/` | POST | Yes | QR token entry point for lab processing |
| `completeLabOrderItems` | `/api/lab-orders/{lab_order_id}/complete/` | POST | Yes | Item completion is currently phase-scoped to `completed` status |
| `createLabResultForItem` | `/api/lab-orders/items/{lab_order_item_id}/results/` | POST | Yes | Multipart when `result_file` exists |
| `getLaboratoryResultDetail` | `/api/lab-orders/results/{lab_result_id}/` | GET | Yes | Lab-side result detail |
| `correctLaboratoryResult` | `/api/lab-orders/results/{lab_result_id}/correct/` | POST | Yes | Original laboratorian only, before release |

## 7. Admin/Staff Portal Mapping

| Screen | Endpoint | Method | Role | Auth Required | Request Type | Response Type | Frontend Status | Notes |
|---|---|---|---|---|---|---|---|---|
| /app/admin (KB list/upload) | /api/knowledge-base/documents/ | GET/POST | staff/admin | Yes | JSON/multipart | envelope | Phase 8 | Upload uses multipart |
| /app/admin (KB detail) | /api/knowledge-base/documents/<id>/ | GET | staff/admin | Yes | none | envelope | Phase 8 | Detail and processing metadata |
| /app/admin (KB process) | /api/knowledge-base/documents/<id>/process/ | POST | staff/admin | Yes | none | envelope | Phase 8 | Workflow action |
| /app/admin (KB approve) | /api/knowledge-base/documents/<id>/approve/ | POST | staff/admin | Yes | none | envelope | Phase 8 | Workflow action |
| /app/admin (KB reject) | /api/knowledge-base/documents/<id>/reject/ | POST | staff/admin | Yes | JSON | envelope | Phase 8 | Workflow action |
| /app/admin (KB archive) | /api/knowledge-base/documents/<id>/archive/ | POST | staff/admin | Yes | none | envelope | Phase 8 | Workflow action |
| /app/admin (KB embed) | /api/knowledge-base/documents/<id>/embed/ | POST | staff/admin | Yes | none | envelope | Phase 8 | Embedding trigger |
| /app/admin (KB chunks) | /api/knowledge-base/documents/<id>/chunks/ | GET | staff/admin | Yes | none | envelope | Phase 8 | Chunk list |
| /app/admin (KB search) | /api/knowledge-base/chunks/search/ | GET | staff/admin | Yes | none | envelope | Phase 8 | Text search |
| /app/admin (KB semantic) | /api/knowledge-base/chunks/semantic-search/ | GET | staff/admin | Yes | none | envelope | Phase 8 | Semantic search |
| /app/admin (RAG feedback list) | /api/rag/admin/feedback/ | GET | staff/admin | Yes | none | raw | Phase 8 | RAG endpoints are non-envelope |
| /app/admin (RAG feedback review) | /api/rag/admin/feedback/<id>/review/ | POST | staff/admin | Yes | JSON | raw | Phase 8 | Review workflow |
| /app/admin (RAG analytics) | /api/rag/admin/analytics/summary/ | GET | staff/admin | Yes | none | raw | Phase 8 | Analytics summary |
| /app/admin (RAG export) | /api/rag/admin/exports/dataset/ | POST | staff/admin | Yes | JSON | csv/raw | Phase 8 | Returns CSV when requested |

## WebSocket Realtime Mapping (Phase 9)

| Frontend area | Socket URL | Auth | Key Events | Notes |
|---|---|---|---|---|
| Notification center/badge | /ws/user/?token=<access_token> | required | notification.created, notification.unread_count, consultation.updated, prescription.updated, lab_order.updated, lab_result.released | Delivery-only channel; REST remains source of truth |
| Consultation chat | /ws/consultations/<consultation_id>/messages/?token=<access_token> | required + participant check | chat.message.created, chat.messages.read, consultation.updated | Message creation still via REST |

## Endpoint Stability Notes

- Stable inventory count: 86 endpoints (Endpoint Inventory)
- Canonical endpoint names should be sourced from API_REFERENCE + ENDPOINT_INVENTORY
- FRONTEND_INTEGRATION_GUIDE contains older aliases/legacy paths that should not be used directly without backend verification

## Contract Conflicts To Carry Into Phase 2

1. Envelope style conflict: `status` vs `success`
2. Login data shape conflict: `data.access`/`data.refresh` vs `data.tokens.access`/`data.tokens.refresh`
3. OTP endpoint naming conflict: `/activate/` vs `/verify-otp/`
4. Notification action route naming conflict: `/mark-read/` forms vs `/read/` forms
5. Scan endpoint conflict: POST scan endpoints vs older GET scan-token endpoints
6. Knowledge-base upload route conflict: `/documents/` vs `/documents/upload/`

Phase 2 implementation must include temporary response normalization and runtime contract validation.
