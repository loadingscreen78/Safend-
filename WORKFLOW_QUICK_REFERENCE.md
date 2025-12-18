# Workflow Quick Reference Guide

## 🚀 Complete Sales Workflow

### Stage 1: Quotation
**Location:** Sales Module → Quotations Tab

1. Create a new quotation
2. Fill in client details and service information
3. Set status to "Pending" or "Draft"
4. Click **Approve** (✓ icon) to accept the quotation

**Result:** 
- Quotation status → "Accepted"
- Agreement automatically created with status "Pending Signature"

---

### Stage 2: Agreement
**Location:** Sales Module → Contracts Tab → Agreements Sub-tab

1. View the newly created agreement
2. Review agreement details
3. Click **Sign** (✓ icon) to sign the agreement

**Result:**
- Agreement status → "Signed"
- Work Order automatically created with status "Draft"

---

### Stage 3: Work Order
**Location:** Sales Module → Contracts Tab → Work Orders Sub-tab

1. View the newly created work order
2. Click **Start** (▶ icon) to begin work

**Result:**
- Work Order status → "In Progress"

3. When work is complete, click **Complete** (✓ icon)

**Result:**
- Work Order status → "Completed"

---

## 📊 Workflow Pipeline View

**Location:** Sales Module → Contracts Tab → Workflow View Sub-tab

### Visual Pipeline Stages

#### 🟡 Pending Agreements
- Shows agreements awaiting signature
- Status: "Pending Signature" or "Draft"
- Action: Edit Agreement

#### 🔵 Agreements Signed
- Shows signed agreements ready for work orders
- Status: "Signed"
- Action: Generate Work Order

#### 🟢 Active Contracts
- Shows work orders in progress
- Status: "In Progress"
- Action: View Work Order

---

## 🎯 Quick Actions

### From Quotations Tab
| Action | Button | Result |
|--------|--------|--------|
| Approve | ✓ (Green) | Creates Agreement |
| Reject | ✗ (Red) | Marks as Rejected |
| Edit | ✏️ | Opens edit form |
| Delete | 🗑️ | Removes quotation |

### From Agreements Tab
| Action | Button | Result |
|--------|--------|--------|
| Sign | ✓ (Green) | Creates Work Order |
| Edit | ✏️ | Opens edit form |
| Delete | 🗑️ | Removes agreement |

### From Work Orders Tab
| Action | Button | Result |
|--------|--------|--------|
| Start | ▶️ (Blue) | Status → In Progress |
| Complete | ✓ (Green) | Status → Completed |
| Cancel | ✗ (Red) | Status → Cancelled |
| Edit | ✏️ | Opens edit form |
| Delete | 🗑️ | Removes work order |

---

## 📈 Real-time Stats

### CRM Stats (Top of CRM Tab)
- **Total Leads:** All contacts made
- **Opportunities:** Current pipeline
- **Active Clients:** With ongoing contracts
- **Conversion Rate:** Qualified ÷ Contacts Made

### Workflow Stats (Top of Contracts Tab)
- **Pending Agreements:** Awaiting signature
- **Agreements Signed:** Ready for work orders
- **Active Contracts:** Service delivery
- **Total Value:** Sum of all active contracts

---

## 🔄 Automatic Linking

The system automatically maintains relationships:

```
Quotation (QT-001)
    ↓ (Approve)
Agreement (AG-001)
    linkedQuoteId: QT-001
    ↓ (Sign)
Work Order (WO-001)
    linkedAgreementId: AG-001
```

---

## 🔍 Filtering & Search

### Filter Options

**Quotations Tab:**
- All Quotations
- Draft
- Sent
- Revised
- Accepted
- Rejected

**Contracts Tab:**
- All Contracts
- Pending Agreement
- Agreement Signed
- Work Order Created
- Active
- Completed

**Agreements Sub-tab:**
- All Agreements
- Draft
- Pending Signature
- Signed
- Active
- Expired
- Terminated

**Work Orders Sub-tab:**
- All Work Orders
- Draft
- Scheduled
- In Progress
- Completed
- On Hold
- Cancelled

### Search
Use the search bar to find records by:
- Client name
- Service details
- Reference IDs
- Any text field

---

## ⚡ Real-time Updates

All changes are synchronized in real-time:
- No page refresh needed
- Updates appear instantly across all tabs
- Multiple users see changes immediately

---

## 🎨 Status Colors

### Quotations
- 🟡 **Yellow:** Draft, Pending, Sent
- 🟢 **Green:** Accepted
- 🔴 **Red:** Rejected
- 🔵 **Blue:** Revised

### Agreements
- ⚪ **Gray:** Draft, Pending Signature
- 🟢 **Green:** Signed
- 🔴 **Red:** Active
- ⚫ **Black:** Terminated

### Work Orders
- ⚪ **Gray:** Draft
- 🔵 **Blue:** Scheduled
- 🟡 **Amber:** In Progress
- 🟢 **Green:** Completed
- 🟠 **Orange:** On Hold
- 🔴 **Red:** Cancelled

---

## 💡 Tips

1. **Always approve quotations** before creating agreements manually
2. **Sign agreements** to automatically generate work orders
3. **Use the Workflow View** to see the complete pipeline at a glance
4. **Filter by status** to focus on specific stages
5. **Search across all fields** to quickly find records
6. **Watch the stats cards** for real-time metrics

---

## 🆘 Troubleshooting

### Agreement not created after approving quotation?
- Check that quotation has a valid Firebase ID
- Ensure quotation status changed to "Accepted"
- Check browser console for errors

### Work order not created after signing agreement?
- Verify agreement status changed to "Signed"
- Check that agreement has valid data
- Look for error toasts

### Stats not updating?
- Refresh the page
- Check Firebase connection
- Verify data exists in Firestore

---

## 📱 Mobile Responsive

All tables and views are mobile-responsive:
- Tables hide less important columns on small screens
- Action buttons remain accessible
- Stats cards stack vertically
- Workflow pipeline adapts to screen size

---

**Last Updated:** November 10, 2025
**Version:** 2.0 - Full Firebase Integration
