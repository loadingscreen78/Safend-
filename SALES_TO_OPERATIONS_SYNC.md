# Sales to Operations Post Sync

## Overview

Automatic synchronization of security posts from Sales Work Orders to Operations module with DigiPIN location tracking.

## Data Flow

```
Sales Module (Work Order Form)
         ↓
   Enter Post Details
   - Post Name
   - DigiPIN (10 digits)
   - Address (auto-filled from DigiPIN)
   - Duty Type (8H/12H)
   - Staff Requirements
         ↓
   Save Work Order
         ↓
Firebase: operationalPosts collection
         ↓
Operations Module (Post Management)
   - List View: Shows all posts
   - Map View: Shows posts on map
```

## Features

### 1. Automatic Post Syncing

When you create/update a Work Order in Sales:
- All posts are automatically synced to Operations
- DigiPIN locations are decoded and stored
- Client information is preserved
- Staff requirements are transferred

### 2. Operations Module Display

**List View:**
- Client Name
- Post Code (e.g., P-2025-01)
- Post Name
- Address (from DigiPIN)
- Duty Type (8H/12H)
- Status (Active/Inactive/Pending)
- Required Staff count

**Map View:**
- Interactive map showing all post locations
- Markers with post details
- Click to view full post information
- Filter by client, status, duty type

### 3. DigiPIN Integration

**In Work Order Form:**
1. Enter 10-digit DigiPIN
2. Click "Show Map" button
3. Click "Decode" to get location
4. Address auto-fills
5. Map displays location
6. Save work order

**In Operations:**
- Posts appear with decoded locations
- Map view shows exact positions
- Address is searchable
- Location data is cached

## Database Structure

### operationalPosts Collection

```typescript
{
  id: string
  workOrderId: string
  postCode: string
  postName: string
  clientName: string
  companyName: string
  location: {
    address: string
    digipin: string
    latitude: number
    longitude: number
  }
  type: 'permanent' | 'temporary'
  dutyType: '8H' | '12H'
  status: 'active' | 'inactive' | 'pending'
  requiredStaff: [{
    role: string
    count: number
    shift: string
    startTime: string
    endTime: string
    days: string[]
  }]
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

## Usage Guide

### Creating Work Order with Posts

1. **Navigate:** Sales → Contracts → Create Work Order
2. **Fill Basic Info:**
   - Client name
   - Service details
   - Start date
   - Value

3. **Go to Posts Tab:**
   - Click "Add Post"
   - Enter Post Name (e.g., "Main Gate")
   - Enter DigiPIN (e.g., 2201450001)
   - Click "Show Map"
   - Click "Decode" to get address
   - Address auto-fills
   - Select Duty Type (8H or 12H)
   - Add Staff Requirements

4. **Add More Posts:** Repeat for each location

5. **Save Work Order:**
   - Posts automatically sync to Operations
   - Toast notification confirms sync

### Viewing Posts in Operations

1. **Navigate:** Operations → Posts
2. **List View:**
   - See all synced posts
   - Search by client, post name, or address
   - Filter by status or duty type
   - Click post to view details

3. **Map View:**
   - Toggle to Map View
   - See all posts on interactive map
   - Click markers for post details
   - Zoom and pan to explore

### Updating Posts

**From Sales:**
1. Edit Work Order
2. Update post details or DigiPIN
3. Save
4. Changes sync to Operations automatically

**From Operations:**
1. Click post in list
2. Edit details
3. Save
4. Updates reflected in Operations only

## Real-Time Sync

- **Instant Updates:** Changes appear immediately
- **No Refresh Needed:** Uses Firebase real-time listeners
- **Bi-directional:** Sales → Operations (automatic)
- **Status Updates:** Operations can update post status

## Example Workflow

### Scenario: New Client with 3 Posts

**Step 1: Create Work Order**
```
Client: Tech Solutions Pvt Ltd
Service: 24/7 Security Services
Start Date: 2025-02-01
```

**Step 2: Add Posts**

**Post 1: Main Gate**
- DigiPIN: 2201450001
- Address: Main Entrance, 123 Business Park, Mumbai
- Duty Type: 12H
- Staff: 2 Guards (Morning + Night shifts)

**Post 2: Building A**
- DigiPIN: 2201450002
- Address: Building A, 123 Business Park, Mumbai
- Duty Type: 8H
- Staff: 3 Guards (Day + Evening + Night shifts)

**Post 3: Parking Area**
- DigiPIN: 2201450003
- Address: Parking Lot, 123 Business Park, Mumbai
- Duty Type: 12H
- Staff: 1 Guard (Night shift only)

**Step 3: Save**
- Work Order saved
- 3 posts synced to Operations
- Toast: "Posts Synced - Security posts have been synced to Operations module"

**Step 4: View in Operations**
- Navigate to Operations → Posts
- See 3 new posts for Tech Solutions
- List shows: Client, Post Code, Address, Status
- Map shows: 3 markers at Business Park location

## Benefits

### For Sales Team
- ✅ Create posts once
- ✅ DigiPIN auto-fills address
- ✅ Visual map confirmation
- ✅ No manual data entry in Operations

### For Operations Team
- ✅ Instant post availability
- ✅ Complete client information
- ✅ Accurate locations with DigiPIN
- ✅ Map view for route planning
- ✅ Staff requirement details

### For Management
- ✅ Real-time visibility
- ✅ Accurate location tracking
- ✅ Reduced errors
- ✅ Faster deployment

## Troubleshooting

### Posts Not Appearing in Operations

**Check:**
1. Work Order saved successfully?
2. "Create Operational Posts" checkbox enabled?
3. Posts have valid DigiPIN?
4. Firebase connection active?

**Solution:**
- Re-save work order
- Check browser console for errors
- Verify Firebase rules allow writes

### DigiPIN Not Decoding

**Check:**
1. DigiPIN is exactly 10 digits?
2. Internet connection active?
3. Mappls API key configured?

**Solution:**
- Verify DigiPIN format
- Check .env file for VITE_MAPPLS_REST_KEY
- Try different DigiPIN

### Map Not Showing

**Check:**
1. Mappls API key valid?
2. Location has latitude/longitude?
3. Browser allows iframes?

**Solution:**
- Verify API key in .env
- Decode DigiPIN to get coordinates
- Check browser console for errors

## API Keys Required

```env
# Required for DigiPIN decoding and maps
VITE_MAPPLS_REST_KEY=your_mappls_rest_key
VITE_MAPPLS_MAP_KEY=your_mappls_map_key
```

## Firebase Collections

### operationalPosts
- Stores all synced posts
- Real-time updates
- Indexed by workOrderId, status, clientName

### workorders (Sales)
- Source of post data
- Contains posts array
- Links to operationalPosts

## Future Enhancements

- [ ] Batch post import
- [ ] Post templates
- [ ] Route optimization
- [ ] Attendance integration
- [ ] Mobile app sync
- [ ] Offline support
- [ ] Post analytics
- [ ] Client portal access
