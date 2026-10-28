using PSAService as service from '../../srv/cat-services';


// =====================================================================
// INVOICES
// =====================================================================

annotate service.Invoices with @(

    // -----------------------------------------------------------------
    // HEADER
    // -----------------------------------------------------------------

    UI.HeaderInfo : {

        TypeName       : 'Invoice',
        TypeNamePlural : 'Invoices',

        Title : {
            $Type : 'UI.DataField',
            Value : project.projectCode
        },

        Description : {
            $Type : 'UI.DataField',
            Value : paymentStatus
        }
    },


    // -----------------------------------------------------------------
    // FILTER BAR
    // -----------------------------------------------------------------

    UI.SelectionFields : [
        client_ID,
        project_ID,
        invoiceDate,
        paymentStatus
    ],


    // -----------------------------------------------------------------
    // LIST REPORT
    // -----------------------------------------------------------------

    UI.LineItem : [

        {
            $Type : 'UI.DataField',
            Label : 'Project',
            Value : project.projectCode
        },

        {
            $Type : 'UI.DataField',
            Label : 'Client',
            Value : client.clientName
        },

        {
            $Type : 'UI.DataField',
            Label : 'Invoice Date',
            Value : invoiceDate
        },

        {
            $Type : 'UI.DataField',
            Label : 'Due Date',
            Value : dueDate
        },

        {
            $Type : 'UI.DataField',
            Label : 'Billable Hours',
            Value : billableHours
        },

        {
            $Type : 'UI.DataField',
            Label : 'Total Amount',
            Value : totalAmount
        },

        {
            $Type : 'UI.DataField',
            Label : 'Currency',
            Value : currencyCode
        },

        {
            $Type : 'UI.DataField',
            Label : 'Payment Status',
            Value : paymentStatus
        },
        

    ],
    UI.Identification : [

    {
        $Type  : 'UI.DataFieldForAction',
        Label  : 'Issue Invoice',
        Action : 'PSAService.issue'
    },

    {
        $Type  : 'UI.DataFieldForAction',
        Label  : 'Mark Paid',
        Action : 'PSAService.markPaid'
    }

],


    // -----------------------------------------------------------------
    // OBJECT PAGE SECTIONS
    // -----------------------------------------------------------------

    UI.Facets : [

        {
            $Type  : 'UI.ReferenceFacet',
            ID     : 'InvoiceInformation',
            Label  : 'Invoice Information',
            Target : '@UI.FieldGroup#InvoiceInformation'
        },

        {
            $Type  : 'UI.ReferenceFacet',
            ID     : 'BillingInformation',
            Label  : 'Billing Information',
            Target : '@UI.FieldGroup#BillingInformation'
        },

        {
            $Type  : 'UI.ReferenceFacet',
            ID     : 'PaymentInformation',
            Label  : 'Payment Information',
            Target : '@UI.FieldGroup#PaymentInformation'
        },

        // {
        //     $Type  : 'UI.ReferenceFacet',
        //     ID     : 'Timesheets',
        //     Label  : 'Timesheets',
        //     Target : 'timesheets/@UI.LineItem'
        // }

    ],


    // -----------------------------------------------------------------
    // INVOICE INFORMATION
    // -----------------------------------------------------------------

    UI.FieldGroup #InvoiceInformation : {

        $Type : 'UI.FieldGroupType',

        Data : [

            {
                $Type : 'UI.DataField',
                Label : 'Project',
                Value : project.projectName
            },

            {
                $Type : 'UI.DataField',
                Label : 'Project Code',
                Value : project.projectCode
            },

            {
                $Type : 'UI.DataField',
                Label : 'Client',
                Value : client.clientName
            },

            {
                $Type : 'UI.DataField',
                Label : 'Invoice Date',
                Value : invoiceDate
            },

            {
                $Type : 'UI.DataField',
                Label : 'Due Date',
                Value : dueDate
            }

        ]
    },


    // -----------------------------------------------------------------
    // BILLING INFORMATION
    // -----------------------------------------------------------------

    UI.FieldGroup #BillingInformation : {

        $Type : 'UI.FieldGroupType',

        Data : [

            {
                $Type : 'UI.DataField',
                Label : 'Billable Hours',
                Value : billableHours
            },

            {
                $Type : 'UI.DataField',
                Label : 'Total Amount',
                Value : totalAmount
            },

            {
                $Type : 'UI.DataField',
                Label : 'Tax Amount',
                Value : taxAmount
            },

            {
                $Type : 'UI.DataField',
                Label : 'Currency',
                Value : currencyCode
            }

        ]
    },


    // -----------------------------------------------------------------
    // PAYMENT INFORMATION
    // -----------------------------------------------------------------

    UI.FieldGroup #PaymentInformation : {

        $Type : 'UI.FieldGroupType',

        Data : [

            {
                $Type : 'UI.DataField',
                Label : 'Payment Status',
                Value : paymentStatus
            },

            {
                $Type : 'UI.DataField',
                Label : 'Payment Date',
                Value : paymentDate
            }

        ]
    }

);


// =====================================================================
// CLIENT VALUE HELP
// =====================================================================

annotate service.Invoices with {

    client @Common.ValueList : {

        $Type : 'Common.ValueListType',

        CollectionPath : 'Clients',

        Parameters : [

            {
                $Type : 'Common.ValueListParameterInOut',

                LocalDataProperty : client_ID,

                ValueListProperty : 'ID'
            },

            {
                $Type : 'Common.ValueListParameterDisplayOnly',

                ValueListProperty : 'clientName'
            },

            {
                $Type : 'Common.ValueListParameterDisplayOnly',

                ValueListProperty : 'contactPerson'
            },

            {
                $Type : 'Common.ValueListParameterDisplayOnly',

                ValueListProperty : 'email'
            },

            {
                $Type : 'Common.ValueListParameterDisplayOnly',

                ValueListProperty : 'phoneNo'
            }

        ]
    }

};


// =====================================================================
// PROJECT VALUE HELP
// =====================================================================

annotate service.Invoices with {

    project @Common.ValueList : {

        $Type : 'Common.ValueListType',

        CollectionPath : 'Projects',

        Parameters : [

            {
                $Type : 'Common.ValueListParameterInOut',

                LocalDataProperty : project_ID,

                ValueListProperty : 'ID'
            },

            {
                $Type : 'Common.ValueListParameterDisplayOnly',

                ValueListProperty : 'projectCode'
            },

            {
                $Type : 'Common.ValueListParameterDisplayOnly',

                ValueListProperty : 'projectName'
            },

            {
                $Type : 'Common.ValueListParameterDisplayOnly',

                ValueListProperty : 'billingType'
            },

            {
                $Type : 'Common.ValueListParameterDisplayOnly',

                ValueListProperty : 'status'
            }

        ]
    }

};


// =====================================================================
// SYSTEM-CONTROLLED INVOICE FIELDS
// =====================================================================
//
// These should normally come from generateInvoice().
//
// =====================================================================

annotate service.Invoices with {

    billableHours @readonly;

    totalAmount @readonly;

    taxAmount @readonly;

    paymentStatus @readonly;

    paymentDate @readonly;

};


