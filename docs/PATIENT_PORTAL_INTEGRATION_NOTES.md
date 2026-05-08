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

## Phase 4.3B - Symptom Catalog UX Verification

### Backend Catalog State (Verified Live)

- `GET /api/consultations/symptom-categories/` → 27 categories (expanded from 13)
- `GET /api/consultations/symptoms/` → 141 symptoms (expanded from 22)
- 23 red-flag symptoms observed in catalog
- Symptom response is non-paginated: all symptoms returned as flat array inside `data` envelope
- Each symptom has: `id`, `category` (nested object with `id`/`name`/`description`/`display_order`), `name`, `description`, `is_red_flag`, `display_order`
- Normalization in `patientService.ts` handles envelope unwrap + flat array correctly — no change required

### Symptom Picker UX Changes Applied

**Client-side filtering** (was server-side category API call):
- Category filter now filters `symptoms` prop client-side inside `filteredSymptoms` useMemo
- `handleCategoryChange` API call removed from `new/page.tsx`; all 141 symptoms loaded once on mount
- Filtering is instant and does not require a network round-trip per category switch
- Clearing a category no longer resets selected symptoms (previous behavior discarded selections on category change)

**Category count in dropdown**:
- Each `<option>` now shows symptom count, e.g. `Respiratory (12)`
- "All categories" option shows total count `(141)`
- Counts computed from the loaded `symptoms` array via `categoryCounts` useMemo

**Selected symptoms chip panel**:
- When one or more symptoms are selected, a chip row appears above the symptom grid
- Each chip shows the symptom name and an × button to individually deselect
- Chips truncate long names to prevent layout overflow
- Chips use the primary accent color for visual continuity

**Sorting**:
- Symptom grid sorts: selected first → red-flag second → display_order ascending
- This keeps selected symptoms visible at the top of the (potentially long) grid

**Scrollable symptom grid**:
- Grid container capped at `max-h-96` with `overflow-y-auto`
- Prevents the page from becoming excessively tall with 141 symptoms

**Red-flag safety notice**:
- When any selected symptom is a red flag (`is_red_flag: true`), a distinct red-bordered notice appears
- Notice copy (all 3 locales):
  - Arabic: إذا كانت الأعراض شديدة أو طارئة، يرجى التوجه إلى أقرب طوارئ فورًا.
  - English: If symptoms are severe or urgent, please seek emergency care immediately.
  - Kurdish: ئەگەر نیشانەکان توند یان فریاکەوتن بوون، تکایە دەستبەجێ سەردانی نزیکترین فریاکەوتن بکە.
- Notice is contextual — only shown when a red-flag symptom is actually selected
- Does not claim diagnosis or AI triage

**Filtered symptom count indicator**:
- When category or search filters are active, the header shows `X / total` symptom count so the patient knows they are seeing a subset

### No Specialty Selector
- No specialty dropdown was re-introduced
- Backend continues to assign `selected_specialty` from symptom routing rules
- Frontend submits `symptom_ids` only

### New Translation Keys Added (ar / ku / en)
- `safetyEmergencyNotice`: shown when a red-flag symptom is selected
- `removeSymptom`: aria-label for the chip × button
- `showingSymptomsCount`: "Showing {count} of {total} symptoms" (available for future use)
- Consultation creation behavior remains symptom-first and unchanged.

### Deferred Work (Not Implemented in Phase 4.2B)

- Profile-completion gating before consultation creation remains deferred and must be enforced in backend plus reflected in frontend in a future phase.