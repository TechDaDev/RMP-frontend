# Laboratory Frontend Implementation Notes

## Backend Docs Path

- `/home/zeus3000/PycharmProjects/RMP_backend/alrafidain_backend/docs`

## Key Backend Contract

- `LABORATORY_WORKFLOW_CONTRACT.md`

## Endpoint List

- `GET /api/lab-orders/tests/` - lab test catalog
- `POST /api/lab-orders/scan/` - QR scan
- `POST /api/lab-orders/{lab_order_id}/complete/` - batch item completion
- `POST /api/lab-orders/items/{lab_order_item_id}/results/` - create result
- `GET /api/lab-orders/results/{lab_result_id}/` - lab-side result detail
- `POST /api/lab-orders/results/{lab_result_id}/correct/` - correct result

## Route Plan

- `/app/lab`
- `/app/lab/scan`
- `/app/lab/orders/[id]`
- `/app/lab/orders/[id]/complete`
- `/app/lab/items/[itemId]/results/new`
- `/app/lab/results/[id]`
- `/app/lab/results/[id]/correct`
- `/app/lab/tests`

Optional future alias (not canonical): `/app/laboratory/*`

## Status / Action Matrix

| Action | Allowed when |
|---|---|
| Scan lab order | laboratorian approved |
| Complete order items | order not locked, laboratorian approved |
| Create result | item completed, order not locked, laboratorian approved |
| Correct result | status `submitted` or `corrected`, original laboratorian, before release |
| View result | lab-side access allowed by backend; patient only after release |

## Value Type Form Rules

- `numeric` - `numeric_value` required.
- `text` - `text_value` required.
- `blood_group` - `blood_group_value` required.
- `positive_negative` - `text_value` must be `positive` or `negative`.
- `file_only` - `result_file` required.

## File Upload Rules

- Use multipart form data when `result_file` is present.
- Keep the correction flow file-immutable.
- Do not expose file-only results before backend release policy allows them.

## Verification Restrictions

- Laboratory clinical actions require approved verification.
- Unapproved laboratorians should see disabled actions and guidance copy.
- The frontend should expect `403` for protected lab actions when verification is missing.

## Privacy Rules

- Never expose `doctor_notes` to patients.
- Never expose `laboratorian_notes` to patients.
- Do not reveal unreleased lab results in patient UI.
- Do not invent pending-order summary data that the backend does not supply.

## Known Limitations

- No separate laboratorian pending list endpoint exists.
- No WebSocket phase in the initial laboratory implementation.
- The laboratory dashboard should be built from existing endpoints and local UI state only.

## Deferred Patient Profile Gate

- Patient profile-completion gating for consultation creation is deferred.
- It must be enforced in the backend first and only then mirrored in the frontend.

## Phase 6.2B Live QA (2026-05-09)

### Implemented and verified

- `/app/lab/scan` is implemented and reachable from the laboratory dashboard workflow card.
- Manual QR token entry is implemented (no camera scanner).
- `POST /api/lab-orders/scan/` is integrated through `scanLabOrder` in the frontend service layer.
- Scanned order panel renders status badge, summary fields, and item lists.
- Pending and completed item sections render from backend response data.

### Validation and error handling results

- Empty token submission is blocked client-side (submit button disabled while input is empty).
- Invalid token returns backend `400` and UI shows safe, user-facing error text.
- Valid token scan succeeds and displays scanned order details and pending items.
- "Scan another order" clears scanned state and returns to manual input.

### Role and access QA

- Laboratorian can access `/app/lab/scan`.
- Patient and doctor are redirected away from `/app/lab/scan` to role-appropriate routes.

### Locale and theme QA

- Arabic remains default and renders RTL labels on scan page.
- Kurdish renders RTL labels without missing keys.
- English renders LTR labels without missing keys.
- Theme toggle works and persisted preference was observed in browser storage.

### Deferred by design

- Camera scanner remains deferred.
- Item completion UI is deferred to Phase 6.3.
- Result creation and correction UI are deferred to Phase 6.4+.
- No fake pending-order list is introduced.

## Phase 6.3 Laboratory Item Completion (2026-05-09)

### Implemented and verified

- Item completion action is now available per remaining item inside `/app/lab/scan` after a successful scan.
- Completion calls `POST /api/lab-orders/{lab_order_id}/complete/` via `completeLabOrderItems` with phase-scoped payload status `completed`.
- Optional laboratorian completion note is supported in the UI payload.
- Scan state is refreshed after completion; when completion response omits full completed-items detail, the page rescans using in-memory token state.

### Behavioral constraints

- Completion controls are hidden/disabled for locked orders.
- Result creation remains explicitly deferred in this phase.
- No result creation or correction UI was introduced as part of item completion.

### Live API QA snapshot

- Completion endpoint returned `200` for real pending item completion.
- Completion response returned `lab_order`, `locked`, `message`, and `remaining_items`; completed item detail is recovered by the in-memory QR rescan fallback.
- Order lifecycle moved from `issued` to `partially_completed` after one item and to locked `fully_completed` after the final item.
- Invalid item completion payload returned `400` with safe frontend error handling path.

### Live browser QA snapshot

- `/app/lab/scan` completed a real scanned remaining item from the browser.
- Completed/locked order state hid completion controls and kept result creation deferred messaging visible.
- Arabic default rendered RTL; English rendered LTR; Kurdish rendered RTL.
- Dark and light theme preferences applied.
- Patient and doctor users remained redirected away from `/app/lab/scan`.

## Phase 6.4 Laboratory Result Creation (2026-05-09)

### Implemented and verified

- Added result creation route: `/app/lab/items/[itemId]/results/new`.
- Added dynamic result form for backend value types:
	- `numeric`
	- `text`
	- `blood_group`
	- `positive_negative`
	- `file_only`
- Integrated `POST /api/lab-orders/items/{item_id}/results/` via `createLabResultForItem`.
- Added multipart upload support for `file_only` (FormData with `result_file`).
- Added completed-item create-result action wiring in scanned order item list.

### Contract QA highlights

- Successful create responses return envelope keys `success`, `message`, `data`.
- Duplicate result creation for same item returns `400`.
- Invalid payloads return field-level validation errors under `errors`.
- `blood_group_value` uses enum values such as `a_positive` (not `A+`).
- Lab and doctor result-detail endpoints returned created result records.
- Patient released-results list did not include newly submitted (unreleased) results.

### Behavioral constraints

- Result correction remains deferred to Phase 6.5.
- Doctor review/release remains doctor-portal responsibility.
- No camera scanning, WebSocket, or RAG additions in this phase.

## Phase 6.5 Laboratory Result Correction (2026-05-09)

### Implemented and verified

- Added result detail route: `/app/lab/results/[resultId]`.
  - Displays current result value, unit, reference range, flag, and notes.
  - Shows result status badge with tone styling.
  - Shows correction action only when status is `submitted` or `corrected` and user is approved.
  - Hides correction action when status is `reviewed` or `released`.
  - Includes back links to scan and lab dashboard.

- Added correction route: `/app/lab/results/[resultId]/correct`.
  - Requires reason field (client-validated and backend-required).
  - Supports dynamic correction fields for all 5 value types.
  - Reuses `LaboratoryResultValueFields` for consistent field rendering.
  - Handles backend field-level validation errors and safe display.
  - Shows success panel after successful correction with result summary.
  - Links back to result detail and lab dashboard.

- Integrated `POST /api/lab-orders/results/{result_id}/correct/` via `correctLaboratoryResult`.
  - Uses FormData when correcting file-only results with new file (NOT currently supported by backend).
  - Uses JSON payload for all other value type corrections.
  - Backend correction response updates result status to `corrected`.
  - Creates audit trail in `LabResultCorrection` model (backend).

- Updated `LaboratoryResultCreatedPanel` to include:
  - View Result link to `/app/lab/results/{resultId}`.
  - Correct Result link to `/app/lab/results/{resultId}/correct` (shown only if status allows).

- Added i18n keys for all Phase 6.5 components in Arabic, Kurdish, and English.

### Correction behavior

- Only original laboratorian can correct (backend enforces).
- Can correct only while status is `submitted` or `corrected`.
- Cannot correct once status is `reviewed` or `released`.
- File correction is immutable (correction endpoint ignores file-only result_file changes per backend contract).
- Reason field is required and client-validated.

### Role and access QA

- Laboratorian approved: can access result detail and correction routes.
- Laboratorian unapproved: sees "Verification pending" message with disabled correction form.
- Patient: redirected away from `/app/lab/results/[resultId]` and `/app/lab/results/[resultId]/correct`.
- Doctor: redirected away from `/app/lab/results/[resultId]` and `/app/lab/results/[resultId]/correct`.

### Locale and theme QA

- Arabic renders RTL and includes all Phase 6.5 translation keys.
- Kurdish renders RTL and includes all Phase 6.5 translation keys.
- English renders LTR and includes all Phase 6.5 translation keys.
- Theme toggle works on both result detail and correction pages.

### Known limitations

- Correction history is not displayed (would require additional backend endpoint or payload structure).
- File-only corrections cannot change the file (backend immutable).
- Doctor review/release remains outside laboratory portal scope.

## Phase 6.6 Laboratory Final QA Pass (2026-05-09)

### Runtime QA completed

- Verified health/runtime:
  - backend `GET /api/health/` healthy
  - frontend dev server reachable on `http://localhost:3000`
- Verified laboratorian route access and guard behavior on:
  - `/app/lab`
  - `/app/lab/scan`
  - `/app/lab/items/[itemId]/results/new`
  - `/app/lab/results/[resultId]`
  - `/app/lab/results/[resultId]/correct`
- Verified patient and doctor are redirected away from all laboratorian routes.
- Verified invalid token and invalid ID paths return safe error states.

### Defects found and fixed

1. **Hardcoded English UI label in scan panel**
   - File: `components/laboratory/LaboratoryScannedOrderPanel.tsx`
   - Fix: replaced hardcoded `Created At` label with localized key usage.

2. **Partial completion payload could leave completed section stale**
   - File: `app/(portal)/app/lab/scan/page.tsx`
   - Fix:
     - infer newly completed items from remaining-item diff
     - merge inferred items into `completed_items`
     - avoid immediate rescan overwrite when inferred completion exists

### Remaining blocker

- In at least one real flow, completed items still render as empty after successful completion, preventing reliable UI handoff to result creation from completed-item actions.
- Because of this, Phase 6.6 is not marked fully complete in this pass.

### Validation state

- `npm run lint` -> pass
- `npx tsc --noEmit` -> pass
- `NODE_OPTIONS=--max-old-space-size=4096 npm run build` -> pass

See `docs/LABORATORY_PORTAL_FINAL_QA.md` for full final QA report.

## Phase 6.6.1 Completed-Item Handoff Stabilization (2026-05-09)

### Root cause confirmed from live payloads

- Live completion and rescan payload variant observed for a fresh one-item order:
  - completion response keys: `lab_order`, `locked`, `message`, `remaining_items`
  - no `completed_items` and no `lab_order.completed_items`
  - rescan response also lacked completed item details while `remaining_items` was already `0` and order status was `fully_completed`
- Because completed item details were omitted in this variant, naive replacement logic could render completed count as `0` even after successful completion.

### Stabilization implementation

- Added `lib/laboratory/laboratoryScanState.ts` with `normalizeScannedOrderState`.
- Normalizer behavior:
  - preserves previous scanned item detail set
  - merges completion and rescan payloads when available
  - infers completed items from removal diff (`previous.remaining_items - next.remaining_items`)
  - accepts explicit completed item id(s) from completion action path
  - deduplicates completed items by id
  - removes inferred/known completed ids from remaining list
  - preserves backend status/locked/message precedence when present
  - avoids empty rescan payload overwriting inferred completed items

### Completion callback chain update

- Updated callback signature to propagate completed item ids:
  - `LaboratoryCompleteItemButton` -> `LaboratoryOrderItemsList` -> `LaboratoryScannedOrderPanel` -> scan page handler
- Scan page now applies one normalized state update per completion cycle, optionally enriched by in-memory rescan.

### Create-result handoff correction

- Updated `canCreateResultForItem` in `lib/laboratory/laboratoryStatus.ts`:
  - completed items remain eligible for result creation when order is `fully_completed`
  - still blocked for `expired` and `cancelled`

### Live chain verification result

- Verified full chain on live backend:
  - scan with fresh order token
  - complete item
  - completed section updates to `1`
  - create-result action appears for completed item
  - create numeric result succeeds
  - duplicate create attempt returns safe backend error
  - result detail route loads
  - correction route enforces required reason
  - valid correction succeeds and detail shows corrected status/value

## Phase 6.7B Frontend Hardening After Backend Scan Payload Fix (2026-05-09)

### Backend Phase 6.7A Status
- Completed: `POST /api/lab-orders/scan/` now returns `lab_order.completed_items` for partially_completed and fully_completed orders
- Frontend verified clean consumption of backend payload on cold rescan

### Frontend Changes

#### New File: lib/laboratory/laboratoryErrorMessages.ts
- Maps known backend English error/status messages to frontend i18n keys
- Currently supports: locked order, invalid QR token, expired order, cancelled order
- Falls back to original message if mapping not found
- Enables backend message localization without backend i18n changes

#### Updated File: components/laboratory/LaboratoryScannedOrderPanel.tsx
- Imports `localizeLaboratoryMessage` helper
- Applies message localization in both scanned-order summary and locked-order warning sections
- Backend message `"This lab order is no longer available for completion."` now renders in user's locale

### Cold Rescan Verification (Live)
- Test: Fresh order → laboratorian scan → complete item → "Scan Another Order" → rescan same token
- Result: PASS
  - Remaining items: 0
  - Completed items: 1 (backend payload consumed directly)
  - Order status: fully_completed (locked)
  - Completed item detail (test name, sample type, completion date) all present

### Fallback Normalization Assessment
- `lib/laboratory/laboratoryScanState.ts` remains unchanged
- Defensive inference layer still necessary — backend variant handling preserved
- No simplification applied per user requirement to keep fallback

### Message Localization Impact
- Backend scan responses with locked order now render localized message
- Tested in Arabic (rendered in Arabic instead of English)
- Mapper extensible for new backend messages as they emerge

### Validation Results
- ✅ TypeScript: No compilation errors
- ✅ ESLint: No linting issues
- ✅ Next.js Build: 26/26 routes successful

### Files Changed Summary
- Modified: 1 (LaboratoryScannedOrderPanel.tsx)
- Created: 1 (laboratoryErrorMessages.ts)
- Total diff: +49 lines, -4 lines

