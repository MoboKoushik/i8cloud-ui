# Test User Credentials

## Mock User Accounts

Use these credentials to test different role-based access levels:

### 1. Super Administrator
- **Username**: `super.admin`
- **Password**: `Admin@123`
- **Access**: Full system access including role and user management
- **Landing Page**: /dashboard

### 2. Security Administrator
- **Username**: `security.admin`
- **Password**: `Sec@123`
- **Access**: Security groups, audit logs, sign-on monitoring, compliance
- **Landing Page**: /security-groups

### 3. Auditor
- **Username**: `auditor`
- **Password**: `Audit@123`
- **Access**: Read-only access to all modules, can export and generate reports
- **Landing Page**: /access-audit

### 4. Integration Engineer
- **Username**: `integration.eng`
- **Password**: `Int@123`
- **Access**: Full access to integration dashboard, limited security groups view
- **Landing Page**: /integration

### 5. Business User
- **Username**: `business.user`
- **Password**: `User@123`
- **Access**: Summary dashboards and public reports only
- **Landing Page**: /dashboard

### 6. Regional Security Manager (Custom Role Example)
- **Username**: `regional.manager`
- **Password**: `Region@123`
- **Access**: Custom permissions - can view, edit, export security groups; view sign-on and workday
- **Landing Page**: /security-groups

## Testing Dynamic RBAC

To verify the Dynamic RBAC system works correctly:

1. Login as **super.admin**
2. Navigate to `/admin/roles`
3. Create a new custom role with specific permissions
4. Navigate to `/admin/users`
5. Create a new user and assign the custom role
6. Logout and login as the new user
7. Verify that only permitted features are accessible

The UI should dynamically show/hide menu items, buttons, and features based on the assigned role's permissions.
