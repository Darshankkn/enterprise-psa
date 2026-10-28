namespace psapp.db;

using {psapp.common as c} from './Common';


// ==========================================================
// 1. CLIENTS
// ==========================================================

entity Clients : c.BusinessObject {

    clientName    : c.Name @mandatory;

    contactPerson : c.Name;

    email         : c.Email;
    phoneNo       : c.Phone;

    address       : c.Address;
    country       : c.CountryCode;
    industry      : c.Industry;

    status        : c.ClientStatus default #Active;


    // UNMANAGED
    // Client 1 -> many Projects
    projects : Association to many Projects
                   on projects.client = $self;


    // UNMANAGED
    // Client 1 -> many Invoices
    invoices : Association to many Invoices
                   on invoices.client = $self;
}


// ==========================================================
// 2. DEPARTMENTS
// ==========================================================

entity Departments : c.BusinessObject {

    departmentName : c.ShortName @mandatory;

    description    : c.ShortDescription;


    // MANAGED
    // Department -> Head Manager
    // CAP generates headManager_ID
    headManager : Association to one Managers;


    // UNMANAGED
    // Department 1 -> many Employees
    employees : Association to many Employees
                    on employees.department = $self;
}


// ==========================================================
// 3. EMPLOYEES
// ==========================================================

entity Employees : c.BusinessObject {

    firstName   : c.ShortName @mandatory;
    lastName    : c.ShortName @mandatory;

    email       : c.Email @mandatory;
    phoneNo     : c.Phone;

    jobTitle    : c.JobTitle;

    joinDate    : Date;

    hourlyRate  : c.Amount;

    status      : c.EmployeeStatus default #Active;


    // MANAGED
    // Employee -> Department
    // CAP generates department_ID
    department : Association to one Departments;


    // MANAGED
    // Employee -> Supervising Manager
    // CAP generates manager_ID
    manager : Association to one Managers;


    // UNMANAGED
    // Employee -> Manager record
    // Relevant when this employee is also a manager
    managerRole : Association to one Managers
                    on managerRole.employee = $self;


    // UNMANAGED
    // Employee 1 -> many Timesheets
    timesheets : Association to many Timesheets
                    on timesheets.employee = $self;
}


// ==========================================================
// 4. MANAGERS
// ==========================================================

entity Managers : c.BusinessObject {

    // MANAGED
    //
    // Manager -> Employee
    //
    // Each Manager represents an Employee.
    //
    // Business rule:
    // employee should be unique in Managers.
    employee : Association to one Employees;


    managerLevel : c.ManagerLevel;

    status       : c.ManagerStatus default #Active;


    // UNMANAGED
    // Manager 1 -> many reporting Employees
    employees : Association to many Employees
                    on employees.manager = $self;


    // UNMANAGED
    // Manager 1 -> many Projects
    projects : Association to many Projects
                    on projects.manager = $self;


    // UNMANAGED
    // Manager 1 -> many approved Timesheets
    approvedTimesheets : Association to many Timesheets
                            on approvedTimesheets.approvedBy = $self;


    // UNMANAGED
    // Manager may head Departments
    headedDepartments : Association to many Departments
                           on headedDepartments.headManager = $self;
}


// ==========================================================
// 5. PROJECTS
// ==========================================================

entity Projects : c.BusinessObject {

    projectCode    : c.Code @mandatory;

    projectName    : c.Name @mandatory;

    description    : c.Description;

    billingType    : c.BillingType @mandatory;

    startDate      : Date;
    endDate        : Date;

    status         : c.ProjectStatus default #Draft;

    priority       : c.Priority default #Medium;

    plannedHours   : c.Hours;

    // Updated based on approved/submitted working hours
    consumedHours  : c.Hours default 0;


    // MANAGED
    // many Projects -> one Client
    client : Association to one Clients;


    // MANAGED
    // many Projects -> one Manager
    manager : Association to one Managers;


    // COMPOSITION
    // Project 1 -> 1 Budget
    budget : Composition of one Budgets
                on budget.project = $self;


    // COMPOSITION
    // Project 1 -> many Milestones
    milestones : Composition of many Milestones
                    on milestones.project = $self;


    // UNMANAGED
    // Project 1 -> many Invoices
    invoices : Association to many Invoices
                    on invoices.project = $self;
}


// ==========================================================
// 6. BUDGETS
// ==========================================================

entity Budgets : c.BusinessObject {

    budgetAmount    : c.Amount @mandatory;

    consumedAmount  : c.Amount default 0;

    remainingAmount : c.Amount;

    billingRateHr   : c.Amount @mandatory;

    budgetStatus    : c.BudgetStatus default #WithinBudget;

    currencyCode    : c.CurrencyCode @mandatory;


    // MANAGED
    //
    // Budget -> Project
    //
    // Business rule:
    // only one Budget should exist for a Project.
    project : Association to one Projects;
}


// ==========================================================
// 7. MILESTONES
// ==========================================================

entity Milestones : c.BusinessObject {

    milestoneName     : c.Name @mandatory;

    description       : c.Description;

    startDate         : Date;
    endDate           : Date;

    completionPercent : c.Percentage default 0;

    status            : c.MilestoneStatus default #NotStarted;

    priority          : c.Priority default #Medium;


    // MANAGED
    // many Milestones -> one Project
    project : Association to one Projects;


    // COMPOSITION
    // Milestone 1 -> many Tasks
    tasks : Composition of many Tasks
                on tasks.milestone = $self;
}


// ==========================================================
// 8. TASKS
// ==========================================================

entity Tasks : c.BusinessObject {

    taskName       : c.Name @mandatory;

    description    : c.Description;

    startDate      : Date;
    endDate        : Date;

    priority       : c.Priority default #Medium;

    status         : c.TaskStatus default #ToDo;

    estimatedHours : c.Hours;

    // Calculated from Timesheet Entries
    actualHours    : c.Hours default 0;


    // MANAGED
    // many Tasks -> one Milestone
    milestone : Association to one Milestones;


    // UNMANAGED
    // Task 1 -> many Timesheet Entries
    timesheetEntries : Association to many TimesheetEntries
                           on timesheetEntries.task = $self;
}


// ==========================================================
// 9. TIMESHEETS
// ==========================================================

entity Timesheets : c.BusinessObject {

    weekStartDate      : Date @mandatory;

    weekEndDate        : Date @mandatory;

    totalBillableHours : c.Hours default 0;

    submittedDate      : Date;

    approvedDate       : Date;

    status             : c.TimesheetStatus default #Draft;

    // Stores reason supplied by rejectTimesheet
    rejectionReason    : c.Notes;


    // MANAGED
    // many Timesheets -> one Employee
    employee : Association to one Employees;


    // MANAGED
    // many Timesheets -> one approving Manager
    approvedBy : Association to one Managers;


    // MANAGED
    // many Timesheets -> zero/one Invoice
    //
    // Null until invoiced.
    invoice : Association to one Invoices;

    //projects
    project : Association to one Projects;


    // COMPOSITION
    // Timesheet 1 -> many Entries
    entries : Composition of many TimesheetEntries
                on entries.timesheet = $self;
}


// ==========================================================
// 10. TIMESHEET ENTRIES
// ==========================================================

entity TimesheetEntries : c.BusinessObject {

    workDate   : Date @mandatory;

    hours      : c.EntryHours @mandatory;

    isBillable : Boolean default true;

    notes      : c.Notes;


    // MANAGED
    // many Entries -> one Timesheet
    timesheet : Association to one Timesheets;


    // MANAGED
    // many Entries -> one Task
    task : Association to one Tasks;
}


// ==========================================================
// 11. INVOICES
// ==========================================================

entity Invoices : c.BusinessObject {

    invoiceDate   : Date;

    dueDate       : Date;

    billableHours : c.Hours default 0;

    totalAmount   : c.Amount;

    taxAmount     : c.Amount;

    currencyCode  : c.CurrencyCode;

    paymentStatus : c.PaymentStatus default #Draft;

    // Used by markInvoicePaid action
    paymentDate   : Date;


    // MANAGED
    // many Invoices -> one Client
    client : Association to one Clients;


    // MANAGED
    // many Invoices -> one Project
    project : Association to one Projects;


    // UNMANAGED
    // Invoice 1 -> many Timesheets
    timesheets : Association to many Timesheets
                    on timesheets.invoice = $self;
}