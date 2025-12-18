# Custom Quotation IDs - Implementation Guide

## ✅ Feature Enabled

You can now use custom quotation IDs like `QT-2025-1234` instead of Firebase auto-generated IDs!

## How It Works

### Automatic ID Generation
When you create a new quotation, the system automatically generates a custom ID in the format:
```
QT-YYYY-NNNN
```
Where:
- `QT` = Quotation prefix
- `YYYY` = Current year (e.g., 2025)
- `NNNN` = Random 4-digit number (e.g., 1234)

**Example:** `QT-2025-7892`

### Custom ID Entry
You can also **edit the ID** before saving:
1. Open the quotation form
2. See the "Quote ID" field at the top
3. Edit it to your preferred format
4. Click Save

### ID Rules
- ✅ Can use any format you want (e.g., `QT-2025-001`, `QUOTE-123`, `SF-2025-ABC`)
- ✅ Must be unique (system will check)
- ✅ Cannot be changed after creation
- ✅ Stored as the Firebase document ID

## Creating a Quotation

### Step 1: Open Form
Click **"Create New Quotation"** button

### Step 2: Review/Edit ID
- Auto-generated ID appears in "Quote ID" field
- **Editable** - Change it if you want
- Format suggestion: `QT-YYYY-NNNN`

### Step 3: Fill Details
- Client Name *
- Service Details *
- Contact Information
- Security Services
- Locations
- Terms & Conditions

### Step 4: Save
Click **"Save"** button
- System checks if ID already exists
- If unique: Creates quotation with your custom ID
- If duplicate: Shows error message

## Editing a Quotation

### ID Field Behavior
- **New Quotation:** ID is editable
- **Existing Quotation:** ID is locked (disabled field)
- **Reason:** Firebase document IDs cannot be changed after creation

### To Change an Existing ID
1. Delete the old quotation
2. Create a new one with the desired ID
3. Copy over the details

## Firebase Storage

### Document Structure
```
/quotations/{customId}
  - id: "QT-2025-1234" (same as document ID)
  - client: "Client Name"
  - service: "Service Details"
  - amount: "₹50,000"
  - status: "Pending"
  - createdAt: Timestamp
  - updatedAt: Timestamp
```

### Custom ID as Document ID
Your custom ID (e.g., `QT-2025-1234`) becomes the Firebase document ID, which means:
- ✅ Easy to reference
- ✅ Human-readable
- ✅ Searchable
- ✅ Unique by design

## Duplicate ID Prevention

### Automatic Check
When saving a quotation, the system:
1. Checks if the ID already exists in Firebase
2. If exists: Shows error message
3. If unique: Creates the document

### Error Message
```
Quotation ID QT-2025-1234 already exists. 
Please use a different ID.
```

### Solution
- Change the ID to a unique value
- Or delete the existing quotation first

## ID Format Examples

### Standard Format
```
QT-2025-1234
QT-2025-5678
QT-2025-9012
```

### Custom Formats (All Valid)
```
QUOTE-001
SF-2025-ABC
Q-2025-JAN-001
SAFEND-2025-123
2025-QT-001
```

### Best Practices
- Use a consistent format across your organization
- Include year for easy sorting
- Use sequential numbers for tracking
- Keep it short and readable

## Workflow Integration

### Quotation → Agreement → Work Order
When you approve a quotation:
1. Quotation status → "Accepted"
2. Agreement created with `linkedQuoteId: "QT-2025-1234"`
3. Agreement can reference the custom quotation ID
4. Work Order can trace back to original quotation

### Traceability
```
Quotation: QT-2025-1234
    ↓
Agreement: AG-2025-5678
    linkedQuoteId: "QT-2025-1234"
    ↓
Work Order: WO-2025-9012
    linkedAgreementId: "AG-2025-5678"
```

## API Changes

### QuotationFirebaseService.ts

**addQuotation Function:**
```typescript
// Now accepts custom ID
export const addQuotation = async (quotation: Omit<Quotation, 'id'> & { id?: string }) => {
  if (quotation.id) {
    // Use custom ID with setDoc
    const customDocRef = doc(db, COLLECTION_NAME, quotation.id);
    
    // Check if exists
    const docSnap = await getDoc(customDocRef);
    if (docSnap.exists()) {
      return { success: false, error: "ID already exists" };
    }
    
    await setDoc(customDocRef, quotationData);
    return { success: true, id: quotation.id };
  } else {
    // Auto-generate ID with addDoc
    const docRef = await addDoc(collection(db, COLLECTION_NAME), quotationData);
    return { success: true, id: docRef.id };
  }
};
```

## Testing

### Test 1: Auto-Generated ID
1. Create new quotation
2. Don't edit the ID field
3. Save
4. ✅ Should create with format `QT-2025-NNNN`

### Test 2: Custom ID
1. Create new quotation
2. Change ID to `CUSTOM-001`
3. Save
4. ✅ Should create with ID `CUSTOM-001`

### Test 3: Duplicate ID
1. Create quotation with ID `TEST-001`
2. Save successfully
3. Create another quotation with ID `TEST-001`
4. Try to save
5. ✅ Should show error: "ID already exists"

### Test 4: Edit Existing
1. Open existing quotation
2. Try to edit ID field
3. ✅ Field should be disabled
4. ✅ Shows message: "ID cannot be changed after creation"

### Test 5: Approve Workflow
1. Create quotation with custom ID `QT-2025-TEST`
2. Save
3. Click Approve (✓)
4. ✅ Should create agreement
5. ✅ Agreement should have `linkedQuoteId: "QT-2025-TEST"`

## Migration from Old System

### If You Have Old Quotations
Old quotations with Firebase auto-generated IDs (20+ character strings) will continue to work normally.

### Mixed System
You can have both:
- Old quotations: `8xK2mP9nQ7vR5tL3wH1j` (Firebase ID)
- New quotations: `QT-2025-1234` (Custom ID)

Both work perfectly in the system!

## Benefits

### 1. Human-Readable
- Easy to communicate: "Check quotation QT-2025-1234"
- Easy to remember
- Easy to reference in emails/calls

### 2. Sequential Tracking
- Use sequential numbers: QT-2025-001, QT-2025-002, etc.
- Easy to count total quotations
- Easy to identify missing quotations

### 3. Organizational Structure
- Include department codes: `SALES-2025-001`
- Include location codes: `MUM-2025-001`
- Include client codes: `ABC-2025-001`

### 4. Year-Based Organization
- Easy to filter by year
- Easy to archive old quotations
- Easy to generate annual reports

## Troubleshooting

### Error: "ID already exists"
**Solution:** Change the ID to a unique value

### Error: "Cannot approve quotation"
**Solution:** Make sure quotation is saved in Firebase first

### ID field is disabled
**Reason:** You're editing an existing quotation
**Solution:** IDs cannot be changed after creation

### Want to change an existing ID
**Solution:** Delete and recreate the quotation

## Summary

✅ Custom quotation IDs enabled
✅ Auto-generation with format `QT-YYYY-NNNN`
✅ Editable before saving
✅ Locked after creation
✅ Duplicate prevention
✅ Full workflow integration
✅ Backward compatible with old IDs

**You now have complete control over your quotation IDs!**

---

**Date:** November 10, 2025  
**Version:** 2.3 - Custom Quotation IDs
**Server:** http://localhost:8081/
