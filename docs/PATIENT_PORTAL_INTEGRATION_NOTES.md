# Patient Portal Integration Notes

This document captures the implemented frontend contract for the patient portal and the live backend behavior verified during integration.

## Scope Delivered

- Patient dashboard summary at `/app/patient`
- Consultation list, detail, and create flow
- Consultation messaging inside consultation detail
- Prescriptions list and detail
- Lab orders list and detail
- Released lab results list and detail
- Read-only medical record view
- Patient-specific sidebar navigation in the portal shell
- Arabic, Kurdish, and English copy for the patient workflow surface

## Live Backend Verification

The patient portal was implemented against the live backend on `http://localhost:8000/api/`, not against static docs alone.

Verified runtime behavior:

- Health endpoint is reachable at `/api/health/`
- Login succeeds and returns tokens under `data.access` and `data.refresh`
- Patient endpoints use the `success` envelope with payload inside `data`
- Patient list endpoints currently return flat arrays inside `data`
- No DRF pagination was observed on the patient endpoints exercised for Phase 4

Verified patient endpoints:

- `GET /api/accounts/me/`
- `GET /api/profiles/me/`
- `POST /api/consultations/`
- `GET /api/consultations/my/`
- `GET /api/consultations/<id>/`
- `GET /api/consultations/symptom-categories/`
- `GET /api/consultations/symptoms/`
- `GET/POST /api/consultations/<id>/messages/`
- `POST /api/consultations/<id>/messages/mark-read/`
- `GET /api/prescriptions/my/`
- `GET /api/prescriptions/my/<id>/`
- `GET /api/lab-orders/my/`
- `GET /api/lab-orders/my/<id>/`
- `GET /api/lab-results/my/`
- `GET /api/lab-results/my/<id>/`
- `GET /api/patient-records/my/`

## Frontend Implementation Notes

### Service Layer

Patient portal requests are centralized in `lib/patient/patientService.ts`.

- Unwraps the backend `success/data` envelope
- Accepts either flat arrays or paginated payloads for future safety
- Keeps all patient workflow API access behind authenticated requests

### Consultation Intake (Symptom-First)

- Patient consultation creation is symptom-first and does not ask the patient to pick a specialty
- Frontend submits `symptom_ids` with duration/severity/fever/pain/notes
- Frontend does not submit `selected_specialty` or `selected_specialty_other`
- Backend assigns `selected_specialty` deterministically from symptom-specialty routing rules
- This routing is system rule-based (deterministic), not AI triage
- AI triage/recommendation is future work and not implemented in this phase

### Route Surface

Implemented patient routes:

- `/app/patient`
- `/app/patient/consultations`
- `/app/patient/consultations/new`
- `/app/patient/consultations/[id]`
- `/app/patient/prescriptions`
- `/app/patient/prescriptions/[id]`
- `/app/patient/lab-orders`
- `/app/patient/lab-orders/[id]`
- `/app/patient/lab-results`
- `/app/patient/lab-results/[id]`
- `/app/patient/medical-record`

These routes remain protected by the existing patient-only layout guard.

### Privacy Constraints Preserved

The UI intentionally mirrors backend privacy limits instead of trying to infer hidden clinical data.

- Prescription medication items are not shown to patients
- Hidden lab order test items are not shown to patients
- Only released lab results are shown to patients
- Doctor-only and laboratorian-only notes are not rendered in patient lab result views
- No patient medical data is stored in local storage
- No doctor, pharmacist, laboratorian, WebSocket, or RAG workflows were added in this phase

## Symptom Catalog Dependency

Consultation creation requires a non-empty symptom catalog because `symptom_ids` are required.

Local backend seed command:

```bash
cd /home/zeus3000/PycharmProjects/RMP_backend/alrafidain_backend
DB_PORT=5433 python3 manage.py seed_symptoms --settings=config.settings.local
```

## Validation Performed

- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

Result at completion:

- Lint passes
- Typecheck passes
- Production build passes

## Remaining Follow-Up

- Seed the backend symptom catalog so consultation creation can be exercised end-to-end from the UI
- Add patient workflow UI QA screenshots or scripted browser checks if a stricter release checklist is needed

## Phase 4.2B - Consultation Detail 403 Diagnosis

### Diagnosis Result

- The consultation detail endpoint itself (`GET /api/consultations/<id>/`) returns `200` for the same patient and consultation ID.
- The consultation messages endpoints return `403` for submitted consultations:
	- `GET /api/consultations/<id>/messages/`
	- `POST /api/consultations/<id>/messages/mark-read/`
- Frontend detail page previously loaded detail and messages with `Promise.all`, so a messages `403` caused the whole detail view to fail with a generic empty state.

### Root Cause

- The frontend treated a non-critical messages permission error as a fatal consultation detail error.
- In development, React StrictMode can double-run effects, which made the same `403` appear twice and amplified confusion during QA.

### Fix Applied

- Decoupled consultation detail loading from consultation messages loading in the patient detail page.
- Kept detail rendering successful even if messages endpoints return `403`.
- Added clearer consultation detail error UX for real detail-level failures with:
	- a retry action
	- a back-to-consultations action
	- localized `403` copy in Arabic, Kurdish, and English

### Verification Outcome

- Consultation detail now renders when backend returns `200` for detail, even if messages are unavailable due to backend permissions for current consultation status.
- Consultation creation behavior remains symptom-first and unchanged.

### Deferred Work (Not Implemented in Phase 4.2B)

- Profile-completion gating before consultation creation remains deferred and must be enforced in backend plus reflected in frontend in a future phase.