# Laboratory Frontend Workflow Plan

## Scope

Phase 6.0B prepares the frontend contract for the laboratory portal only. It adds
the route plan, endpoint map, status helpers, typed service skeleton, and locale
keys needed for Phase 6.1. No laboratory UI screens are built in this phase.

## Non-scope

- No laboratory dashboard UI screens.
- No QR scanner UI.
- No result creation form UI.
- No result correction UI.
- No WebSocket integration.
- No RAG integration.
- No backend changes.
- No patient profile-completion gate implementation in frontend.

## Backend Contract Source

- Primary contract: `/home/zeus3000/PycharmProjects/RMP_backend/alrafidain_backend/docs/LABORATORY_WORKFLOW_CONTRACT.md`
- Supporting references: `API_REFERENCE.md`, `ENDPOINT_INVENTORY.md`, `FRONTEND_INTEGRATION_GUIDE.md`, `openapi-schema.yml`

## Laboratory Role and Verification Assumptions

- Laboratory users register as `user_type = laboratorian`.
- Approved laboratorian verification is required for all clinical lab actions.
- Unapproved laboratorians must see a verification-pending state and disabled actions.
- Backend returns `403` for unapproved laboratorians on lab clinical endpoints.
- The frontend should treat `/app/lab` as the canonical laboratory shell route.
- `/app/laboratory` can be added later only as an alias if needed.

## Route Map

Canonical route family:

- `/app/lab` - Laboratory dashboard
- `/app/lab/scan` - QR token scan and manual entry
- `/app/lab/orders/[id]` - Lab order processing detail
- `/app/lab/orders/[id]/complete` - Batch item completion flow
- `/app/lab/items/[itemId]/results/new` - Create a lab result for one item
- `/app/lab/results/[id]` - Laboratory result detail
- `/app/lab/results/[id]/correct` - Correct a submitted result
- `/app/lab/tests` - Lab test catalog browser/search

Current implementation note:

- `/app/lab` exists as the laboratorian shell and role-gated entry point.
- `/app/lab/scan` is implemented with manual QR token entry.
- Live QA for scan flow was completed in Phase 6.2B.

## Screen-to-Endpoint Map

| Screen | Endpoint | Method | Purpose |
|---|---|---|---|
| `/app/lab` | `GET /api/lab-orders/tests/` | GET | Load catalog and dashboard helpers |
| `/app/lab/scan` | `POST /api/lab-orders/scan/` | POST | Open an order by QR token |
| `/app/lab/orders/[id]` | `POST /api/lab-orders/{lab_order_id}/complete/` | POST | Complete order items |
| `/app/lab/orders/[id]` | `GET /api/lab-orders/tests/` | GET | Support test catalog lookup |
| `/app/lab/items/[itemId]/results/new` | `POST /api/lab-orders/items/{lab_order_item_id}/results/` | POST | Create a new lab result |
| `/app/lab/results/[id]` | `GET /api/lab-orders/results/{lab_result_id}/` | GET | Read result detail |
| `/app/lab/results/[id]/correct` | `POST /api/lab-orders/results/{lab_result_id}/correct/` | POST | Correct an existing result |
| `/app/lab/tests` | `GET /api/lab-orders/tests/` | GET | Search and filter catalog |

## Lab Order Lifecycle

Backend order statuses:

- `issued`
- `partially_completed`
- `fully_completed`
- `expired`
- `cancelled`

Rules:

- `issued` is the initial state after doctor creation.
- `partially_completed` appears when some items are completed.
- `fully_completed` locks the order.
- `expired` is evaluated on scan and locks the order.
- `cancelled` is doctor-driven and locks the order.

## Lab Result Lifecycle

Backend result statuses:

- `submitted`
- `corrected`
- `reviewed`
- `released`

Rules:

- Laboratorians create results only for completed order items.
- Correction is allowed only for the original laboratorian while the result is `submitted` or `corrected`.
- Doctors review and release results.
- Patients see released results only.

## QR Scan Workflow

1. Laboratorian enters or scans a QR token.
2. Frontend calls `POST /api/lab-orders/scan/` with `{ qr_token }`.
3. Backend returns the order, remaining items, and a locked flag.
4. If the order is expired or locked, the frontend shows a read-only state.

## Item Completion Workflow

1. Laboratorian reviews the scanned order detail.
2. For each eligible item, the frontend sends `completed` or `unavailable`.
3. Frontend calls `POST /api/lab-orders/{lab_order_id}/complete/`.
4. Backend updates item status and order lifecycle state.

## Result Creation Workflow

Supported backend value types:

- `numeric`
- `text`
- `blood_group`
- `positive_negative`
- `file_only`

Form rules:

- `numeric` requires `numeric_value`.
- `text` requires `text_value`.
- `blood_group` requires `blood_group_value`.
- `positive_negative` uses `text_value` with `positive` or `negative`.
- `file_only` requires `result_file`.
- `laboratorian_notes` is optional and is lab-side only.

## Result Correction Workflow

- Correction request must include a human reason.
- Correction payload can adjust value fields and notes.
- `result_file` is immutable after creation and is not part of correction.
- The backend allows correction only before doctor release.

## Privacy Rules

- Patients must never see `doctor_notes`.
- Patients must never see `laboratorian_notes`.
- Patients must only see released lab results.
- Unrelated users must not see lab order or result detail.
- The frontend must preserve backend serializer boundaries and not infer hidden values.

## UI States

- Verification pending banner for unapproved laboratorians.
- Locked order banner for expired, cancelled, or fully completed orders.
- Empty catalog state when no tests are returned.
- No pending items state when all order items are already completed or unavailable.

## Error States

- `401` - Unauthenticated, redirect to login.
- `403` - Verification or role denied.
- `404` - Order/result not found or not visible to the current role.
- `400` - Invalid QR token, invalid result payload, or locked-order action.
- `500` - Generic backend error with safe fallback copy.

## Phase Breakdown

### Phase 6.1 - Laboratory Dashboard + Verification Gate

- Build `/app/lab` dashboard shell.
- Show verification banner and disabled action states for unapproved laboratorians.
- Surface quick links for scan, tests, and recent work.

### Phase 6.2 - QR Scan and Lab Order Processing

- Build `/app/lab/scan`.
- Integrate `scanLabOrder` service call.
- Render scanned order detail and remaining items.

Status: Completed and live-QA validated (Phase 6.2B).

Validated behaviors:

- Empty token is blocked client-side.
- Invalid token returns backend `400` and safe UI error message.
- Valid token renders order status, summary, and item sections.
- Scan reset action returns to manual entry state.

### Phase 6.3 - Complete Lab Order Items

- Build `/app/lab/orders/[id]` and `/complete` flow.
- Integrate `completeLabOrderItems`.
- Enforce locked-order and verification guards.

Status: Next recommended phase.

### Phase 6.4 - Create Lab Results

- Build `/app/lab/items/[itemId]/results/new`.
- Support the five backend value types.
- Support multipart upload for file-only results.

### Phase 6.5 - Correct Lab Results

- Build `/app/lab/results/[id]/correct`.
- Allow original author correction only before release.
- Preserve immutable file handling.

### Phase 6.6 - Laboratory Portal Final QA

- Validate routing, privacy, i18n, status helper logic, and build integrity.

## Known Backend Gaps

- No separate pending-order list endpoint for laboratorians.
- No WebSocket requirement for Phase 6 initial work.
- No live result-correction stream or realtime lab dashboard contract.
- `/app/lab` is the current and planned canonical route family.
- `/app/laboratory` may be introduced later as an alias only if required.

## Deferred Future Tasks

- Patient incomplete-profile consultation gate must be enforced backend-first in a later phase.
- WebSocket updates and result-to-notification live updates are out of scope for Phase 6.0B.
- Any shared laboratory list/summary API should only be added if the backend later exposes it.