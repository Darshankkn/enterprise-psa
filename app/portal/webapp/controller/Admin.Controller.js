sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (
    Controller,
    MessageToast
) {
    "use strict";

    return Controller.extend(
        "psa.portal.controller.Admin",
        {

            // =====================================================
            // BACK
            // =====================================================

            onBack: function () {

                this.getOwnerComponent()
                    .getRouter()
                    .navTo(
                        "home",
                        {},
                        true
                    );
            },


            // =====================================================
            // EMPLOYEE MANAGEMENT
            // =====================================================

            onEmployeeManagement: function () {

                window.location.href =
                    "/employeesmanagement/index.html";
            },


            // =====================================================
            // PROJECT MANAGEMENT
            // =====================================================

            onProjectManagement: function () {

                window.location.href =
                    "/projectmanagement/index.html";
            },


            // =====================================================
            // TIMESHEET MANAGEMENT
            // =====================================================

            onTimesheetManagement: function () {

                window.location.href =
                    "/timesheetmanagement/index.html";
            },


            // =====================================================
            // INVOICE MANAGEMENT
            // =====================================================

            onInvoiceManagement: function () {

                window.location.href =
                    "/invoicemanagement/index.html";
            },


            // =====================================================
            // MANAGER DASHBOARD
            // =====================================================

            onManagerPortal: function () {

                window.location.href =
                    "/managerportal/index.html";
            },


            // =====================================================
            // EMPLOYEE TIMESHEET
            // =====================================================

            onEmployeeTimesheet: function () {

                window.location.href =
                    "/mytimesheet/index.html";
            },


            // =====================================================
            // MASTER DATA PLACEHOLDER
            // =====================================================

            onMasterData: function () {

                MessageToast.show(
                    "Master Data administration will be connected here."
                );
            }

        }
    );
});