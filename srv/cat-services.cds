using { psapp.db as db } from '../db/Schema';

using {psapp.common as c} from '../db/Common';


service PSAService {


    // =====================================================================
// MANAGER HOME - PROJECT OVERVIEW
// =====================================================================

@readonly
entity ProjectOverview as select from db.Projects as P
    left join db.Budgets as B
        on B.project.ID = P.ID
{
    // ---------------------------------------------------------
    // PROJECT
    // ---------------------------------------------------------

    key P.ID as ID,

    P.projectCode,
    P.projectName,
    P.description,

    P.startDate,
    P.endDate,

    P.status,
    P.priority,
    P.billingType,

    // ---------------------------------------------------------
    // CLIENT
    // ---------------------------------------------------------

    P.client.ID         as clientID,
    P.client.clientName as clientName,

    // ---------------------------------------------------------
    // MANAGER
    // ---------------------------------------------------------

    P.manager.ID as managerID,

    // ---------------------------------------------------------
    // HOURS
    // ---------------------------------------------------------

    P.plannedHours,
    P.consumedHours,

    // ---------------------------------------------------------
    // BUDGET
    // ---------------------------------------------------------

    B.budgetAmount,
    B.consumedAmount,
    B.remainingAmount,
    B.billingRateHr,
    B.currencyCode,
    B.budgetStatus,

    // ---------------------------------------------------------
    // HOUR BURN %
    // ---------------------------------------------------------

    case
        when P.plannedHours > 0
        then (
            P.consumedHours * 100 /
            P.plannedHours
        )
        else 0
    end as hoursConsumedPercentage : Decimal(5,2),

    // ---------------------------------------------------------
    // BUDGET BURN %
    // ---------------------------------------------------------

    case
        when B.budgetAmount > 0
        then (
            B.consumedAmount * 100 /
            B.budgetAmount
        )
        else 0
    end as budgetConsumedPercentage : Decimal(5,2)
};

    // ===============================================================
    // MASTER DATA
    // ===============================================================

    entity Clients
        as projection on db.Clients;


    entity Departments
        as projection on db.Departments;


    entity Employees
        as projection on db.Employees;


    entity Managers
        as projection on db.Managers;



    // ===============================================================
    // PROJECT MANAGEMENT
    // ===============================================================

    entity Projects
        as projection on db.Projects;


    entity Budgets
        as projection on db.Budgets;


    entity Milestones
        as projection on db.Milestones;


    entity Tasks
        as projection on db.Tasks;



    // ===============================================================
    // TIMESHEETS
    // ===============================================================

    entity Timesheets as projection on db.Timesheets
actions {

    action submit()
        returns Timesheets;
    action create() 
        returns Timesheets;

    action reopen()
        returns Timesheets;

    action approve()
        returns Timesheets;

    action reject(
        reason : String(255)
    )
        returns Timesheets;
};


    entity TimesheetEntries
        as projection on db.TimesheetEntries;



    // ===============================================================
    // BILLING
    // ===============================================================

    entity Invoices as projection on db.Invoices
actions {

    action issue()
        returns Invoices;

    action markPaid(
        paymentDate : Date
    )
        returns Invoices;

};


    // TIMESHEET ACTIONS


    // DRAFT -> SUBMITTED

    // action submitTimesheet(
    //     timesheetID : UUID
    // )
    // returns Timesheets;



    // // REJECTED -> DRAFT

    // action reopenTimesheet(
    //     timesheetID : UUID
    // )
    // returns Timesheets;



    // // SUBMITTED -> APPROVED

    // action approveTimesheet(
    //     timesheetID : UUID
    // )
    // returns Timesheets;



    // // SUBMITTED -> REJECTED

    // action rejectTimesheet(
    //     timesheetID : UUID,
    //     reason      : String(255)
    // )
    // returns Timesheets;




    // PROJECT ACTIONS

    action recalculateProjectHours(
        projectID : UUID
    )
    returns Projects;



    action recalculateBudget(
        projectID : UUID
    )
    returns Budgets;



    action recalculateMilestoneProgress(
        milestoneID : UUID
    )
    returns Milestones;


    // BILLING ACTIONS

    action generateInvoice(
        projectID  : UUID,
        periodFrom : Date,
        periodTo   : Date
    )
    returns Invoices;



    // DRAFT -> ISSUED

    action issueInvoice(
        invoiceID : UUID
    )
    returns Invoices;

    



    // ISSUED -> PAID

    action markInvoicePaid(
        invoiceID   : UUID,
        paymentDate : Date
    )
    returns Invoices;


    // PROJECT FUNCTIONS

    function getBurnSummary(
        projectID : UUID
    )
    returns c.BurnSummary;



    // UTILIZATION FUNCTIONS

    function getEmployeeUtilization(
        employeeID : UUID,
        fromDate   : Date,
        toDate     : Date
    )
    returns c.UtilizationSummary;



    function getDepartmentUtilization(
        departmentID : UUID,
        fromDate     : Date,
        toDate       : Date
    )
    returns Decimal(5,2);


    
    // BILLING FUNCTIONS
    
    function getUnbilledHours(
        projectID : UUID
    )
    returns Decimal(10,2);



    function previewInvoice(
        projectID  : UUID,
        periodFrom : Date,
        periodTo   : Date
    )
    returns c.InvoicePreview;

}