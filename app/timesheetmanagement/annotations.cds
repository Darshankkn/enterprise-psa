using PSAService as service from '../../srv/cat-services';


// =====================================================================
// TIMESHEETS
// =====================================================================

annotate service.Timesheets with @(

    UI.HeaderInfo : {

        TypeName       : 'Timesheet',
        TypeNamePlural : 'Timesheets',

        Title : {
            $Type : 'UI.DataField',
            Value : employee.firstName
        },

        Description : {
            $Type : 'UI.DataField',
            Value : status
        }

    },


    // =================================================================
    // FILTERS
    // =================================================================

    UI.SelectionFields : [
        employee_ID,
        weekStartDate,
        weekEndDate,
        status
    ],


    // =================================================================
    // STANDARD LIST
    // Mainly useful for History / Manager Approval pages
    // =================================================================

    UI.LineItem : [

        {
            $Type : 'UI.DataField',
            Label : 'Employee',
            Value : employee.firstName
        },

        {
            $Type : 'UI.DataField',
            Label : 'Week Start',
            Value : weekStartDate
        },

        {
            $Type : 'UI.DataField',
            Label : 'Week End',
            Value : weekEndDate
        },

        {
            $Type : 'UI.DataField',
            Label : 'Billable Hours',
            Value : totalBillableHours
        },

        {
            $Type : 'UI.DataField',
            Label : 'Status',
            Value : status,
            Criticality : statusCriticality
        },

        {
            $Type : 'UI.DataField',
            Label : 'Submitted Date',
            Value : submittedDate
        },

        {
            $Type : 'UI.DataField',
            Label : 'Approved Date',
            Value : approvedDate
        },

        {
            $Type  : 'UI.DataFieldForAction',
            Label  : 'Submit',
            Action : 'PSAService.submit'
        },

        {
            $Type  : 'UI.DataFieldForAction',
            Label  : 'Reopen',
            Action : 'PSAService.reopen'
        },

        {
            $Type  : 'UI.DataFieldForAction',
            Label  : 'Approve',
            Action : 'PSAService.approve'
        },

        {
            $Type  : 'UI.DataFieldForAction',
            Label  : 'Reject',
            Action : 'PSAService.reject'
        }

    ],


    // =================================================================
    // OBJECT PAGE
    // =================================================================

    UI.Facets : [

        {
            $Type  : 'UI.ReferenceFacet',
            ID     : 'GeneralInformation',
            Label  : 'General Information',
            Target : '@UI.FieldGroup#GeneralInformation'
        },

        {
            $Type  : 'UI.ReferenceFacet',
            ID     : 'TimesheetSummary',
            Label  : 'Timesheet Summary',
            Target : '@UI.FieldGroup#TimesheetSummary'
        },

        {
            $Type  : 'UI.ReferenceFacet',
            ID     : 'TimeEntries',
            Label  : 'Time Entries',
            Target : 'entries/@UI.LineItem'
        }

    ],


    // =================================================================
    // OBJECT PAGE ACTIONS
    // =================================================================

    UI.Identification : [

        {
            $Type  : 'UI.DataFieldForAction',
            Label  : 'Submit',
            Action : 'PSAService.submit'
        },

        {
            $Type  : 'UI.DataFieldForAction',
            Label  : 'Reopen',
            Action : 'PSAService.reopen'
        },

        {
            $Type  : 'UI.DataFieldForAction',
            Label  : 'Approve',
            Action : 'PSAService.approve'
        },

        {
            $Type  : 'UI.DataFieldForAction',
            Label  : 'Reject',
            Action : 'PSAService.reject'
        }

    ],


    // =================================================================
    // GENERAL INFORMATION
    // =================================================================

    UI.FieldGroup #GeneralInformation : {

        $Type : 'UI.FieldGroupType',

        Data : [

            {
                $Type : 'UI.DataField',
                Label : 'Employee',
                Value : employee.firstName
            },

            {
                $Type : 'UI.DataField',
                Label : 'Week Start Date',
                Value : weekStartDate
            },

            {
                $Type : 'UI.DataField',
                Label : 'Week End Date',
                Value : weekEndDate
            },

            {
                $Type : 'UI.DataField',
                Label : 'Status',
                Value : status
            }

        ]

    },


    // =================================================================
    // TIMESHEET SUMMARY
    // =================================================================

    UI.FieldGroup #TimesheetSummary : {

        $Type : 'UI.FieldGroupType',

        Data : [

            {
                $Type : 'UI.DataField',
                Label : 'Total Billable Hours',
                Value : totalBillableHours
            },

            {
                $Type : 'UI.DataField',
                Label : 'Submitted Date',
                Value : submittedDate
            },

            {
                $Type : 'UI.DataField',
                Label : 'Approved Date',
                Value : approvedDate
            },

            {
                $Type : 'UI.DataField',
                Label : 'Approved By',
                Value : approvedBy.managerLevel
            },

            {
                $Type : 'UI.DataField',
                Label : 'Rejection Reason',
                Value : rejectionReason
            }

        ]

    }

);


// =====================================================================
// SYSTEM CONTROLLED FIELDS
// =====================================================================

annotate service.Timesheets with {

    totalBillableHours @readonly;
    submittedDate      @readonly;
    approvedDate       @readonly;
    approvedBy         @readonly;
    rejectionReason    @readonly;
    invoice            @readonly;

};


// =====================================================================
// EMPLOYEE VALUE HELP
// =====================================================================

annotate service.Timesheets with {

    employee @Common.ValueList : {

        $Type : 'Common.ValueListType',

        CollectionPath : 'Employees',

        Parameters : [

            {
                $Type :
                    'Common.ValueListParameterInOut',

                LocalDataProperty :
                    employee_ID,

                ValueListProperty :
                    'ID'
            },

            {
                $Type :
                    'Common.ValueListParameterDisplayOnly',

                ValueListProperty :
                    'firstName'
            },

            {
                $Type :
                    'Common.ValueListParameterDisplayOnly',

                ValueListProperty :
                    'lastName'
            },

            {
                $Type :
                    'Common.ValueListParameterDisplayOnly',

                ValueListProperty :
                    'email'
            }

        ]

    }

};


// =====================================================================
// TIMESHEET ENTRIES
// =====================================================================

annotate service.TimesheetEntries with @(

    UI.HeaderInfo : {

        TypeName       : 'Time Entry',
        TypeNamePlural : 'Time Entries',

        Title : {
            $Type : 'UI.DataField',
            Value : task.taskName
        },

        Description : {
            $Type : 'UI.DataField',
            Value : workDate
        }

    },


    // =================================================================
    // ENTRY TABLE
    // =================================================================

    UI.LineItem : [

        {
            $Type : 'UI.DataField',
            Label : 'Work Date',
            Value : workDate
        },

        {
            $Type : 'UI.DataField',
            Label : 'Task',
            Value : task.taskName
        },

        {
            $Type : 'UI.DataField',
            Label : 'Hours',
            Value : hours
        },

        {
            $Type : 'UI.DataField',
            Label : 'Billable',
            Value : isBillable
        },

        {
            $Type : 'UI.DataField',
            Label : 'Notes',
            Value : notes
        }

    ],


    // =================================================================
    // ENTRY OBJECT PAGE
    // =================================================================

    UI.Facets : [

        {
            $Type  : 'UI.ReferenceFacet',
            ID     : 'EntryDetails',
            Label  : 'Entry Details',
            Target : '@UI.FieldGroup#EntryDetails'
        }

    ],


    UI.FieldGroup #EntryDetails : {

        $Type : 'UI.FieldGroupType',

        Data : [

            {
                $Type : 'UI.DataField',
                Label : 'Work Date',
                Value : workDate
            },

            {
                $Type : 'UI.DataField',
                Label : 'Task',
                Value : task.taskName
            },

            {
                $Type : 'UI.DataField',
                Label : 'Hours',
                Value : hours
            },

            {
                $Type : 'UI.DataField',
                Label : 'Billable',
                Value : isBillable
            },

            {
                $Type : 'UI.DataField',
                Label : 'Notes',
                Value : notes
            }

        ]

    }

);


// =====================================================================
// TASK VALUE HELP
// =====================================================================

annotate service.TimesheetEntries with {

    task @Common.ValueList : {

        $Type : 'Common.ValueListType',

        CollectionPath : 'Tasks',

        Parameters : [

            {
                $Type :
                    'Common.ValueListParameterInOut',

                LocalDataProperty :
                    task_ID,

                ValueListProperty :
                    'ID'
            },

            {
                $Type :
                    'Common.ValueListParameterDisplayOnly',

                ValueListProperty :
                    'taskName'
            },

            {
                $Type :
                    'Common.ValueListParameterDisplayOnly',

                ValueListProperty :
                    'status'
            },

            {
                $Type :
                    'Common.ValueListParameterDisplayOnly',

                ValueListProperty :
                    'estimatedHours'
            },

            {
                $Type :
                    'Common.ValueListParameterDisplayOnly',

                ValueListProperty :
                    'actualHours'
            }

        ]

    }

};


// =====================================================================
// CRUD CAPABILITIES
// =====================================================================

annotate service.Timesheets with @(

    Capabilities.InsertRestrictions : {
        Insertable : true
    },

    Capabilities.UpdateRestrictions : {
        Updatable : true
    },

    Capabilities.DeleteRestrictions : {
        Deletable : true
    }

);


annotate service.TimesheetEntries with @(

    Capabilities.InsertRestrictions : {
        Insertable : true
    },

    Capabilities.UpdateRestrictions : {
        Updatable : true
    },

    Capabilities.DeleteRestrictions : {
        Deletable : true
    }

);