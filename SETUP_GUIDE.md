# Setup Guide - Safend Application

## Quick Start

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Firebase Console Setup

#### A. Create/Verify Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **testsafend-eca71**

#### B. Enable Authentication
1. Navigate to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Add your deployment domain to **Authorized domains**

#### C. Create Admin User
1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Enter:
   - Email: `safendadmin@mail.com`
   - Password: `admin123`
4. Click **Add user**

#### D. Set up Firestore
1. Navigate to **Firestore Database**
2. Click **Create database** (if not exists)
3. Choose **Start in production mode**
4. Select your region

#### E. Configure Firestore Rules
1. Go to **Firestore Database** → **Rules**
2. Replace with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      // Users can read their own data
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Only admins can write/create users
      allow write: if request.auth != null && 
                     (request.auth.token.email == 'safendadmin@mail.com' ||
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin']));
    }
    
    // Allow admins to read all users
    match /users/{userId} {
      allow read: if request.auth != null && 
                    (request.auth.token.email == 'safendadmin@mail.com' ||
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin']));
    }
  }
}
```
3. Click **Publish**

### 3. Run the Application
```bash
npm run dev
```

The app will start at `http://localhost:5173`

## First Login

### Login as Admin
1. Open `http://localhost:5173`
2. Enter credentials:
   - Email: `safendadmin@mail.com`
   - Password: `admin123`
3. Click **Sign In**
4. You'll be redirected to the dashboard

## Creating Users

### Step-by-Step
1. **Login** as admin
2. **Navigate** to: Dashboard → Control Centre → User Manager
3. **Click** "Add User" button
4. **Fill in** the form:
   - **Full Name**: User's full name
   - **Email**: User's email address
   - **Role**: Select from:
     - Administrator (full access)
     - Sales (sales module only)
     - Operations (operations module only)
     - HR (HR module only)
     - Accounts (accounts module only)
     - Reports (reports module only)
   - **Branch**: Select user's branch
   - **Status**: Active or Inactive
5. **Copy** the generated password (click copy icon)
6. **Click** "Create User"
7. **Share** the email and password with the user securely

### Password Management
- Passwords are auto-generated (12 characters, alphanumeric + special chars)
- Click the **refresh icon** to regenerate password
- Click the **copy icon** to copy password to clipboard
- Share passwords securely (email, Slack, etc.)

## Module Access by Role

| Role | Dashboard | Sales | Operations | HR | Accounts | Office Admin | Reports |
|------|-----------|-------|------------|----|-----------|--------------| --------|
| admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| sales | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| operations | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| hr | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| accounts | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| reports | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

## User Management Features

### View Users
- See all users in the system
- Filter by: All, Active, Inactive
- Search by: Name, Email, Role
- View user details: Name, Email, Role, Branch, Status, Last Active

### Edit User
1. Click the **edit icon** next to user
2. Modify user details
3. Click **Update User**

### Activate/Deactivate User
1. Click the **toggle icon** next to user
2. Confirm action
3. User status will be updated

### Delete User
1. Click the **delete icon** next to user
2. Confirm deletion
3. User will be removed from system

## Troubleshooting

### Can't Login
**Problem**: "Access denied" or "No role assigned"
**Solution**: 
1. Verify user exists in Firebase Authentication
2. Check user has document in Firestore `users` collection
3. Verify user has `roles` array with at least one role

### Admin Can't Create Users
**Problem**: "Permission denied" when creating users
**Solution**:
1. Check Firestore rules are configured correctly
2. Verify admin user email is exactly `safendadmin@mail.com`
3. Check admin user has `admin` role in Firestore

### User Can Access Wrong Modules
**Problem**: User can access modules they shouldn't
**Solution**:
1. Check user's roles in Firestore
2. Verify route protection in App.tsx
3. Clear browser cache and localStorage
4. Re-login

### Password Not Copying
**Problem**: Copy button doesn't work
**Solution**:
1. Check browser permissions for clipboard access
2. Manually select and copy the password
3. Try a different browser

## Security Best Practices

1. **Change Admin Password**: After first login, consider changing admin password
2. **Secure Password Sharing**: Use secure channels to share passwords
3. **Regular Audits**: Review user access regularly
4. **Deactivate Users**: Deactivate users who leave the organization
5. **Strong Passwords**: Ensure generated passwords are strong
6. **Firestore Rules**: Keep Firestore rules restrictive

## Development vs Production

### Development
- Use Firebase emulators for local testing
- Test with dummy data
- Don't use real user emails

### Production
- Use production Firebase project
- Enable Firebase App Check
- Set up monitoring and alerts
- Regular backups of Firestore data
- Use environment variables for sensitive data

## Support

For issues or questions:
1. Check `RBAC_IMPLEMENTATION.md` for detailed documentation
2. Check `FIREBASE_MIGRATION.md` for Firebase setup details
3. Review Firebase Console logs
4. Check browser console for errors

## Next Steps

After setup:
1. ✅ Create test users for each role
2. ✅ Test login and access for each role
3. ✅ Configure branch data
4. ✅ Set up email notifications (optional)
5. ✅ Configure backup strategy
6. ✅ Set up monitoring and alerts
