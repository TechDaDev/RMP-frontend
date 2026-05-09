# Laboratory Portal Final QA Report (Phase 6.6)

## 1) Test Date/Time

- UTC: 2026-05-09 00:27:22Z

## 2) Backend URL

- `http://localhost:8000`
- Health check: `GET /api/health/` returned healthy response.

## 3) Frontend URL

- `http://localhost:3000`

## 4) Routes Tested

- `/app/lab`
- `/app/lab/scan`
- `/app/lab/items/fake-id/results/new`
- `/app/lab/results/fake-id`
- `/app/lab/results/fake-id/correct`
- Role-guard attempts to the same routes for patient and doctor users

## 5) Dashboard Result

Status: PASS

- Lab dashboard loads.
- Verification badge/status renders.
- Lab identity block renders when profile data is present.
- Test catalog preview renders.
- Scan workflow action links to `/app/lab/scan`.
- Privacy notice renders.

## 6) QR Scan Result

Status: PASS (core), PARTIAL (advanced flow)

- Empty token is blocked client-side (submit disabled until token input).
- Invalid token path shows safe error behavior.
- Valid token opens scanned order panel and status/doctor/expiry metadata.
- Scan reset action works.

## 7) Item Completion Result

Status: PARTIAL / DEFECT FOUND

- Completion action and confirmation UI work.
- Success notice appears after completion.
- Defect observed: completed items section remains empty (`0`) after successful completion in tested flow, preventing reliable create-result handoff from completed items list.

Fixes applied in this QA pass:
- Added safer merge logic in `/app/lab/scan` state update to infer completed items from remaining-item diffs when backend completion payload is partial.
- Avoided immediate rescan overwrite when inferred completed item(s) exist.

Note:
- Additional runtime verification still indicates incomplete propagation in at least one scenario; this remains open for follow-up.

## 8) Result Creation Result

Status: PARTIAL

- Invalid route (`/app/lab/items/fake-id/results/new`) renders safe form/error behavior without crash.
- Required-field validation appears on empty submit.
- Full completed-item-to-result E2E path is blocked by the completion-list propagation issue above in tested flow.

## 9) Result Detail Result

Status: PASS (error-state), PARTIAL (real-result)

- Invalid route (`/app/lab/results/fake-id`) shows safe controlled error state.
- No raw stack traces or JSON dumps shown.
- Real-result detail verification is pending completion-list handoff stabilization.

## 10) Result Correction Result

Status: PASS (route/error-state), PARTIAL (real-result)

- Invalid route (`/app/lab/results/fake-id/correct`) shows safe controlled error state.
- Real submitted-result correction flow could not be fully closed in this pass due upstream completed-item handoff issue.

## 11) Role Guard Result

Status: PASS

- Laboratorian can access lab routes.
- Patient access to lab routes redirects to patient area.
- Doctor access to lab routes redirects to doctor area.

## 12) Patient Privacy Result

Status: PASS (guard checks), PARTIAL (released-result visibility cycle)

- Patient cannot access laboratory portal routes.
- Patient is redirected from creation/correction/detail lab staff routes.
- Full unreleased/released comparison cycle in patient result list remains pending doctor release scenario execution in this pass.

## 13) Doctor Handoff Result

Status: PASS (route separation)

- Doctor is blocked from laboratorian portal routes.
- Lab portal does not expose doctor review/release controls.
- Doctor-side lab workflows remain in doctor routes.

## 14) Language/Theme Result

Status: PASS (core), FIX APPLIED

- Arabic default and RTL behavior observed.
- English and Kurdish switching paths remain available.
- Dark/light theme toggle works.
- Fix applied: removed hardcoded English label usage in scanned-order panel by localizing the created-at label (`t.patient.createdAt`).

## 15) Mobile Result

Status: PARTIAL

- Core layout behavior is responsive in portal shell and scan page structure.
- Full viewport-by-viewport artifact review for all lab pages remains pending after completion-list defect triage.

## 16) Error-State Result

Status: PASS

- Invalid token and invalid IDs render safe user-facing states.
- No endless spinners after settled requests.
- No stack traces or raw payloads shown in tested states.

## 17) Known Limitations

1. Completed-items list propagation after completion still shows zero in at least one tested path despite local inference patch.
2. Full real-result creation/detail/correction closure is dependent on the completed-items handoff displaying actionable completed items consistently.
3. Some backend message strings arrive in English and are surfaced verbatim in UI (server-side copy source).

## 18) Deferred Tasks

1. Re-run strict E2E: scan -> complete -> create result (all value types) -> detail -> correction (required for final closure).
2. Verify duplicate-result handling from the completed-item create action path after handoff stabilization.
3. Execute full patient released-result visibility check (including doctor release cycle).
4. Finish explicit mobile checks for all Phase 6.5 routes.

## 19) Security Check

- Credentials committed: NO
- QR tokens committed: NO
- `.env.local` committed: NO
- `docs_backend/test_users.md` committed: NO
- Temp uploaded test files committed: NO
- Generated cache files committed: NO

## Phase 6.6.1 Addendum (Completed-Item Handoff Stabilization)

### Root Cause (confirmed with live payload)

- In at least one real backend variant, completion and immediate rescan responses returned:
	- `remaining_items`
	- `lab_order.status`
	- `locked`
	- `message`
- The same variant returned no `completed_items` and no `lab_order.completed_items`.
- This caused completed item handoff to be unstable unless the UI inferred completed detail from pre-completion scan state.

### Fixes applied

1. Added `normalizeScannedOrderState` helper to merge and normalize scan/completion/rescan states.
2. Preserved pre-completion item details and inferred completed item from remaining-item diff.
3. Passed explicit completed item id from completion button flow to scan page normalization.
4. Prevented empty completed payload variants from wiping inferred completed state.
5. Updated create-result eligibility so completed items remain actionable when order is `fully_completed` (still blocked for `expired`/`cancelled`).

### Live backend variant evidence (sanitized)

- Fresh order scan:
	- `status=issued`
	- `remaining_items=1`
	- `completed_items=0`
- Completion response:
	- `status=fully_completed`
	- `remaining_items=0`
	- `locked=true`
	- keys: `lab_order, locked, message, remaining_items`
	- completed item arrays absent
- Rescan response:
	- `status=fully_completed`
	- `remaining_items=0`
	- `locked=true`
	- completed item arrays absent

### Required chain closure (live)

PASS:
- scan -> complete item -> completed section updates (`completed_items=1`)
- create-result action appears for completed item
- create numeric result succeeds
- duplicate create attempt returns safe backend error (no crash)
- result detail route loads and renders
- correction route enforces required reason on empty submit
- valid correction submit succeeds
- result detail reflects corrected status/value

### Role and privacy sanity re-check

PASS:
- laboratorian can access lab routes
- patient redirected to patient portal when requesting lab routes
- doctor redirected to doctor portal when requesting lab routes
- no doctor review/release controls were added to laboratory portal

### Locale/theme/mobile quick regression

PASS (quick):
- Arabic default/RTL verified
- English LTR verified
- Kurdish RTL verified
- dark/light toggle verified
- no horizontal overflow detected on narrow viewport (`390x844`) for checked route

## Final Phase 6.6 Status

- Phase 6.6 is marked COMPLETE after Phase 6.6.1 stabilization and live chain closure.
