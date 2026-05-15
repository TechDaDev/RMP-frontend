# **FRONTEND TASK PROMPT: Staff/Admin Profile System Implementation**

**To:** Frontend Team  
**From:** Backend Team  
**Status:** 🟢 Ready for Implementation  
**Priority:** High  
**Est. Effort:** 3-5 days  

---

## **📋 Overview**

The backend has implemented a dedicated **Staff/Admin** user profile system with role-based access control (RBAC). You need to implement the frontend to recognize and route staff users, display their profile, and gate admin features behind permission flags.

**Test Credentials:**
```
Email: admin@rmp.local
Password: Admin1234!
Type: staff
Role: System Administrator
```

---

## **✅ Implementation Phases**

### **PHASE 1: Login & Routing (Required)**

**What Changed:**
- Admin user now has `user_type: "staff"` (was `"doctor"`)
- Login response includes `user_type` in the user object

**Your Task:**
1. After successful login, check `response.data.user.user_type`
2. Route users based on their type:
   ```typescript
   if (user.user_type === 'staff') {
     navigate('/admin/dashboard');
   } else if (user.user_type === 'patient') {
     navigate('/patient/dashboard');
   } else if (user.user_type === 'doctor') {
     navigate('/doctor/dashboard');
   }
   ```
3. Store `user_type` in your auth state (Redux, Context, Zustand, etc.)

**Testing:**
```
Login: admin@rmp.local / Admin1234!
Expected: Routed to /admin/dashboard
Verify: user_type === 'staff' in stored auth state
```

---

### **PHASE 2: Staff Profile Display (Required)**

**Backend Endpoint:**
```
GET /api/profiles/me/
Authorization: Bearer <access_token>
```

**Response for staff user:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "user_profile": null,  // Staff don't have UserProfile
    "role_profile": {
      "id": "...",
      "staff_role": "system_admin",
      "role_display": "System Administrator",
      "department": "Administration",
      "can_approve_professionals": true,
      "can_manage_knowledge_base": true,
      "can_export_datasets": true,
      "can_view_audit_logs": true,
      "hire_date": "2025-01-01",
      "has_completed_training": true,
      "is_active": true,
      "last_active": "2025-01-15T14:30:00Z"
    },
    "completion": { ... },
    "verification": { "required": false, "status": null }
  }
}
```

**Your Task:**
1. After login, fetch `GET /api/profiles/me/`
2. For staff users, extract and store `role_profile` in auth state
3. Display in settings/profile page:
   - Role: `{role_profile.role_display}`
   - Department: `{role_profile.department}`
   - Hired: `{role_profile.hire_date}`
   - Last Active: `{role_profile.last_active}`
   - Training: `{role_profile.has_completed_training ? 'Completed' : 'Pending'}`

**Key Point:** Staff users have `user_profile: null`. Do NOT try to display phone/address/national_id for them.

---

### **PHASE 3: Permission Gating (Core Feature)**

**Permission Flags Available:**
- `can_approve_professionals` → Show Verification Review feature
- `can_manage_knowledge_base` → Show Knowledge Base Management
- `can_export_datasets` → Show Analytics & Export tools
- `can_view_audit_logs` → Show Audit Log viewer

**Your Task:**
1. Create a reusable permission guard:
   ```typescript
   function hasPermission(permission: string): boolean {
     const { user, roleProfile } = useAuth();
     return user?.user_type === 'staff' && roleProfile?.[permission] === true;
   }
   ```

2. Use it to conditionally show/hide features:
   ```typescript
   if (hasPermission('can_approve_professionals')) {
     // Show verification nav link
   }
   if (hasPermission('can_manage_knowledge_base')) {
     // Show KB management nav link
   }
   if (hasPermission('can_export_datasets')) {
     // Show analytics nav link
   }
   if (hasPermission('can_view_audit_logs')) {
     // Show audit logs nav link
   }
   ```

3. Create admin navigation component that respects permissions:
   ```typescript
   <AdminNav roleProfile={roleProfile} />
   ```

---

### **PHASE 4: Admin Dashboard Layout (Required)**

**Create Route Structure:**
```
/admin/
├── /dashboard              # Main admin hub
├── /verifications          # (if can_approve_professionals)
├── /knowledge-base         # (if can_manage_knowledge_base)
├── /analytics              # (if can_export_datasets)
├── /audit-logs             # (if can_view_audit_logs)
└── /settings               # Read-only staff profile
```

**Your Task:**
1. Create `/admin/dashboard` with:
   - Quick stat cards (pending verifications, pending documents, etc.)
   - Links to available features (based on permissions)
   - User activity feed (optional)

2. Create stubs for each feature route (implementation TBD later)

3. Ensure non-staff users cannot access `/admin/*` routes
   - Redirect to their appropriate dashboard

---

### **PHASE 5: Error Handling (Required)**

**When staff lacks permission (403):**
```json
{
  "success": false,
  "message": "Permission denied."
}
```

**Your Task:**
1. Catch 403 errors from admin endpoints
2. Show user alert: "You don't have permission to access this feature"
3. Redirect back to `/admin/dashboard`
4. Log the attempt (optional but recommended for debugging)

---

## **📝 Code Examples**

### **Auth State Structure (Recommended):**
```typescript
interface AuthState {
  user: {
    id: string;
    email: string;
    user_type: 'patient' | 'doctor' | 'pharmacist' | 'laboratorian' | 'staff';
    first_name: string;
    last_name: string;
  };
  roleProfile: {
    // Staff-specific
    staff_role: string;
    role_display: string;
    department: string;
    can_approve_professionals: boolean;
    can_manage_knowledge_base: boolean;
    can_export_datasets: boolean;
    can_view_audit_logs: boolean;
    hire_date: string;
    has_completed_training: boolean;
    last_active: string;
  } | null;
}
```

### **Login Handler:**
```typescript
async function login(email: string, password: string) {
  const response = await api.post('/accounts/login/', { email, password });
  const { user, access, refresh } = response.data.data;
  
  // Store tokens
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
  
  // Update auth state
  authStore.setUser(user);
  
  // Fetch and store profile
  const profileResponse = await api.get('/profiles/me/');
  authStore.setRoleProfile(profileResponse.data.data.role_profile);
  
  // Route
  if (user.user_type === 'staff') {
    navigate('/admin/dashboard');
  } else {
    navigate(`/${user.user_type}/dashboard`);
  }
}
```

### **Permission Guard Component:**
```typescript
export function PermissionGuard({ 
  permission, 
  children, 
  fallback = null 
}: {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { user, roleProfile } = useAuth();
  
  if (user?.user_type !== 'staff' || !roleProfile?.[permission]) {
    return fallback;
  }
  
  return <>{children}</>;
}

// Usage:
<PermissionGuard permission="can_approve_professionals">
  <a href="/admin/verifications">Review Professionals</a>
</PermissionGuard>
```

---

## **🧪 Testing Checklist**

- [ ] **Login Test**
  - Login as admin@rmp.local / Admin1234!
  - Verify: user_type = "staff" in response
  - Verify: Routed to /admin/dashboard

- [ ] **Profile Fetch Test**
  - Call GET /api/profiles/me/
  - Verify: role_profile is not null
  - Verify: role_display = "System Administrator"
  - Verify: All can_* flags are true

- [ ] **Navigation Test**
  - All 4 admin nav links visible (all permissions enabled)
  - Click each link → loads without errors

- [ ] **Permission Gates Test**
  - Verify: Each permission flag hides/shows corresponding feature

- [ ] **Error Handling Test**
  - Attempt to access feature without permission → 403 error handled gracefully
  - User redirected with alert message

---

## **📚 Reference Documents**
the doc path: '/home/zeus3000/PycharmProjects/RMP_backend/alrafidain_backend/docs'
1. **Full Integration Guide:** `docs/STAFF_INTEGRATION_GUIDE.md` (in backend repo)
2. **Test Credentials:** `docs/test_users.md`
3. **Live API Docs:** `http://localhost:8000/api/docs/`

---

## **❓ FAQ**

**Q: Why doesn't staff have UserProfile?**  
A: Staff are internal users; they don't need patient-like info (phone, address, national ID). Only `StaffProfile` is used.

**Q: Can we modify staff_role or permissions from frontend?**  
A: No. These are admin-only, backend-managed. Frontend is read-only.

**Q: What if user has no role_profile?**  
A: Shouldn't happen. If it does, treat as permission denied and redirect to login.

**Q: Should I cache the role_profile?**  
A: Yes, store it in auth state after login. Refresh on app init or after profile updates.

**Q: When will the admin feature endpoints be ready?**  
A: TBD. For now, create stub pages at `/admin/verifications`, `/admin/knowledge-base`, etc. Implementation details coming soon.

---

## **🎯 Acceptance Criteria**

✅ Staff users route to `/admin/dashboard` after login  
✅ Staff profile displays role, department, hire date, training status  
✅ Admin nav shows only features user has permission for  
✅ All 4 admin routes exist and load without errors  
✅ 403 errors handled gracefully with user alert  
✅ Non-staff users cannot access `/admin/*` routes  
✅ All code follows team's style guide and linting rules  
✅ Responsive on mobile & desktop  
