using PSAService as service from '../../srv/cat-services';

annotate service.Employees with @(

    // ============================================================
    // HEADER
    // ============================================================

    UI.HeaderInfo : {
        TypeName       : 'Employee',
        TypeNamePlural : 'Employees',

        Title : {
            $Type : 'UI.DataField',
            Value : firstName
        },

        Description : {
            $Type : 'UI.DataField',
            Value : jobTitle
        }
    },

    // ============================================================
    // FILTER BAR
    // ============================================================

    UI.SelectionFields : [
        firstName,
        lastName,
        email,
        status,
        department_ID,
        manager_ID
    ],

    // ============================================================
    // LIST REPORT
    // ============================================================

    UI.LineItem : [

        {
            $Type : 'UI.DataField',
            Label : 'First Name',
            Value : firstName
        },

        {
            $Type : 'UI.DataField',
            Label : 'Last Name',
            Value : lastName
        },

        {
            $Type : 'UI.DataField',
            Label : 'Email',
            Value : email
        },

        {
            $Type : 'UI.DataField',
            Label : 'Department',
            Value : department.departmentName
        },

        {
            $Type : 'UI.DataField',
            Label : 'Manager',
            Value : manager.managerLevel
        },

        {
            $Type : 'UI.DataField',
            Label : 'Job Title',
            Value : jobTitle
        },

        {
            $Type : 'UI.DataField',
            Label : 'Status',
            Value : status
        }

    ],

    // ============================================================
    // OBJECT PAGE FACETS
    // ============================================================

    UI.Facets : [

        {
            $Type  : 'UI.ReferenceFacet',
            ID     : 'GeneralInformation',
            Label  : 'General Information',
            Target : '@UI.FieldGroup#GeneralInformation'
        },

        {
            $Type  : 'UI.ReferenceFacet',
            ID     : 'Organization',
            Label  : 'Organization Details',
            Target : '@UI.FieldGroup#Organization'
        },

        {
            $Type  : 'UI.ReferenceFacet',
            ID     : 'Employment',
            Label  : 'Employment Details',
            Target : '@UI.FieldGroup#Employment'
        }

    ],

    // ============================================================
    // GENERAL INFORMATION
    // ============================================================

    UI.FieldGroup #GeneralInformation : {
        $Type : 'UI.FieldGroupType',

        Data : [

            {
                $Type : 'UI.DataField',
                Label : 'First Name',
                Value : firstName
            },

            {
                $Type : 'UI.DataField',
                Label : 'Last Name',
                Value : lastName
            },

            {
                $Type : 'UI.DataField',
                Label : 'Email',
                Value : email
            },

            {
                $Type : 'UI.DataField',
                Label : 'Phone Number',
                Value : phoneNo
            }

        ]
    },

    // ============================================================
    // ORGANIZATION
    // ============================================================

    UI.FieldGroup #Organization : {
        $Type : 'UI.FieldGroupType',

        Data : [

            {
                $Type : 'UI.DataField',
                Label : 'Department',
                Value : department.departmentName
            },

            {
                $Type : 'UI.DataField',
                Label : 'Manager',
                Value : manager.managerLevel
            }

        ]
    },

    // ============================================================
    // EMPLOYMENT
    // ============================================================

    UI.FieldGroup #Employment : {
        $Type : 'UI.FieldGroupType',

        Data : [

            {
                $Type : 'UI.DataField',
                Label : 'Job Title',
                Value : jobTitle
            },

            {
                $Type : 'UI.DataField',
                Label : 'Join Date',
                Value : joinDate
            },

            {
                $Type : 'UI.DataField',
                Label : 'Hourly Rate',
                Value : hourlyRate
            },

            {
                $Type : 'UI.DataField',
                Label : 'Status',
                Value : status
            }

        ]
    }

);

// ============================================================
// DEPARTMENT VALUE HELP
// ============================================================

annotate service.Employees with {

    department @Common.ValueList : {

        $Type : 'Common.ValueListType',

        CollectionPath : 'Departments',

        Parameters : [

            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : department_ID,
                ValueListProperty : 'ID'
            },

            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'departmentName'
            },

            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'description'
            }

        ]

    }

};

// ============================================================
// MANAGER VALUE HELP
// ============================================================

annotate service.Employees with {

    manager @Common.ValueList : {

        $Type : 'Common.ValueListType',

        CollectionPath : 'Managers',

        Parameters : [

            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : manager_ID,
                ValueListProperty : 'ID'
            },

            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'managerLevel'
            },

            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'status'
            }

        ]

    }

};

// ============================================================
// CRUD CAPABILITIES
// ============================================================

annotate service.Employees with @(

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