# Add Post to Work Order Feature

## Overview
Added an "Add Post" button in the Work Orders table that allows adding security posts directly to existing work orders, which then sync to Operations.

## Implementation

### 1. **Add Post Button in Work Orders Table**
- Location: Sales Module → Contracts Tab → Work Orders Table
- Icon: MapPin (blue color)
- Position: In the Actions column, next to Edit button
- Visible for all work orders

### 2. **Security Post Form Modal**
When clicking "Add Post":
- Opens a modal form
- Shows work order details (Client name, WO ID)
- Form fields:
  - Post Name (e.g., "Main Gate", "Building A")
  - Post Code (auto-generated)
  - Post Type (Permanent/Temporary)
  - Duty Type (8H/12H shifts)
  - Address (full location)
  - DigiPIN (format: XXX-XXX-XXXX with auto-formatting)
  - Staff Requirements:
    - Role (Security Guard, Supervisor, etc.)
    - Count (number of staff)
    - Shift name
    - Start/End times
    - Working days (Mon-Sun checkboxes)
  - Multiple shifts can be added

### 3. **Auto-Sync to Operations**
- Post is added to the work order
- Automatically syncs to Operations module
- Appears in Operations → Posts tab
- Grouped by client name
- Shows DigiPIN and decoded coordinates

## How to Use

### Adding a Post to Work Order:

1. **Go to Sales Module** → Contracts tab
2. **Find the work order** in the table
3. **Click the MapPin icon** (blue) in Actions column
4. **Fill in the form:**
   - Post name and code
   - Select post type and duty type
   - Enter address
   - Enter DigiPIN (auto-formats as you type)
   - Add staff requirements with shifts
   - Select working days
5. **Click "Create Post"**
6. **Post syncs to Operations** automatically

### Viewing in Operations:

1. **Go to Operations Module** → Posts tab
2. **Find the client** in the list
3. **Click to expand** client section
4. **See the new post** with all details including:
   - Post name and code
   - Address
   - DigiPIN
   - Decoded coordinates
   - Staff requirements
   - Work Order reference


## Technical Details

### Modified Components:

**1. WorkordersTable.tsx**
- Added MapPin icon button in Actions column
- Added state for post form modal
- Added handlers for opening/closing post form
- Integrated SecurityPostFormModal component

**2. SecurityPostFormModal.tsx**
- Updated to accept `workOrder` prop instead of `clients`
- Shows work order details at top of form
- Auto-populates client info from work order
- Syncs post to operations on submit
- Updates work order with new post

### Data Flow:

```
Work Orders Table
    ↓
Click "Add Post" (MapPin icon)
    ↓
SecurityPostFormModal opens
    ↓
Fill form with post details
    ↓
Submit → syncPostsFromWorkOrder()
    ↓
Post added to work order
    ↓
Auto-sync to Operations
    ↓
Appears in Operations Posts tab
```

### Key Features:

✅ **Contextual** - Add posts directly from work order
✅ **Client Info** - Auto-populated from work order
✅ **DigiPIN** - Auto-formatting (XXX-XXX-XXXX)
✅ **Multiple Shifts** - Add multiple staff requirements
✅ **Working Days** - Select specific days per shift
✅ **Auto-Sync** - Instant sync to Operations
✅ **Grouped Display** - Posts grouped by client in Operations

## Benefits

- **Streamlined Workflow** - Add posts without leaving work orders
- **Context Aware** - Client info automatically filled
- **Flexible** - Add multiple posts per work order
- **Real-time** - Instant sync to Operations
- **Complete Info** - All post details in one form
- **Easy Management** - Posts linked to work orders

## Future Enhancements

- Edit existing posts from work orders
- Delete posts from work orders
- View all posts for a work order
- Bulk post creation
- Post templates
- Copy posts between work orders
