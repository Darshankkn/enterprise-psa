namespace psapp.common;

using {
    cuid,
    managed
} from '@sap/cds/common';


// ============================================================
// COMMON STRING TYPES
// ============================================================

type Name             : String(100);
type ShortName        : String(60);

type Description      : String(500);
type ShortDescription : String(255);

type Email            : String(100);
type Phone            : String(20);
type Address          : String(255);
type Notes            : String(255);

type Code             : String(20);
type CountryCode      : String(3);
type CurrencyCode     : String(3);

type JobTitle         : String(60);
type ManagerLevel     : String(20);
type Industry         : String(50);


// ============================================================
// COMMON NUMERIC TYPES
// ============================================================

type Amount      : Decimal(15,2);
type Hours       : Decimal(10,2);
type EntryHours  : Decimal(4,2);
type Percentage  : Decimal(5,2);


// ============================================================
// CLIENT STATUS
// ============================================================

type ClientStatus : String(15) enum {
    Active   = 'ACTIVE';
    Inactive = 'INACTIVE';
    Prospect = 'PROSPECT';
};


// ============================================================
// EMPLOYEE STATUS
// ============================================================

type EmployeeStatus : String(15) enum {
    Active   = 'ACTIVE';
    Inactive = 'INACTIVE';
    OnLeave  = 'ON_LEAVE';
};


// ============================================================
// MANAGER STATUS
// ============================================================

type ManagerStatus : String(15) enum {
    Active   = 'ACTIVE';
    Inactive = 'INACTIVE';
};


// ============================================================
// PROJECT STATUS
// ============================================================

type ProjectStatus : String(20) enum {
    Draft     = 'DRAFT';
    Active    = 'ACTIVE';
    OnHold    = 'ON_HOLD';
    Completed = 'COMPLETED';
    Cancelled = 'CANCELLED';
};


// ============================================================
// PRIORITY
// ============================================================

type Priority : String(10) enum {
    Low      = 'LOW';
    Medium   = 'MEDIUM';
    High     = 'HIGH';
    Critical = 'CRITICAL';
};


// ============================================================
// BILLING TYPE
// ============================================================

type BillingType : String(20) enum {
    FixedPrice   = 'FIXED';
    TimeMaterial = 'T&M';
    Retainer     = 'RETAINER';
};


// ============================================================
// BUDGET STATUS
// ============================================================

type BudgetStatus : String(20) enum {
    WithinBudget = 'WITHIN_BUDGET';
    AtRisk       = 'AT_RISK';
    Breached     = 'BREACHED';
};


// ============================================================
// MILESTONE STATUS
// ============================================================

type MilestoneStatus : String(20) enum {
    NotStarted = 'NOT_STARTED';
    InProgress = 'IN_PROGRESS';
    Completed  = 'COMPLETED';
    Delayed    = 'DELAYED';
};


// ============================================================
// TASK STATUS
// ============================================================

type TaskStatus : String(20) enum {
    ToDo       = 'TO_DO';
    InProgress = 'IN_PROGRESS';
    Done       = 'DONE';
    Blocked    = 'BLOCKED';
};


// ============================================================
// TIMESHEET STATUS
// ============================================================

type TimesheetStatus : String(20) enum {
    Draft     = 'DRAFT';
    Submitted = 'SUBMITTED';
    Approved  = 'APPROVED';
    Rejected  = 'REJECTED';
    Invoiced  = 'INVOICED';
};


// ============================================================
// INVOICE STATUS
// ============================================================

type PaymentStatus : String(20) enum {
    Draft     = 'DRAFT';
    Issued    = 'ISSUED';
    Paid      = 'PAID';
    Overdue   = 'OVERDUE';
    Cancelled = 'CANCELLED';
};


// ============================================================
// COMMON ASPECT
// ============================================================
//
// cuid gives:
//     ID : UUID
//
// managed gives:
//     createdAt
//     createdBy
//     modifiedAt
//     modifiedBy
//
// ============================================================

aspect BusinessObject : cuid, managed {
}



type BurnSummary {

    projectID            : UUID;

    plannedHours         : Decimal(10,2);
    consumedHours        : Decimal(10,2);
    remainingHours       : Decimal(10,2);

    budgetAmount         : Decimal(15,2);
    consumedAmount       : Decimal(15,2);
    remainingAmount      : Decimal(15,2);

    burnPercentage       : Decimal(5,2);
    completionPercentage : Decimal(5,2);

    budgetStatus         : String(20);
};


type UtilizationSummary {

    employeeID            : UUID;

    totalHours            : Decimal(10,2);
    billableHours         : Decimal(10,2);
    nonBillableHours      : Decimal(10,2);

    utilizationPercentage : Decimal(5,2);
};


type InvoicePreview {

    projectID     : UUID;

    billableHours : Decimal(10,2);

    subtotal      : Decimal(15,2);
    taxAmount     : Decimal(15,2);
    totalAmount   : Decimal(15,2);

    currencyCode  : String(3);
};