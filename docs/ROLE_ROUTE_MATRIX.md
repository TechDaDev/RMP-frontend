# Role Route Matrix

This matrix defines current preview behavior and planned guard/redirect behavior for authenticated routing.

## Roles

- anonymous
- patient
- doctor (verification pending / approved)
- pharmacist (verification pending / approved)
- laboratorian (verification pending / approved)
- staff/admin

## Route Access Matrix

| Role | / | /login | /register | /app | /app/patient | /app/doctor | /app/pharmacist | /app/lab | /app/admin |
|---|---|---|---|---|---|---|---|---|---|
| anonymous | allowed | allowed | allowed | redirect -> /login (future) | redirect -> /login (future) | redirect -> /login (future) | redirect -> /login (future) | redirect -> /login (future) | redirect -> /login (future) |
| patient | allowed | redirect -> /app/patient (future) | redirect -> /app/patient (future) | role redirect to /app/patient (future), selector allowed now | allowed | redirect -> /app/patient | redirect -> /app/patient | redirect -> /app/patient | redirect -> /app/patient |
| doctor-pending | allowed | redirect -> /app/doctor (future) | redirect -> /app/doctor (future) | role redirect to /app/doctor (future), selector allowed now | redirect -> /app/doctor | allowed with verification-pending banner and action lock | redirect -> /app/doctor | redirect -> /app/doctor | redirect -> /app/doctor |
| doctor-approved | allowed | redirect -> /app/doctor (future) | redirect -> /app/doctor (future) | role redirect to /app/doctor (future), selector allowed now | redirect -> /app/doctor | allowed | redirect -> /app/doctor | redirect -> /app/doctor | redirect -> /app/doctor |
| pharmacist-pending | allowed | redirect -> /app/pharmacist (future) | redirect -> /app/pharmacist (future) | role redirect to /app/pharmacist (future), selector allowed now | redirect -> /app/pharmacist | redirect -> /app/pharmacist | allowed with verification-pending banner and action lock | redirect -> /app/pharmacist | redirect -> /app/pharmacist |
| pharmacist-approved | allowed | redirect -> /app/pharmacist (future) | redirect -> /app/pharmacist (future) | role redirect to /app/pharmacist (future), selector allowed now | redirect -> /app/pharmacist | redirect -> /app/pharmacist | allowed | redirect -> /app/pharmacist | redirect -> /app/pharmacist |
| laboratorian-pending | allowed | redirect -> /app/lab (future) | redirect -> /app/lab (future) | role redirect to /app/lab (future), selector allowed now | redirect -> /app/lab | redirect -> /app/lab | redirect -> /app/lab | allowed with verification-pending banner and action lock | redirect -> /app/lab |
| laboratorian-approved | allowed | redirect -> /app/lab (future) | redirect -> /app/lab (future) | role redirect to /app/lab (future), selector allowed now | redirect -> /app/lab | redirect -> /app/lab | redirect -> /app/lab | allowed | redirect -> /app/lab |
| staff/admin | allowed | redirect -> /app/admin (future) | redirect -> /app/admin (future) | role redirect to /app/admin (future), selector allowed now | redirect -> /app/admin | redirect -> /app/admin | redirect -> /app/admin | redirect -> /app/admin | allowed |

## Guard Conditions (Planned)

| Route Group | Required backend condition |
|---|---|
| any /app/* | valid authenticated user from GET /api/accounts/me/ |
| /app/patient | user_type == patient |
| /app/doctor | user_type == doctor |
| /app/pharmacist | user_type == pharmacist |
| /app/lab | user_type == laboratorian |
| /app/admin | is_staff == true OR is_superuser == true |
| doctor action endpoints | verification_status == approved |
| pharmacist action endpoints | verification_status == approved |
| laboratorian action endpoints | verification_status == approved |

## Privacy and Visibility Rules (Planned UI Guards)

1. Patients must not see prescription medication items.
2. Patients must not see lab order test item details.
3. Patients must not see unreleased lab results.
4. Patients must not see laboratorian_notes or doctor_notes in results.
5. Non-approved medical staff should see profile completion/verification pending states and action-disabled workflows.

## Planned Laboratory Route Map

Role: laboratorian only.


- `/app/lab`
- `/app/lab/scan`
- `/app/lab/orders/[id]`
- `/app/lab/orders/[id]/complete`
- `/app/lab/items/[itemId]/results/new`
- `/app/lab/results/[id]`
- `/app/lab/results/[id]/correct`
- `/app/lab/tests`

Canonical laboratorian shell and route family is `/app/lab`.
Optional future alias: `/app/laboratory/*`.

## Phase 6.2B Guard QA Results

Explicit runtime checks were executed on `/app/lab/scan`:

- patient -> redirected to `/app/patient`
- doctor -> redirected to `/app/doctor`
- laboratorian -> allowed

## Current Preview Mode Note

- Current Phase 1 preview keeps /app as role selector for UI preview only.
- Route restrictions above become enforced after Phase 2 auth integration.
