# Role-Based Access Control (RBAC) Implementation

## Overview
Complete role-based access control system with Firebase integration for user management.

## Permanent Admin Account
- **Email**: `safendadmin@mail.com`
- **Password**: `admin123`
- **Role**: admin (hardcoded, cannot be changed)
- **Access**: Full access to all modules

## System Roles
1. **admin** - Full access to all modules
2. **sales** - Access to Sales module only
3. **operations** - Access to Operations module only
4. **hr** - Access to HR module only
5. **accounts** - Access to Accounts module only
6. **reports** - Access to Reports module only

## Features Implemented

### 1. Login System
- ✅ Removed signup option from login form
- ✅ Only admin can create users
- ✅ Role validation on login
- ✅ Users without roles are denied access

### 2. User Management (Control Centre)
Located in: **Dashboard → Control Centre → User Manager**

Features:
- ✅ Create new users with email and auto-generated password
- ✅ Assign roles to users (sales, operations, hr, accounts, reports, admin)
- ✅ Copy password to clipboard
- ✅ Regenerate password
- ✅ Edit user details
- ✅ Activate/Deactivate users
- ✅ Delete users
- ✅ Search and filter users
- ✅ View user activity

### 3. Firebase Integration
- ✅ Users stored in Firestore `users` collection
- ✅ User authentication via Firebase Auth
- ✅ Role-based access control via Firestore
- ✅ Real-time user data sync

### 4. Route Protection
Routes are protected based on user roles:
- `/dashboard` - All authenticated users
- `/sales` - admin, sales
- `/operations` - admin, operations
- `/accounts` - admin, accounts
- `/hr` - admin, hr
- `/office-admin` - admin only

## How to Use

### As Admin (safendadmin@mail.com)

1. **Login** with admin credentials
2. **Navigate** to Dashboard → Control Centre → User Manager
3. **Click** "Add User" button
4. **Fill** user details:
   - Full Name
   - Email Address
   - Role (sales, operations, hr, accounts, reports)
   - Branch
   - Status (active/inactive)
5. **Copy** the generated password
6. **Click** "Create User"
7. **Share** the email and password with the user securely

### As Regular User

1. **Receive** email and password from admin
2. **Login** with provided credentials
3. **Access** only your assigned module
4. Cannot access other modules or admin features

## Firestore Structure

```
users/
  {userId}/
    uid: "firebase-user-id"
    email: "user@example.com"
    name: "User Name"
    roles: ["sales"]  // Array of roles
    branch: "Mumbai HQ"
    branchId: "b1"
    status: "active"
    createdAt: "2025-10-20T10:14:00.000Z"
    lastActive: "2 hours ago"
```

## Security Features

1. **Permanent Admin**: safendadmin@mail.com always has admin role
2. **No Self-Registration**: Users can only be created by admin
3. **Role Validation**: Roles checked on every login
4. **Route Protection**: Unauthorized access redirected to login
5. **Firestore Rules**: Should be configured to restrict access

## Firebase Console Setup Required

### 1. Authentication
- Go to Firebase Console → Authentication
- Enable Email/Password sign-in method
- Add authorized domain (your deployment domain)

### 2. Firestore Database
- Go to Firebase Console → Firestore Database
- Create database (if not exists)
- The `users` collection will be created automatically

### 3. Firestore Security Rules (Important!)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - only authenticated users can read their own data
    // Only admins can write
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin']);
    }
  }
}
```

### 4. Create Initial Admin User
Since signup is disabled, you need to create the admin user manually:

**Option 1: Firebase Console**
1. Go to Authentication → Users
2. Add user manually:
   - Email: safendadmin@mail.com
   - Password: admin123

**Option 2: Firebase Admin SDK (Backend)**
Use Firebase Admin SDK to create the user programmatically

## Testing

### Test Admin Access
1. Login as: safendadmin@mail.com / admin123
2. Verify access to all modules
3. Create a test user with 'sales' role
4. Logout

### Test Sales User Access
1. Login with the sales user credentials
2. Verify access to Sales module only
3. Try accessing Operations module (should be denied)
4. Verify dashboard access

### Test User Management
1. Login as admin
2. Create user with each role
3. Edit user details
4. Deactivate/Activate user
5. Delete user
6. Verify all operations work correctly

## Troubleshooting

### Users can't login
- Check Firebase Authentication is enabled
- Verify user exists in Firebase Auth
- Check user has roles in Firestore

### Users can access wrong modules
- Verify roles are correctly set in Firestore
- Check route protection in App.tsx
- Clear browser cache and localStorage

### Password generation not working
- Check firebaseUserManagement.ts is imported correctly
- Verify generatePassword function works

## Next Steps

1. ✅ Implement password reset functionality
2. ✅ Add email notifications for new users
3. ✅ Implement audit logging for user actions
4. ✅ Add bulk user import via CSV
5. ✅ Integrate with LDAP/Active Directory
