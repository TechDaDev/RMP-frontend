# Mobile + RTL Final QA (Phase 8.7)

## 1) Scope

Final UI-only polish pass for mobile responsiveness and RTL/LTR consistency across the implemented portal.

Included:
- Shared UI primitives and layout wrappers.
- PortalShell follow-up wrapping/notice polish.
- Patient, doctor, laboratory, pharmacist, and profile routes.
- Light/dark contrast sanity for touched surfaces.

Excluded:
- API/service contract changes.
- Auth or authorization behavior changes.
- Route permission changes.
- Feature additions, workflow redesign, or fake data paths.

## 2) Routes Checked

Patient:
- /app/patient
- /app/patient/consultations
- /app/patient/consultations/new
- /app/patient/consultations/[id] (component/layout code path checked; live record traversal data-dependent)
- /app/patient/prescriptions
- /app/patient/prescriptions/[id] (component/layout code path checked; live record traversal data-dependent)
- /app/patient/lab-orders
- /app/patient/lab-orders/[id] (component/layout code path checked; live record traversal data-dependent)
- /app/patient/lab-results
- /app/patient/lab-results/[id] (component/layout code path checked; live record traversal data-dependent)
- /app/patient/medical-record

Doctor:
- /app/doctor
- /app/doctor/consultations/pending
- /app/doctor/consultations/assigned
- /app/doctor/consultations/[id] (component/layout code path checked; live record traversal data-dependent)
- Doctor detail workflow routes under consultations/prescriptions/lab-results/patient-record (layout and responsive behavior checked at component level)

Laboratory:
- /app/lab
- /app/lab/scan
- /app/lab/items/[itemId]/results/new (component/layout code path checked; live item traversal data-dependent)
- /app/lab/results/[resultId]
- /app/lab/results/[resultId]/correct

Pharmacist:
- /app/pharmacist
- /app/pharmacist/scan
- /app/pharmacist/history

Shared/Public:
- /app/profile
- /login
- /

## 3) Viewports Checked

- 360px
- 390px
- 430px
- 768px
- Desktop-wide layout

## 4) Languages Checked

- Arabic (`lang=ar`, `dir=rtl`) as default.
- Kurdish (`lang=ku`, `dir=rtl`).
- English (`lang=en`, `dir=ltr`).

## 5) Theme Checks

Light and dark themes were checked for touched components:
- Page headers and section cards.
- Status/notice surfaces (success/warning/error/info).
- Form controls and action buttons.
- Badge contrast and readability.

## 6) Mobile Drawer Checks

- Drawer semantics kept as dialog with modal behavior.
- Escape-to-close preserved.
- Overlay click-to-close preserved.
- Side placement remains locale-aware:
  - RTL languages open from the right.
  - LTR language opens from the left.

## 7) Overflow Checks

Main fixes:
- `PageHeader`:
  - Mobile padding density improved.
  - Title wrapping and action-row wrapping improved.
- `Button` and `Badge`:
  - Added long-label wrapping safety.
  - Added max-width/min-width safety for dense layouts.
- `ConsultationLifecycleCard`:
  - Converted stepper to responsive grid (2 columns small, 4 columns larger) to avoid overflow.
- `ConsultationMessagesPanel`:
  - Header/actions and message text wrapping improved.
- `PortalShell` verification notices:
  - Added safe wrapping for long localized copy.

## 8) Forms/Action Rows Checks

Main fixes:
- Profile forms (`UserProfileForm`, `DoctorProfileForm`, `PatientProfileForm`, `PharmacistProfileForm`, `LaboratorianProfileForm`):
  - Submit actions now full-width on mobile and auto-width on larger screens.
- Doctor forms (`DoctorResponseForm`, `DoctorMessagesPanel`, `DoctorLabResultReviewCard`):
  - Submit actions now mobile-friendly.
- Doctor order/prescription forms:
  - Action rows converted to responsive grid for clearer small-screen behavior.
- `DoctorWorkspaceActions`:
  - Converted to responsive action grid with full-width mobile targets.
- `PharmacistDispensingForm`:
  - Status toggles now responsive grid for safe wrapping.

## 9) Status/Notice Checks

- Long verification and status notices now wrap safely in PortalShell.
- Existing status logic remains unchanged.
- Existing role/verification gates remain unchanged.

## 10) Bugs Found

1. Patient lifecycle stepper could compress/overflow on small widths.
2. Patient messages header and content had weak wrap behavior in narrow layouts.
3. Doctor workspace action row had cramped button wrapping on mobile.
4. Several form submit actions were too compact on mobile.
5. One pharmacist spacing utility was LTR-specific (`ml-1`).
6. Profile header text had risk of long-name/email clipping.

## 11) Fixes Applied

Shared/UI:
- components/ui/PageHeader.tsx
- components/ui/Button.tsx
- components/ui/Badge.tsx

Shell:
- components/layouts/PortalShell.tsx

Patient:
- components/patient/ConsultationLifecycleCard.tsx
- components/patient/ConsultationMessagesPanel.tsx
- components/patient/ConsultationForm.tsx

Doctor:
- components/doctor/DoctorWorkspaceActions.tsx
- components/doctor/DoctorResponseForm.tsx
- components/doctor/DoctorMessagesPanel.tsx
- components/doctor/DoctorLabResultReviewCard.tsx
- components/doctor/DoctorPrescriptionForm.tsx
- components/doctor/DoctorLabOrderForm.tsx

Pharmacist:
- components/pharmacist/PharmacistDispensingForm.tsx

Profile:
- components/profile/ProfileHeaderCard.tsx
- components/profile/UserProfileForm.tsx
- components/profile/DoctorProfileForm.tsx
- components/profile/PatientProfileForm.tsx
- components/profile/PharmacistProfileForm.tsx
- components/profile/LaboratorianProfileForm.tsx

Docs:
- docs/UI_POLISH_NOTES.md
- docs/FRONTEND_INTEGRATION_PLAN.md

## 12) Remaining Limitations

- Some detail-route live traversal remains data-dependent (record IDs from backend runtime).
- Where live records were unavailable, layout validation was done through route/component structure and existing state surfaces.
- No workflow or payload adjustments were introduced to force traversal.

## 13) Confirmation

Confirmed for this phase:
- No workflow behavior changes.
- No API/service behavior changes.
- No auth/authorization behavior changes.
- No route permission changes.
- No sensitive credentials/tokens/QR values added to docs or UI output.
