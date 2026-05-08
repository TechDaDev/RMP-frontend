# Laboratory Frontend Implementation Notes

## Backend Docs Path

- `/home/zeus3000/PycharmProjects/RMP_backend/alrafidain_backend/docs`

## Key Backend Contract

- `LABORATORY_WORKFLOW_CONTRACT.md`

## Endpoint List

- `GET /api/lab-orders/tests/` - lab test catalog
- `POST /api/lab-orders/scan/` - QR scan
- `POST /api/lab-orders/{lab_order_id}/complete/` - batch item completion
- `POST /api/lab-orders/items/{lab_order_item_id}/results/` - create result
- `GET /api/lab-orders/results/{lab_result_id}/` - lab-side result detail
- `POST /api/lab-orders/results/{lab_result_id}/correct/` - correct result

## Route Plan

- `/app/laboratory`
- `/app/laboratory/scan`
- `/app/laboratory/orders/[id]`
- `/app/laboratory/orders/[id]/complete`
- `/app/laboratory/items/[itemId]/results/new`
- `/app/laboratory/results/[id]`
- `/app/laboratory/results/[id]/correct`
- `/app/laboratory/tests`

## Status / Action Matrix

| Action | Allowed when |
|---|---|
| Scan lab order | laboratorian approved |
| Complete order items | order not locked, laboratorian approved |
| Create result | item completed, order not locked, laboratorian approved |
| Correct result | status `submitted` or `corrected`, original laboratorian, before release |
| View result | lab-side access allowed by backend; patient only after release |

## Value Type Form Rules

- `numeric` - `numeric_value` required.
- `text` - `text_value` required.
- `blood_group` - `blood_group_value` required.
- `positive_negative` - `text_value` must be `positive` or `negative`.
- `file_only` - `result_file` required.

## File Upload Rules

- Use multipart form data when `result_file` is present.
- Keep the correction flow file-immutable.
- Do not expose file-only results before backend release policy allows them.

## Verification Restrictions

- Laboratory clinical actions require approved verification.
- Unapproved laboratorians should see disabled actions and guidance copy.
- The frontend should expect `403` for protected lab actions when verification is missing.

## Privacy Rules

- Never expose `doctor_notes` to patients.
- Never expose `laboratorian_notes` to patients.
- Do not reveal unreleased lab results in patient UI.
- Do not invent pending-order summary data that the backend does not supply.

## Known Limitations

- No separate laboratorian pending list endpoint exists.
- No WebSocket phase in the initial laboratory implementation.
- The laboratory dashboard should be built from existing endpoints and local UI state only.

## Deferred Patient Profile Gate

- Patient profile-completion gating for consultation creation is deferred.
- It must be enforced in the backend first and only then mirrored in the frontend.