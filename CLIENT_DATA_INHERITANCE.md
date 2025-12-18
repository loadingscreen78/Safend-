# Client Data Inheritance System

## Overview
Complete data inheritance system that ensures client information flows correctly through all stages of the sales workflow: Lead → Quotation → Agreement → Work Order.

## Data Flow Architecture

### Stage 1: Lead (Starting Point)
**All client data originates here:**
- Personal Info: name, email, phone
- Company Info: companyName, address, city, state, pincode
- Business Details: securityNeeds, manpowerRequirements, siteInformation
- Sales Info: source, status, assignedTo, budget, targetStartDate

### Stage 2: Quotation (From Lead)
**Inherits from Lead:**
- `leadId` - Reference to original lead
- `client` - Lead name
- `companyName` - Lead company
- `contactPerson` - Lead name
- `contactEmail` - Lead email
- `contactPhone` - Lead phone
- `address`, `city`, `state`, `pincode` - Lead location
- `service` - Auto-generated from lead requirements

**New Fields:**
- `quotationId` - Custom ID (QT-2025-XXXX)
- `amount` - Quotation value
- `validUntil` - Expiry date
- Security service details, shift info, tax info

### Stage 3: Agreement (From Quotation)
**Inherits from Quotation:**
- `linkedQuoteId` - Reference to quotation
- `leadId` - Original lead reference
- `clientName` - From quotation.client
- `companyName` - From quotation
- `contactEmail`, `contactPhone` - From quotation
- `address`, `city`, `state`, `pincode` - From quotation
- `serviceDetails` - From quotation.service
- `value` - From quotation.amount

**New Fields:**
- `agreementId` - Custom ID (AG-2025-XXXX)
- `status` - Pending Signature / Signed / Cancelled
- `signedDate` - When agreement was signed

### Stage 4: Work Order (From Agreement)
**Inherits from Agreement:**
- `linkedAgreementId` - Reference to agreement
- `linkedQuoteId` - Reference to quotation
- `leadId` - Original lead reference
- `clientName` - From agreement
- `companyName` - From agreement
- `contactEmail`, `contactPhone` - From agreement
- `address`, `city`, `state`, `pincode` - From agreement
- `serviceDetails` - From agreement
- `value` - From agreement

**New Fields:**
- `workOrderId` - Custom ID (WO-2025-XXXX)
- `status` - In Progress / Completed / On Hold
- `startDate` - Service start date
- `completionDate` - Service completion date

## How to Use

### Creating Quotation from Lead

1. **Via Lead Actions Menu:**
   ```
   Leads Table → More Actions (⋮) → Create Quotation
   ```
   - Automatically fills all client details
   - Pre-populates contact information
   - Sets service based on lead requirements
   - Links back to original lead

2. **What Gets Inherited:**
   - ✅ Client name and company
   - ✅ Email and phone
   - ✅ Full address (street, city, state, pincode)
   - ✅ Lead ID for tracking
   - ✅ Service description

### Creating Agreement from Quotation

1. **Via Quotation Actions:**
   ```
   Quotations Table → Actions → Create Agreement
   ```
   - Inherits all quotation data
   - Maintains lead reference
   - Copies client contact details
   - Transfers service and value

2. **What Gets Inherited:**
   - ✅ All client information from quotation
   - ✅ Quotation ID reference
   - ✅ Original lead ID
   - ✅ Service details and amount
   - ✅ Contact information

### Creating Work Order from Agreement

1. **Via Agreement Actions:**
   ```
   Agreements Table → Actions → Create Work Order
   ```
   - Inherits all agreement data
   - Maintains quotation and lead references
   - Copies all client details
   - Transfers service scope and value

2. **What Gets Inherited:**
   - ✅ All client information
   - ✅ Agreement ID reference
   - ✅ Quotation ID reference
   - ✅ Original lead ID
   - ✅ Complete service details

## Data Structure Updates

### Updated Interfaces

#### Quotation Interface
```typescript
export interface Quotation {
  id?: string;
  quotationId?: string;
  leadId?: string;              // NEW: Link to lead
  client: string;
  companyName?: string;          // NEW: Company name
  service: string;
  amount?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;              // NEW: Full address
  city?: string;                 // NEW: City
  state?: string;                // NEW: State
  pincode?: string;              // NEW: Pincode
  // ... other fields
}
```

#### Agreement Interface
```typescript
export interface Agreement {
  id?: string;
  agreementId?: string;
  linkedQuoteId: string;
  leadId?: string;               // NEW: Original lead
  clientName: string;
  companyName?: string;          // NEW: Company name
  contactEmail?: string;         // NEW: Email
  contactPhone?: string;         // NEW: Phone
  address?: string;              // NEW: Address
  city?: string;                 // NEW: City
  state?: string;                // NEW: State
  pincode?: string;              // NEW: Pincode
  // ... other fields
}
```

#### Work Order Interface
```typescript
export interface WorkOrder {
  id?: string;
  workOrderId?: string;
  linkedAgreementId: string;
  linkedQuoteId?: string;        // NEW: Quotation reference
  leadId?: string;               // NEW: Original lead
  clientName: string;
  companyName?: string;          // NEW: Company name
  contactEmail?: string;         // NEW: Email
  contactPhone?: string;         // NEW: Phone
  address?: string;              // NEW: Address
  city?: string;                 // NEW: City
  state?: string;                // NEW: State
  pincode?: string;              // NEW: Pincode
  // ... other fields
}
```

## Benefits

### 1. Complete Data Continuity
- No manual re-entry of client information
- Consistent data across all stages
- Reduced errors and typos

### 2. Full Traceability
- Track from lead to work order
- See complete customer journey
- Audit trail for compliance

### 3. Efficient Workflow
- One-click conversions
- Auto-populated forms
- Faster processing

### 4. Better Reporting
- Link all transactions to original lead
- Calculate conversion rates
- Track lead source ROI

## Implementation Status

✅ **Completed:**
- Updated all data interfaces
- Added leadId tracking across all stages
- Added "Create Quotation" button to leads
- Implemented data inheritance for Lead → Quotation
- Added all client fields to quotation, agreement, and work order

🔄 **Next Steps:**
- Add "Create Agreement" button to quotations
- Add "Create Work Order" button to agreements
- Update forms to display inherited data
- Add visual indicators showing data source

## Testing the Flow

1. **Create a Lead** with complete information
2. **Click "Create Quotation"** from lead actions
3. **Verify** all client data is pre-filled
4. **Save Quotation** and check it has leadId
5. **Create Agreement** from quotation
6. **Verify** all data flows through
7. **Create Work Order** from agreement
8. **Confirm** complete data inheritance

## Notes

- All references (leadId, linkedQuoteId, linkedAgreementId) are preserved
- Client can update information at any stage
- Original lead data remains unchanged
- Each stage can add new information without affecting previous stages
