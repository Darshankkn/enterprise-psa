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
        "psa.manager.portal.managerportal.controller.View1",
        {

            // =====================================================
            // INITIALIZATION
            // =====================================================

            onInit: function () {

                this._loadDashboard();

                this._refreshTimer = setInterval(() => {
                    this._loadDashboard();
                }, 15000);
            },


            onExit: function () {

                if (this._refreshTimer) {
                    clearInterval(this._refreshTimer);
                    this._refreshTimer = null;
                }
            },


            // =====================================================
            // DASHBOARD
            // =====================================================

            _loadDashboard: async function () {

                const oModel =
                    this.getOwnerComponent().getModel();

                const oDashboard = {

                    projects: 0,
                    employees: 0,
                    invoices: 0,
                    timesheets: 0,

                    pendingApprovals: 0,
                    pendingInvoices: 0,
                    budgetRisks: 0,

                    activeProjects: 0,
                    completedProjects: 0,
                    onHoldProjects: 0
                };

                try {

                    const [
                        aProjects,
                        aEmployees,
                        aInvoices,
                        aTimesheets
                    ] = await Promise.all([

                        oModel
                            .bindList("/Projects")
                            .requestContexts(0, 500),

                        oModel
                            .bindList("/Employees")
                            .requestContexts(0, 500),

                        oModel
                            .bindList("/Invoices")
                            .requestContexts(0, 500),

                        oModel
                            .bindList("/Timesheets")
                            .requestContexts(0, 500)
                    ]);


                    // =================================================
                    // COUNTS
                    // =================================================

                    oDashboard.projects =
                        aProjects.length;

                    oDashboard.employees =
                        aEmployees.length;

                    oDashboard.invoices =
                        aInvoices.length;

                    oDashboard.timesheets =
                        aTimesheets.length;


                    // =================================================
                    // OBJECTS
                    // =================================================

                    const aProjectObjects =
                        aProjects.map(
                            oContext =>
                                oContext.getObject()
                        );

                    const aInvoiceObjects =
                        aInvoices.map(
                            oContext =>
                                oContext.getObject()
                        );

                    const aTimesheetObjects =
                        aTimesheets.map(
                            oContext =>
                                oContext.getObject()
                        );


                    // =================================================
                    // PENDING TIMESHEET APPROVALS
                    // =================================================

                    oDashboard.pendingApprovals =
                        aTimesheetObjects.filter(
                            oTimesheet => {

                                const sStatus =
                                    (
                                        oTimesheet.status || ""
                                    ).toUpperCase();

                                return sStatus === "SUBMITTED";
                            }
                        ).length;


                    // =================================================
                    // PENDING INVOICES
                    // =================================================

                    oDashboard.pendingInvoices =
                        aInvoiceObjects.filter(
                            oInvoice => {

                                const sStatus =
                                    (
                                        oInvoice.status || ""
                                    ).toUpperCase();

                                return sStatus !== "PAID";
                            }
                        ).length;


                    // =================================================
                    // PROJECT HEALTH
                    // =================================================

                    oDashboard.budgetRisks =
                        aProjectObjects.filter(
                            oProject => {

                                return (
                                    oProject.budgetStatus || ""
                                )
                                    .toUpperCase()
                                    .includes("OVER");
                            }
                        ).length;


                    oDashboard.activeProjects =
                        aProjectObjects.filter(
                            oProject => {

                                return [
                                    "ACTIVE",
                                    "OPEN",
                                    "IN_PROGRESS"
                                ].includes(
                                    (
                                        oProject.status || ""
                                    ).toUpperCase()
                                );
                            }
                        ).length;


                    oDashboard.completedProjects =
                        aProjectObjects.filter(
                            oProject => {

                                return [
                                    "COMPLETED",
                                    "CLOSED"
                                ].includes(
                                    (
                                        oProject.status || ""
                                    ).toUpperCase()
                                );
                            }
                        ).length;


                    oDashboard.onHoldProjects =
                        aProjectObjects.filter(
                            oProject => {

                                return [
                                    "ON_HOLD",
                                    "HOLD"
                                ].includes(
                                    (
                                        oProject.status || ""
                                    ).toUpperCase()
                                );
                            }
                        ).length;

                } catch (oError) {

                    console.error(
                        "Manager dashboard loading failed:",
                        oError
                    );
                }


                // Reuse the model instead of recreating it
                // every 15 seconds.

                let oDashboardModel =
                    this.getView()
                        .getModel("dashboard");

                if (!oDashboardModel) {

                    oDashboardModel =
                        new JSONModel(oDashboard);

                    this.getView().setModel(
                        oDashboardModel,
                        "dashboard"
                    );

                } else {

                    oDashboardModel.setData(
                        oDashboard
                    );
                }
            },


            // =====================================================
            // DETAIL DIALOG
            // =====================================================

            _showDialog: function (
                sTitle,
                aItems
            ) {

                let oDialogModel =
                    this.getView()
                        .getModel("dialog");

                const oData = {
                    title: sTitle,
                    items: aItems
                };

                if (!oDialogModel) {

                    oDialogModel =
                        new JSONModel(oData);

                    this.getView().setModel(
                        oDialogModel,
                        "dialog"
                    );

                } else {

                    oDialogModel.setData(oData);
                }

                const oDialog =
                    this.byId("detailsDialog");

                if (oDialog) {

                    oDialog.open();

                } else {

                    console.error(
                        "detailsDialog could not be found."
                    );
                }
            },


            onCloseDialog: function () {

                const oDialog =
                    this.byId("detailsDialog");

                if (oDialog) {
                    oDialog.close();
                }
            },


            // =====================================================
            // PROJECT HEALTH
            // =====================================================

            onActiveProjects: async function () {

                try {

                    const oModel =
                        this.getOwnerComponent()
                            .getModel();

                    const aProjects =
                        await oModel
                            .bindList("/Projects")
                            .requestContexts(0, 500);

                    const aData =
                        aProjects
                            .map(
                                oContext =>
                                    oContext.getObject()
                            )
                            .filter(
                                oProject =>

                                    [
                                        "ACTIVE",
                                        "OPEN",
                                        "IN_PROGRESS"
                                    ].includes(
                                        (
                                            oProject.status || ""
                                        ).toUpperCase()
                                    )
                            );

                    this._showDialog(
                        "Active Projects",
                        aData
                    );

                } catch (oError) {

                    console.error(
                        "Active project loading failed:",
                        oError
                    );
                }
            },


            onCompletedProjects: async function () {

                try {

                    const oModel =
                        this.getOwnerComponent()
                            .getModel();

                    const aProjects =
                        await oModel
                            .bindList("/Projects")
                            .requestContexts(0, 500);

                    const aData =
                        aProjects
                            .map(
                                oContext =>
                                    oContext.getObject()
                            )
                            .filter(
                                oProject =>

                                    [
                                        "COMPLETED",
                                        "CLOSED"
                                    ].includes(
                                        (
                                            oProject.status || ""
                                        ).toUpperCase()
                                    )
                            );

                    this._showDialog(
                        "Completed Projects",
                        aData
                    );

                } catch (oError) {

                    console.error(
                        "Completed project loading failed:",
                        oError
                    );
                }
            },


            onHoldProjects: async function () {

                try {

                    const oModel =
                        this.getOwnerComponent()
                            .getModel();

                    const aProjects =
                        await oModel
                            .bindList("/Projects")
                            .requestContexts(0, 500);

                    const aData =
                        aProjects
                            .map(
                                oContext =>
                                    oContext.getObject()
                            )
                            .filter(
                                oProject =>

                                    [
                                        "ON_HOLD",
                                        "HOLD"
                                    ].includes(
                                        (
                                            oProject.status || ""
                                        ).toUpperCase()
                                    )
                            );

                    this._showDialog(
                        "Projects On Hold",
                        aData
                    );

                } catch (oError) {

                    console.error(
                        "On-hold project loading failed:",
                        oError
                    );
                }
            },


            // =====================================================
            // PENDING ACTIONS
            // =====================================================

            onPendingTimesheets: async function () {

                try {

                    const oModel =
                        this.getOwnerComponent()
                            .getModel();

                    const aTimesheets =
                        await oModel
                            .bindList("/Timesheets")
                            .requestContexts(0, 500);

                    const aData =
                        aTimesheets
                            .map(
                                oContext =>
                                    oContext.getObject()
                            )
                            .filter(
                                oTimesheet =>

                                    (
                                        oTimesheet.status || ""
                                    ).toUpperCase() ===
                                    "SUBMITTED"
                            );

                    this._showDialog(
                        "Pending Timesheets",
                        aData
                    );

                } catch (oError) {

                    console.error(
                        "Pending timesheet loading failed:",
                        oError
                    );
                }
            },


            onPendingInvoices: async function () {

                try {

                    const oModel =
                        this.getOwnerComponent()
                            .getModel();

                    const aInvoices =
                        await oModel
                            .bindList("/Invoices")
                            .requestContexts(0, 500);

                    const aData =
                        aInvoices
                            .map(
                                oContext =>
                                    oContext.getObject()
                            )
                            .filter(
                                oInvoice =>

                                    (
                                        oInvoice.status || ""
                                    ).toUpperCase() !==
                                    "PAID"
                            );

                    this._showDialog(
                        "Pending Invoices",
                        aData
                    );

                } catch (oError) {

                    console.error(
                        "Pending invoice loading failed:",
                        oError
                    );
                }
            },


            onOverBudgetProjects: async function () {

                try {

                    const oModel =
                        this.getOwnerComponent()
                            .getModel();

                    /*
                     * IMPORTANT:
                     * budgetStatus existed in your previous
                     * ProjectOverview model.
                     *
                     * If Projects itself does NOT expose
                     * budgetStatus, change this later to
                     * /ProjectOverview or /Budgets.
                     */

                    const aProjects =
                        await oModel
                            .bindList("/Projects")
                            .requestContexts(0, 500);

                    const aData =
                        aProjects
                            .map(
                                oContext =>
                                    oContext.getObject()
                            )
                            .filter(
                                oProject =>

                                    (
                                        oProject.budgetStatus || ""
                                    )
                                        .toUpperCase()
                                        .includes("OVER")
                            );

                    this._showDialog(
                        "Projects Over Budget",
                        aData
                    );

                } catch (oError) {

                    console.error(
                        "Budget-risk loading failed:",
                        oError
                    );
                }
            },


            // =====================================================
            // APPLICATION MENU NAVIGATION
            // =====================================================

            onMenuNavigation: function (oEvent) {

                /*
                 * Support both:
                 *
                 * sap.m.List / itemPress
                 *      -> listItem
                 *
                 * sap.tnt.NavigationList
                 *      -> item
                 *
                 * and direct press handlers where the
                 * source itself is the selected item.
                 */

                const oItem =
                    oEvent.getParameter("item") ||
                    oEvent.getParameter("listItem") ||
                    oEvent.getSource();

                if (!oItem) {

                    console.error(
                        "Navigation failed: selected menu item was not found."
                    );

                    MessageToast.show(
                        "Unable to identify selected application."
                    );

                    return;
                }


                // =================================================
                // GET MENU KEY
                // =================================================

                let sKey = "";

                if (
                    typeof oItem.getKey ===
                    "function"
                ) {

                    sKey =
                        oItem.getKey() || "";
                }


                // =================================================
                // FALLBACK TO CONTROL ID
                // =================================================

                if (!sKey) {

                    const sId =
                        oItem.getId
                            ? oItem.getId()
                            : "";

                    if (
                        sId.includes(
                            "navProjects"
                        )
                    ) {
                        sKey = "projects";
                    }

                    else if (
                        sId.includes(
                            "navEmployees"
                        )
                    ) {
                        sKey = "employees";
                    }

                    else if (
                        sId.includes(
                            "navInvoices"
                        )
                    ) {
                        sKey = "invoices";
                    }

                    else if (
                        sId.includes(
                            "navTimesheets"
                        )
                    ) {
                        sKey = "timesheets";
                    }

                    else if (
                        sId.includes(
                            "navAnalytics"
                        )
                    ) {
                        sKey = "analytics";
                    }
                }


                // =================================================
                // NORMALIZE KEY
                // =================================================

                sKey =
                    String(sKey)
                        .trim()
                        .toLowerCase();


                console.log(
                    "Selected manager application:",
                    sKey
                );


                // =================================================
                // APPLICATION PATH
                // =================================================

                const mApplications = {

                    projects:
                        "/projectmanagement/index.html",

                    employees:
                        "/employeesmanagement/index.html",

                    invoices:
                        "/invoicemanagement/index.html",

                    timesheets:
                        "/timesheetmanagement/index.html",

                    analytics:
                        "/manager/index.html"
                };


                const sTarget =
                    mApplications[sKey];


                if (!sTarget) {

                    console.error(
                        "No application mapping found for:",
                        sKey
                    );

                    MessageToast.show(
                        "Navigation target is not configured."
                    );

                    return;
                }


                // =================================================
                // NAVIGATE
                // =================================================

                window.location.href =
                    sTarget;
            },
            // =====================================================
// APPLICATION NAVIGATION
// =====================================================

onProjects: function () {
    window.location.href =
        "/projectmanagement/index.html";
},

onEmployees: function () {
    window.location.href =
        "/employeesmanagement/index.html";
},

onInvoices: function () {
    window.location.href =
        "/invoicemanagement/index.html";
},

onTimesheets: function () {
    window.location.href =
        "/timesheetmanagement/index.html";
},

onAnalytics: function () {
    window.location.href =
        "/manager/index.html";
}

        },
        
    );
    
},
);