# Auth QA Report — Phase 2.1

## Overview

Phase 2.1 hardens the authentication UX and error handling introduced in Phase 2. All testing was performed against the live Django REST Framework backend at `http://localhost:8000/api/`.

---

## Backend Testing Results

### Roles Tested

| Role | Login | Dashboard Redirect | Verification Banner |
|------|-------|--------------------|---------------------|
| patient | ✅ | /app/patient | N/A (no verification required) |
| doctor | ✅ | /app/doctor | Pending / Approved / Rejected banners work |
| pharmacist | ✅ | /app/pharmacist | Pending / Approved / Rejected banners work |
| laboratorian | ✅ | /app/lab | Pending / Approved / Rejected banners work |

### Error Cases Tested

| Scenario | Backend Response | Frontend Handling |
|----------|-----------------|-------------------|
| Wrong password | 400 `{success:false, message:"Login failed.", errors:{non_field_errors:["Invalid credentials."]}}` | `non_field_errors` promoted to message — shown in error alert |
| Invalid/expired token | 401 | AuthProvider clears tokens, sets user to null, redirects to login |
| Network offline | `fetch` throws TypeError | Caught, `ApiError(status=0)` thrown, `t.auth.networkError` shown |
| Field validation errors | 400 with `errors` object | Field errors concatenated and shown in error alert |

### Backend Limitations (Documented)

- `is_staff` and `is_superuser` fields return `null` for all users including admin — cannot detect superuser from token/profile response
- Admin user has `user_type: doctor` — treated as doctor role
- No token refresh endpoint — access tokens expire without auto-renewal (out of scope for Phase 2)

---

## Changes Implemented

### API Layer

- `lib/api/client.ts`: `fetch()` wrapped in try/catch; network failures throw `ApiError` with `status: 0`
- `lib/api/errors.ts`: `throwApiError` promotes `non_field_errors` array to top-level message

### Auth Provider

- `components/auth/AuthProvider.tsx`: 401 errors in `loadProfile` call `clearTokens()` before setting user to null

### Form UX

- All public auth forms: `noValidate`, `if (loading) return` guard, network error branch (`err.status === 0`)
- `autoComplete` attributes: `email`, `current-password`, `new-password`, `given-name`, `family-name`, `one-time-code`
- Password fields replaced with `PasswordInput` component (show/hide toggle with EyeIcon/EyeOffIcon)

### Route Guards

- `RequireAuth`: shows `<AppLoading />` spinner during initial token check (prevents flash of protected content)
- `RequireRole`: per-role guard component; wrong-role users redirected to correct dashboard
- Per-role layouts: `app/(portal)/app/{patient,doctor,pharmacist,lab}/layout.tsx`

### Verification Display

- PortalShell: "Verified" green badge shown for professionals with `is_approved === true`
- Existing pending/rejected/suspended banners unchanged

### i18n

- 4 new strings added to all 3 locales (ar/ku/en): `networkError`, `showPassword`, `hidePassword`, `verificationApprovedBadge`

---

## Security Notes

- No credentials stored in source code or documentation
- Token storage is localStorage (temporary — httpOnly cookie migration is a future task, noted in `lib/auth/tokenStorage.ts`)
- `docs_backend/` folder remains untracked (excluded from git)
- `.env.local` remains untracked/gitignored

---

## Remaining Risks / Future Work

1. **Token refresh**: No `/token/refresh/` endpoint implemented — expired access tokens require re-login
2. **Admin detection**: Backend does not expose `is_staff`/`is_superuser` — cannot build separate admin UI based on these flags
3. **localStorage tokens**: Should migrate to httpOnly cookies in a future backend/frontend coordination task
4. **OTP expiry**: No frontend timer showing OTP expiry countdown
