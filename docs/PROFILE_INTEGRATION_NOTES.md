# Profile Integration Notes

## Implemented Endpoints

- `GET /api/profiles/me/`
- `PATCH /api/profiles/me/user-profile/`
- `PATCH /api/profiles/me/patient/`
- `PATCH /api/profiles/me/doctor/`
- `PATCH /api/profiles/me/pharmacist/`
- `PATCH /api/profiles/me/laboratorian/`

## Editable Fields

Base user profile:
- `phone_number`
- `profile_image`
- `gender`
- `date_of_birth`
- `governorate`
- `district`
- `address`
- `national_id`

Patient profile:
- `social_security_id`
- `emergency_contact_name`
- `emergency_contact_phone`

Doctor profile:
- `medical_license_number`
- `medical_license_image`
- `specialty`
- `specialty_other`
- `subspecialty`
- `professional_title`
- `years_of_experience`
- `bio`
- `work_address`

Pharmacist profile:
- `pharmacist_license_number`
- `pharmacist_license_image`
- `pharmacy_name`
- `pharmacy_license_number`
- `pharmacy_license_image`
- `pharmacy_address`
- `working_hours`

Laboratorian profile:
- `laboratorian_license_number`
- `laboratorian_license_image`
- `laboratory_name`
- `laboratory_license_number`
- `laboratory_license_image`
- `laboratory_address`
- `specialization`
- `working_hours`

## Verification Handling

Patients receive `verification.required = false`.

Professional roles receive:
- `required`
- `status`
- `is_approved`

The frontend displays pending, approved, rejected, and non-required states. It does not expose staff approval actions and does not fake approval behavior. Backend read-only fields (`verification_status`, `verified_at`, `verification_notes`) are displayed only as status context.

## Completion Handling

The profile page reads backend completion data from:
- `shared_profile_complete`
- `role_profile_complete`
- `overall_complete`
- `missing_shared_fields`
- `missing_role_fields`

Dashboard prompt cards link to `/app/profile` when the profile is incomplete or professional verification is pending. They do not block dashboard access.

## File Upload Support

Confirmed image fields:
- `profile_image`
- `medical_license_image`
- `pharmacist_license_image`
- `pharmacy_license_image`
- `laboratorian_license_image`
- `laboratory_license_image`

The backend validators allow profile image extensions/content types only: jpg, jpeg, png, and webp. The frontend sends JSON PATCH for ordinary updates and switches to `multipart/form-data` only when a selected `File` is present. The request wrapper does not manually set `Content-Type` for FormData so the browser can set the multipart boundary.

PDF upload is not enabled in this phase because backend profile serializers use image fields and image validators.

## Backend Contract Assumptions

- `GET /api/profiles/me/` may be returned directly or in a `{ data }` envelope depending on middleware/response wrapper behavior.
- PATCH validation errors may be returned in API envelope form or direct DRF field-error form.
- The backend owns profile creation during registration; the frontend does not create profile records.
- Professional verification approval/rejection remains staff/backend owned.

## Test Roles

Local patient, doctor, pharmacist, and laboratorian users were used for QA without copying credentials into code, docs, UI, or commits.

## Security Notes

- Profile and medical data are not stored in `localStorage`.
- Only auth tokens remain in the existing token storage path from prior auth work.
- `docs_backend/test_users.md` is local-only and must remain untracked.
- `.env.local` must not be committed.
- No consultations, prescriptions, lab orders, RAG, notifications, WebSockets, or admin approval workflows were added in this phase.
