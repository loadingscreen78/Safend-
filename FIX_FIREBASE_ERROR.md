# 🔧 Fix Firebase Permission Error

## The Error
```
No document to update: projects/testsafend-eca71/databases/(default)/documents/leads/...
```

## Why It Happens
Firebase Firestore security rules are blocking write operations.

## Quick Fix (2 Steps)

### Step 1: Update Firestore Security Rules

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: testsafend-eca71
3. **Click**: Firestore Database (left sidebar)
4. **Click**: Rules tab (top)
5. **Replace all rules** with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow authenticated users to read/write leads
    match /leads/{leadId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write users
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to create audit logs
    match /auditLogs/{logId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
  }
}
```

6. **Click**: Publish

### Step 2: Create Firestore Index

1. **Stay in Firebase Console**
2. **Go to**: Firestore Database → Indexes tab
3. **Click**: Create Index
4. **Set**:
   - Collection ID: `leads`
   - Field: `createdAt`
   - Order: Descending
5. **Click**: Create Index
6. **Wait** 2-3 minutes for index to build

## Alternative: Open Rules for Testing

If you want to test quickly, use these TEMPORARY rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

⚠️ **WARNING**: These rules allow all authenticated users to read/write everything. Only use for testing!

## After Fixing

1. **Refresh your app**
2. **Try creating a lead again**
3. **It should work now!**

## Verify It's Working

1. Create a lead in the app
2. Go to Firebase Console → Firestore Database → Data tab
3. You should see a `leads` collection with your data

## Still Not Working?

Check:
- ✅ You're logged in (authenticated)
- ✅ Rules are published
- ✅ Index is created (if using orderBy)
- ✅ No typos in collection name

## Summary

The error happens because:
1. Firebase security rules block write operations by default
2. You need to explicitly allow authenticated users to write to `leads` collection
3. You need an index for `orderBy('createdAt', 'desc')`

Follow the steps above and it will work! 🔥
