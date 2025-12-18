# India Post DigiPIN API Integration

## Overview
This application uses the official India Post DigiPIN API to decode DigiPIN codes into latitude/longitude coordinates.

## API Details

### Endpoint
```
GET https://api.indiapost.gov.in/digipin/v1/decode?digipin={DIGIPIN}
```

### Request Format
```http
GET /digipin/v1/decode?digipin=5C88J97FT9 HTTP/1.1
Host: api.indiapost.gov.in
Accept: application/json
Content-Type: application/json
```

### Response Format
```json
{
  "latitude": 28.613900,
  "longitude": 77.209000,
  "accuracy": 10
}
```

### Error Responses
```json
{
  "error": "Invalid DigiPIN format",
  "code": 400
}
```

```json
{
  "error": "DigiPIN not found",
  "code": 404
}
```

## Implementation

### Service File
**Location:** `src/services/digipin/DigipinService.ts`

### Function: `decodeDigipin()`
```typescript
export const decodeDigipin = async (digipin: string): Promise<DigipinDecodeResponse> => {
  // Validates format: XXX-XXX-XXXX
  // Calls India Post API
  // Returns coordinates
}
```

### Usage in Application

#### 1. Security Post Form
**File:** `src/pages/sales/components/SecurityPostFormModal.tsx`

When user creates a post:
1. User enters DigiPIN: `5C8-8J9-7FT9`
2. Form validates format
3. On submit, calls `decodeDigipin()`
4. Stores coordinates in database
5. Syncs to Operations module

#### 2. Operations Display
**File:** `src/pages/operations/components/PostManagement.tsx`

Displays decoded coordinates:
- Shows "Lat: X.XXXXXX / Lng: Y.YYYYYY"
- Real-time updates from Firebase
- Grouped by client

## DigiPIN Format

### Valid Format
- Pattern: `XXX-XXX-XXXX`
- Characters: Alphanumeric (A-Z, 0-9)
- Length: 9-12 characters (excluding dashes)
- Example: `5C8-8J9-7FT9`

### Validation
```typescript
const cleanDigipin = digipin.replace(/-/g, '').toUpperCase();
if (!/^[A-Z0-9]{9,12}$/.test(cleanDigipin)) {
  throw new Error('Invalid DigiPIN format');
}
```

### Auto-formatting
The form automatically formats DigiPIN as user types:
- Input: `5C88J97FT9`
- Formatted: `5C8-8J9-7FT9`

## Error Handling

### Network Errors
```typescript
try {
  const decoded = await decodeDigipin(digipin);
  // Success
} catch (error) {
  // Handle: API unavailable, network error, etc.
  toast({
    title: "Error",
    description: "Could not decode DigiPIN. Please check your connection.",
    variant: "destructive"
  });
}
```

### Invalid DigiPIN
```typescript
// API returns 404
{
  "error": "DigiPIN not found in database"
}

// User sees:
"This DigiPIN is not registered with India Post"
```

### API Rate Limiting
If India Post implements rate limiting:
- Cache decoded DigiPINs locally
- Implement retry logic with exponential backoff
- Show user-friendly error messages

## Testing

### Test with Valid DigiPIN
1. Go to Sales → Work Orders
2. Click MapPin icon
3. Enter valid DigiPIN from India Post
4. Submit form
5. Check console for API response
6. Verify coordinates in Operations → Posts

### Test with Invalid DigiPIN
1. Enter: `INVALID-PIN`
2. Should show validation error
3. Enter: `AAA-BBB-CCCC` (valid format but not in database)
4. Should show "DigiPIN not found" error

### Console Logging
Check browser console for:
```
Decoding DigiPIN via India Post API: 5C8-8J9-7FT9
India Post API response: { latitude: 28.6139, longitude: 77.209, accuracy: 10 }
DigiPIN decoded successfully: { latitude: 28.6139, longitude: 77.209 }
```

## API Limitations

### Known Limitations
1. **Public Access**: API may require authentication/API key
2. **Rate Limits**: Unknown - may be implemented
3. **Availability**: Government API - may have downtime
4. **CORS**: May need backend proxy if CORS issues occur

### Solutions

#### If API Key Required
Add to `.env`:
```env
VITE_INDIA_POST_API_KEY=your_api_key_here
```

Update service:
```typescript
headers: {
  'Accept': 'application/json',
  'Authorization': `Bearer ${import.meta.env.VITE_INDIA_POST_API_KEY}`
}
```

#### If CORS Issues
Create backend proxy:
```typescript
// Backend endpoint
app.get('/api/decode-digipin', async (req, res) => {
  const { digipin } = req.query;
  const response = await fetch(`https://api.indiapost.gov.in/digipin/v1/decode?digipin=${digipin}`);
  const data = await response.json();
  res.json(data);
});

// Frontend calls backend instead
const response = await fetch(`/api/decode-digipin?digipin=${digipin}`);
```

## Monitoring

### Success Metrics
- Track successful decode rate
- Monitor API response times
- Log failed DigiPINs for review

### Error Tracking
```typescript
// Log to analytics/monitoring service
if (!response.ok) {
  logError('DigiPIN decode failed', {
    digipin: digipin,
    status: response.status,
    error: await response.text()
  });
}
```

## Security

### Data Privacy
- DigiPINs are public location identifiers
- No personal data in DigiPIN
- Safe to log and cache

### API Security
- Use HTTPS only
- Don't expose API keys in frontend
- Implement rate limiting on your side
- Validate all inputs before API call

## Performance

### Optimization Strategies

#### 1. Caching
```typescript
// Cache in localStorage
const cached = localStorage.getItem(`digipin_${digipin}`);
if (cached) {
  return JSON.parse(cached);
}

// After decode
localStorage.setItem(`digipin_${digipin}`, JSON.stringify(result));
```

#### 2. Batch Requests
If API supports batch:
```typescript
// Decode multiple DigiPINs at once
const response = await fetch('/digipin/v1/decode/batch', {
  method: 'POST',
  body: JSON.stringify({ digipins: ['5C8-8J9-7FT9', 'ABC-DEF-GHIJ'] })
});
```

#### 3. Background Decoding
Use Firebase Cloud Functions (see `DIGIPIN_BACKEND_SETUP.md`):
- Decode in background
- Update coordinates asynchronously
- No frontend waiting time

## Support

### India Post API Documentation
- Official Docs: https://api.indiapost.gov.in/docs
- Support: api-support@indiapost.gov.in
- Status Page: https://status.indiapost.gov.in

### Troubleshooting
1. Check API status page
2. Verify network connectivity
3. Test with curl:
   ```bash
   curl "https://api.indiapost.gov.in/digipin/v1/decode?digipin=5C88J97FT9"
   ```
4. Check browser console for errors
5. Verify DigiPIN is valid

## Status
✅ **IMPLEMENTED** - Using official India Post DigiPIN API for coordinate decoding
