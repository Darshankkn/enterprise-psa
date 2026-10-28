using PSAService as service from '../../srv/cat-services';


// =====================================================================
// PROJECTS
// =====================================================================

annotate service.Projects with @(

    UI.HeaderInfo : {
        TypeName       : 'Project',
        TypeNamePlural : 'Projects',

        Title : {
            $Type : 'UI.DataField',
            Value : projectName
        },

        Description : {
            $Type : 'UI.DataField',
            Value : projectCode
        }
    },


    // -----------------------------------------------------------------
    // FILTER BAR
    // -----------------------------------------------------------------

    UI.SelectionFields : [
        projectCode,
        projectName,
        client_ID,
        manager_ID,
        status,
        priority,
        billingType
    ],


    // -----------------------------------------------------------------
    // LIST REPORT
    // -----------------------------------------------------------------

    UI.LineItem : [

        {
            $Type : 'UI.DataField',
            Label : 'Project Code',
            Value : projectCode
        },

        {
            $Type : 'UI.DataField',
            Label : 'Project Name',
            Value : projectName
        },

        {
            $Type : 'UI.DataField',
            Label : 'Client',
            Value : client.clientName
        },

        {
            $Type : 'UI.DataField',
            Label : 'Billing Type',
            Value : billingType
        },

        {
            $Type : 'UI.DataField',
            Label : 'Start Date',
            Value : startDate
        },

        {
            $Type : 'UI.DataField',
            Label : 'End Date',
            Value : endDate
        },

        {
            $Type : 'UI.DataField',
            Label : 'Status',
            Value : status
        },

        {
            $Type : 'UI.DataField',
            Label : 'Priority',
            Value : priority
        },

        {
            $Type : 'UI.DataField',
            Label : 'Planned Hours',
            Value : plannedHours
        },

        {
            $Type : 'UI.DataField',
            Label : 'Consumed Hours',
            Value : consumedHours
        }

    ],


    // -----------------------------------------------------------------
    // OBJECT PAGE FACETS
    // -----------------------------------------------------------------

    UI.Facets : [

        {
            $Type  : 'UI.ReferenceFacet',
            ID     : 'GeneralInformation',
            Label  : 'General Information',
            Target : '@UI.FieldGroup#GeneralInformation'
        },

        {
            $Type  : 'UI.ReferenceFacet',
            ID     : 'Planning',
            Label  : 'Planning',
            Target : '@UI.FieldGroup#Planning'
        },

        {
            $Type  : 'UI.ReferenceFacet',
            ID     : 'Budget',
            Label  : 'Budget',
            Target : 'budget/@UI.FieldGroup#BudgetDetails'
        },

        {
            $Type  : 'UI.ReferenceFacet',
            ID     : 'Milestones',
            Label  : 'Milestones',
            Target : 'milestones/@UI.LineItem'
        },

        {
            $Type  : 'UI.ReferenceFacet',
            ID     : 'Invoices',
            Label  : 'Invoices',
            Target : 'invoices/@UI.LineItem'
        },
        

    ],
    


    // -----------------------------------------------------------------
    // GENERAL INFORMATION
    // -----------------------------------------------------------------

    UI.FieldGroup #GeneralInformation : {

        $Type : 'UI.FieldGroupType',

        Data : [

            {
                $Type : 'UI.DataField',
                Label : 'Project Code',
                Value : projectCode
            },

            {
                $Type : 'UI.DataField',
                Label : 'Project Name',
                Value : projectName
            },

            {
                $Type : 'UI.DataField',
                Label : 'Description',
                Value : description
            },

            {
                $Type : 'UI.DataField',
                Label : 'Client',
                Value : client.clientName
            },

            {
                $Type : 'UI.DataField',
                Label : 'Manager Level',
                Value : manager.managerLevel
            },

            {
                $Type : 'UI.DataField',
                Label : 'Billing Type',
                Value : billingType
            },

            {
                $Type : 'UI.DataField',
                Label : 'Status',
                Value : status
            },

            {
                $Type : 'UI.DataField',
                Label : 'Priority',
                Value : priority
            }

        ]
    },


    // -----------------------------------------------------------------
    // PLANNING
    // -----------------------------------------------------------------

    UI.FieldGroup #Planning : {

        $Type : 'UI.FieldGroupType',

        Data : [

            {
                $Type : 'UI.DataField',
                Label : 'Start Date',
                Value : startDate
            },

            {
                $Type : 'UI.DataField',
                Label : 'End Date',
                Value : endDate
            },

            {
                $Type : 'UI.DataField',
                Label : 'Planned Hours',
                Value : plannedHours
            },

            {
                $Type : 'UI.DataField',
                Label : 'Consumed Hours',
                Value : consumedHours
            }

        ]
    }

);


// =====================================================================
// PROJECT -> CLIENT VALUE HELP
// =====================================================================

annotate service.Projects with {

    client @Common.ValueList : {

        $Type          : 'Common.ValueListType',
        CollectionPath : 'Clients',

        Parameters : [

            {
                $Type             : 'Common.ValueListParameterInOut',
                LocalDataProperty : client_ID,
                ValueListProperty : 'ID'
            },

            {
                $Type             : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'clientName'
            },

            {
                $Type             : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'contactPerson'
            },

            {
                $Type             : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'email'
            },

            {
                $Type             : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'phoneNo'
            }

        ]
    }

};


// =====================================================================
// PROJECT -> MANAGER VALUE HELP
// =====================================================================

annotate service.Projects with {

    manager @Common.ValueList : {

        $Type          : 'Common.ValueListType',
        CollectionPath : 'Managers',

        Parameters : [

            {
                $Type             : 'Common.ValueListParameterInOut',
                LocalDataProperty : manager_ID,
                ValueListProperty : 'ID'
            },

            {
                $Type             : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'managerLevel'
            },

            {
                $Type             : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'status'
            }

        ]
    }

};


// =====================================================================
// BUDGETS
// =====================================================================

annotate service.Budgets with @(

    UI.HeaderInfo : {
        TypeName       : 'Budget',
        TypeNamePlural : 'Budgets'
    },


    UI.LineItem : [

        {
            $Type : 'UI.DataField',
            Label : 'Budget Amount',
            Value : budgetAmount
        },

        {
            $Type : 'UI.DataField',
            Label : 'Consumed Amount',
            Value : consumedAmount
        },

        {
            $Type : 'UI.DataField',
            Label : 'Remaining Amount',
            Value : remainingAmount
        },

        {
            $Type : 'UI.DataField',
            Label : 'Status',
            Value : budgetStatus
        },

        {
            $Type : 'UI.DataField',
            Label : 'Currency',
            Value : currencyCode
        }

    ],


    UI.FieldGroup #BudgetDetails : {

        $Type : 'UI.FieldGroupType',

        Data : [

            {
                $Type : 'UI.DataField',
                Label : 'Budget Amount',
                Value : budgetAmount
            },

            {
                $Type : 'UI.DataField',
                Label : 'Consumed Amount',
                Value : consumedAmount
            },

            {
                $Type : 'UI.DataField',
                Label : 'Remaining Amount',
                Value : remainingAmount
            },

            {
                $Type : 'UI.DataField',
                Label : 'Billing Rate / Hour',
                Value : billingRateHr
            },

            {
                $Type : 'UI.DataField',
                Label : 'Budget Status',
                Value : budgetStatus
            },

            {
                $Type : 'UI.DataField',
                Label : 'Currency',
                Value : currencyCode
            }

        ]
    }

);


// =====================================================================
// MILESTONES
// =====================================================================

annotate service.Milestones with @(

    UI.HeaderInfo : {

        TypeName       : 'Milestone',
        TypeNamePlural : 'Milestones',

        Title : {
            $Type : 'UI.DataField',
            Value : milestoneName
        },

        Description : {
            $Type : 'UI.DataField',
            Value : status
        }

    },


    UI.LineItem : [

        {
            $Type : 'UI.DataField',
            Label : 'Milestone',
            Value : milestoneName
        },

        {
            $Type : 'UI.DataField',
            Label : 'Start Date',
            Value : startDate
        },

        {
            $Type : 'UI.DataField',
            Label : 'End Date',
            Value : endDate
        },

        {
            $Type : 'UI.DataField',
            Label : 'Completion %',
            Value : completionPercent
        },

        {
            $Type : 'UI.DataField',
            Label : 'Status',
            Value : status
        },

        {
            $Type : 'UI.DataField',
            Label : 'Priority',
            Value : priority
        }

    ],


    UI.Facets : [

        {
            $Type  : 'UI.ReferenceFacet',
            ID     : 'MilestoneDetails',
            Label  : 'Milestone Details',
            Target : '@UI.FieldGroup#MilestoneDetails'
        },

        {
            $Type  : 'UI.ReferenceFacet',
            ID     : 'Tasks',
            Label  : 'Tasks',
            Target : 'tasks/@UI.LineItem'
        }

    ],


    UI.FieldGroup #MilestoneDetails : {

        $Type : 'UI.FieldGroupType',

        Data : [

            {
                $Type : 'UI.DataField',
                Label : 'Milestone Name',
                Value : milestoneName
            },

            {
                $Type : 'UI.DataField',
                Label : 'Description',
                Value : description
            },

            {
                $Type : 'UI.DataField',
                Label : 'Start Date',
                Value : startDate
            },

            {
                $Type : 'UI.DataField',
                Label : 'End Date',
                Value : endDate
            },

            {
                $Type : 'UI.DataField',
                Label : 'Completion %',
                Value : completionPercent
            },

            {
                $Type : 'UI.DataField',
                Label : 'Status',
                Value : status
            },

            {
                $Type : 'UI.DataField',
                Label : 'Priority',
                Value : priority
            }

        ]
    }

);


// =====================================================================
// TASKS
// =====================================================================

annotate service.Tasks with @(

    UI.HeaderInfo : {

        TypeName       : 'Task',
        TypeNamePlural : 'Tasks',

        Title : {
            $Type : 'UI.DataField',
            Value : taskName
        },

        Description : {
            $Type : 'UI.DataField',
            Value : status
        }

    },


    UI.LineItem : [

        {
            $Type : 'UI.DataField',
            Label : 'Task',
            Value : taskName
        },

        {
            $Type : 'UI.DataField',
            Label : 'Start Date',
            Value : startDate
        },

        {
            $Type : 'UI.DataField',
            Label : 'End Date',
            Value : endDate
        },

        {
            $Type : 'UI.DataField',
            Label : 'Estimated Hours',
            Value : estimatedHours
        },

        {
            $Type : 'UI.DataField',
            Label : 'Actual Hours',
            Value : actualHours
        },

        {
            $Type : 'UI.DataField',
            Label : 'Status',
            Value : status
        },

        {
            $Type : 'UI.DataField',
            Label : 'Priority',
            Value : priority
        }

    ],


    UI.FieldGroup #TaskDetails : {

        $Type : 'UI.FieldGroupType',

        Data : [

            {
                $Type : 'UI.DataField',
                Label : 'Task Name',
                Value : taskName
            },

            {
                $Type : 'UI.DataField',
                Label : 'Description',
                Value : description
            },

            {
                $Type : 'UI.DataField',
                Label : 'Start Date',
                Value : startDate
            },

            {
                $Type : 'UI.DataField',
                Label : 'End Date',
                Value : endDate
            },

            {
                $Type : 'UI.DataField',
                Label : 'Estimated Hours',
                Value : estimatedHours
            },

            {
                $Type : 'UI.DataField',
                Label : 'Actual Hours',
                Value : actualHours
            },

            {
                $Type : 'UI.DataField',
                Label : 'Status',
                Value : status
            },

            {
                $Type : 'UI.DataField',
                Label : 'Priority',
                Value : priority
            }

        ]
    },

);



// =====================================================================
// INVOICES
// =====================================================================

