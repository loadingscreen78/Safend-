# DigiPIN Backend Implementation

## Overview
Automatic DigiPIN decoding using Firebase Cloud Functions. When a post is created with a DigiPIN, the backend automatically decodes it and stores the coordinates.

## Architecture

```
Post Created (Frontend)
    ↓
Firebase Firestore (operationalPosts collection)
    ↓
Cloud Function Triggered (onPostCreated)
    ↓
Call India Post DigiPIN API
    ↓
Decode DigiPIN → Get Lat/Lng
    ↓
Update Post Document with Coordinates
    ↓
Frontend Displays Coordinates (Real-time)
```

## Setup Instructions

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### 2. Initialize Firebase Functions
```bash
cd "Jagannath project/lovable-project-513c5e73"
firebase init functions
```

Select:
- Use existing project: testsafend-eca71
- Language: TypeScript
- ESLint: No
- Install dependencies: Yes

### 3. Install Dependencies
```bash
cd functions
npm install
```

### 4. Deploy Functions
```bash
npm run deploy
```

Or deploy specific function:
```bash
firebase deploy --only functions:onPostCreated
firebase deploy --only functions:onPostUpdated
```

## Cloud Functions

### 1. onPostCreated
**Trigger:** When a new post document is created
**Action:** Decodes DigiPIN and updates coordinates

### 2. onPostUpdated
**Trigger:** When post document is updated
**Action:** Re-decodes if DigiPIN changed

### 3. decodeDigipinHttp (Optional)
**Type:** HTTP endpoint
**URL:** `https://us-central1-testsafend-eca71.cloudfunctions.net/decodeDigipinHttp`
**Usage:** Manual DigiPIN decoding

```bash
curl "https://us-central1-testsafend-eca71.cloudfunctions.net/decodeDigipinHttp?digipin=5C8-8J9-7FT9"
```

## Frontend Changes

### Before:
```typescript
Coordinates: Not decoded yet
```

### After:
```typescript
// If coordinates exist:
Coordinates
Lat: 28.613900
Lng: 77.209000

// If not decoded:
Pending (DigiPIN decode required)
```

## Data Flow

### 1. Post Creation
```javascript
// Frontend creates post
{
  postName: "Main Gate",
  location: {
    address: "123 Street",
    digipin: "5C8-8J9-7FT9",
    latitude: 0,
    longitude: 0
  }
}

// Cloud Function decodes
// Updates to:
{
  location: {
    address: "123 Street",
    digipin: "5C8-8J9-7FT9",
    latitude: 28.613900,
    longitude: 77.209000,
    accuracy: 10,
    decodedAt: Timestamp
  }
}

// Frontend displays
Lat: 28.613900
Lng: 77.209000
```

## Error Handling

### If DigiPIN decode fails:
```javascript
{
  location: {
    digipin: "INVALID",
    latitude: 0,
    longitude: 0,
    decodeError: "Failed to decode DigiPIN",
    decodeAttemptedAt: Timestamp
  }
}
```

Frontend shows: "Pending (DigiPIN decode required)"

## Testing

### 1. Local Testing (Emulator)
```bash
cd functions
npm run serve
```

### 2. Test Post Creation
1. Go to Sales → Work Orders
2. Click MapPin icon
3. Fill form with DigiPIN: "5C8-8J9-7FT9"
4. Submit
5. Check Firebase Console logs
6. Go to Operations → Posts
7. Coordinates should appear within seconds

### 3. Check Logs
```bash
firebase functions:log
```

## API Endpoint

### India Post DigiPIN API
```
GET https://api.indiapost.gov.in/digipin/v1/decode?digipin=5C88J97FT9
```

**Response:**
```json
{
  "latitude": 28.613900,
  "longitude": 77.209000,
  "accuracy": 10,
  "address": "New Delhi, India"
}
```

## Cost Estimation

Firebase Cloud Functions pricing:
- First 2 million invocations/month: FREE
- After that: $0.40 per million invocations

For typical usage (100 posts/day):
- Monthly invocations: ~3,000
- Cost: $0 (within free tier)

## Monitoring

### Firebase Console
1. Go to Firebase Console
2. Navigate to Functions
3. View logs and metrics
4. Monitor execution time and errors

### Check Function Status
```bash
firebase functions:list
```

## Troubleshooting

### Function not triggering?
1. Check Firebase Console → Functions
2. Verify function is deployed
3. Check Firestore rules allow writes
4. View function logs for errors

### DigiPIN not decoding?
1. Check India Post API status
2. Verify DigiPIN format (XXX-XXX-XXXX)
3. Check function logs for API errors
4. Test with known valid DigiPIN

### Coordinates not updating?
1. Check real-time listener in frontend
2. Verify Firebase connection
3. Check browser console for errors
4. Refresh Operations page

## Security

### Firestore Rules
Ensure functions can write to operationalPosts:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /operationalPosts/{postId} {
      allow read, write: if request.auth != null;
      // Allow Cloud Functions to write
      allow write: if request.auth.token.admin == true;
    }
  }
}
```

## Maintenance

### Update Function
1. Edit `functions/src/digipinDecoder.ts`
2. Run `npm run deploy`
3. Monitor logs for issues

### Rollback
```bash
firebase functions:delete onPostCreated
firebase deploy --only functions:onPostCreated
```
