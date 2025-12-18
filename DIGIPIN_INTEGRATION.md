# DigiPIN Integration Guide

## Overview

Complete integration guide for DigiPIN decoding, reverse geocoding, and map display in the Security Management System.

## Architecture

```
User enters DigiPIN (10 digits)
         ↓
    Validate format
         ↓
Decode via DigiPIN API → Get lat/lon
         ↓
Reverse Geocode → Get address
         ↓
Save to Firebase (optional)
         ↓
Display on map + Show details
```

## API Endpoints

### 1. Decode DigiPIN

**Endpoint:** `https://api.digipin.org/v1/decode`

**Method:** GET

**Parameters:**
- `code` (string): 10-digit DigiPIN code

**Request Example:**
```http
GET https://api.digipin.org/v1/decode?code=2201450001
```

**Response Example:**
```json
{
  "code": "2201450001",
  "latitude": 19.073600,
  "longitude": 72.877700,
  "accuracy": 4
}
```

**Response Fields:**
- `code` (string): The DigiPIN code
- `latitude` (number): Latitude coordinate
- `longitude` (number): Longitude coordinate
- `accuracy` (number): Accuracy level (0-10, higher is better)

---

### 2. Reverse Geocode (Mappls)

**Endpoint:** `https://apis.mappls.com/advancedmaps/v1/{REST_KEY}/rev_geocode`

**Method:** GET

**Parameters:**
- `lat` (number): Latitude
- `lng` (number): Longitude

**Headers:**
- Requires Mappls REST API Key

**Request Example:**
```http
GET https://apis.mappls.com/advancedmaps/v1/{{MAPPLS_REST_KEY}}/rev_geocode?lat=19.073600&lng=72.877700
```

**Response Example:**
```json
{
  "suggestedLocations": [
    {
      "formatted_address": "Main Gate, 123 Business Park, Mumbai, Maharashtra 400001, India",
      "locality": "Mumbai",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    }
  ]
}
```

---

### 3. Reverse Geocode (Nominatim Fallback)

**Endpoint:** `https://nominatim.openstreetmap.org/reverse`

**Method:** GET

**Parameters:**
- `format` (string): "jsonv2"
- `lat` (number): Latitude
- `lon` (number): Longitude

**Headers:**
- `User-Agent`: Required (e.g., "SecurityManagementSystem/1.0")

**Request Example:**
```http
GET https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=19.073600&lon=72.877700
User-Agent: SecurityManagementSystem/1.0
```

**Response Example:**
```json
{
  "display_name": "Main Gate, 123 Business Park, Mumbai, Maharashtra 400001, India",
  "address": {
    "road": "Business Park Road",
    "suburb": "Andheri East",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postcode": "400001",
    "country": "India"
  }
}
```

---

### 4. Save Location (Backend)

**Endpoint:** `https://YOUR_BACKEND_URL/save-location`

**Method:** POST

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{BACKEND_SECRET}}
```

**Request Body:**
```json
{
  "digipin": "2201450001",
  "latitude": 19.073600,
  "longitude": 72.877700,
  "address": "Main Gate, 123 Business Park, Mumbai, Maharashtra 400001, India",
  "accuracy": 4,
  "createdBy": "user_123",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

**Response Example:**
```json
{
  "success": true,
  "id": "loc_abc123",
  "message": "Location saved successfully"
}
```

---

## Environment Variables

Add these to your `.env` file:

```env
# DigiPIN API (no key required for basic usage)
# VITE_DIGIPIN_API_URL=https://api.digipin.org/v1

# Mappls API Keys (optional, falls back to Nominatim)
VITE_MAPPLS_REST_KEY=your_mappls_rest_key_here
VITE_MAPPLS_MAP_KEY=your_mappls_map_key_here

# Backend for saving locations (optional)
VITE_BACKEND_URL=https://your-backend-url.com
VITE_BACKEND_SECRET=your_backend_secret_here
```

---

## Frontend Integration

### Service Usage

```typescript
import { processDigipin } from '@/services/digipin/DigipinService';

// Process a DigiPIN
const result = await processDigipin('2201450001');

if (result.success) {
  console.log('DigiPIN:', result.data.code);
  console.log('Coordinates:', result.data.latitude, result.data.longitude);
  console.log('Address:', result.data.address);
  console.log('Mappls URL:', result.data.mapplsUrl);
  console.log('Google Maps URL:', result.data.googleMapsUrl);
  console.log('Saved ID:', result.data.savedId);
} else {
  console.error('Error:', result.error);
}
```

### Component Integration

```typescript
import { useState } from 'react';
import { processDigipin } from '@/services/digipin/DigipinService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function DigipinDecoder() {
  const [digipin, setDigipin] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDecode = async () => {
    setLoading(true);
    const decoded = await processDigipin(digipin);
    setResult(decoded);
    setLoading(false);
  };

  return (
    <div>
      <Input
        value={digipin}
        onChange={(e) => setDigipin(e.target.value)}
        placeholder="Enter 10-digit DigiPIN"
        maxLength={10}
      />
      <Button onClick={handleDecode} disabled={loading}>
        Decode
      </Button>
      
      {result?.success && (
        <div>
          <p>Coordinates: {result.data.latitude}, {result.data.longitude}</p>
          <p>Address: {result.data.address}</p>
          <a href={result.data.googleMapsUrl} target="_blank">
            View on Google Maps
          </a>
        </div>
      )}
    </div>
  );
}
```

---

## Workflow Steps

### Complete DigiPIN Processing Flow

1. **Validate Input**
   ```typescript
   if (!/^\d{10}$/.test(digipin)) {
     throw new Error('DigiPIN must be exactly 10 digits');
   }
   ```

2. **Decode DigiPIN**
   ```typescript
   const decoded = await decodeDigipin(digipin);
   // Returns: { code, latitude, longitude, accuracy }
   ```

3. **Reverse Geocode**
   ```typescript
   const geocoded = await reverseGeocode(decoded.latitude, decoded.longitude);
   // Returns: { formatted_address }
   ```

4. **Save Location (Optional)**
   ```typescript
   const savedId = await saveLocation({
     digipin: decoded.code,
     latitude: decoded.latitude,
     longitude: decoded.longitude,
     address: geocoded.formatted_address,
     accuracy: decoded.accuracy
   });
   // Returns: savedId or null
   ```

5. **Generate Map URLs**
   ```typescript
   const mapplsUrl = `https://mappls.com/?lat=${lat}&lng=${lon}&zoom=17`;
   const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
   ```

---

## Test Data

### Test DigiPIN: 2201450001

**Expected Output:**
```json
{
  "success": true,
  "data": {
    "code": "2201450001",
    "latitude": 19.073600,
    "longitude": 72.877700,
    "accuracy": 4,
    "address": "Main Gate, 123 Business Park, Mumbai, Maharashtra 400001, India",
    "savedId": "loc_abc123",
    "mapplsUrl": "https://mappls.com/?lat=19.073600&lng=72.877700&zoom=17",
    "googleMapsUrl": "https://www.google.com/maps?q=19.073600,72.877700"
  }
}
```

---

## Webhook Payload (for external integrations)

If you want to push decoded DigiPIN data to an external system:

**Endpoint:** `https://YOUR_FRONTEND_SERVER/api/kiro/webhook`

**Method:** POST

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{FRONTEND_SECRET}}
```

**Payload:**
```json
{
  "event": "digipin.decoded",
  "digipin": "2201450001",
  "latitude": 19.073600,
  "longitude": 72.877700,
  "address": "Main Gate, 123 Business Park, Mumbai, Maharashtra 400001, India",
  "accuracy": 4,
  "savedId": "loc_abc123",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

---

## Security Best Practices

1. **API Keys**
   - Never commit API keys to version control
   - Use environment variables for all keys
   - Rotate keys regularly

2. **Backend Authentication**
   - Use Bearer tokens for backend communication
   - Validate tokens on server side
   - Use HTTPS only

3. **Rate Limiting**
   - Cache decoded DigiPIN results (they're deterministic)
   - Implement client-side rate limiting
   - Use backend proxy for API calls if needed

4. **Data Privacy**
   - Don't log sensitive location data
   - Implement proper access controls
   - Follow GDPR/data protection regulations

---

## Error Handling

### Common Errors

**Invalid DigiPIN Format:**
```json
{
  "success": false,
  "error": "DigiPIN must be exactly 10 digits"
}
```

**Decode Failed:**
```json
{
  "success": false,
  "error": "Failed to decode DigiPIN: API returned 404"
}
```

**Geocoding Failed:**
```json
{
  "success": true,
  "data": {
    ...
    "address": "Address not available"
  }
}
```

**Save Failed (non-critical):**
```json
{
  "success": true,
  "data": {
    ...
    "savedId": null
  }
}
```

---

## Map Display Options

### Option 1: Mappls Embed
```html
<iframe
  src="https://apis.mappls.com/advancedmaps/v1/{{MAP_KEY}}/map_load?lat=19.073600&lng=72.877700&zoom=17"
  width="100%"
  height="400"
  frameborder="0"
></iframe>
```

### Option 2: Google Maps Embed
```html
<iframe
  src="https://www.google.com/maps/embed/v1/place?key={{GOOGLE_MAPS_KEY}}&q=19.073600,72.877700&zoom=17"
  width="100%"
  height="400"
  frameborder="0"
></iframe>
```

### Option 3: OpenStreetMap Embed
```html
<iframe
  src="https://www.openstreetmap.org/export/embed.html?bbox=72.867700,19.063600,72.887700,19.083600&layer=mapnik&marker=19.073600,72.877700"
  width="100%"
  height="400"
  frameborder="0"
></iframe>
```

---

## Firebase Integration (Optional)

If you want to save locations to Firebase:

```typescript
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';

export const saveLocationToFirebase = async (location: SavedLocation) => {
  try {
    const docRef = await addDoc(collection(db, 'locations'), {
      ...location,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving to Firebase:', error);
    return null;
  }
};
```

---

## Next Steps

1. Add DigiPIN decoder button to Work Order form
2. Create map view component for displaying locations
3. Add location history/cache
4. Implement batch DigiPIN processing
5. Add map markers for multiple posts
6. Create location picker with map interface

---

## Support

For DigiPIN API issues: https://digipin.org/support  
For Mappls API issues: https://www.mappls.com/api/support  
For OpenStreetMap issues: https://wiki.openstreetmap.org/wiki/Nominatim
