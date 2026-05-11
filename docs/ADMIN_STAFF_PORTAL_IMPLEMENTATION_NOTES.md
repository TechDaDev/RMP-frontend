# Admin / Staff Portal Implementation Notes (Phase 9)

## 1) Backend Endpoints Inspected

Source docs inspected:
- `/home/zeus3000/PycharmProjects/RMP_backend/alrafidain_backend/docs/API_REFERENCE.md`
- `/home/zeus3000/PycharmProjects/RMP_backend/alrafidain_backend/docs/ENDPOINT_INVENTORY.md`
- `/home/zeus3000/PycharmProjects/RMP_backend/alrafidain_backend/docs/FRONTEND_INTEGRATION_GUIDE.md`
- `/home/zeus3000/PycharmProjects/RMP_backend/alrafidain_backend/docs/openapi-schema.yml`

Implemented against documented staff/admin endpoints only:
- `GET/POST /api/knowledge-base/documents/`
- `GET /api/knowledge-base/documents/{id}/`
- `POST /api/knowledge-base/documents/{id}/process/`
- `POST /api/knowledge-base/documents/{id}/approve/`
- `POST /api/knowledge-base/documents/{id}/reject/`
- `POST /api/knowledge-base/documents/{id}/archive/`
- `POST /api/knowledge-base/documents/{id}/embed/`
- `GET /api/knowledge-base/documents/{id}/chunks/`
- `GET /api/rag/admin/feedback/`
- `POST /api/rag/admin/feedback/{id}/review/`
- `GET /api/rag/admin/analytics/summary/`
- `POST /api/rag/admin/exports/dataset/`
- `GET /api/admin/verifications/`
- `GET /api/admin/verifications/{role}/{id}/`
- `POST /api/admin/verifications/{role}/{id}/approve/`
- `POST /api/admin/verifications/{role}/{id}/reject/`
- `POST /api/admin/verifications/{role}/{id}/suspend/`

## 2) Implemented Scope

Chosen implementation path: **Path C** (documented staff/admin endpoints only).

Implemented:
- Admin dashboard route with real staff/admin endpoint integration.
- Knowledge documents list route.
- Knowledge document detail route with documented workflow actions.
- RAG feedback review route with documented review status actions.
- Verification review queue route with role/status/search filtering.
- Verification detail route with approve/reject/suspend action forms.
- Dataset export action (JSON) from admin dashboard.
- Admin route guard layout.
- Admin navigation entries for implemented routes.
- Admin i18n keys in Arabic/Kurdish/English.

## 3) Backend-Blocked / Out of Contract Scope

Not implemented (no matching backend contract as generic admin portal endpoints):
- Generic `/api/admin/dashboard/` endpoint.
- Generic users management endpoint for all users.
- Generic doctor/pharmacist/laboratorian verification queue endpoint.
- Generic audit log API endpoint for frontend consumption.

The dashboard explicitly surfaces this contract boundary in UI copy.

## 4) Routes Implemented

- `/app/admin`
- `/app/admin/knowledge-base`
- `/app/admin/knowledge-base/[id]`
- `/app/admin/rag-feedback`
- `/app/admin/verifications`
- `/app/admin/verifications/[role]/[id]`

## 5) Services / Types Added

Added:
- `types/admin.ts`
- `lib/admin/adminService.ts`

Updated:
- `lib/api/endpoints.ts` (added `admin` endpoint group pointing to documented paths)

## 6) Role Guard Behavior

- Added admin route layout guard via `RequireRole role="admin"`.
- Updated role redirects to include `/app/admin` where applicable.
- Existing non-admin route guards remain unchanged.
- Runtime issue found and fixed in Phase 9B stabilization:
	- backend `/api/accounts/me/` currently returns `user_type` only and does not expose `is_staff`/`is_superuser`.
	- in current test data, admin-capable account can be returned as `user_type: "doctor"`, which misroutes admin pages.
	- frontend now derives effective admin access from a successful call to a documented admin endpoint (`GET /api/admin/verifications/?limit=1`) and uses that capability to route/guard admin pages.

## 7) Privacy Rules Applied

- No credentials, tokens, QR tokens, or private patient clinical fields were added to admin UI output.
- UI uses only endpoint-returned metadata for staff/admin workflows.
- No hidden/internal backend fields were intentionally surfaced.

## 8) QA Results (Functional + UI)

Functional sanity:
- Dashboard calls documented analytics/feedback/documents endpoints.
- Knowledge detail actions call only documented action endpoints.
- RAG feedback review calls documented review endpoint with supported statuses.
- Dataset export calls documented export endpoint with JSON format.
- Verification queue/detail call only documented Phase 9A verification endpoints.
- Reject/suspend forms enforce required reason before submission.

UI sanity:
- Uses established Phase 8 primitives (`PageHeader`, `DashboardSection`, `DashboardGrid`, `DashboardStatCard`, `DashboardWorkflowCard`, `DashboardStateCard`, `Card`, `Badge`, `Button`).
- Mobile-safe action layouts and wrapping maintained.
- RTL/LTR and theme behavior preserved via shared shell + i18n/theme providers.
- Final mobile QA executed at `390px` for:
	- `/app/admin`
	- `/app/admin/verifications`
	- `/app/admin/verifications/[role]/[id]`
	- filters, detail action forms, and mobile drawer behavior
	- no horizontal overflow observed during the QA pass
- Locale/direction QA re-checked:
	- Arabic (RTL)
	- Kurdish (RTL)
	- English (LTR)
- Theme QA re-checked in light/dark modes.

## 9) Remaining Limitations

- Frontend currently infers admin access by probing a documented admin endpoint because `/api/accounts/me/` does not expose `is_staff` or `is_superuser`.
- Backend improvement requested: include explicit staff/superuser flags in `/api/accounts/me/` (and profile payload parity) so frontend can use direct role claims instead of capability probing.
- Knowledge base upload route is supported by backend but was not added in this phase to avoid introducing new file-upload UX surface and to keep scope aligned with requested implementation level.

## 10) Recommended Next Steps

1. Add a dedicated knowledge document upload screen (staff-only) with safe file constraints and validation.
2. Add RAG analytics detail drill-down page (read-only) from existing analytics summary.
3. If backend later ships generic admin verification/users APIs, add those routes as a separate phase with strict privacy mapping.
