# Pharmacist Frontend Implementation Notes

Phase 7.0B — Technical handoff for Phase 7.1+ implementation

Phase 7.1 addendum — Dashboard + verification gate implemented

Phase 7.2 addendum — Manual prescription scan + detail panel implemented

---

## Phase 7.1 Status (Implemented)

### Implemented routes

- `/app/pharmacist`
- `/app/pharmacist/scan`

### Implemented UI scope

- Pharmacist dashboard header and status badge.
- Verification gate notice (approved/pending/rejected/suspended messaging).
- Pharmacy identity summary card (safe real profile fields only).
- Workflow quick-action cards:
  - Scan Prescription (live route for approved pharmacists)
  - Prescription Detail (shown from scan response payload)
  - Dispense Prescription (Phase 7.3 message)
  - Dispensing History (deferred pending backend endpoint)
- Manual QR scan entry panel for pharmacist-approved users.
- Scanned prescription detail panel with pharmacist-safe fields.
- Remaining medication list rendering from `remaining_items`.
- Locked prescription read-only messaging when backend returns `locked: true`.
- Privacy and safety notice with backend contract rules.

### Explicitly deferred (still not implemented)

- `/app/pharmacist/prescriptions/[id]` detail workflow.
- `/app/pharmacist/prescriptions/[id]/dispense` submit workflow.
- Camera QR scanner.
- WebSocket notifications.

### Role guard QA result

- pharmacist -> allowed on `/app/pharmacist`
- patient -> redirected to `/app/patient`
- doctor -> redirected to `/app/doctor`
- laboratorian -> redirected to `/app/lab`

### Language/theme QA result

- Arabic dashboard rendering: pass
- English dashboard rendering: pass
- Kurdish dashboard rendering: pass
- Theme toggle (light/dark): pass

### Current limitations

- Dispense and history cards remain disabled until later phases.
- History card remains deferred because backend contract does not expose pharmacist history endpoint.
- Live backend probe confirmed `GET /api/prescriptions/pharmacist/history/` returns 404.
- Dashboard shows no fake counters or synthetic activity.

---

## Backend Contract Source

**Audit commit**: 6639d66 — docs: audit pharmacist workflow contract

**Key backend docs**:
- `/home/zeus3000/PycharmProjects/RMP_backend/alrafidain_backend/docs/PHARMACIST_WORKFLOW_CONTRACT.md` — Complete specification
- `API_REFERENCE.md` — Endpoint inventory
- `ENDPOINT_INVENTORY.md` — Endpoint categorization
- `openapi-schema.yml` — OpenAPI spec

---

## Endpoint List

### Pharmacist Endpoints

| Endpoint | Method | Purpose | Auth | Returns |
|---|---|---|---|---|
| `/api/prescriptions/scan/` | POST | Scan prescription by QR token | Bearer + approved | Prescription + remaining_items + locked status |
| `/api/prescriptions/{id}/dispense/` | POST | Dispense items from prescription | Bearer + approved | Updated prescription + remaining_items |

### Supporting Endpoints

| Endpoint | Method | Purpose | Auth | Returns |
|---|---|---|---|---|
| `/api/profiles/me/pharmacist/` | GET | Load pharmacist profile for verification status | Bearer | Profile + verification_status |
| `/api/accounts/me/` | GET | Current user (for role check) | Bearer | User object with user_type |

---

## Frontend Structure

### Constants & Config

- `lib/api/endpoints.ts` → `API_ENDPOINTS.pharmacistPrescriptions`
  - `.scan` → `"/api/prescriptions/scan/"`
  - `.detail(id)` → `/api/prescriptions/${id}/` (placeholder; future backend endpoint)
  - `.dispense(id)` → `/api/prescriptions/${id}/dispense/`

### Types

- `types/pharmacist.ts` → Complete request/response models
  - `PharmacistPrescriptionStatus` (issued, partially_dispensed, fully_dispensed, expired, cancelled)
  - `PharmacistPrescriptionItemStatus` (pending, dispensed, cancelled)
  - `DispensePrescriptionItemStatus` (dispensed, unavailable)
  - `PharmacistScanResponse` ← Use in Phase 7.2 scan endpoint
  - `PharmacistDispenseResponse` ← Use in Phase 7.3 dispense endpoint
  - `PharmacistProfileData` → Load in Phase 7.1 dashboard
  - `SelectedDispenseItem` → UI model for Phase 7.3 form state

### Services

- `lib/pharmacist/pharmacistService.ts` → Service wired for scan flow
  - `scanPrescription({ qr_token })` → Phase 7.2
  - `dispensePrescription(prescriptionId, payload)` → Phase 7.3
  - `getPharmacistPrescriptionDetail(id)` → Placeholder; use scan data for now
  - `getPharmacistDispensingHistory()` → Deferred (no backend endpoint in Phase 7.0A)

### Helpers

- `lib/pharmacist/pharmacistStatus.ts` → Deterministic permission functions
  - `canPharmacistScan(isApproved)` → Guard for scan page
  - `canDispensePrescription(status)` → Allow dispense if issued/partially_dispensed
  - `canDispensePrescriptionItem(itemStatus, prescriptionStatus)` → Allow dispense if pending item + dispensable prescription
  - `isPrescriptionLocked(status)` → Return true for fully_dispensed/expired/cancelled
  - `getPrescriptionStatusTone(status)` → Badge color (info/warning/success/danger)
  - `getPrescriptionItemStatusTone(status)` → Badge color (info/success/danger)
  - `getPrescriptionLockReasonKey(status)` → i18n message key for lock reason

### i18n Keys

- `lib/i18n.ts` → `translations[locale].pharmacist.*` (~80 keys)
  - Dashboard: `dashboardTitle`, `dashboardSubtitle`, `verificationRequired`, etc.
  - Scan: `scanPrescription`, `qrToken`, `invalidQrToken`, `scanFailed`, etc.
  - Detail: `prescriptionDetail`, `prescriptionItems`, `pendingItems`, etc.
  - Dispensing: `dispensePrescription`, `markDispensed`, `dispensingNote`, `submitDispensing`, etc.
  - Status: `prescriptionLocked`, `prescriptionExpired`, `prescriptionFullyDispensed`, etc.
  - Privacy: `patientPrivacyNotice`, `patientDoesNotSeeInternalNotes`, etc.
- Languages: `ar` (Arabic), `ku` (Kurdish), `en` (English)

---

## Route Map

### Current State

- `/app/pharmacist` → Dashboard implemented
- `/app/pharmacist/scan` → Implemented manual scan + detail panel (scan-response-driven)
- Dedicated detail route and dispense submit route remain deferred

### Planned Routes (to implement)

| Route | Phase | Purpose |
|---|---|---|
| `/app/pharmacist` | 7.1 | Dashboard with verification gate |
| `/app/pharmacist/scan` | 7.2 | Manual QR scan entry |
| `/app/pharmacist/prescriptions/[id]` | 7.2 | Prescription detail with items |
| `/app/pharmacist/prescriptions/[id]/dispense` | 7.3 | Dispensing workflow |
| `/app/pharmacist/history` | 7.4 | Dispensing history (deferred) |

### Guard Implementation

- Use `RequireRole` component (already implemented for pharmacist layout)
- Check `verification_status == "approved"` on scan/dispense actions
- Show verification-pending banner if unverified
- Redirect patient/doctor away from `/app/pharmacist/*`

---

## Status & Action Matrix

### Prescription Statuses (from backend)

| Status | Dispensable? | Locked? | UI Tone | Notes |
|---|---|---|---|---|
| `issued` | ✅ Yes | ❌ No | info | Initial state; all items pending |
| `partially_dispensed` | ✅ Yes | ❌ No | warning | Some items done, some pending |
| `fully_dispensed` | ❌ No | ✅ Yes | success | All items dispensed/cancelled |
| `expired` | ❌ No | ✅ Yes | danger | 7+ days since creation (auto-updated on scan) |
| `cancelled` | ❌ No | ✅ Yes | danger | Doctor cancelled before any dispensing |

### Item Statuses (from backend)

| Status | Dispensable? | UI Tone | Notes |
|---|---|---|---|
| `pending` | ✅ Yes | info | Ready to dispense |
| `dispensed` | ❌ No | success | Item locked; cannot change |
| `cancelled` | ❌ No | danger | Item locked; cannot dispense |

### Permission Checks

```typescript
// Scan action
canPharmacistScan(user.pharmacistProfile.verification_status === "approved")

// Dispense action
canDispensePrescription(prescription.status) // Allow if issued/partially_dispensed
canDispensePrescriptionItem(item.status, prescription.status) // Allow if item.pending + prescription.dispensable

// View prescription detail
canViewPrescription(prescription.status) // Allow all except null
```

---

## Scan Workflow (Phase 7.2)

1. User enters QR token manually (no camera scanner in Phase 7.2)
2. Frontend validates token not empty
3. Call `scanPrescription(qrToken)` from service
4. **Success**: Receive `PharmacistScanResponse` with prescription + remaining_items + locked
   - Navigate to prescription detail
   - Display items in list
   - If locked: show read-only detail + lock reason message
   - If dispensable: show dispense controls
5. **Error** (400/403/429/401):
   - Show error message (e.g., "Invalid QR code", "Prescription not found", "Too many attempts")
   - Offer retry button

---

## Dispensing Workflow (Phase 7.3) ✅ COMPLETE

1. User selects items from remaining_items with checkboxes
2. For each selected item:
   - Choose status: "dispensed" or "unavailable"
   - Optional: enter quantity (if dispensed) or reason (if unavailable)
   - Optional: enter note (both statuses)
3. Submit payload:
   ```json
   {
     "items": [
       {
         "prescription_item_id": "uuid",
         "status": "dispensed",
         "dispensed_quantity": "21 capsules",
         "note": "Dispensed as written"
       }
     ]
   }
   ```
4. Call `dispensePrescription(prescriptionId, payload)` from service
5. **Success**: 
   - Receive updated prescription + remaining_items
   - Show confirmation message
   - If remaining_items not empty: offer "Continue Dispensing" or "Scan Another"
   - If remaining_items empty: show "All items processed" + "Scan Another"
6. **Error** (400/403/409):
   - Show validation error (e.g., "Item not found", "Item already dispensed", "Prescription locked")
   - Keep form state; user can fix and retry

---

## Partial Dispensing Support

Backend supports dispensing some items and leaving others pending:

```
issued → (dispense item 1) → partially_dispensed → (dispense item 2) → fully_dispensed
```

Frontend workflow:
1. After first dispense, show updated remaining_items
2. If any items remain: offer "Continue Dispensing" button → return to detail, refresh item list
3. If no items remain: show "All items processed" → offer "Scan Another Prescription"

## Phase 7.3B Live QA

- Browser QA completed on the live backend for scan → partial dispense → full dispense → locked rescan.
- Fixed duplicated dispensed-item rendering by deduplicating merged dispensed items by `id` in the scan page state update.
- Fixed stale per-item checkbox state by rebuilding selection state when the remaining item list changes.
- Verified pharmacist, patient, doctor, and laboratorian route gates from real browser sessions.
- QR token is kept in runtime memory only; no persistence changes were added.

---

## Patient Privacy Rules

**Pharmacist must NOT expose**:

- Patient full name, email, or contact info
- Patient medical history
- Unreleased lab results
- Doctor clinical notes
- Any medications to other patients

**Backend enforces** via:

- Scan response intentionally omits patient info (privacy by omission)
- Prescription detail endpoint is per-prescription, not cross-prescription
- QR tokens are unique per prescription

**Frontend enforces** via:

- Never request patient data in pharmacist views
- Never cache patient info across prescriptions
- Never expose patient data in error messages or logs

---

## Doctor Handoff Rules

**Doctor can see** (in prescription detail):

- All medication items (pending, dispensed, cancelled)
- Dispensing records array including:
  - Pharmacist who dispensed
  - Status (dispensed or unavailable)
  - Quantity, note, timestamp

**Doctor receives notifications** on:

- Item dispensed
- Item marked unavailable
- Prescription fully_dispensed

**Doctor cannot** (enforced by backend):

- Cancel items after any item has been dispensed
- See pharmacist internal notes (none yet)

---

## Known Backend Gaps

### 1. No Pharmacist History Endpoint

**Status**: Not in Phase 7.0A

- Backend returns dispensing records in **doctor** prescription detail only
- Pharmacist cannot query own dispensing history directly
- **Impact**: `/app/pharmacist/history` deferred to Phase 7.4 or future backend phase

### 2. No Pharmacist Prescription List/Detail Endpoints

**Status**: Not in current contract

- Pharmacist has only: **scan** (find by QR) and **dispense** endpoints
- No `GET /api/prescriptions/pharmacist/my/` for listing prescriptions
- **Impact**: Pharmacist workflow is QR-driven, not queue-driven (intentional by design)

### 3. Dispensing History for Pharmacist

**Status**: Not applicable in Phase 7.0A

- Only doctor can see dispensing history (in prescription detail)
- Pharmacist sees only immediate dispensing result
- **Future**: Consider adding pharmacist history endpoint in future backend phase if needed

---

## Deferred Tasks (Out of Phase 7.0B)

- ❌ Camera-based QR scanning (manual text entry only; camera deferred to Phase 7.2 or later)
- ❌ WebSocket integration (out of Phase 7 initial scope)
- ❌ RAG/AI-assisted dispensing (out of scope)
- ❌ Multi-pharmacy support (single facility per pharmacist)
- ❌ Pharmacist-to-pharmacist communication (backend doesn't support)
- ❌ Patient-visible dispensing status (currently backend-hidden; may add in future)

---

## Files Reference

| File | Purpose | Phase |
|---|---|---|
| `lib/api/endpoints.ts` | Endpoint constants | 7.0B ✅ |
| `types/pharmacist.ts` | TypeScript models | 7.0B ✅ |
| `lib/pharmacist/pharmacistStatus.ts` | Permission helpers | 7.0B ✅ |
| `lib/pharmacist/pharmacistService.ts` | Service skeleton | 7.0B ✅ |
| `lib/i18n.ts` + `types/i18n.ts` | Internationalization | 7.0B ✅ |
| `docs/PHARMACIST_FRONTEND_WORKFLOW_PLAN.md` | Complete specification | 7.0B ✅ |
| `docs/ROLE_ROUTE_MATRIX.md` | Route matrix (updated) | 7.0B ✅ |
| `docs/API_FRONTEND_MAPPING.md` | Endpoint mapping (updated) | 7.0B ✅ |
| `docs/FRONTEND_INTEGRATION_PLAN.md` | Phase breakdown (updated) | 7.0B ✅ |
| `components/pharmacist/*` | UI components | Phase 7.1+ |
| `app/(portal)/app/pharmacist/scan` | Scan page route | Phase 7.2 |
| `app/(portal)/app/pharmacist/prescriptions/[id]` | Detail page route | Phase 7.2 |
| `app/(portal)/app/pharmacist/prescriptions/[id]/dispense` | Dispense page route | Phase 7.3 |

---

## Next Steps (Phase 7.1)

1. Review this implementation notes doc
2. Review `PHARMACIST_FRONTEND_WORKFLOW_PLAN.md` for detailed specification
3. Review backend contract from `PHARMACIST_WORKFLOW_CONTRACT.md`
4. Start Phase 7.1 with dashboard implementation
5. Wire service skeleton functions to React components as needed
6. Test against live backend at http://localhost:8000
