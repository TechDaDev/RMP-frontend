# Pharmacist Portal Final QA

## 1. Test Date and Time
- 2026-05-09T21:51:31+03:00

## 2. Backend URL
- http://localhost:8000

## 3. Frontend URL
- http://localhost:3000

## 4. Routes Tested
- /app/pharmacist
- /app/pharmacist/scan
- /app/pharmacist/history
- /app/patient/prescriptions
- /app/patient/prescriptions/[id]
- /app/doctor
- /app/doctor/prescriptions/[id]
- /app/lab

## 5. Dashboard Result
- PASS: Dashboard loads for pharmacist and role guard is active.
- PASS: Scan card links to /app/pharmacist/scan.
- PASS: History card links to /app/pharmacist/history.
- FIXED: Removed stale deferred empty-state block that still said history was deferred.

## 6. Scan Result
- PASS: Empty/whitespace QR input remains blocked client-side.
- PASS: Invalid QR shows safe error copy without stack traces.
- PASS: Valid QR scan loads prescription panel with real backend data.
- PASS: Scan page keeps dispensing actions only in /app/pharmacist/scan.

## 7. Dispensing Result
- PASS: Partial dispensing of one item updates status to partially_dispensed.
- PASS: Remaining item stays pending and selectable.
- PASS: Full dispensing of remaining item updates status to fully_dispensed.
- PASS: Pending section becomes empty and locking notice appears.
- PASS: No duplicate dispensed rows observed.

## 8. Locked Rescan Result
- PASS: Rescanning the same prescription after full dispense returns locked/fully_dispensed state.
- PASS: No active dispensing controls shown in locked state.
- PASS: QR token is not shown on pharmacist scan result panel.

## 9. History Result
- PASS: /app/pharmacist/history loads and calls real endpoint GET /api/prescriptions/pharmacist/history/.
- PASS: History count uses backend count and reflects new records after dispensing actions.
- PASS: Latest records from this QA run appeared at the top.
- PASS: History cards show medication, short prescription id, status, dispensed time, and safe patient/doctor summary.
- PASS: No QR token, internal pharmacist note, doctor notes, or patient private fields shown in history UI.
- PASS: No active dispensing actions shown in history cards.
- PASS: Back link to dashboard and link to scan route both work.
- NOTE: Explicit next/previous pagination controls are not currently implemented in UI; first page renders correctly.

## 10. Role Guard Result
- PASS: Pharmacist can access /app/pharmacist, /app/pharmacist/scan, /app/pharmacist/history.
- PASS: Patient is redirected away from pharmacist routes to /app/patient.
- PASS: Doctor is redirected away from pharmacist routes to /app/doctor.
- PASS: Laboratorian is redirected away from pharmacist routes to /app/lab.

## 11. Patient Privacy Result
- PASS: Patient cannot access pharmacist routes.
- PASS: Patient prescription UI did not show pharmacist internal notes from dispensing flow.
- PASS: Patient has no access to pharmacist history UI.

## 12. Doctor Handoff Result
- PASS: Doctor cannot access pharmacist routes.
- PASS: Doctor prescription detail route remains operational.
- PASS: Doctor-side prescription status reflected fully_dispensed after pharmacist completed dispensing.

## 13. Language and Theme Result
- PASS: Arabic default observed on login and portal entry.
- PASS: Kurdish switch works and renders pharmacist dashboard copy in Kurdish (RTL).
- PASS: English switch works and renders pharmacist dashboard copy in English (LTR).
- PASS: Theme toggle works and persisted after page reload.
- FIXED: History timestamp formatting now follows active locale instead of forcing en-US.

## 14. Mobile Result
- PASS: Mobile viewport QA was run with automated viewport checks on:
  - /app/pharmacist
  - /app/pharmacist/scan
  - /app/pharmacist/history
- PASS: No horizontal overflow detected in these routes during the run.

## 15. Error-State Result
- PASS: Invalid QR token handled safely.
- PASS: Empty/whitespace token blocked before request.
- PASS: Locked rescan handled safely.
- PASS: No raw stack traces or JSON dumps surfaced in tested pharmacist flows.
- NOT TESTED: Forced backend-down simulation for scan/history endpoints was not executed in this pass.

## 16. Bugs Found
1. Pharmacist dashboard still showed a deferred empty-state message although history endpoint is live.
2. Pharmacist verification notice displayed contradictory copy for approved users.
3. Pharmacist history card timestamps were hardcoded to en-US instead of active locale.
4. Locked prescription backend message appeared in English inside non-English UI.

## 17. Fixes Applied
1. Removed stale deferred empty-state block from pharmacist dashboard route.
2. Updated verification notice title/action summary logic for approved pharmacists.
3. Switched history timestamp rendering to use current app locale.
4. Added localized handling for known locked-prescription backend message in scan panel.

## 18. Known Limitations
- History page currently loads first page only (limit/offset) and does not expose explicit next/previous controls.
- Backend-origin messages are only partially normalized/localized (known locked text mapped; other backend strings may still be raw).

## 19. Deferred Tasks
- Add explicit history pagination controls when UX requirement is confirmed.
- Expand backend-message localization mapping for pharmacist flows.
- Optional copy polish in verification notice secondary text for approved state.

## 20. Security Check
- Confirmed: no credentials committed.
- Confirmed: no QR tokens committed.
- Confirmed: .env.local not staged.
- Confirmed: docs_backend/test_users.md not staged.
- Confirmed: no temporary scripts/files staged.
- Confirmed: no .next cache/build artifacts staged.
