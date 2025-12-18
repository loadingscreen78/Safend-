# 🎯 Sales Module - Firebase Integration Plan

## Current Status

### Module Structure ✅
The Sales module has a well-organized structure with:
- **Main Module**: `SalesModule.tsx`
- **6 Main Tabs**:
  1. Client Management (CRM)
  2. Quotations
  3. Contracts/Agreements
  4. Collections (Aging Invoices)
  5. Reports
  6. Unified Calendar

### Current Data Storage
- **localStorage** - Currently using browser localStorage for demo
- **No Firebase Integration** - Needs to be connected to Firebase Firestore

## Sales Module Features

### 1. Client Management (CRM)
**Components:**
- `LeadsTable.tsx` - Display all leads
- `LeadForm.tsx` - Create/Edit leads
- `ClientProfile.tsx` - View client details
- `ContactsTable.tsx` - Manage contacts
- `ContactForm.tsx` - Add/Edit contacts
- `FollowupsTable.tsx` - Track follow-ups
- `FollowupForm.tsx` - Schedule follow-ups

**Data Models:**
- Leads (with security needs, manpower requirements, site information)
- Contacts
- Follow-ups

**Filters:**
- All Clients
- New Leads
- Qualified Leads
- Opportunities
- Existing Clients
- Inactive Clients

### 2. Quotations
**Components:**
- `QuotationsTable.tsx` - Display quotations
- `QuotationForm.tsx` - Create/Edit quotations
- `QuotationStatusBadge.tsx` - Status indicators
- `QuotationActionButtons.tsx` - Actions (Send, Revise, Accept, Reject)

**Data Models:**
- Quotations (linked to leads/clients)
- Line items
- Terms and conditions

**Filters:**
- All Quotations
- Draft
- Sent
- Revised
- Accepted
- Rejected

### 3. Contracts/Agreements
**Components:**
- `ContractsManagement.tsx` - Main contracts view
- `AgreementsTable.tsx` - Display agreements
- `AgreementForm.tsx` - Create/Edit agreements
- `WorkordersTable.tsx` - Display work orders
- `WorkorderForm.tsx` - Create/Edit work orders

**Data Models:**
- Agreements (contract details, terms, pricing)
- Work Orders (deployment details)

**Filters:**
- All Contracts
- Pending Agreement
- Agreement Signed
- Work Order Created
- Active
- Completed

### 4. Collections (Aging Invoices)
**Components:**
- `AgingInvoicesTable.tsx` - Display invoices
- `AgingInvoiceForm.tsx` - Create/Edit invoices
- Collections tracking

**Data Models:**
- Invoices
- Payment tracking
- Aging analysis

**Filters:**
- All Invoices
- 0-30 Days
- 31-60 Days
- 61-90 Days
- 90+ Days

### 5. Reports
**Components:**
- `SalesReportView.tsx` - Main reports view
- Various report components in `reports/` folder

**Report Types:**
- Sales Performance
- Revenue Analysis
- Pipeline Status
- Conversion Rate
- Activity Reports

### 6. Unified Calendar
**Components:**
- Calendar components in `calendar/` folder
- Event management
- Multi-module event integration

**Event Types:**
- Sales Meetings
- Site Visits
- Contract Deadlines
- Follow-up reminders

## Firebase Integration Plan

### Phase 1: Client Management (CRM) 🎯
**Priority: HIGH**

#### Collections to Create:
1. **`leads`** - Store all lead information
   ```typescript
   {
     id: string,
     name: string,
     companyName: string,
     email: string,
     phone: string,
     address: string,
     city: string,
     state: string,
     pincode: string,
     source: string,
     status: string,
     assignedTo: string,
     securityNeeds: {...},
     manpowerRequirements: {...},
     siteInformation: {...},
     budget: string,
     targetStartDate: string,
     urgency: string,
     notes: string,
     createdAt: Timestamp,
     updatedAt: Timestamp,
     createdBy: string,
     branchId: string
   }
   ```

2. **`contacts`** - Store contact information
   ```typescript
   {
     id: string,
     leadId: string,
     name: string,
     designation: string,
     email: string,
     phone: string,
     isPrimary: boolean,
     createdAt: Timestamp,
     updatedAt: Timestamp
   }
   ```

3. **`followups`** - Track follow-up activities
   ```typescript
   {
     id: string,
     leadId: string,
     type: string,
     date: Timestamp,
     notes: string,
     status: string,
     assignedTo: string,
     createdAt: Timestamp,
     updatedAt: Timestamp
   }
   ```

#### Files to Update:
- ✅ Create `src/services/firebase/LeadFirebaseService.ts`
- ✅ Create `src/services/firebase/ContactFirebaseService.ts`
- ✅ Create `src/services/firebase/FollowupFirebaseService.ts`
- ✅ Update `LeadForm.tsx` to use Firebase
- ✅ Update `LeadsTable.tsx` to load from Firebase
- ✅ Update `ContactForm.tsx` to use Firebase
- ✅ Update `FollowupForm.tsx` to use Firebase

### Phase 2: Quotations 📄
**Priority: HIGH**

#### Collections to Create:
1. **`quotations`** - Store quotation data
   ```typescript
   {
     id: string,
     quotationNumber: string,
     leadId: string,
     clientName: string,
     date: Timestamp,
     validUntil: Timestamp,
     status: string,
     items: array,
     subtotal: number,
     tax: number,
     total: number,
     terms: string,
     notes: string,
     createdAt: Timestamp,
     updatedAt: Timestamp,
     createdBy: string
   }
   ```

#### Files to Update:
- ✅ Create `src/services/firebase/QuotationFirebaseService.ts`
- ✅ Update `QuotationForm.tsx`
- ✅ Update `QuotationsTable.tsx`

### Phase 3: Contracts/Agreements 📋
**Priority: MEDIUM**

#### Collections to Create:
1. **`agreements`** - Store agreement data
2. **`workOrders`** - Store work order data

#### Files to Update:
- ✅ Create `src/services/firebase/AgreementFirebaseService.ts`
- ✅ Create `src/services/firebase/WorkOrderFirebaseService.ts`
- ✅ Update `AgreementForm.tsx`
- ✅ Update `WorkorderForm.tsx`

### Phase 4: Collections/Invoices 💰
**Priority: MEDIUM**

#### Collections to Create:
1. **`invoices`** - Store invoice data
2. **`payments`** - Track payments

#### Files to Update:
- ✅ Create `src/services/firebase/InvoiceFirebaseService.ts`
- ✅ Update `AgingInvoiceForm.tsx`
- ✅ Update `AgingInvoicesTable.tsx`

### Phase 5: Reports & Analytics 📊
**Priority: LOW**

#### Implementation:
- Query Firebase collections for report data
- Aggregate data for analytics
- Generate charts and visualizations

## Implementation Steps

### Step 1: Setup Firebase Collections
1. Create Firestore collections
2. Set up security rules
3. Create indexes for queries

### Step 2: Create Firebase Services
1. Lead Management Service
2. Contact Management Service
3. Follow-up Management Service
4. Quotation Service
5. Agreement Service
6. Work Order Service
7. Invoice Service

### Step 3: Update Components
1. Replace localStorage with Firebase calls
2. Add loading states
3. Add error handling
4. Add real-time updates

### Step 4: Add Audit Logging
1. Log lead creation/updates
2. Log quotation actions
3. Log agreement signing
4. Log payment tracking

### Step 5: Testing
1. Test CRUD operations
2. Test filters and search
3. Test data relationships
4. Test permissions

## Security Rules

```javascript
// Firestore Security Rules for Sales Module

// Leads
match /leads/{leadId} {
  allow read: if request.auth != null && 
              (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin', 'sales']));
  allow create, update: if request.auth != null && 
                           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin', 'sales']);
  allow delete: if request.auth != null && 
                   get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin']);
}

// Quotations
match /quotations/{quotationId} {
  allow read: if request.auth != null && 
              get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin', 'sales', 'accounts']);
  allow create, update: if request.auth != null && 
                           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin', 'sales']);
  allow delete: if request.auth != null && 
                   get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(['admin']);
}

// Similar rules for agreements, workOrders, invoices, etc.
```

## Next Steps

1. **Start with CRM (Client Management)**
   - Most critical for sales operations
   - Foundation for other modules
   - High user impact

2. **Then Quotations**
   - Directly linked to leads
   - Important for sales pipeline

3. **Then Contracts**
   - Follows quotations
   - Critical for operations handoff

4. **Then Collections**
   - Financial tracking
   - Important for cash flow

5. **Finally Reports**
   - Analytics and insights
   - Depends on all other data

## Benefits of Firebase Integration

✅ **Real-time Updates** - Multiple users see changes instantly
✅ **Data Persistence** - No data loss on page refresh
✅ **Scalability** - Handle growing data volumes
✅ **Security** - Role-based access control
✅ **Backup** - Automatic data backup
✅ **Multi-device** - Access from anywhere
✅ **Audit Trail** - Track all changes
✅ **Search** - Powerful query capabilities

## Estimated Timeline

- **Phase 1 (CRM)**: 2-3 days
- **Phase 2 (Quotations)**: 1-2 days
- **Phase 3 (Contracts)**: 1-2 days
- **Phase 4 (Collections)**: 1-2 days
- **Phase 5 (Reports)**: 1-2 days
- **Testing & Polish**: 1-2 days

**Total**: 7-13 days

## Ready to Start?

Let's begin with **Phase 1: Client Management (CRM)**!

This includes:
1. Creating Firebase services for Leads, Contacts, and Follow-ups
2. Updating forms to save to Firebase
3. Updating tables to load from Firebase
4. Adding real-time updates
5. Adding audit logging

Shall we start? 🚀
