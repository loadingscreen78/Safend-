# Post Sync Troubleshooting Guide

## Issue
Posts added from Work Orders are not showing in Operations Posts tab.

## Solution Implemented

### 1. **DigiPIN Decoding**
- Added DigiPIN decoding before syncing
- Converts DigiPIN to latitude/longitude coordinates
- Falls back to 0,0 if decoding fails

### 2. **Proper Data Structure**
- Post data now includes decoded coordinates
- Work order structure matches expected format
- Client name properly passed to operations

### 3. **Console Logging**
Added extensive logging to track the sync process:
- "Creating post for work order: [ID]"
- "Post data: [object]"
- "Syncing to operations: [object]"
- "Sync result: [object]"

## How to Test

### Step 1: Add a Post
1. Go to Sales → Contracts → Work Orders
2. Click the MapPin icon (blue) next to any work order
3. Fill in the form:
   - Post Name: "Test Post"
   - Address: "123 Test Street"
   - DigiPIN: "5C8-8J9-7FT7" (or any valid format)
   - Add at least one staff requirement
4. Click "Create Post"

### Step 2: Check Console
Open browser console (F12) and look for:
```
Creating post for work order: WO-2024-XXXX
Post data: { name: "Test Post", code: "POST-XXXX", ... }
DigiPIN decoded: { latitude: XX.XXXX, longitude: XX.XXXX }
Syncing to operations: { id: "WO-2024-XXXX", client: "Client Name", posts: [...] }
Sync result: { success: true, message: "1 post(s) synced successfully" }
```

### Step 3: Check Operations
1. Go to Operations → Posts tab
2. Click "Refresh" button
3. Look for the client name
4. Click to expand and see the post

## Common Issues

### Issue 1: DigiPIN Decode Fails
**Symptom:** Console shows "DigiPIN decode failed"
**Solution:** Post will still be created with coordinates 0,0
**Fix:** Use a valid DigiPIN format or check DigiPIN API

### Issue 2: Post Not Appearing
**Symptom:** Success message but no post in Operations
**Solution:** Check Firebase Console
1. Go to Firebase Console
2. Navigate to Firestore Database
3. Look for `operationalPosts` collection
4. Check if document was created

### Issue 3: Client Name Missing
**Symptom:** Post appears but client name is empty
**Solution:** Check work order has `client` or `clientName` field


## Debugging Steps

### 1. Check Browser Console
Press F12 and look for:
- Any error messages in red
- Console.log messages showing the sync process
- Network tab for Firebase requests

### 2. Check Firebase Console
1. Open Firebase Console
2. Go to Firestore Database
3. Check `operationalPosts` collection
4. Verify document structure:
   ```
   {
     workOrderId: "WO-2024-XXXX",
     postCode: "POST-XXXX",
     postName: "Test Post",
     clientName: "Client Name",
     location: {
       address: "123 Test Street",
       digipin: "5C8-8J9-7FT7",
       latitude: XX.XXXX,
       longitude: XX.XXXX
     },
     type: "permanent",
     dutyType: "8H",
     status: "active",
     requiredStaff: [...]
   }
   ```

### 3. Check Operations Module
1. Go to Operations → Posts tab
2. Check if "No Posts Found" message appears
3. Try clicking "Refresh" button
4. Check browser console for subscription errors

## Expected Behavior

1. **Add Post Button Clicked** → Modal opens
2. **Form Filled & Submitted** → DigiPIN decoded
3. **Sync to Operations** → Document created in Firebase
4. **Real-time Update** → Operations tab updates automatically
5. **Post Appears** → Grouped under client name

## Data Flow

```
Work Orders Table (Sales)
    ↓
Click MapPin Icon
    ↓
SecurityPostFormModal Opens
    ↓
Fill Form & Submit
    ↓
Decode DigiPIN → Get Coordinates
    ↓
Create Post Object
    ↓
syncPostsFromWorkOrder()
    ↓
createOperationalPost() → Firebase
    ↓
subscribeToOperationalPosts() → Real-time listener
    ↓
Operations Posts Tab Updates
    ↓
Post Appears Under Client
```

## Quick Fix Checklist

- [ ] DigiPIN is in correct format (XXX-XXX-XXXX)
- [ ] All required fields filled
- [ ] Work order has valid ID
- [ ] Client name exists in work order
- [ ] Firebase connection is active
- [ ] Browser console shows no errors
- [ ] Operations tab is subscribed to updates
- [ ] Refresh button clicked in Operations

## Still Not Working?

If posts still don't appear:
1. Check Firebase rules allow write to `operationalPosts`
2. Verify network connection
3. Check if other Firebase operations work
4. Try creating a work order with posts from scratch
5. Check if the issue is with the specific work order
