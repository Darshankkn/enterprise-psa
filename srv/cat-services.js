const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {

    // "this" = PSAService

    const {
        Clients,
        Departments,
        Employees,
        Managers,
        Projects,
        Budgets,
        Milestones,
        Tasks,
        Timesheets,
        TimesheetEntries,
        Invoices
    } = this.entities;


    // =====================================================
    // VALIDATIONS
    // =====================================================

    this.before(
        ['CREATE', 'UPDATE'],
        'TimesheetEntries',
        async req => {

            const { hours, workDate } = req.data;

            if (
                hours !== undefined &&
                (
                    Number(hours) < 0.25 ||
                    Number(hours) > 24
                )
            ) {
                return req.reject(
                    400,
                    'Hours must be between 0.25 and 24.'
                );
            }

            if (
                req.event === 'CREATE' &&
                !workDate
            ) {
                return req.reject(
                    400,
                    'Work date is required.'
                );
            }
        }
    );

    // ============================================================
    // HELPER FUNCTIONS
    // ============================================================

    const today = () =>
        new Date().toISOString().slice(0, 10);


    async function getProjectFromTask(taskID) {

        const task = await SELECT.one
            .from(Tasks)
            .where({ ID: taskID });

        if (!task) return null;

        const milestone = await SELECT.one
            .from(Milestones)
            .where({ ID: task.milestone_ID });

        if (!milestone) return null;

        const project = await SELECT.one
            .from(Projects)
            .where({ ID: milestone.project_ID });

        return project;
    }


    // ============================================================
    //
    //                    EMPLOYEE VALIDATIONS
    //
    // ============================================================

    this.before(
        ['CREATE', 'UPDATE'],
        'Employees',
        async req => {

            const {
                hourlyRate,
                joinDate,
                department_ID,
                manager_ID
            } = req.data;


            if (
                hourlyRate !== undefined &&
                Number(hourlyRate) < 0
            ) {
                return req.reject(
                    400,
                    'Hourly rate cannot be negative.'
                );
            }


            if (department_ID) {

                const department = await SELECT.one
                    .from(Departments)
                    .where({ ID: department_ID });

                if (!department) {
                    return req.reject(
                        400,
                        'Invalid Department.'
                    );
                }
            }


            if (manager_ID) {

                const manager = await SELECT.one
                    .from(Managers)
                    .where({ ID: manager_ID });

                if (!manager) {
                    return req.reject(
                        400,
                        'Invalid Manager.'
                    );
                }
            }
        }
    );


    // ============================================================
    //
    //                    MANAGER VALIDATIONS
    //
    // ============================================================

    this.before(
        'CREATE',
        'Managers',
        async req => {

            const { employee_ID } = req.data;

            if (!employee_ID) {
                return req.reject(
                    400,
                    'Employee is required for Manager.'
                );
            }


            const employee = await SELECT.one
                .from(Employees)
                .where({ ID: employee_ID });

            if (!employee) {
                return req.reject(
                    400,
                    'Invalid Employee.'
                );
            }


            // One Employee -> maximum one Manager record
            const existingManager = await SELECT.one
                .from(Managers)
                .where({ employee_ID });

            if (existingManager) {
                return req.reject(
                    400,
                    'A Manager record already exists for this Employee.'
                );
            }
        }
    );


    // ============================================================
    //
    //                    PROJECT VALIDATIONS
    //
    // ============================================================

    this.before(
        ['CREATE', 'UPDATE'],
        'Projects',
        async req => {

            const {
                startDate,
                endDate,
                plannedHours,
                client_ID,
                manager_ID
            } = req.data;


            if (
                startDate &&
                endDate &&
                startDate > endDate
            ) {
                return req.reject(
                    400,
                    'Project start date cannot be after end date.'
                );
            }


            if (
                plannedHours !== undefined &&
                Number(plannedHours) < 0
            ) {
                return req.reject(
                    400,
                    'Planned hours cannot be negative.'
                );
            }


            if (client_ID) {

                const client = await SELECT.one
                    .from(Clients)
                    .where({ ID: client_ID });

                if (!client) {
                    return req.reject(
                        400,
                        'Invalid Client.'
                    );
                }
            }


            if (manager_ID) {

                const manager = await SELECT.one
                    .from(Managers)
                    .where({ ID: manager_ID });

                if (!manager) {
                    return req.reject(
                        400,
                        'Invalid Project Manager.'
                    );
                }
            }
        }
    );


    // ============================================================
    //
    //                    BUDGET VALIDATIONS
    //
    // ============================================================

    this.before(
        'CREATE',
        'Budgets',
        async req => {

            const {
                project_ID,
                budgetAmount,
                billingRateHr
            } = req.data;


            if (!project_ID) {
                return req.reject(
                    400,
                    'Project is required for Budget.'
                );
            }


            if (
                budgetAmount === undefined ||
                Number(budgetAmount) <= 0
            ) {
                return req.reject(
                    400,
                    'Budget amount must be greater than zero.'
                );
            }


            if (
                billingRateHr === undefined ||
                Number(billingRateHr) < 0
            ) {
                return req.reject(
                    400,
                    'Billing rate cannot be negative.'
                );
            }


            const project = await SELECT.one
                .from(Projects)
                .where({ ID: project_ID });

            if (!project) {
                return req.reject(
                    400,
                    'Invalid Project.'
                );
            }


            // Project 1 : 1 Budget
            const existingBudget = await SELECT.one
                .from(Budgets)
                .where({ project_ID });

            if (existingBudget) {
                return req.reject(
                    400,
                    'A Budget already exists for this Project.'
                );
            }
        }
    );


    // ============================================================
    //
    //                   MILESTONE VALIDATIONS
    //
    // ============================================================

    this.before(
        ['CREATE', 'UPDATE'],
        'Milestones',
        async req => {

            const {
                project_ID,
                startDate,
                endDate,
                completionPercent
            } = req.data;


            if (
                startDate &&
                endDate &&
                startDate > endDate
            ) {
                return req.reject(
                    400,
                    'Milestone start date cannot be after end date.'
                );
            }


            if (
                completionPercent !== undefined &&
                (
                    Number(completionPercent) < 0 ||
                    Number(completionPercent) > 100
                )
            ) {
                return req.reject(
                    400,
                    'Completion percentage must be between 0 and 100.'
                );
            }


            if (project_ID) {

                const project = await SELECT.one
                    .from(Projects)
                    .where({ ID: project_ID });

                if (!project) {
                    return req.reject(
                        400,
                        'Invalid Project.'
                    );
                }


                if (
                    startDate &&
                    project.startDate &&
                    startDate < project.startDate
                ) {
                    return req.reject(
                        400,
                        'Milestone cannot start before Project.'
                    );
                }


                if (
                    endDate &&
                    project.endDate &&
                    endDate > project.endDate
                ) {
                    return req.reject(
                        400,
                        'Milestone cannot end after Project.'
                    );
                }
            }
        }
    );


    // ============================================================
    //
    //                     TASK VALIDATIONS
    //
    // ============================================================

    this.before(
        ['CREATE', 'UPDATE'],
        'Tasks',
        async req => {

            const {
                milestone_ID,
                startDate,
                endDate,
                estimatedHours,
                actualHours
            } = req.data;


            if (
                startDate &&
                endDate &&
                startDate > endDate
            ) {
                return req.reject(
                    400,
                    'Task start date cannot be after end date.'
                );
            }


            if (
                estimatedHours !== undefined &&
                Number(estimatedHours) < 0
            ) {
                return req.reject(
                    400,
                    'Estimated hours cannot be negative.'
                );
            }


            if (
                actualHours !== undefined &&
                Number(actualHours) < 0
            ) {
                return req.reject(
                    400,
                    'Actual hours cannot be negative.'
                );
            }


            if (milestone_ID) {

                const milestone = await SELECT.one
                    .from(Milestones)
                    .where({ ID: milestone_ID });

                if (!milestone) {
                    return req.reject(
                        400,
                        'Invalid Milestone.'
                    );
                }


                if (
                    startDate &&
                    milestone.startDate &&
                    startDate < milestone.startDate
                ) {
                    return req.reject(
                        400,
                        'Task cannot start before Milestone.'
                    );
                }


                if (
                    endDate &&
                    milestone.endDate &&
                    endDate > milestone.endDate
                ) {
                    return req.reject(
                        400,
                        'Task cannot end after Milestone.'
                    );
                }
            }
        }
    );


    // ============================================================
    //
    //                   TIMESHEET VALIDATIONS
    //
    // ============================================================

    this.before(
        ['CREATE', 'UPDATE'],
        'Timesheets',
        async req => {

            const {
                weekStartDate,
                weekEndDate,
                employee_ID
            } = req.data;


            if (
                weekStartDate &&
                weekEndDate &&
                weekStartDate > weekEndDate
            ) {
                return req.reject(
                    400,
                    'Timesheet start date cannot be after end date.'
                );
            }


            if (employee_ID) {

                const employee = await SELECT.one
                    .from(Employees)
                    .where({ ID: employee_ID });

                if (!employee) {
                    return req.reject(
                        400,
                        'Invalid Employee.'
                    );
                }
            }
        }
    );


    // ============================================================
//
//               TIMESHEET ENTRY VALIDATIONS
//
// ============================================================

this.before(
    ['CREATE', 'UPDATE'],
    'TimesheetEntries',
    async req => {

        // ========================================================
        // BUILD COMPLETE ENTRY DATA
        //
        // CREATE:
        // req.data normally contains everything.
        //
        // UPDATE/PATCH:
        // req.data may contain only the changed fields.
        // Therefore load the existing Entry and merge it.
        // ========================================================

        let entryData = {
            ...req.data
        };


        if (req.event === 'UPDATE') {

            const entryID =
                req.data.ID ||
                req.params?.[0]?.ID;


            if (entryID) {

                const existingEntry =
                    await SELECT.one
                        .from(TimesheetEntries)
                        .where({
                            ID: entryID
                        });


                if (!existingEntry) {

                    return req.reject(
                        404,
                        'Timesheet Entry not found.'
                    );
                }


                entryData = {
                    ...existingEntry,
                    ...req.data
                };
            }
        }


        const {
            hours,
            workDate,
            timesheet_ID,
            task_ID
        } = entryData;


        // ========================================================
        // HOURS VALIDATION
        // ========================================================

        if (
            hours !== undefined &&
            hours !== null
        ) {

            const numericHours =
                Number(hours);


            if (
                !Number.isFinite(numericHours) ||
                numericHours < 0.25 ||
                numericHours > 24
            ) {

                return req.reject(
                    400,
                    'Hours must be between 0.25 and 24.'
                );
            }
        }


        // ========================================================
        // REQUIRED ASSOCIATIONS
        // ========================================================

        if (req.event === 'CREATE') {

            if (!timesheet_ID) {

                return req.reject(
                    400,
                    'Timesheet is required.'
                );
            }


            if (!task_ID) {

                return req.reject(
                    400,
                    'Task is required.'
                );
            }


            if (!workDate) {

                return req.reject(
                    400,
                    'Work Date is required.'
                );
            }
        }


        // We cannot perform association-dependent validation
        // without the Timesheet and Task.

        if (
            !timesheet_ID ||
            !task_ID
        ) {

            return;
        }


        // ========================================================
        // VALIDATE TIMESHEET
        // ========================================================

        const timesheet =
            await SELECT.one
                .from(Timesheets)
                .where({
                    ID: timesheet_ID
                });


        if (!timesheet) {

            return req.reject(
                400,
                'Invalid Timesheet.'
            );
        }


        // ========================================================
        // TIMESHEET STATUS VALIDATION
        //
        // DRAFT:
        // Employee can modify.
        //
        // REJECTED:
        // Employee can correct and resubmit.
        //
        // SUBMITTED:
        // Locked while Manager reviews.
        //
        // APPROVED:
        // Permanently locked.
        // ========================================================

        const timesheetStatus =
            String(
                timesheet.status || ''
            ).toUpperCase();


        const editableStatuses = [
            'DRAFT',
            'REJECTED'
        ];


        if (
            !editableStatuses.includes(
                timesheetStatus
            )
        ) {

            return req.reject(
                400,
                'Timesheet Entries can only be changed while the Timesheet is Draft or Rejected.'
            );
        }


        // ========================================================
        // VALIDATE EMPLOYEE
        // ========================================================

        if (!timesheet.employee_ID) {

            return req.reject(
                400,
                'Timesheet does not have an Employee.'
            );
        }


        const employee =
            await SELECT.one
                .from(Employees)
                .where({
                    ID: timesheet.employee_ID
                });


        if (!employee) {

            return req.reject(
                400,
                'Timesheet Employee does not exist.'
            );
        }


        // ========================================================
        // VALIDATE TASK -> PROJECT
        // ========================================================

        const project =
            await getProjectFromTask(
                task_ID
            );


        if (!project) {

            return req.reject(
                400,
                'The selected Task is not linked to a valid Project.'
            );
        }


        // ========================================================
        // EMPLOYEE -> MANAGER -> PROJECT VALIDATION
        //
        // Employee.manager_ID
        // must equal
        // Project.manager_ID
        // ========================================================

        if (!employee.manager_ID) {

            return req.reject(
                403,
                'Employee does not have an assigned Manager.'
            );
        }


        if (!project.manager_ID) {

            return req.reject(
                400,
                'The selected Project does not have an assigned Manager.'
            );
        }


        if (
            employee.manager_ID !==
            project.manager_ID
        ) {

            return req.reject(
                403,
                'The selected Task does not belong to a Project managed by your Manager.'
            );
        }


        // ========================================================
        // WORK DATE VALIDATION
        // ========================================================

        if (workDate) {

            // ----------------------------------------------------
            // Date must fall inside Timesheet week
            // ----------------------------------------------------

            if (
                workDate < timesheet.weekStartDate ||
                workDate > timesheet.weekEndDate
            ) {

                return req.reject(
                    400,
                    'Work Date must be within the Timesheet week.'
                );
            }


            // ----------------------------------------------------
            // SATURDAY / SUNDAY NOT ALLOWED
            // ----------------------------------------------------

            const dateParts =
                workDate.split('-');


            const workDateObject =
                new Date(
                    Number(dateParts[0]),
                    Number(dateParts[1]) - 1,
                    Number(dateParts[2])
                );


            const dayOfWeek =
                workDateObject.getDay();


            // 0 = Sunday
            // 6 = Saturday

            if (
                dayOfWeek === 0 ||
                dayOfWeek === 6
            ) {

                return req.reject(
                    400,
                    'Timesheet Entries are not allowed on Saturday or Sunday.'
                );
            }
        }
    }
);


// ============================================================
//
//          TIMESHEET ENTRY DELETE VALIDATION
//
// ============================================================

this.before(
    'DELETE',
    'TimesheetEntries',
    async req => {

        // ========================================================
        // DETERMINE ENTRY ID
        // ========================================================

        const entryID =
            req.data.ID ||
            req.params?.[0]?.ID;


        if (!entryID) {
            return;
        }


        // ========================================================
        // LOAD ENTRY
        // ========================================================

        const entry =
            await SELECT.one
                .from(TimesheetEntries)
                .where({
                    ID: entryID
                });


        if (!entry) {
            return;
        }


        // ========================================================
        // LOAD PARENT TIMESHEET
        // ========================================================

        const timesheet =
            await SELECT.one
                .from(Timesheets)
                .where({
                    ID: entry.timesheet_ID
                });


        if (!timesheet) {

            return req.reject(
                400,
                'Parent Timesheet does not exist.'
            );
        }


        // ========================================================
        // STATUS VALIDATION
        // ========================================================

        const status =
            String(
                timesheet.status || ''
            ).toUpperCase();


        // Employee can remove entries only from:
        //
        // DRAFT
        // REJECTED

        const deletableStatuses = [
            'DRAFT',
            'REJECTED'
        ];


        if (
            !deletableStatuses.includes(
                status
            )
        ) {

            return req.reject(
                400,
                'Timesheet Entries cannot be deleted after the Timesheet has been submitted or approved.'
            );
        }
    }
);

    // ============================================================
    //
    //                    INVOICE VALIDATIONS
    //
    // ============================================================

    this.before(
        ['CREATE', 'UPDATE'],
        'Invoices',
        async req => {

            const {
                invoiceDate,
                dueDate,
                totalAmount,
                taxAmount,
                project_ID,
                client_ID
            } = req.data;


            if (
                invoiceDate &&
                dueDate &&
                invoiceDate > dueDate
            ) {
                return req.reject(
                    400,
                    'Invoice due date cannot be before invoice date.'
                );
            }


            if (
                totalAmount !== undefined &&
                Number(totalAmount) < 0
            ) {
                return req.reject(
                    400,
                    'Invoice total amount cannot be negative.'
                );
            }


            if (
                taxAmount !== undefined &&
                Number(taxAmount) < 0
            ) {
                return req.reject(
                    400,
                    'Tax amount cannot be negative.'
                );
            }


            if (project_ID) {

                const project = await SELECT.one
                    .from(Projects)
                    .where({ ID: project_ID });

                if (!project) {
                    return req.reject(
                        400,
                        'Invalid Project.'
                    );
                }


                // Invoice Client must match Project Client.
                if (
                    client_ID &&
                    project.client_ID !== client_ID
                ) {
                    return req.reject(
                        400,
                        'Invoice Client must match the Project Client.'
                    );
                }
            }
        }
    );

    //issue

    this.on('issue', 'Invoices', async req => {

    const invoiceID = req.params[0].ID;

    const invoice = await SELECT.one
        .from(Invoices)
        .where({
            ID: invoiceID
        });


    if (!invoice) {
        return req.reject(
            404,
            'Invoice not found.'
        );
    }

    if (Number(invoice.totalAmount || 0) <= 0) {
    return req.reject(
        400,
        'A zero-value Invoice cannot be issued.'
    );
}


    if (invoice.paymentStatus !== 'DRAFT') {
        return req.reject(
            400,
            'Only Draft invoices can be issued.'
        );
    }


    await UPDATE(Invoices)
        .set({
            paymentStatus: 'ISSUED'
        })
        .where({
            ID: invoiceID
        });


    return SELECT.one
        .from(Invoices)
        .where({
            ID: invoiceID
        });

});

//mark paid
this.on('markPaid', 'Invoices', async req => {

    const invoiceID = req.params[0].ID;

    const {
        paymentDate
    } = req.data;


    if (!paymentDate) {
        return req.reject(
            400,
            'Payment date is required.'
        );
    }

    if (paymentDate < invoice.invoiceDate) {
    return req.reject(
        400,
        'Payment date cannot be earlier than the Invoice date.'
    );
}


    const invoice = await SELECT.one
        .from(Invoices)
        .where({
            ID: invoiceID
        });


    if (!invoice) {
        return req.reject(
            404,
            'Invoice not found.'
        );
    }


    if (invoice.paymentStatus !== 'ISSUED') {
        return req.reject(
            400,
            'Only Issued invoices can be marked as Paid.'
        );
    }


    await UPDATE(Invoices)
        .set({
            paymentStatus: 'PAID',
            paymentDate
        })
        .where({
            ID: invoiceID
        });


    return SELECT.one
        .from(Invoices)
        .where({
            ID: invoiceID
        });

});



    // ============================================================
    //
    //                   SUBMIT TIMESHEET
    //
    // ============================================================

    this.on('submit', 'Timesheets', async req => {

            const timesheetID = req.params[0].ID;


            const timesheet = await SELECT.one
                .from(Timesheets)
                .where({
                    ID: timesheetID
                });


            if (!timesheet) {
                return req.reject(
                    404,
                    'Timesheet not found.'
                );
            }


            if (timesheet.status !== 'DRAFT') {
                return req.reject(
                    400,
                    'Only Draft Timesheets can be submitted.'
                );
            }


            const entries = await SELECT
                .from(TimesheetEntries)
                .where({
                    timesheet_ID: timesheetID
                });


            if (!entries.length) {
                return req.reject(
                    400,
                    'Timesheet must contain at least one Entry.'
                );
            }


            const dailyTotals = {};

            let totalBillableHours = 0;


            for (const entry of entries) {

                const hours = Number(entry.hours);


                if (
                    hours < 0.25 ||
                    hours > 24
                ) {
                    return req.reject(
                        400,
                        'Every Timesheet Entry must contain between 0.25 and 24 hours.'
                    );
                }


                if (
                    entry.workDate < timesheet.weekStartDate ||
                    entry.workDate > timesheet.weekEndDate
                ) {
                    return req.reject(
                        400,
                        'All work dates must fall within the Timesheet week.'
                    );
                }


                dailyTotals[entry.workDate] =
                    (dailyTotals[entry.workDate] || 0)
                    + hours;


                if (entry.isBillable) {
                    totalBillableHours += hours;
                }
            }


            for (
                const [date, total]
                of Object.entries(dailyTotals)
            ) {

                if (total > 24) {
                    return req.reject(
                        400,
                        `Total working hours for ${date} cannot exceed 24.`
                    );
                }
            }


            await UPDATE(Timesheets)
                .set({
                    status: 'SUBMITTED',
                    submittedDate: today(),
                    totalBillableHours
                })
                .where({
                    ID: timesheetID
                });


            return SELECT.one
                .from(Timesheets)
                .where({
                    ID: timesheetID
                });
        }
    );


    // ============================================================
    //
    //                    REOPEN TIMESHEET
    //
    // ============================================================

    this.on('reopen', 'Timesheets', async req => {

    const timesheetID = req.params[0].ID;


            const timesheet = await SELECT.one
                .from(Timesheets)
                .where({
                    ID: timesheetID
                });


            if (!timesheet) {
                return req.reject(
                    404,
                    'Timesheet not found.'
                );
            }


            if (timesheet.status !== 'REJECTED') {
                return req.reject(
                    400,
                    'Only Rejected Timesheets can be reopened.'
                );
            }


            await UPDATE(Timesheets)
                .set({
                    status: 'DRAFT',
                    rejectionReason: null,
                    approvedDate: null
                })
                .where({
                    ID: timesheetID
                });


            return SELECT.one
                .from(Timesheets)
                .where({
                    ID: timesheetID
                });
        }
    );


    // ============================================================
    //
    //                   APPROVE TIMESHEET
    //
    // ============================================================

    this.on('approve', 'Timesheets', async req => {

    const timesheetID = req.params[0].ID;


            const timesheet = await SELECT.one
                .from(Timesheets)
                .where({
                    ID: timesheetID
                });


            if (!timesheet) {
                return req.reject(
                    404,
                    'Timesheet not found.'
                );
            }


            if (timesheet.status !== 'SUBMITTED') {
                return req.reject(
                    400,
                    'Only Submitted Timesheets can be approved.'
                );
            }


            /*
             * approvedBy_ID should ultimately come from the
             * authenticated Manager, not from frontend input.
             *
             * We aren't setting it yet because your auth-user-to-
             * Employee/Manager mapping hasn't been defined.
             */


            await UPDATE(Timesheets)
                .set({
                    status: 'APPROVED',
                    approvedDate: today(),
                    rejectionReason: null
                })
                .where({
                    ID: timesheetID
                });


            return SELECT.one
                .from(Timesheets)
                .where({
                    ID: timesheetID
                });
        }
    );


    // ============================================================
    //
    //                    REJECT TIMESHEET
    //
    // ============================================================

    this.on('reject', 'Timesheets', async req => {

    const timesheetID = req.params[0].ID;

    const { reason } = req.data;

    if (!reason || !reason.trim()) {
        return req.reject(
            400,
            'Rejection reason is mandatory.'
        );
    }


    const timesheet = await SELECT.one
        .from(Timesheets)
        .where({
            ID: timesheetID
        });


    if (!timesheet) {
        return req.reject(
            404,
            'Timesheet not found.'
        );
    }


    if (timesheet.status !== 'SUBMITTED') {
        return req.reject(
            400,
            'Only Submitted Timesheets can be rejected.'
        );
    }


    await UPDATE(Timesheets)
        .set({
            status: 'REJECTED',
            rejectionReason: reason,
            approvedDate: null
        })
        .where({
            ID: timesheetID
        });


    return SELECT.one
        .from(Timesheets)
        .where({
            ID: timesheetID
        });

});


    // ============================================================
    //
    //             RECALCULATE PROJECT HOURS
    //
    // ============================================================

    this.on(
        'recalculateProjectHours',
        async req => {

            const {
                projectID
            } = req.data;


            const project = await SELECT.one
                .from(Projects)
                .where({
                    ID: projectID
                });


            if (!project) {
                return req.reject(
                    404,
                    'Project not found.'
                );
            }


            const milestones = await SELECT
                .from(Milestones)
                .where({
                    project_ID: projectID
                });


            let projectHours = 0;


            for (const milestone of milestones) {

                const tasks = await SELECT
                    .from(Tasks)
                    .where({
                        milestone_ID: milestone.ID
                    });


                for (const task of tasks) {

                    const entries = await SELECT
                        .from(TimesheetEntries)
                        .where({
                            task_ID: task.ID
                        });


                    const actualHours = entries.reduce(
                        (sum, entry) =>
                            sum + Number(entry.hours || 0),
                        0
                    );


                    await UPDATE(Tasks)
                        .set({
                            actualHours
                        })
                        .where({
                            ID: task.ID
                        });


                    projectHours += actualHours;
                }
            }


            await UPDATE(Projects)
                .set({
                    consumedHours: projectHours
                })
                .where({
                    ID: projectID
                });


            return SELECT.one
                .from(Projects)
                .where({
                    ID: projectID
                });
        }
    );


    // ============================================================
    //
    //                 RECALCULATE BUDGET
    //
    // ============================================================

    this.on(
        'recalculateBudget',
        async req => {

            const { projectID } = req.data;


            const budget = await SELECT.one
                .from(Budgets)
                .where({
                    project_ID: projectID
                });


            if (!budget) {
                return req.reject(
                    404,
                    'Budget not found for Project.'
                );
            }


            const project = await SELECT.one
                .from(Projects)
                .where({
                    ID: projectID
                });


            if (!project) {
                return req.reject(
                    404,
                    'Project not found.'
                );
            }


            const consumedAmount =
                Number(project.consumedHours || 0) *
                Number(budget.billingRateHr || 0);


            const remainingAmount =
                Number(budget.budgetAmount) -
                consumedAmount;


            const percentage =
                Number(budget.budgetAmount) > 0
                    ? (
                        consumedAmount /
                        Number(budget.budgetAmount)
                    ) * 100
                    : 0;


            let budgetStatus = 'WITHIN_BUDGET';


            if (percentage > 100) {

                budgetStatus = 'BREACHED';

            } else if (percentage >= 80) {

                budgetStatus = 'AT_RISK';
            }


            await UPDATE(Budgets)
                .set({
                    consumedAmount,
                    remainingAmount,
                    budgetStatus
                })
                .where({
                    ID: budget.ID
                });


            return SELECT.one
                .from(Budgets)
                .where({
                    ID: budget.ID
                });
        }
    );


    // ============================================================
    //
    //            RECALCULATE MILESTONE PROGRESS
    //
    // ============================================================

    this.on(
        'recalculateMilestoneProgress',
        async req => {

            const { milestoneID } = req.data;


            const milestone = await SELECT.one
                .from(Milestones)
                .where({
                    ID: milestoneID
                });


            if (!milestone) {
                return req.reject(
                    404,
                    'Milestone not found.'
                );
            }


            const tasks = await SELECT
                .from(Tasks)
                .where({
                    milestone_ID: milestoneID
                });


            const taskCount = tasks.length;


            const completedCount =
                tasks.filter(
                    task => task.status === 'DONE'
                ).length;


            const completionPercent =
                taskCount > 0
                    ? (
                        completedCount /
                        taskCount
                    ) * 100
                    : 0;


            let status = milestone.status;


            if (completionPercent === 100) {

                status = 'COMPLETED';

            } else if (completionPercent > 0) {

                status = 'IN_PROGRESS';
            }


            await UPDATE(Milestones)
                .set({
                    completionPercent,
                    status
                })
                .where({
                    ID: milestoneID
                });


            return SELECT.one
                .from(Milestones)
                .where({
                    ID: milestoneID
                });
        }
    );


    // ============================================================
    //
    //                    GET BURN SUMMARY
    //
    // ============================================================

    this.on(
        'getBurnSummary',
        async req => {

            const { projectID } = req.data;


            const project = await SELECT.one
                .from(Projects)
                .where({
                    ID: projectID
                });


            if (!project) {
                return req.reject(
                    404,
                    'Project not found.'
                );
            }


            const budget = await SELECT.one
                .from(Budgets)
                .where({
                    project_ID: projectID
                });


            const plannedHours =
                Number(project.plannedHours || 0);


            const consumedHours =
                Number(project.consumedHours || 0);


            const budgetAmount =
                Number(budget?.budgetAmount || 0);


            const consumedAmount =
                Number(budget?.consumedAmount || 0);


            return {

                projectID,

                plannedHours,

                consumedHours,

                remainingHours:
                    plannedHours - consumedHours,

                budgetAmount,

                consumedAmount,

                remainingAmount:
                    Number(
                        budget?.remainingAmount || 0
                    ),

                burnPercentage:
                    budgetAmount > 0
                        ? (
                            consumedAmount /
                            budgetAmount
                        ) * 100
                        : 0,

                completionPercentage:
                    plannedHours > 0
                        ? (
                            consumedHours /
                            plannedHours
                        ) * 100
                        : 0,

                budgetStatus:
                    budget?.budgetStatus || null
            };
        }
    );


    // ============================================================
    //
    //                 GET EMPLOYEE UTILIZATION
    //
    // ============================================================

    this.on(
        'getEmployeeUtilization',
        async req => {

            const {
                employeeID,
                fromDate,
                toDate
            } = req.data;


            if (
                !fromDate ||
                !toDate ||
                fromDate > toDate
            ) {
                return req.reject(
                    400,
                    'A valid date range is required.'
                );
            }


            const employee = await SELECT.one
                .from(Employees)
                .where({
                    ID: employeeID
                });


            if (!employee) {
                return req.reject(
                    404,
                    'Employee not found.'
                );
            }


            const timesheets = await SELECT
                .from(Timesheets)
                .where({
                    employee_ID: employeeID
                });


            let totalHours = 0;
            let billableHours = 0;


            for (const timesheet of timesheets) {

                const entries = await SELECT
                    .from(TimesheetEntries)
                    .where({
                        timesheet_ID: timesheet.ID
                    });


                for (const entry of entries) {

                    if (
                        entry.workDate >= fromDate &&
                        entry.workDate <= toDate
                    ) {

                        const hours =
                            Number(entry.hours || 0);

                        totalHours += hours;


                        if (entry.isBillable) {
                            billableHours += hours;
                        }
                    }
                }
            }


            const nonBillableHours =
                totalHours - billableHours;


            /*
             * IMPORTANT:
             *
             * We do not have employee capacity/available hours
             * in the current schema.
             *
             * Therefore a true utilization percentage cannot
             * be calculated reliably yet.
             */

            return {

                employeeID,

                totalHours,

                billableHours,

                nonBillableHours,

                utilizationPercentage: 0
            };
        }
    );


    // ============================================================
    //
    //              GET DEPARTMENT UTILIZATION
    //
    // ============================================================

    this.on(
        'getDepartmentUtilization',
        async req => {

            const {
                departmentID,
                fromDate,
                toDate
            } = req.data;


            if (
                !fromDate ||
                !toDate ||
                fromDate > toDate
            ) {
                return req.reject(
                    400,
                    'A valid date range is required.'
                );
            }


            const department = await SELECT.one
                .from(Departments)
                .where({
                    ID: departmentID
                });


            if (!department) {
                return req.reject(
                    404,
                    'Department not found.'
                );
            }


            /*
             * We intentionally don't invent a utilization formula.
             *
             * To correctly calculate:
             *
             * utilized hours / available capacity * 100
             *
             * we need employee capacity / working hours.
             */


            return 0;
        }
    );


    // ============================================================
    //
    //                  GET UNBILLED HOURS
    //
    // ============================================================

    this.on(
        'getUnbilledHours',
        async req => {

            const { projectID } = req.data;


            const milestones = await SELECT
                .from(Milestones)
                .where({
                    project_ID: projectID
                });


            let totalHours = 0;


            for (const milestone of milestones) {

                const tasks = await SELECT
                    .from(Tasks)
                    .where({
                        milestone_ID: milestone.ID
                    });


                for (const task of tasks) {

                    const entries = await SELECT
                        .from(TimesheetEntries)
                        .where({
                            task_ID: task.ID,
                            isBillable: true
                        });


                    for (const entry of entries) {

                        const timesheet =
                            await SELECT.one
                                .from(Timesheets)
                                .where({
                                    ID: entry.timesheet_ID
                                });


                        if (
                            timesheet &&
                            timesheet.status === 'APPROVED' &&
                            !timesheet.invoice_ID
                        ) {
                            totalHours +=
                                Number(entry.hours || 0);
                        }
                    }
                }
            }


            return totalHours;
        }
    );


    // ============================================================
    //
    //                  PREVIEW INVOICE
    //
    // ============================================================

    this.on(
        'previewInvoice',
        async req => {

            const {
                projectID,
                periodFrom,
                periodTo
            } = req.data;


            if (
                !periodFrom ||
                !periodTo ||
                periodFrom > periodTo
            ) {
                return req.reject(
                    400,
                    'A valid invoice period is required.'
                );
            }


            const project = await SELECT.one
                .from(Projects)
                .where({
                    ID: projectID
                });


            if (!project) {
                return req.reject(
                    404,
                    'Project not found.'
                );
            }


            const budget = await SELECT.one
                .from(Budgets)
                .where({
                    project_ID: projectID
                });


            if (!budget) {
                return req.reject(
                    400,
                    'Budget is required before invoice calculation.'
                );
            }


            /*
             * Calculate eligible approved, unbilled time
             * belonging to this Project and invoice period.
             */

            const milestones = await SELECT
                .from(Milestones)
                .where({
                    project_ID: projectID
                });


            let billableHours = 0;


            for (const milestone of milestones) {

                const tasks = await SELECT
                    .from(Tasks)
                    .where({
                        milestone_ID: milestone.ID
                    });


                for (const task of tasks) {

                    const entries = await SELECT
                        .from(TimesheetEntries)
                        .where({
                            task_ID: task.ID,
                            isBillable: true
                        });


                    for (const entry of entries) {

                        if (
                            entry.workDate < periodFrom ||
                            entry.workDate > periodTo
                        ) {
                            continue;
                        }


                        const timesheet =
                            await SELECT.one
                                .from(Timesheets)
                                .where({
                                    ID: entry.timesheet_ID
                                });


                        if (
                            timesheet &&
                            timesheet.status === 'APPROVED' &&
                            !timesheet.invoice_ID
                        ) {
                            billableHours +=
                                Number(entry.hours || 0);
                        }
                    }
                }
            }


            /*
             * T&M calculation.
             *
             * Do not use this formula for Fixed Price or
             * Retainer projects until those billing rules
             * are defined.
             */

            if (project.billingType !== 'T&M') {

                return req.reject(
                    400,
                    'Invoice preview is currently implemented only for Time & Material projects.'
                );
            }


            const subtotal =
                billableHours *
                Number(budget.billingRateHr || 0);


            /*
             * Tax rate isn't present in the current schema.
             * Therefore we must not invent one.
             */

            const taxAmount = 0;

            const totalAmount =
                subtotal + taxAmount;


            return {

                projectID,

                billableHours,

                subtotal,

                taxAmount,

                totalAmount,

                currencyCode:
                    budget.currencyCode
            };
        }
    );


    // ============================================================
    //
    //                   GENERATE INVOICE
    //
    // ============================================================

    this.on(
        'generateInvoice',
        async req => {

            const {
                projectID,
                periodFrom,
                periodTo
            } = req.data;


            if (
                !periodFrom ||
                !periodTo ||
                periodFrom > periodTo
            ) {
                return req.reject(
                    400,
                    'A valid invoice period is required.'
                );
            }


            const project = await SELECT.one
                .from(Projects)
                .where({
                    ID: projectID
                });


            if (!project) {
                return req.reject(
                    404,
                    'Project not found.'
                );
            }


            if (project.billingType !== 'T&M') {

                return req.reject(
                    400,
                    'Automatic invoice generation is currently implemented only for Time & Material projects.'
                );
            }


            const budget = await SELECT.one
                .from(Budgets)
                .where({
                    project_ID: projectID
                });


            if (!budget) {
                return req.reject(
                    400,
                    'Budget is required for Invoice generation.'
                );
            }


            const milestones = await SELECT
                .from(Milestones)
                .where({
                    project_ID: projectID
                });


            let billableHours = 0;

            const eligibleTimesheets =
                new Set();


            for (const milestone of milestones) {

                const tasks = await SELECT
                    .from(Tasks)
                    .where({
                        milestone_ID: milestone.ID
                    });


                for (const task of tasks) {

                    const entries = await SELECT
                        .from(TimesheetEntries)
                        .where({
                            task_ID: task.ID,
                            isBillable: true
                        });


                    for (const entry of entries) {

                        if (
                            entry.workDate < periodFrom ||
                            entry.workDate > periodTo
                        ) {
                            continue;
                        }


                        const timesheet =
                            await SELECT.one
                                .from(Timesheets)
                                .where({
                                    ID: entry.timesheet_ID
                                });


                        if (
                            timesheet &&
                            timesheet.status === 'APPROVED' &&
                            !timesheet.invoice_ID
                        ) {

                            billableHours +=
                                Number(entry.hours || 0);

                            eligibleTimesheets.add(
                                timesheet.ID
                            );
                        }
                    }
                }
            }


            if (!billableHours) {
                return req.reject(
                    400,
                    'No approved unbilled hours were found for the selected period.'
                );
            }


            const totalAmount =
                billableHours *
                Number(budget.billingRateHr || 0);


            const invoiceID = cds.utils.uuid();


            await INSERT
                .into(Invoices)
                .entries({

                    ID: invoiceID,

                    invoiceDate: today(),

                    billableHours,

                    totalAmount,

                    taxAmount: 0,

                    currencyCode:
                        budget.currencyCode,

                    paymentStatus:
                        'DRAFT',

                    project_ID:
                        projectID,

                    client_ID:
                        project.client_ID
                });


            for (
                const timesheetID
                of eligibleTimesheets
            ) {

                await UPDATE(Timesheets)
                    .set({
                        invoice_ID: invoiceID,
                        status: 'INVOICED'
                    })
                    .where({
                        ID: timesheetID
                    });
            }


            return SELECT.one
                .from(Invoices)
                .where({
                    ID: invoiceID
                });
        }
    );


    // ============================================================
    //
    //                      ISSUE INVOICE
    //
    // ============================================================

    this.on(
        'issueInvoice',
        async req => {

            const {
                invoiceID
            } = req.data;


            const invoice = await SELECT.one
                .from(Invoices)
                .where({
                    ID: invoiceID
                });


            if (!invoice) {
                return req.reject(
                    404,
                    'Invoice not found.'
                );
            }


            if (invoice.paymentStatus !== 'DRAFT') {
                return req.reject(
                    400,
                    'Only Draft Invoices can be issued.'
                );
            }


            await UPDATE(Invoices)
                .set({
                    paymentStatus: 'ISSUED'
                })
                .where({
                    ID: invoiceID
                });


            return SELECT.one
                .from(Invoices)
                .where({
                    ID: invoiceID
                });
        }
    );


    // ============================================================
    //
    //                   MARK INVOICE PAID
    //
    // ============================================================

    this.on(
        'markInvoicePaid',
        async req => {

            const {
                invoiceID,
                paymentDate
            } = req.data;


            if (!paymentDate) {
                return req.reject(
                    400,
                    'Payment date is required.'
                );
            }


            const invoice = await SELECT.one
                .from(Invoices)
                .where({
                    ID: invoiceID
                });


            if (!invoice) {
                return req.reject(
                    404,
                    'Invoice not found.'
                );
            }


            if (invoice.paymentStatus !== 'ISSUED') {
                return req.reject(
                    400,
                    'Only Issued Invoices can be marked as Paid.'
                );
            }


            await UPDATE(Invoices)
                .set({
                    paymentStatus: 'PAID',
                    paymentDate
                })
                .where({
                    ID: invoiceID
                });


            return SELECT.one
                .from(Invoices)
                .where({
                    ID: invoiceID
                });
        }
    );

});
