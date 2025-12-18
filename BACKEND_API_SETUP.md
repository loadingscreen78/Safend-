# Backend API Setup - DigiPIN Decode

## Quick Start

### 1. Install Backend Dependencies
```bash
cd "Jagannath project/lovable-project-513c5e73/server"
npm install
```

### 2. Start Backend Server
```bash
npm start
```

You should see:
```
🚀 DigiPIN API server running on http://localhost:3001
📍 Endpoint: http://localhost:3001/api/digipin/decode?digipin=4P3-JK8-52C9
💚 Health check: http://localhost:3001/health
```

### 3. Start Frontend (in another terminal)
```bash
cd "Jagannath project/lovable-project-513c5e73"
npm run dev
```

### 4. Test It!
1. Go to Sales → Work Orders
2. Click MapPin icon
3. Enter DigiPIN: `4P3-JK8-52C9`
4. Submit
5. Check Operations → Posts for coordinates!

## How It Works

### Backend Server
- **Port:** 3001
- **Endpoint:** `GET /api/digipin/decode?digipin={DIGIPIN}`
- **Location:** `server/index.js`

### API Flow
```
Frontend (port 8080)
    ↓
Vite Proxy (/api → localhost:3001)
    ↓
Backend Server (port 3001)
    ↓
Try India Post API
    ↓
If fails → Use fallback algorithm
    ↓
Return coordinates
```

### Response Format
```json
{
  "latitude": 28.613900,
  "longitude": 77.209000,
  "accuracy": 10,
  "source": "india_post" // or "fallback"
}
```

## Testing

### Test Backend Directly
```bash
# Health check
curl http://localhost:3001/health

# Decode DigiPIN
curl "http://localhost:3001/api/digipin/decode?digipin=4P3-JK8-52C9"
```

### Test Through Frontend
```bash
# Frontend proxies /api to backend
curl "http://localhost:8080/api/digipin/decode?digipin=4P3-JK8-52C9"
```

## Development

### Run with Auto-Reload
```bash
cd server
npm run dev
```

### Check Logs
Backend logs show:
- `📍 DigiPIN decode request: 4P3-JK8-52C9`
- `🔍 Calling India Post API: ...`
- `✅ India Post API success` OR `⚠️ India Post API failed`
- `🔄 Using fallback algorithm`
- `✅ Generated coordinates: Lat X, Lng Y`

## Troubleshooting

### Backend not starting?
```bash
# Check if port 3001 is in use
netstat -ano | findstr :3001

# Kill process if needed
taskkill /PID <PID> /F

# Try again
cd server
npm start
```

### Frontend can't reach backend?
1. Check backend is running on port 3001
2. Check vite.config.ts has proxy configured
3. Restart frontend dev server

### Still getting 404?
1. Check backend logs for requests
2. Test backend directly: `curl http://localhost:3001/health`
3. Check browser console for errors

## Production Deployment

### Option 1: Deploy Backend Separately
Deploy `server/` folder to:
- Heroku
- Railway
- Render
- AWS Lambda

Update frontend to use production URL:
```typescript
// src/services/digipin/DigipinService.ts
const API_URL = import.meta.env.VITE_API_URL || '';
const response = await fetch(`${API_URL}/api/digipin/decode?digipin=${digipin}`);
```

Add to `.env.production`:
```
VITE_API_URL=https://your-backend.herokuapp.com
```

### Option 2: Use Firebase Cloud Functions
See `DIGIPIN_BACKEND_SETUP.md` for Firebase setup.

### Option 3: Use Serverless
Deploy as AWS Lambda, Vercel Function, or Netlify Function.

## File Structure
```
Jagannath project/lovable-project-513c5e73/
├── server/
│   ├── index.js          # Backend API server
│   ├── package.json      # Backend dependencies
│   └── node_modules/     # (after npm install)
├── src/
│   └── services/
│       └── digipin/
│           └── DigipinService.ts  # Frontend API client
└── vite.config.ts        # Proxy configuration
```

## API Endpoints

### GET /api/digipin/decode
**Query Parameters:**
- `digipin` (required): DigiPIN code (e.g., `4P3-JK8-52C9`)

**Success Response (200):**
```json
{
  "latitude": 28.613900,
  "longitude": 77.209000,
  "accuracy": 10,
  "source": "india_post"
}
```

**Error Response (400):**
```json
{
  "error": "Invalid DigiPIN format. Expected: XXX-XXX-XXXX"
}
```

### GET /health
**Success Response (200):**
```json
{
  "status": "ok",
  "message": "DigiPIN API server is running"
}
```

## Status
✅ Backend server created
✅ API endpoint implemented
✅ Vite proxy configured
✅ Fallback algorithm included
🔄 Ready to start!

## Next Steps
1. Run `cd server && npm install`
2. Run `npm start` in server folder
3. Run `npm run dev` in main folder
4. Test creating a post with DigiPIN!
