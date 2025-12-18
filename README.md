# Security Services Management System

## Project Overview

A comprehensive enterprise resource planning (ERP) system designed specifically for security services companies. This system manages the complete business lifecycle from lead generation to service delivery, with integrated modules for sales, operations, HR, accounts, and administration.

## Core Business Domain

**Industry:** Private Security Services  
**Primary Services:**
- Armed and Unarmed Security Guards
- Supervisors and Patrol Officers
- Personal Security Officers (PSO)
- Event Security
- Site Security Management

## System Architecture

### Technology Stack
- **Frontend:** React + TypeScript + Vite
- **UI Framework:** Shadcn/ui + Tailwind CSS
- **Backend:** Firebase (Firestore Database, Authentication)
- **State Management:** React Hooks
- **Document Generation:** pdfmake
- **Routing:** React Router

### Key Modules

#### 1. Sales Management Module
Complete CRM and sales pipeline management system.

**Features:**
- Lead Management with detailed client information
- Quotation generation with custom IDs (QT-2025-XXXX)
- Agreement/Contract management
- Work Order creation and tracking
- Follow-up scheduling with calendar integration
- Client communication (Email, Call, Meeting scheduling)

**Data Flow:**
```
Lead → Quotation → Agreement → Work Order
```

**Client Data Inheritance:**
All client information (name, company, email, phone, address, city, state, pincode) automatically flows through each stage, eliminating manual re-entry.

#### 2. Operations Module
Field operations and security post management.

**Features:**
- Security Post Management with DigiPin location codes
- Staff deployment and scheduling
- Shift management (8-hour and 12-hour shifts)
- Attendance tracking
- Real-time post monitoring

#### 3. HR Module
Human resource management for security personnel.

**Features:**
- Employee onboarding and records
- Training and certification tracking
- Leave management
- Performance evaluation
- Payroll integration

#### 4. Accounts Module
Financial management and billing.

**Features:**
- Invoice generation
- Payment tracking
- Aging invoice management
- GST compliance
- Financial reporting

#### 5. Admin Module
System administration and configuration.

**Features:**
- User management
- Role-based access control
- System settings
- Audit logs

## Key Features Explained

### 1. DigiPin Location System

**What is DigiPin?**
A 10-digit numeric code used to uniquely identify security post locations.

**Purpose:**
- Precise location identification without GPS coordinates
- Easy to communicate and remember
- Standardized across the organization
- Used for post assignment and tracking

**How to Use DigiPin:**

When creating a Work Order, each security post requires a DigiPin:

1. **Navigate to:** Sales Module → Contracts → Create Work Order
2. **Go to:** Posts Tab
3. **For each post, enter:**
   - Post Name (e.g., "Main Gate", "Building A Entrance")
   - Post Address (full street address)
   - **DigiPin:** Enter exactly 10 digits (e.g., 1234567890)

**DigiPin Field Validation:**
- Must be exactly 10 digits
- Only numeric characters allowed
- Automatically filters out non-numeric input
- Required for post identification in operations

**Example DigiPin Entry:**
```
Post Name: Main Gate Security
Post Address: 123 Business Park, Sector 5, Mumbai
DigiPin: 2201450001
         ^^^^^^^^^^
         10 digits - uniquely identifies this location
```

**DigiPin Format Recommendation:**
- First 2 digits: City code (e.g., 22 for Mumbai)
- Next 2 digits: Area code (e.g., 01 for Sector 1)
- Next 2 digits: Building/Complex code (e.g., 45 for Building 45)
- Last 4 digits: Specific post number (e.g., 0001 for first post)

### 2. Shift Management System

**8-Hour Shifts:**
- Available shifts: Day, Night, Evening, Morning
- Maximum 3 shifts per day
- Flexible scheduling for all shift types

**12-Hour Shifts:**
- Available shifts: Morning, Night ONLY
- Maximum 2 shifts per day (Morning: 6 AM - 6 PM, Night: 6 PM - 6 AM)
- Automatically restricts shift options when 12H duty type is selected

**Shift Selection Logic:**
When creating a Work Order:
1. Select Duty Type (8-Hour or 12-Hour)
2. Shift dropdown automatically adjusts available options
3. For 12H: Only Morning and Night shifts are shown
4. For 8H: All four shift options are available

### 3. Quotation System

**Custom Quotation IDs:**
Format: `QT-YYYY-XXXX`
- QT: Quotation prefix
- YYYY: Current year
- XXXX: Random 4-digit number

**Quotation Features:**
- Multi-tab form (Basic Info, Services, Locations, Terms & Tax)
- Security service breakdown (Unarmed Guards, Armed Guards, Supervisors, Patrol Officers)
- Shift type selection with automatic validation
- GST calculation and compliance
- PDF export with company branding
- Valid until date tracking

### 4. Client Data Inheritance

**Automatic Data Flow:**

When you create a quotation from a lead:
```javascript
Lead Data:
- Name: Rajesh Kumar
- Company: Tech Solutions Pvt Ltd
- Email: rajesh@techsolutions.com
- Phone: +91 98765 43210
- Address: 123 Business Park
- City: Mumbai
- State: Maharashtra
- Pincode: 400001

↓ Click "Create Quotation" ↓

Quotation Form Auto-fills:
- Client: Rajesh Kumar
- Company Name: Tech Solutions Pvt Ltd
- Contact Email: rajesh@techsolutions.com
- Contact Phone: +91 98765 43210
- Address: 123 Business Park
- City: Mumbai
- State: Maharashtra
- Pincode: 400001
```

**Benefits:**
- Zero manual data entry
- Consistent information across all stages
- Reduced errors and typos
- Complete audit trail from lead to work order

### 5. Unified Calendar Integration

**Calendar Sources:**
The unified calendar automatically aggregates events from:

1. **Leads:** Target start dates
2. **Followups:** Scheduled calls, meetings, emails, site visits
3. **Quotations:** Validity deadlines
4. **Agreements:** Signing dates
5. **Work Orders:** Service start and completion dates
6. **Manual Events:** Custom calendar entries

**Automatic Event Creation:**
When you schedule a followup, the system automatically:
- Creates a calendar event
- Sets 1-hour duration
- Adds client as attendee
- Syncs in real-time
- Updates on changes
- Removes on deletion

### 6. Document Export System

**PDF Generation:**
- Quotations with detailed service breakdown
- Agreements with terms and conditions
- Work Orders with post details
- Professional formatting with company branding

**Export Features:**
- Download as PDF
- Preview before download
- Email directly to client
- Automatic file naming

## Workflow Examples

### Complete Sales Workflow

**Step 1: Lead Creation**
```
Navigate: Sales → CRM → Add Lead
Fill in:
- Client name and company
- Contact details (email, phone)
- Full address (street, city, state, pincode)
- Security requirements
- Budget and timeline
```

**Step 2: Lead to Quotation**
```
Action: Click "Create Quotation" from lead actions menu
Result: Quotation form opens with all client data pre-filled
Add:
- Service details
- Security personnel requirements
- Shift type (8H or 12H)
- Pricing and rates
- GST information
```

**Step 3: Quotation to Agreement**
```
Action: Accept quotation → Create Agreement
Result: Agreement form with inherited data
Add:
- Contract terms
- Payment schedule
- Service level agreements
```

**Step 4: Agreement to Work Order**
```
Action: Sign agreement → Create Work Order
Result: Work Order form with complete client data
Add:
- Security posts with DigiPin codes
- Staff requirements per post
- Shift schedules
- Duty types
```

### Work Order Creation Example

**Scenario:** Deploy security at a corporate office

```
Client: Tech Solutions Pvt Ltd
Service Period: 01-Jan-2025 to 31-Dec-2025

Post 1: Main Gate
- DigiPin: 2201450001
- Address: Main Entrance, 123 Business Park, Mumbai
- Duty Type: 12-Hour Shift
- Staff: 2 Security Guards
  - Morning Shift: 06:00 - 18:00 (1 guard)
  - Night Shift: 18:00 - 06:00 (1 guard)
- Working Days: Mon-Sun

Post 2: Building A Entrance
- DigiPin: 2201450002
- Address: Building A, 123 Business Park, Mumbai
- Duty Type: 8-Hour Shift
- Staff: 3 Security Guards
  - Day Shift: 06:00 - 14:00 (1 guard)
  - Evening Shift: 14:00 - 22:00 (1 guard)
  - Night Shift: 22:00 - 06:00 (1 guard)
- Working Days: Mon-Fri
```

## Database Structure

### Firebase Collections

**leads**
```typescript
{
  id: string
  name: string
  companyName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  source: string
  status: string
  securityNeeds: object
  manpowerRequirements: object
  siteInformation: object
  budget: string
  targetStartDate: string
  createdAt: Timestamp
}
```

**quotations**
```typescript
{
  id: string
  quotationId: string
  leadId: string
  client: string
  companyName: string
  contactEmail: string
  contactPhone: string
  address: string
  city: string
  state: string
  pincode: string
  service: string
  amount: string
  status: string
  validUntil: string
  shiftType: '8H' | '12H'
  shiftCount: number
  createdAt: Timestamp
}
```

**agreements**
```typescript
{
  id: string
  agreementId: string
  linkedQuoteId: string
  leadId: string
  clientName: string
  companyName: string
  contactEmail: string
  contactPhone: string
  address: string
  serviceDetails: string
  value: string
  status: string
  signedDate: Timestamp
  createdAt: Timestamp
}
```

**workorders**
```typescript
{
  id: string
  workOrderId: string
  linkedAgreementId: string
  linkedQuoteId: string
  leadId: string
  clientName: string
  companyName: string
  posts: [{
    name: string
    code: string
    type: 'permanent' | 'temporary'
    location: {
      address: string
      digipin: string  // 10-digit location code
    }
    dutyType: '8H' | '12H'
    requiredStaff: [{
      role: string
      count: number
      shift: 'Day' | 'Night' | 'Evening' | 'Morning'
      startTime: string
      endTime: string
      days: string[]
    }]
  }]
  status: string
  startDate: Timestamp
  createdAt: Timestamp
}
```

**followups**
```typescript
{
  id: string
  contact: string
  company: string
  type: 'Call' | 'Email' | 'Meeting' | 'Visit'
  dateTime: string
  subject: string
  status: string
  createdAt: Timestamp
}
```

**calendarEvents**
```typescript
{
  id: string
  title: string
  start: Timestamp
  end: Timestamp
  type: 'meeting' | 'followup' | 'contract' | 'service'
  description: string
  relatedId: string
  attendees: string[]
  createdAt: Timestamp
}
```

## User Roles and Permissions

### Admin
- Full system access
- User management
- System configuration
- All module access

### Sales Manager
- Lead and client management
- Quotation creation and approval
- Agreement management
- Sales reporting

### Operations Manager
- Work order management
- Post deployment
- Staff scheduling
- Operations reporting

### HR Manager
- Employee management
- Training and certification
- Leave management
- Payroll processing

### Accounts Manager
- Invoice generation
- Payment tracking
- Financial reporting
- GST compliance

## Important Business Rules

### Shift Rules
1. **8-Hour Shifts:** Can have 1, 2, or 3 shifts per day
2. **12-Hour Shifts:** Can only have 1 or 2 shifts per day (Morning/Night)
3. Shifts must cover required hours based on client agreement
4. Minimum wage compliance must be maintained

### DigiPin Rules
1. Must be exactly 10 digits
2. Must be unique per post
3. Cannot be changed once post is operational
4. Used for attendance and tracking systems

### Data Inheritance Rules
1. Client data flows automatically: Lead → Quotation → Agreement → Work Order
2. Original lead ID is preserved throughout the workflow
3. Each stage can add new information without affecting previous stages
4. All references (leadId, linkedQuoteId, linkedAgreementId) are maintained

### Document Rules
1. Quotations must have custom IDs (QT-YYYY-XXXX format)
2. Agreements must reference a quotation
3. Work Orders must reference an agreement
4. All documents support PDF export

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Firebase account and project setup
- Environment variables configured

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Firebase Configuration
Create `.env` file with:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## For AI Assistants (ChatGPT Context)

When working with this project, understand:

1. **DigiPin is a 10-digit location identifier** - Not GPS coordinates, but a unique numeric code for each security post
2. **Shift types affect available shift options** - 12H restricts to Morning/Night only
3. **Data inheritance is automatic** - Client information flows through Lead → Quotation → Agreement → Work Order
4. **Calendar integration is real-time** - Followups automatically create calendar events
5. **Document IDs are custom** - Format: QT-2025-XXXX, AG-2025-XXXX, WO-2025-XXXX
6. **Firebase is the backend** - All data operations use Firestore
7. **Forms are multi-tab** - Complex forms split into logical sections
8. **Validation is client-side** - React form validation with real-time feedback

## Support and Documentation

For detailed information on specific features, refer to:
- `CLIENT_DATA_INHERITANCE.md` - Data flow documentation
- `CALENDAR_INTEGRATION_UPDATE.md` - Calendar system details
- `DOCUMENT_EXPORT_FEATURE.md` - PDF generation guide
- `WORKFLOW_QUICK_REFERENCE.md` - Quick workflow guide
- `IMPLEMENTATION_STATUS.md` - Feature completion status

## License

Proprietary - All rights reserved
