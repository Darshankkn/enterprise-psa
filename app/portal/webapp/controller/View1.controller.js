sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (
    Controller,
    JSONModel,
    MessageToast
) {
    "use strict";

    return Controller.extend(
        "psa.portal.controller.View1",
        {

            // =====================================================
            // INITIALIZATION
            // =====================================================

            onInit: function () {

                /*
                 * TEMPORARY ACCESS SETTINGS.
                 *
                 * All portals are enabled so that the complete
                 * navigation flow can first be tested.
                 *
                 * Later these will come from authenticated roles.
                 */

                const oRolesModel =
                    new JSONModel({
                        employee: true,
                        manager: true,
                        finance: true,
                        admin: true,
                        noAccess: false
                    });

                this.getView().setModel(
                    oRolesModel,
                    "roles"
                );
            },


            // =====================================================
            // EMPLOYEE PORTAL
            // =====================================================

            onEmployeePortal: function () {

                window.location.href =
                    "/mytimesheet/index.html";
            },


            // =====================================================
            // MANAGER PORTAL
            // =====================================================

            onManagerPortal: function () {

                window.location.href =
                    "/managerportal/index.html";
            },


            // =====================================================
            // FINANCE PORTAL
            // =====================================================

            onFinancePortal: function () {

                /*
                 * Currently Invoice Management acts
                 * as the Finance workspace.
                 *
                 * Later this can point to a dedicated
                 * Finance Portal dashboard.
                 */

                window.location.href =
                    "/invoicemanagement/index.html";
            },


            // =====================================================
            // ADMIN PORTAL
            // =====================================================

            onAdminPortal: function () {

                /*
                 * Admin is NOT another app.
                 *
                 * It is another route inside this
                 * PSA Portal UI5 component.
                 */

                this.getOwnerComponent()
                    .getRouter()
                    .navTo("admin");
            }

        }
    );
});