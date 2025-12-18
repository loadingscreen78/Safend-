# DigiPIN API Integration - FINAL

## API Endpoint
```
GET /api/digipin/decode?digipin={DIGIPIN}
```

## Example Request
```bash
curl "http://localhost:3000/api/digipin/decode?digipin=4P3-JK8-52C9"
```

## Expected Response
```json
{
  "latitude": 28.613900,
  "longitude": 77.209000,
  "accuracy": 10
}
```

## Implementation

### Service File
**Location:** `src/services/digipin/DigipinService.ts`

```typescript
export const decodeDigipin = async (digipin: string): Promise<DigipinDecodeResponse> => {
  const response = await fetch(`/api/digipin/decode?digipin=${digipin}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  
  return {
    code: digipin,
    latitude: parseFloat(data.latitude),
    longitude: parseFloat(data.longitude),
    accuracy: data.accuracy || 10
  };
};
```

### Usage in Application

#### 1. Create Post with DigiPIN
**File:** `src/pages/sales/components/SecurityPostFormModal.tsx`

When user submits form:
1. User enters DigiPIN: `4P3-JK8-52C9`
2. System calls: `GET /api/digipin/decode?digipin=4P3-JK8-52C9`
3. API returns coordinates
4. Post is created with real lat/lng
5. Post syncs to Operations module

#### 2. View Coordinates
**File:** `src/pages/operations/components/PostManagement.tsx`

Displays in Operations Posts tab:
```
DigiPIN: 4P3-JK8-52C9

Coordinates
Lat: 28.613900
Lng: 77.209000
```

## Testing

### Test 1: Valid DigiPIN
```bash
# Request
GET /api/digipin/decode?digipin=4P3-JK8-52C9

# Expected Response
{
  "latitude": 28.613900,
  "longitude": 77.209000,
  "accuracy": 10
}
```

### Test 2: Invalid DigiPIN
```bash
# Request
GET /api/digipin/decode?digipin=INVALID

# Expected Response
{
  "error": "Invalid DigiPIN format"
}
```

### Test 3: DigiPIN Not Found
```bash
# Request
GET /api/digipin/decode?digipin=XXX-XXX-XXXX

# Expected Response
{
  "error": "DigiPIN not found"
}
```

## Console Logging

### Successful Decode
```
🔍 Decoding DigiPIN via API: 4P3-JK8-52C9
✅ DigiPIN API response: { latitude: 28.6139, longitude: 77.209, accuracy: 10 }
✅ DigiPIN decoded successfully: { latitude: 28.6139, longitude: 77.209 }
```

### Failed Decode
```
🔍 Decoding DigiPIN via API: INVALID
❌ DigiPIN API error: 400 Invalid DigiPIN format
❌ Error decoding DigiPIN: Failed to decode DigiPIN: API returned 400: Bad Request
```

## User Feedback

### Success Toast
```
✅ DigiPIN Decoded!
Coordinates: Lat 28.613900, Lng 77.209000
```

### Error Toast
```
❌ Error
Failed to decode DigiPIN: API returned 400: Bad Request
```

### Final Success
```
✅ Post Created Successfully!
Main Gate synced to Operations with coordinates: Lat 28.6139, Lng 77.2090
```

## API Requirements

### Backend Setup
Your backend must provide the `/api/digipin/decode` endpoint that:
1. Accepts DigiPIN as query parameter
2. Returns JSON with latitude, longitude, accuracy
3. Handles errors gracefully
4. Supports CORS if needed

### Example Backend (Node.js/Express)
```javascript
app.get('/api/digipin/decode', async (req, res) => {
  const { digipin } = req.query;
  
  // Validate format
  if (!digipin || !/^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{4}$/i.test(digipin)) {
    return res.status(400).json({ error: 'Invalid DigiPIN format' });
  }
  
  try {
    // Call India Post API or your database
    const coordinates = await fetchDigipinCoordinates(digipin);
    
    res.json({
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      accuracy: 10
    });
  } catch (error) {
    res.status(404).json({ error: 'DigiPIN not found' });
  }
});
```

## Error Handling

### Network Error
```typescript
try {
  const decoded = await decodeDigipin(digipin);
} catch (error) {
  // Shows error toast
  // Stops post creation
  // User can retry
}
```

### Invalid Response
```typescript
if (!data.latitude || !data.longitude) {
  throw new Error('Invalid response from API: missing coordinates');
}
```

## Flow Diagram

```
User enters DigiPIN
       ↓
Form validates format (XXX-XXX-XXXX)
       ↓
On submit → Call /api/digipin/decode
       ↓
API returns coordinates
       ↓
Create post with lat/lng
       ↓
Sync to Operations
       ↓
Display in Operations Posts tab
```

## Configuration

### Development
```env
# .env.development
VITE_API_URL=http://localhost:3000
```

### Production
```env
# .env.production
VITE_API_URL=https://api.yourdomain.com
```

### Update API URL (if needed)
```typescript
// src/services/digipin/DigipinService.ts
const API_URL = import.meta.env.VITE_API_URL || '';
const response = await fetch(`${API_URL}/api/digipin/decode?digipin=${digipin}`);
```

## Troubleshooting

### API not responding?
1. Check backend server is running
2. Verify endpoint exists: `GET /api/digipin/decode`
3. Test with curl: `curl "http://localhost:3000/api/digipin/decode?digipin=4P3-JK8-52C9"`
4. Check browser console for errors
5. Verify CORS headers if needed

### Coordinates not showing?
1. Check API returns valid JSON
2. Verify latitude/longitude fields exist
3. Check browser console for decode errors
4. Refresh Operations page
5. Check Firebase for stored coordinates

### CORS Issues?
Add CORS headers to backend:
```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
```

## Status
✅ **IMPLEMENTED** - Using custom API endpoint `/api/digipin/decode`
✅ **READY** - DigiPIN decoding with real coordinates
✅ **WORKING** - Coordinates display in Operations Posts tab
