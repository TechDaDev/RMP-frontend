# Pharmacist Frontend Workflow Plan

Phase 7.0B — Contract preparation and planning

---

## Table of Contents

1. [Scope](#scope)
2. [Non-Scope](#non-scope)
3. [Backend Contract Source](#backend-contract-source)
4. [Pharmacist Role and Verification](#pharmacist-role-and-verification)
5. [Route Map](#route-map)
6. [Screen-to-Endpoint Map](#screen-to-endpoint-map)
7. [Prescription Lifecycle](#prescription-lifecycle)
8. [Prescription Item Lifecycle](#prescription-item-lifecycle)
9. [QR/Manual Scan Workflow](#qrmanual-scan-workflow)
10. [Prescription Detail Workflow](#prescription-detail-workflow)
11. [Dispensing Workflow](#dispensing-workflow)
12. [Partial Dispensing Workflow](#partial-dispensing-workflow)
13. [Patient Privacy Rules](#patient-privacy-rules)
14. [Doctor Handoff Rules](#doctor-handoff-rules)
15. [UI States](#ui-states)
16. [Error States](#error-states)
17. [Phase Breakdown](#phase-breakdown)
18. [Known Backend Gaps](#known-backend-gaps)
19. [Deferred Future Tasks](#deferred-future-tasks)

---

## Scope

**Phase 7.0B** (this phase) is planning and contract preparation only:

- ✅ Audit backend pharmacist workflow contract
- ✅ Define frontend pharmacist route map
- ✅ Create pharmacist TypeScript types
- ✅ Create pharmacist status/action helpers
- ✅ Create pharmacist service skeleton (not wired to UI yet)
- ✅ Add pharmacist i18n keys
- ✅ Update documentation
- ❌ **Do not** build pharmacist UI screens yet
- ❌ **Do not** wire any API calls to UI components
- ❌ **Do not** add QR camera scanner (manual QR entry only in Phase 7.2)
- ❌ **Do not** add WebSocket integration
- ❌ **Do not** add RAG/AI integration

**Phase 7.1+** (future) will implement the actual UI screens and integrate the service layer with React components.

---

## Non-Scope

This plan explicitly excludes:

- Patient-facing dispensing visibility (patients cannot see pharmacist-only fields or dispensing records per backend contract)
- Medication item details visibility to patients (backend filters these out by design)
- Camera-based QR scanning (deferred to later phase; manual text entry only)
- WebSocket push notifications (out of Phase 7 initial scope)
- RAG/AI-assisted dispensing (out of scope)
- Pharmacy inventory management (backend does not track stock; dispense/unavailable are status changes only)
- Pharmacist-to-pharmacist communication (backend does not support)

---

## Backend Contract Source

**Backend audit commit**: `6639d66` — docs: audit pharmacist workflow contract

**Key backend contract doc**:
- `/home/zeus3000/PycharmProjects/RMP_backend/alrafidain_backend/docs/PHARMACIST_WORKFLOW_CONTRACT.md`

**Additional backend docs**:
- `API_REFERENCE.md` — complete endpoint inventory
- `ENDPOINT_INVENTORY.md` — endpoint categorization
- `FRONTEND_INTEGRATION_GUIDE.md` — integration guidance
- `openapi-schema.yml` — OpenAPI specification

---

## Pharmacist Role and Verification

### User Type

Pharmacist users are registered with:
- `user_type = "pharmacist"`

### Verification Status

Pharmacist must complete profile and receive approval before accessing clinical endpoints:

| Status | Meaning | Clinical Access |
|---|---|---|
| `pending` | Profile submitted, awaiting admin review | ❌ Blocked (403 on scan/dispense) |
| `approved` | Admin approved, user can scan and dispense | ✅ Allowed |
| `rejected` | Admin rejected profile | ❌ Blocked; must resubmit |
| `suspended` | Admin suspended user (rare) | ❌ Blocked |
| `incomplete` | Profile not started | ❌ Blocked |

### Verification Check

Backend enforces on these endpoints:
- `POST /api/prescriptions/scan/`
- `POST /api/prescriptions/{id}/dispense/`

Frontend gate:
- Show "Profile Pending Verification" message if `verification_status != approved`
- Disable scan/dispense actions
- Link to profile completion page

---

## Route Map

### Canonical Pharmacist Route

**Canonical base**: `/app/pharmacist`

**Route plan** (future implementation):

| Route | Purpose | Description |
|---|---|---|
| `/app/pharmacist` | Dashboard | Quick links, recent activity, verification status |
| `/app/pharmacist/scan` | QR scan entry | Manual prescription QR/code entry; launches detail workflow |
| `/app/pharmacist/prescriptions/[id]` | Prescription detail | Full prescription view with remaining items and dispensing controls |
| `/app/pharmacist/prescriptions/[id]/dispense` | Dispense workflow | Item selection, quantity/note entry, dispensing submission |
| `/app/pharmacist/history` | Dispensing history | Past dispensing actions (if backend supports endpoint) |
| `/app/pharmacist/profile` or settings | Profile management | Link to profile completion/verification (future; may reuse shared profile page) |

### Route Guard Conditions

| Route | Required Condition |
|---|---|
| `/app/pharmacist/*` | Authenticated user with `user_type == "pharmacist"` |
| Scan/dispense actions | `verification_status == "approved"` |

---

## Screen-to-Endpoint Map

| Screen | Endpoint | Method | Purpose |
|---|---|---|---|
| Pharmacist Dashboard | `GET /api/profiles/me/pharmacist/` | GET | Load verification status and profile badge |
| QR Scan Entry | `POST /api/prescriptions/scan/` | POST | Scan prescription and load remaining items |
| Prescription Detail | (Data from scan response) | — | Display prescription + items + controls |
| Dispense Form | `POST /api/prescriptions/{id}/dispense/` | POST | Submit dispensing for selected items |
| Dispensing History | `GET /api/prescriptions/doctor/{id}/` | GET | Doctor sees dispensing_records array (future feature) |

---

## Prescription Lifecycle

### Status Values

| Status | Meaning | Pharmacist Editable? | Notes |
|---|---|---|---|
| `issued` | Created by doctor; awaiting pharmacist action | ✅ Yes | Initial state |
| `partially_dispensed` | Some items dispensed, some pending | ✅ Yes | Auto-updated after dispense |
| `fully_dispensed` | All items dispensed or cancelled | ❌ Locked | No further changes allowed |
| `expired` | 7+ days since creation | ❌ Locked | Auto-updated on scan if expired |
| `cancelled` | Doctor cancelled before dispensing | ❌ Locked | No pharmacist action possible |

### Prescription Expiry

- **Default**: 7 days from `issued_at`
- **Checked**: On pharmacist QR scan
- **Behavior**: If past 7 days, backend auto-updates status to `expired` and returns `locked: true`
- **Frontend**: Display expiry as red/warning tone; disable dispense for expired prescriptions

### Prescription Locking Rules

Locked prescriptions return `locked: true` in scan response:

| Cause | Locked | Remaining Items | UI State |
|---|---|---|---|
| `fully_dispensed` | ✅ | empty array | Show completed items, read-only |
| `expired` | ✅ | empty array | Show expiry message, read-only |
| `cancelled` | ✅ | empty array | Show cancellation message, read-only |

---

## Prescription Item Lifecycle

### Item Statuses

| Status | Meaning | Pharmacist Action |
|---|---|---|
| `pending` | Not yet dispensed | Dispense or mark unavailable |
| `dispensed` | Dispensed to patient | Locked; no further action |
| `cancelled` | Item cancelled (usually by doctor) | Locked; cannot dispense |

### Item Dispensing Rules

- **Only pending items** can be marked dispensed or unavailable
- **Once marked**, item status is locked (cannot change back to pending)
- **Doctor cannot cancel** items after any item has been dispensed

### Item Dispensing Actions

| Action | Payload Status | Effect |
|---|---|---|
| Dispense | `status: "dispensed"` | Item.status → `dispensed`, Item.dispensed_at set, audit log created |
| Mark Unavailable | `status: "unavailable"` | Item.status → `cancelled`, Item.cancelled_at set, audit log created, doctor notified |

---

## QR/Manual Scan Workflow

### Entry Point

**Route**: `/app/pharmacist/scan`

**Input**: Manual QR code/token text entry (camera scanner deferred)

### Request Contract

```typescript
POST /api/prescriptions/scan/

{
  "qr_token": "<string from patient>"
}
```

### Response Contract (Success)

```json
{
  "success": true,
  "data": {
    "prescription": {
      "id": "uuid",
      "status": "issued | partially_dispensed",
      "doctor": { "id", "email", "full_name" },
      "issued_at": "2026-05-09T...",
      "expires_at": "2026-05-16T..."
    },
    "remaining_items": [
      {
        "id": "uuid",
        "medication_name": "Amoxicillin",
        "strength": "500mg",
        "dosage": "1 capsule",
        "frequency": "3x daily",
        "duration": "7 days",
        "route": "oral",
        "quantity": "21 capsules",
        "instructions": "After meals"
      }
    ],
    "locked": false,
    "message": null
  },
  "message": "QR scanned."
}
```

### Response Contract (Locked/Expired)

```json
{
  "success": true,
  "data": {
    "prescription": { ... },
    "remaining_items": [],
    "locked": true,
    "message": "This prescription is no longer available for dispensing."
  },
  "message": "QR scanned."
}
```

### Error Cases

| Case | Status | Frontend Handling |
|---|---|---|
| Invalid/empty QR token | 400 | Show error: "Invalid QR code" |
| QR token not found | 400 | Show error: "Prescription not found" |
| Expired prescription | 200 | Locked=true, show expiry message |
| Unapproved pharmacist | 403 | Verification banner, disable scan |
| Not authenticated | 401 | Redirect to login |
| Rate limited | 429 | Show error: "Too many scan attempts" |

### Frontend Workflow

1. User enters QR token manually in text field
2. Frontend validates token not empty
3. Frontend calls `POST /api/prescriptions/scan/` with `qr_token`
4. **Success**: Navigate to prescription detail with remaining_items and dispensing controls
5. **Locked**: Show read-only detail with lock message, no dispensing controls
6. **Error**: Show error state with retry option

---

## Prescription Detail Workflow

### Route

**Route**: `/app/pharmacist/prescriptions/[id]`

**Data source**: From scan response (no separate detail API for pharmacist)

### Display Information

| Field | Show? | Notes |
|---|---|---|
| Prescription ID | ✅ | For reference |
| Prescription Status | ✅ | With status badge (color-coded) |
| Issued Date/Time | ✅ | Display with icon |
| Expiry Date/Time | ✅ | Display with warning if < 24h remaining |
| Doctor Info | ✅ | Name, email, ID |
| Remaining Items Count | ✅ | Pending count as quick reference |
| Patient Name | ❌ | Backend does not return for privacy |
| Patient Contact | ❌ | Not returned for privacy |
| Doctor Notes | ❌ | Backend does not return |

### Display Layout

1. **Header**: Prescription ID + Status badge + Actions
2. **Timeline**: Issued → Expiry with visual indicator
3. **Doctor Context**: Name, specialty (if available), email
4. **Remaining Items List**: Expandable cards with details
5. **Action Controls**: "Dispense", "Mark Unavailable" buttons (disabled if locked)

### Locked Prescription Display

If `locked: true` in scan response:

- Display prescription info as read-only
- Show lock reason message (e.g., "This prescription is no longer available for dispensing.")
- Disable all action buttons
- Optionally show "Go Back" or "Scan Another" link

---

## Dispensing Workflow

### Route

**Route**: `/app/pharmacist/prescriptions/[id]/dispense` (or modal/form on detail page)

### Request Contract

```typescript
POST /api/prescriptions/{prescription_id}/dispense/

{
  "items": [
    {
      "prescription_item_id": "uuid",
      "status": "dispensed" | "unavailable",
      "dispensed_quantity": "21 capsules" (optional),
      "note": "Dispensed as written" (optional)
    }
  ]
}
```

### Item Status Values

- `"dispensed"` — Medication was dispensed to patient
- `"unavailable"` — Medication could not be dispensed (out of stock, contraindicated, etc.)

### Optional Fields

- `dispensed_quantity`: Can be empty string if status is `"unavailable"`
- `note`: Optional explanation (e.g., "Dispensed with generic equivalent", "Out of stock", "Patient refused")

### Response Contract

```json
{
  "success": true,
  "data": {
    "prescription": {
      "id": "uuid",
      "status": "partially_dispensed | fully_dispensed",
      "issued_at": "...",
      "expires_at": "..."
    },
    "remaining_items": [
      {
        "id": "uuid",
        "medication_name": "...",
        "status": "pending"
      }
    ],
    "locked": false,
    "message": null
  },
  "message": "Items processed."
}
```

### Dispensing Rules

- **Only pending items** in the items array can be included
- **At least one item** must be in the request
- **Locked prescriptions** return 400 (cannot dispense)
- **Expired prescriptions** return 400 (cannot dispense)
- **Unapproved pharmacist** returns 403

### Frontend Workflow

1. Display remaining_items from scan with checkboxes
2. User selects items to mark dispensed
3. For each item, show optional fields:
   - Dispensed Quantity (text input, e.g., "21 capsules")
   - Note (text area, e.g., "Out of stock")
4. User confirms dispensing
5. Frontend calls `POST /api/prescriptions/{id}/dispense/` with selected items
6. **Success**: Show confirmation message + updated prescription status + remaining items
7. **Error**: Show validation error (e.g., "Item not found", "Prescription is locked")
8. **Post-dispense**: Offer option to:
   - Continue to next item (if any pending)
   - Scan another prescription
   - Return to dashboard

### Validation Errors (from backend)

| Error | Handling |
|---|---|
| Item not in this prescription | Show: "Item not found in this prescription" |
| Item not pending | Show: "Item is already dispensed or cancelled" |
| Prescription is locked | Show: "This prescription cannot be modified" |
| Prescription is expired | Show: "This prescription has expired" |
| Empty items array | Show: "Select at least one item to dispense" |
| Unapproved pharmacist | Show verification banner (should not reach dispense form) |

---

## Partial Dispensing Workflow

### Supported Flow

Backend supports partial dispensing:

**Prescription Status Transitions**:

```
issued
  ↓ (pharmacist dispenses 1 of 2 items)
partially_dispensed (1 pending, 1 dispensed)
  ↓ (pharmacist dispenses remaining item)
fully_dispensed (all items dispensed/cancelled)
```

### Frontend Handling

1. After dispensing, backend returns updated prescription with `remaining_items` array
2. If `remaining_items` is not empty:
   - Show: "Some items are still pending"
   - Display remaining items
   - Offer "Continue Dispensing" option
   - Offer "Scan Another Prescription" option
3. If `remaining_items` is empty:
   - Show: "All items have been processed"
   - Offer "Scan Another Prescription" option

### Audit Trail

Each dispense action creates a `DispensingRecord`:

```json
{
  "id": "uuid",
  "prescription_item_id": "uuid",
  "pharmacist": { "id", "email", "full_name" },
  "status": "dispensed | unavailable",
  "dispensed_quantity": "21 capsules",
  "note": "Dispensed as written",
  "created_at": "2026-05-09T12:30:00Z"
}
```

**Note**: Only doctor can see dispensing records (in doctor prescription detail), not pharmacist. Pharmacist sees only the updated prescription status.

---

## Patient Privacy Rules

**Pharmacist must never expose**:

- ❌ Patient full name or contact info
- ❌ Patient medical history
- ❌ Unreleased lab results
- ❌ Doctor's clinical notes
- ❌ Patient medications to other patients

**Backend enforces** via:

- Scan response does NOT include patient info (privacy by omission)
- Prescription detail is per-prescription, not cross-prescription
- QR tokens are per-prescription and unique

**Frontend enforces** via:

- Do not request or store patient data in pharmacist views
- Do not cache patient info across prescriptions
- Treat QR token as sensitive data; do not log or expose in UI

---

## Doctor Handoff Rules

### Information Doctor Can See

Doctor can see in prescription detail:

- **Medication items**: All items (pending, dispensed, cancelled)
- **Dispensing records**: Array of all dispensing actions including:
  - Pharmacist who dispensed
  - Status (dispensed or unavailable)
  - Dispensed quantity
  - Pharmacist note (optional)
  - Timestamp

### Doctor Notifications

Backend sends notifications to doctor on:

- ✅ Medication item dispensed
- ✅ Medication unavailable (item cancelled by pharmacist)
- ✅ Prescription fully_dispensed (all items processed)

**Frontend note**: Notifications are backend-driven; frontend does not initiate. Doctor sees updates in their prescription detail view.

### Doctor Actions Forbidden After Dispensing Starts

- Doctor cannot cancel items after any item has been dispensed
- Doctor can still cancel entire prescription if no items have been dispensed

---

## UI States

### Prescription Detail States

| State | Display | Actions |
|---|---|---|
| **Issued (editable)** | Normal card, full details, "Dispense" button enabled | Allow dispensing |
| **Partially Dispensed (editable)** | Normal card, pending items highlighted, "Continue Dispensing" | Allow dispensing remaining |
| **Fully Dispensed (locked)** | Grayed out card, all items marked dispensed, no buttons | Read-only |
| **Expired (locked)** | Red card, expiry message, no buttons | Read-only |
| **Cancelled (locked)** | Grayed out card, cancellation message, no buttons | Read-only |

### Loading States

- **Scanning QR**: Spinner + "Scanning prescription..."
- **Dispensing**: Spinner + "Processing dispensing..."
- **Network Error**: Error state with retry button

### Empty States

| Scenario | Display |
|---|---|
| No remaining items | "All items have been processed" |
| All items cancelled by doctor | "No items available for dispensing" |
| Prescription not found | "Prescription not found. Please check the QR code." |

---

## Error States

### Scan Errors

| Error | Display | Action |
|---|---|---|
| Invalid QR token | "Invalid QR code. Please try again." | Retry button |
| QR token not found | "Prescription not found." | Retry or "Scan Another" |
| Expired prescription | "This prescription has expired." | Read-only detail |
| Unapproved pharmacist | Verification banner (not error, gate) | Link to profile completion |
| Rate limited | "Too many scan attempts. Try again later." | Retry after delay |
| Network error | "Cannot connect to server. Please check your internet." | Retry button |

### Dispense Errors

| Error | Display | Action |
|---|---|---|
| Item not found | "Item not found in this prescription." | Back to detail |
| Item already dispensed | "Item is already dispensed." | Uncheck and retry |
| Prescription locked | "This prescription cannot be modified." | Back to scan |
| Prescription expired | "This prescription has expired." | Back to scan |
| Empty items selection | "Select at least one item to dispense." | Select items |
| Network error | "Cannot submit dispensing. Please check your internet." | Retry button |

---

## Phase Breakdown

### Phase 7.0B — Workflow Planning (Current)

✅ Audit backend contract
✅ Create workflow plan doc
✅ Define route map
✅ Create TypeScript types
✅ Create status/action helpers
✅ Create service skeleton
✅ Add i18n keys
✅ Update documentation

**Output**: This plan doc + support files (types, helpers, service, i18n, docs)

**No UI screens yet. No API calls wired to UI yet.**

### Phase 7.1 — Pharmacist Dashboard + Verification Gate

- Build `/app/pharmacist` dashboard page
- Display verification status badge
- Show profile completion prompt if unverified
- Add quick links (Scan, History, Settings)
- Integrate profile service for verification_status
- Add sidebar navigation item (if not already present)

**Output**: Dashboard screen + verification gate

### Phase 7.2 — Prescription QR Scan and Detail

- Build `/app/pharmacist/scan` page
- Add manual QR token entry form
- Integrate `POST /api/prescriptions/scan/` service call
- Build prescription detail display
- Show remaining_items list with status badges
- Handle error states (invalid token, expired, locked, etc.)
- Handle verification gate (403 on unapproved)

**Output**: QR scan entry + prescription detail screen

### Phase 7.3 — Prescription Dispensing Workflow

- Build dispense form/modal on prescription detail
- Add item selection (checkboxes)
- Add optional quantity + note fields
- Integrate `POST /api/prescriptions/{id}/dispense/` service call
- Show dispensing result (updated status, remaining items)
- Handle partial dispensing flow (offer continue)
- Handle error states (locked, expired, validation errors)

**Output**: Dispensing workflow screen

### Phase 7.4 — Dispensing History and Status Review (Optional)

- Build `/app/pharmacist/history` page (if backend supports history endpoint)
- Display past dispensing actions
- Show pharmacist, timestamp, status, quantity, note
- Filter/search by date range or prescription ID

**Output**: History view (deferred if backend endpoint not available)

### Phase 7.5 — Pharmacist Portal Final QA Pass

- End-to-end QA of all screens and workflows
- Verification gate testing (pending vs approved)
- Error state validation
- i18n validation (ar/ku/en)
- Theme validation (dark/light)
- Mobile/responsive design check
- Privacy compliance check (no patient data exposure)
- Doctor notification side effects verification
- Performance and accessibility audit

**Output**: QA report + fixes + final commit

---

## Known Backend Gaps

### Pharmacist History Endpoint

**Status**: Not yet implemented in backend

- Backend returns dispensing records only in **doctor** prescription detail view
- Pharmacist cannot query own dispensing history directly
- **Frontend impact**: Cannot build `/app/pharmacist/history` page yet
- **Recommendation**: Implement `GET /api/prescriptions/pharmacist/history/` in future backend phase or fetch via doctor detail (not advisable for privacy)

### Pharmacist Prescription List/Detail Endpoints

**Status**: Not in current contract

- Pharmacist has only: **scan** (find by QR) and **dispense** endpoints
- No `GET /api/prescriptions/pharmacist/my/` for listing assigned/pending prescriptions
- **Frontend impact**: Pharmacist must scan QR to access prescription (no dashboard queue)
- **Recommendation**: This may be intentional (pharmacy is QR-driven, not queue-driven); Phase 7.1 should confirm with backend if list view is needed

### Medication Item Details Privacy

**Status**: Backend filters medication items for patients, returns full details for pharmacist

- Patient sees no medication items (privacy by design)
- Pharmacist sees only `remaining_items` (already dispensed hidden)
- Doctor sees all items + dispensing records
- **Frontend impact**: Frontend must respect backend response structure; do not supplement patient views with medication details

---

## Deferred Future Tasks

### Camera-Based QR Scanning

- Deferred to Phase 7.2 or later
- Requires device camera access + QR decoder library
- Manual text entry sufficient for MVP
- Future: Add `<input type="file">` or camera stream integration

### WebSocket Integration

- Out of Phase 7 scope
- Backend notifications exist; frontend can poll or wait for manual refresh
- Future: Real-time dispensing notifications to doctor

### RAG/AI-Assisted Dispensing

- Out of scope
- No medication interaction checking
- Pharmacist responsible for clinical decisions
- Frontend displays medication info as-is from backend

### Multi-Pharmacy Support

- Deferred to future phase
- Pharmacist profile is per-facility (one pharmacy per pharmacist)
- No cross-pharmacy dispensing in current backend

### Patient-Visible Dispensing Status

- Deferred to future phase
- Currently, patients see only prescription status (issued, dispensed, expired, cancelled)
- Patients do NOT see item-level dispensing details or pharmacist notes
- Future: May add optional patient visibility feature

### Pharmacist Profile Management

- Phase 7 assumes profile completion already available (from Phase 3 — Profile)
- Pharmacist portal may link to shared profile page or build dedicated pharmacist profile form
- Currently: Use `/app/profile` or link to pharmacist-specific section if implemented

---

## Summary

This plan establishes:

- ✅ Route structure for pharmacist portal
- ✅ Contract-exact endpoint and type definitions
- ✅ Workflow sequences for scan → detail → dispense → confirmation
- ✅ Status lifecycles and locking rules
- ✅ Privacy and authorization enforcement rules
- ✅ Phase breakdown for implementation
- ✅ Known limitations and deferred tasks

**Phase 7.1** will begin implementation with the dashboard and verification gate, followed by scan/detail (7.2) and dispensing (7.3) workflows.

**No UI screens are included in this phase.** All code (types, helpers, service, i18n, docs) is prepared for Phase 7.1 to consume.
