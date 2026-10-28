sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (
    Controller,
    JSONModel,
    MessageToast,
    MessageBox
) {
    "use strict";

    return Controller.extend(
        "psa.employee.mytimesheet.controller.View1",
        {

            // =========================================================
            // INITIALIZATION
            // =========================================================

            onInit: function () {

                const oToday = new Date();
                const oMonday = this._getMonday(oToday);

                // -----------------------------------------------------
                // CURRENT TIMESHEET MODEL
                // -----------------------------------------------------

                const oTimesheetModel = new JSONModel({

                    busy: false,

                    timesheetID: null,

                    projectID: null,
                    projectCode: "",
                    projectName: "",
                    projectDisplay: "No Project Selected",

                    weekStart: this._formatDate(oMonday),

                    weekEnd: this._formatDate(
                        this._addDays(oMonday, 6)
                    ),

                    weekLabel: "",

                    status: "DRAFT",
                    statusState: "Information",

                    rejectionReason: "",

                    hasTimesheet: false,

                    editable: false,
                    canDelete: false,
                    canSubmit: false,

                    isSubmitted: false,
                    isApproved: false,
                    isRejected: false,

                    weeklyTotal: 0,
                    billableTotal: 0,

                    rows: []
                });

                this.getView().setModel(
                    oTimesheetModel,
                    "timesheet"
                );


                // -----------------------------------------------------
                // TASK MODEL
                // -----------------------------------------------------

                this.getView().setModel(
                    new JSONModel({
                        tasks: []
                    }),
                    "taskModel"
                );


                // -----------------------------------------------------
                // PROJECT MODEL
                // -----------------------------------------------------

                this.getView().setModel(
                    new JSONModel({
                        projects: []
                    }),
                    "projectModel"
                );


                // -----------------------------------------------------
                // CREATE TIMESHEET MODEL
                // -----------------------------------------------------

                this.getView().setModel(
                    new JSONModel({

                        projectID: "",

                        weekStartDate:
                            this._formatDate(oMonday)

                    }),
                    "createTimesheet"
                );


                // -----------------------------------------------------
                // HISTORY MODEL
                // -----------------------------------------------------

                this.getView().setModel(
                    new JSONModel({
                        items: []
                    }),
                    "history"
                );


                this._updateWeekLabel();

                this._loadTasks();

                this._loadProjects();
            },


            // =========================================================
            // DATE HELPERS
            // =========================================================

            _getMonday: function (oDate) {

                const d = new Date(oDate);

                const iDay = d.getDay();

                const iDifference =
                    d.getDate() -
                    iDay +
                    (iDay === 0 ? -6 : 1);

                d.setDate(iDifference);

                d.setHours(0, 0, 0, 0);

                return d;
            },


            _addDays: function (oDate, iDays) {

                const d = new Date(oDate);

                d.setDate(
                    d.getDate() + iDays
                );

                return d;
            },


            _formatDate: function (oDate) {

                const iYear =
                    oDate.getFullYear();

                const sMonth =
                    String(
                        oDate.getMonth() + 1
                    ).padStart(2, "0");

                const sDay =
                    String(
                        oDate.getDate()
                    ).padStart(2, "0");

                return (
                    iYear +
                    "-" +
                    sMonth +
                    "-" +
                    sDay
                );
            },


            _parseDate: function (sDate) {

                if (!sDate) {
                    return null;
                }

                return new Date(
                    sDate + "T00:00:00"
                );
            },


            _formatDisplayDate: function (sDate) {

                if (!sDate) {
                    return "";
                }

                const aParts =
                    sDate.split("-");

                const oDate =
                    new Date(
                        Number(aParts[0]),
                        Number(aParts[1]) - 1,
                        Number(aParts[2])
                    );

                return oDate.toLocaleDateString(
                    "en-GB",
                    {
                        day: "2-digit",
                        month: "short"
                    }
                );
            },


            _updateWeekLabel: function () {

                const oModel =
                    this.getView()
                        .getModel("timesheet");

                const sStart =
                    oModel.getProperty(
                        "/weekStart"
                    );

                const sEnd =
                    oModel.getProperty(
                        "/weekEnd"
                    );

                oModel.setProperty(
                    "/weekLabel",

                    this._formatDisplayDate(
                        sStart
                    ) +
                    " - " +
                    this._formatDisplayDate(
                        sEnd
                    )
                );
            },


            // =========================================================
            // STATUS / PERMISSION HANDLING
            // =========================================================

            _applyStatus: function (sStatus) {

                const oModel =
                    this.getView()
                        .getModel("timesheet");

                const sNormalizedStatus =
                    String(
                        sStatus || "DRAFT"
                    ).toUpperCase();


                oModel.setProperty(
                    "/status",
                    sNormalizedStatus
                );


                // Reset all state flags first

                oModel.setProperty(
                    "/isSubmitted",
                    false
                );

                oModel.setProperty(
                    "/isApproved",
                    false
                );

                oModel.setProperty(
                    "/isRejected",
                    false
                );


                switch (
                    sNormalizedStatus
                ) {

                    // =============================================
                    // DRAFT
                    // =============================================

                    case "DRAFT":

                        oModel.setProperty(
                            "/statusState",
                            "Information"
                        );

                        oModel.setProperty(
                            "/editable",
                            true
                        );

                        oModel.setProperty(
                            "/canDelete",
                            true
                        );

                        oModel.setProperty(
                            "/canSubmit",
                            true
                        );

                        break;


                    // =============================================
                    // SUBMITTED
                    // =============================================

                    case "SUBMITTED":

                        oModel.setProperty(
                            "/statusState",
                            "Warning"
                        );

                        oModel.setProperty(
                            "/editable",
                            false
                        );

                        oModel.setProperty(
                            "/canDelete",
                            false
                        );

                        oModel.setProperty(
                            "/canSubmit",
                            false
                        );

                        oModel.setProperty(
                            "/isSubmitted",
                            true
                        );

                        break;


                    // =============================================
                    // APPROVED
                    // =============================================

                    case "APPROVED":

                        oModel.setProperty(
                            "/statusState",
                            "Success"
                        );

                        oModel.setProperty(
                            "/editable",
                            false
                        );

                        oModel.setProperty(
                            "/canDelete",
                            false
                        );

                        oModel.setProperty(
                            "/canSubmit",
                            false
                        );

                        oModel.setProperty(
                            "/isApproved",
                            true
                        );

                        break;


                    // =============================================
                    // REJECTED
                    // =============================================

                    case "REJECTED":

                        oModel.setProperty(
                            "/statusState",
                            "Error"
                        );

                        oModel.setProperty(
                            "/editable",
                            true
                        );

                        oModel.setProperty(
                            "/canDelete",
                            true
                        );

                        oModel.setProperty(
                            "/canSubmit",
                            true
                        );

                        oModel.setProperty(
                            "/isRejected",
                            true
                        );

                        break;


                    default:

                        oModel.setProperty(
                            "/statusState",
                            "None"
                        );

                        oModel.setProperty(
                            "/editable",
                            false
                        );

                        oModel.setProperty(
                            "/canDelete",
                            false
                        );

                        oModel.setProperty(
                            "/canSubmit",
                            false
                        );
                }
            },


            _getStatusState: function (sStatus) {

                switch (
                    String(
                        sStatus || ""
                    ).toUpperCase()
                ) {

                    case "DRAFT":
                        return "Information";

                    case "SUBMITTED":
                        return "Warning";

                    case "APPROVED":
                        return "Success";

                    case "REJECTED":
                        return "Error";

                    default:
                        return "None";
                }
            },


            // =========================================================
            // LOAD PROJECTS
            // =========================================================

            _loadProjects: async function () {

                const oODataModel =
                    this.getOwnerComponent()
                        .getModel();

                const oProjectModel =
                    this.getView()
                        .getModel("projectModel");

                try {

                    const oBinding =
                        oODataModel.bindList(
                            "/Projects",
                            null,
                            null,
                            null,
                            {
                                $select:
                                    "ID,projectCode,projectName,status"
                            }
                        );


                    const aContexts =
                        await oBinding
                            .requestContexts(
                                0,
                                500
                            );


                    const aProjects =
                        aContexts.map(
                            function (oContext) {

                                return (
                                    oContext.getObject()
                                );
                            }
                        );


                    oProjectModel.setProperty(
                        "/projects",
                        aProjects
                    );

                } catch (oError) {

                    console.error(
                        "Error loading Projects:",
                        oError
                    );

                    MessageBox.error(
                        "Unable to load projects from PSA Service."
                    );
                }
            },


            // =========================================================
            // LOAD TASKS
            // =========================================================

            _loadTasks: async function () {

                const oODataModel =
                    this.getOwnerComponent()
                        .getModel();

                const oTaskModel =
                    this.getView()
                        .getModel("taskModel");

                try {

                    const oBinding =
                        oODataModel.bindList(
                            "/Tasks",
                            null,
                            null,
                            null,
                            {
                                $select:
                                    "ID,taskName,status"
                            }
                        );


                    const aContexts =
                        await oBinding
                            .requestContexts(
                                0,
                                500
                            );


                    const aTasks =
                        aContexts.map(
                            function (oContext) {

                                return (
                                    oContext.getObject()
                                );
                            }
                        );


                    oTaskModel.setProperty(
                        "/tasks",
                        aTasks
                    );

                } catch (oError) {

                    console.error(
                        "Error loading Tasks:",
                        oError
                    );

                    MessageBox.error(
                        "Unable to load tasks from PSA Service."
                    );
                }
            },


            // =========================================================
            // CREATE TIMESHEET
            // =========================================================

            onCreateTimesheet: function () {

                const oCreateModel =
                    this.getView()
                        .getModel(
                            "createTimesheet"
                        );

                const oMonday =
                    this._getMonday(
                        new Date()
                    );


                oCreateModel.setData({

                    projectID: "",

                    weekStartDate:
                        this._formatDate(
                            oMonday
                        )
                });


                this.byId(
                    "createTimesheetDialog"
                ).open();
            },


            onCancelCreateTimesheet: function () {

                this.byId(
                    "createTimesheetDialog"
                ).close();
            },


            onConfirmCreateTimesheet: function () {

                const oCreateModel =
                    this.getView()
                        .getModel(
                            "createTimesheet"
                        );

                const oTimesheetModel =
                    this.getView()
                        .getModel(
                            "timesheet"
                        );

                const oProjectModel =
                    this.getView()
                        .getModel(
                            "projectModel"
                        );


                const sProjectID =
                    oCreateModel.getProperty(
                        "/projectID"
                    );

                const sSelectedDate =
                    oCreateModel.getProperty(
                        "/weekStartDate"
                    );


                // =============================================
                // VALIDATE PROJECT
                // =============================================

                if (!sProjectID) {

                    MessageBox.warning(
                        "Please select a Project Code."
                    );

                    return;
                }


                // =============================================
                // VALIDATE WEEK
                // =============================================

                if (!sSelectedDate) {

                    MessageBox.warning(
                        "Please select a week."
                    );

                    return;
                }


                // Always normalize selected date to Monday

                const oSelectedDate =
                    this._parseDate(
                        sSelectedDate
                    );

                const oMonday =
                    this._getMonday(
                        oSelectedDate
                    );

                const oSunday =
                    this._addDays(
                        oMonday,
                        6
                    );


                // =============================================
                // FIND PROJECT DETAILS
                // =============================================

                const aProjects =
                    oProjectModel.getProperty(
                        "/projects"
                    ) || [];


                const oProject =
                    aProjects.find(
                        function (oItem) {

                            return (
                                oItem.ID ===
                                sProjectID
                            );
                        }
                    );


                if (!oProject) {

                    MessageBox.error(
                        "Selected project could not be found."
                    );

                    return;
                }


                // =============================================
                // CREATE LOCAL DRAFT
                // =============================================

                oTimesheetModel.setProperty(
                    "/timesheetID",
                    null
                );

                oTimesheetModel.setProperty(
                    "/projectID",
                    oProject.ID
                );

                oTimesheetModel.setProperty(
                    "/projectCode",
                    oProject.projectCode
                );

                oTimesheetModel.setProperty(
                    "/projectName",
                    oProject.projectName
                );

                oTimesheetModel.setProperty(
                    "/projectDisplay",

                    oProject.projectCode +
                    " - " +
                    oProject.projectName
                );


                oTimesheetModel.setProperty(
                    "/weekStart",
                    this._formatDate(
                        oMonday
                    )
                );

                oTimesheetModel.setProperty(
                    "/weekEnd",
                    this._formatDate(
                        oSunday
                    )
                );


                // Create first row with 8-hour weekday defaults

                oTimesheetModel.setProperty(
                    "/rows",
                    [
                        {
                            taskID: "",
                            taskName: "",

                            mon: 8,
                            tue: 8,
                            wed: 8,
                            thu: 8,
                            fri: 8,

                            sat: 0,
                            sun: 0,

                            total: 40,

                            isBillable: true
                        }
                    ]
                );


                oTimesheetModel.setProperty(
                    "/hasTimesheet",
                    true
                );


                oTimesheetModel.setProperty(
                    "/rejectionReason",
                    ""
                );


                this._applyStatus(
                    "DRAFT"
                );

                this._updateWeekLabel();

                this._recalculateTotals();


                this.byId(
                    "createTimesheetDialog"
                ).close();


                MessageToast.show(
                    "Timesheet created. Select a task and save the draft."
                );
            },


            // =========================================================
            // WEEK NAVIGATION
            // =========================================================

            onPreviousWeek: function () {
                this._changeWeek(-7);
            },


            onNextWeek: function () {
                this._changeWeek(7);
            },


            _changeWeek: function (iDays) {

                const oModel =
                    this.getView()
                        .getModel("timesheet");


                const sCurrent =
                    oModel.getProperty(
                        "/weekStart"
                    );


                const oCurrent =
                    this._parseDate(
                        sCurrent
                    );


                const oNewStart =
                    this._addDays(
                        oCurrent,
                        iDays
                    );


                const oNewEnd =
                    this._addDays(
                        oNewStart,
                        6
                    );


                oModel.setProperty(
                    "/weekStart",
                    this._formatDate(
                        oNewStart
                    )
                );


                oModel.setProperty(
                    "/weekEnd",
                    this._formatDate(
                        oNewEnd
                    )
                );


                this._updateWeekLabel();


                /*
                 * Next backend step:
                 *
                 * load employee Timesheet matching:
                 *
                 * employee
                 * project
                 * weekStartDate
                 */
            },


            // =========================================================
            // ADD TASK
            // =========================================================

            onAddTask: function () {

                const oModel =
                    this.getView()
                        .getModel("timesheet");


                if (
                    !oModel.getProperty(
                        "/editable"
                    )
                ) {

                    return;
                }


                const aRows =
                    oModel.getProperty(
                        "/rows"
                    ) || [];


                aRows.push({

                    taskID: "",
                    taskName: "",

                    mon: 8,
                    tue: 8,
                    wed: 8,
                    thu: 8,
                    fri: 8,

                    sat: 0,
                    sun: 0,

                    total: 40,

                    isBillable: true
                });


                oModel.setProperty(
                    "/rows",
                    aRows
                );


                this._recalculateTotals();
            },


            // =========================================================
            // DELETE TASK ROW
            // =========================================================

            onDeleteRow: function (oEvent) {

                const oModel =
                    this.getView()
                        .getModel("timesheet");


                if (
                    !oModel.getProperty(
                        "/editable"
                    )
                ) {

                    MessageToast.show(
                        "This timesheet cannot be edited."
                    );

                    return;
                }


                const oContext =
                    oEvent
                        .getSource()
                        .getBindingContext(
                            "timesheet"
                        );


                if (!oContext) {
                    return;
                }


                const iIndex =
                    Number(
                        oContext
                            .getPath()
                            .split("/")
                            .pop()
                    );


                const aRows =
                    oModel.getProperty(
                        "/rows"
                    ) || [];


                aRows.splice(
                    iIndex,
                    1
                );


                oModel.setProperty(
                    "/rows",
                    aRows
                );


                this._recalculateTotals();
            },


            // =========================================================
            // HOURS
            // =========================================================

            onHoursChange: function (oEvent) {

                const oInput =
                    oEvent.getSource();


                let fValue =
                    Number(
                        oInput.getValue()
                    );


                if (
                    !Number.isFinite(fValue) ||
                    fValue < 0
                ) {

                    fValue = 0;
                }


                /*
                 * Your requirement currently says
                 * default 8 hours/day.
                 *
                 * 8 is a default, not an enforced maximum.
                 *
                 * Keep backend validation as the
                 * final authority for permitted hours.
                 */

                if (fValue > 24) {

                    fValue = 24;

                    MessageToast.show(
                        "Hours cannot exceed 24."
                    );
                }


                oInput.setValue(
                    fValue
                );


                const oContext =
                    oInput.getBindingContext(
                        "timesheet"
                    );


                if (oContext) {

                    const oModel =
                        this.getView()
                            .getModel(
                                "timesheet"
                            );


                    const oBinding =
                        oInput.getBinding(
                            "value"
                        );


                    if (oBinding) {

                        oModel.setProperty(
                            oContext.getPath() +
                            "/" +
                            oBinding.getPath(),
                            fValue
                        );
                    }
                }


                this._recalculateTotals();
            },


            onBillableChange: function () {
                this._recalculateTotals();
            },


            onTaskChange: function (oEvent) {

                const oComboBox =
                    oEvent.getSource();


                const sTaskID =
                    oComboBox.getSelectedKey();


                const oContext =
                    oComboBox.getBindingContext(
                        "timesheet"
                    );


                if (!oContext) {
                    return;
                }


                const oModel =
                    this.getView()
                        .getModel(
                            "timesheet"
                        );


                const aTasks =
                    this.getView()
                        .getModel(
                            "taskModel"
                        )
                        .getProperty(
                            "/tasks"
                        ) || [];


                const oTask =
                    aTasks.find(
                        function (oItem) {

                            return (
                                oItem.ID ===
                                sTaskID
                            );
                        }
                    );


                oModel.setProperty(
                    oContext.getPath() +
                    "/taskID",
                    sTaskID
                );


                oModel.setProperty(
                    oContext.getPath() +
                    "/taskName",
                    oTask
                        ? oTask.taskName
                        : ""
                );
            },


            // =========================================================
            // TOTALS
            // =========================================================

            _recalculateTotals: function () {

                const oModel =
                    this.getView()
                        .getModel("timesheet");


                const aRows =
                    oModel.getProperty(
                        "/rows"
                    ) || [];


                let fWeeklyTotal = 0;
                let fBillableTotal = 0;


                aRows.forEach(
                    function (oRow) {

                        /*
                         * Saturday and Sunday are always
                         * zero by business requirement.
                         */

                        oRow.sat = 0;
                        oRow.sun = 0;


                        const fTotal =

                            Number(
                                oRow.mon || 0
                            ) +

                            Number(
                                oRow.tue || 0
                            ) +

                            Number(
                                oRow.wed || 0
                            ) +

                            Number(
                                oRow.thu || 0
                            ) +

                            Number(
                                oRow.fri || 0
                            );


                        oRow.total =
                            Number(
                                fTotal.toFixed(2)
                            );


                        fWeeklyTotal +=
                            fTotal;


                        if (
                            oRow.isBillable
                        ) {

                            fBillableTotal +=
                                fTotal;
                        }
                    }
                );


                oModel.setProperty(
                    "/rows",
                    aRows
                );


                oModel.setProperty(
                    "/weeklyTotal",

                    Number(
                        fWeeklyTotal.toFixed(2)
                    )
                );


                oModel.setProperty(
                    "/billableTotal",

                    Number(
                        fBillableTotal.toFixed(2)
                    )
                );
            },


            // =========================================================
            // VALIDATION
            // =========================================================

            _validateTimesheet: function () {

                const oModel =
                    this.getView()
                        .getModel("timesheet");


                if (
                    !oModel.getProperty(
                        "/hasTimesheet"
                    )
                ) {

                    MessageBox.warning(
                        "Create a timesheet first."
                    );

                    return false;
                }


                if (
                    !oModel.getProperty(
                        "/projectID"
                    )
                ) {

                    MessageBox.warning(
                        "Project is required."
                    );

                    return false;
                }


                const aRows =
                    oModel.getProperty(
                        "/rows"
                    ) || [];


                if (!aRows.length) {

                    MessageBox.warning(
                        "Add at least one task."
                    );

                    return false;
                }


                for (
                    let i = 0;
                    i < aRows.length;
                    i++
                ) {

                    if (
                        !aRows[i].taskID
                    ) {

                        MessageBox.warning(
                            "Select a task for every row."
                        );

                        return false;
                    }


                    if (
                        Number(
                            aRows[i].total || 0
                        ) <= 0
                    ) {

                        MessageBox.warning(
                            "Enter working hours for every selected task."
                        );

                        return false;
                    }


                    if (
                        Number(
                            aRows[i].sat || 0
                        ) !== 0 ||
                        Number(
                            aRows[i].sun || 0
                        ) !== 0
                    ) {

                        MessageBox.warning(
                            "Saturday and Sunday must have zero working hours."
                        );

                        return false;
                    }
                }


                return true;
            },


            // =========================================================
            // SAVE DRAFT
            // =========================================================

            onSaveDraft: async function () {

                this._recalculateTotals();


                const oModel =
                    this.getView()
                        .getModel("timesheet");


                if (
                    !this._validateTimesheet()
                ) {
                    return;
                }


                if (
                    !oModel.getProperty(
                        "/editable"
                    )
                ) {

                    MessageBox.warning(
                        "Only editable timesheets can be saved."
                    );

                    return;
                }


                /*
                 * IMPORTANT:
                 *
                 * At this stage this is still the
                 * UI-side draft implementation.
                 *
                 * The actual database persistence
                 * should call your CAP Save Draft
                 * implementation.
                 */


                MessageToast.show(
                    "Draft is ready to be saved."
                );
            },


            // =========================================================
            // SUBMIT
            // =========================================================

            onSubmit: async function () {

    this._recalculateTotals();

    // Validate Project, Tasks and Hours
    if (!this._validateTimesheet()) {
        return;
    }

    const oModel =
        this.getView().getModel("timesheet");

    MessageBox.confirm(
        "Submit this timesheet for manager approval?",
        {
            title: "Submit Timesheet",

            actions: [
                MessageBox.Action.SUBMIT,
                MessageBox.Action.CANCEL
            ],

            emphasizedAction:
                MessageBox.Action.SUBMIT,

            onClose: function (sAction) {

                if (
                    sAction !==
                    MessageBox.Action.SUBMIT
                ) {
                    return;
                }

                /*
                 * Backend integration:
                 *
                 * 1. Create/save the Timesheet if it
                 *    does not exist yet.
                 *
                 * 2. Save TimesheetEntries.
                 *
                 * 3. Call the Timesheets.submit()
                 *    bound action.
                 *
                 * For now update the local UI state.
                 */

                this._applyStatus("SUBMITTED");

                MessageToast.show(
                    "Timesheet submitted for manager approval."
                );

            }.bind(this)
        }
    );
},


            // =========================================================
            // DELETE ENTIRE TIMESHEET
            // =========================================================

            onDeleteTimesheet: function () {

                const oModel =
                    this.getView()
                        .getModel("timesheet");


                if (
                    !oModel.getProperty(
                        "/canDelete"
                    )
                ) {

                    MessageBox.warning(
                        "This timesheet cannot be deleted."
                    );

                    return;
                }


                MessageBox.confirm(
                    "Delete this timesheet?",
                    {

                        title:
                            "Delete Timesheet",

                        emphasizedAction:
                            MessageBox.Action.DELETE,

                        actions: [
                            MessageBox.Action.DELETE,
                            MessageBox.Action.CANCEL
                        ],

                        onClose:
                            function (sAction) {

                                if (
                                    sAction !==
                                    MessageBox.Action.DELETE
                                ) {
                                    return;
                                }


                                /*
                                 * Once database delete is wired:
                                 *
                                 * DELETE the Timesheet
                                 * through OData.
                                 *
                                 * Due to composition,
                                 * entries should remain
                                 * owned by Timesheet.
                                 */


                                this._resetTimesheet();


                                MessageToast.show(
                                    "Timesheet removed from the current screen."
                                );

                            }.bind(this)
                    }
                );
            },


            _resetTimesheet: function () {

                const oModel =
                    this.getView()
                        .getModel("timesheet");


                const oToday =
                    new Date();


                const oMonday =
                    this._getMonday(
                        oToday
                    );


                oModel.setData({

                    busy: false,

                    timesheetID: null,

                    projectID: null,
                    projectCode: "",
                    projectName: "",
                    projectDisplay:
                        "No Project Selected",

                    weekStart:
                        this._formatDate(
                            oMonday
                        ),

                    weekEnd:
                        this._formatDate(
                            this._addDays(
                                oMonday,
                                6
                            )
                        ),

                    weekLabel: "",

                    status: "DRAFT",
                    statusState:
                        "Information",

                    rejectionReason: "",

                    hasTimesheet: false,

                    editable: false,
                    canDelete: false,
                    canSubmit: false,

                    isSubmitted: false,
                    isApproved: false,
                    isRejected: false,

                    weeklyTotal: 0,
                    billableTotal: 0,

                    rows: []
                });


                this._updateWeekLabel();
            },


            // =========================================================
            // MY TIMESHEETS
            // =========================================================

            onMyTimesheets: async function () {

                await this._loadTimesheetHistory();


                this.byId(
                    "myTimesheetsDialog"
                ).open();
            },


            onCloseMyTimesheets: function () {

                this.byId(
                    "myTimesheetsDialog"
                ).close();
            },


            _loadTimesheetHistory: async function () {

                const oODataModel =
                    this.getOwnerComponent()
                        .getModel();


                const oHistoryModel =
                    this.getView()
                        .getModel("history");


                try {

                    /*
                     * Authentication/employee filtering
                     * is still required before production.
                     *
                     * Once user → employee mapping is in
                     * place, filter Timesheets by employee.
                     */


                    const oBinding =
                        oODataModel.bindList(
                            "/Timesheets",
                            null,
                            null,
                            null,
                            {
                                $select:
                                    "ID,weekStartDate,weekEndDate,totalBillableHours,submittedDate,status,rejectionReason"
                            }
                        );


                    const aContexts =
                        await oBinding
                            .requestContexts(
                                0,
                                500
                            );


                    const aHistory =
                        aContexts.map(
                            function (oContext) {

                                const oData =
                                    oContext.getObject();


                                return {

                                    ID:
                                        oData.ID,

                                    weekStartDate:
                                        oData.weekStartDate,

                                    weekEndDate:
                                        oData.weekEndDate,

                                    weekLabel:
                                        this
                                            ._formatDisplayDate(
                                                oData.weekStartDate
                                            ) +
                                        " - " +
                                        this
                                            ._formatDisplayDate(
                                                oData.weekEndDate
                                            ),

                                    projectCode:
                                        "",

                                    projectName:
                                        "",

                                    totalBillableHours:
                                        oData.totalBillableHours ||
                                        0,

                                    submittedDate:
                                        oData.submittedDate ||
                                        "-",

                                    status:
                                        String(
                                            oData.status ||
                                            "DRAFT"
                                        ).toUpperCase(),

                                    statusState:
                                        this._getStatusState(
                                            oData.status
                                        ),

                                    rejectionReason:
                                        oData.rejectionReason ||
                                        ""
                                };

                            }.bind(this)
                        );


                    oHistoryModel.setProperty(
                        "/items",
                        aHistory
                    );

                } catch (oError) {

                    console.error(
                        "Unable to load Timesheet history:",
                        oError
                    );


                    MessageBox.error(
                        "Unable to load My Timesheets."
                    );
                }
            },


            // =========================================================
            // OPEN HISTORICAL TIMESHEET
            // =========================================================

            onOpenTimesheet: function (oEvent) {

                const oContext =
                    oEvent
                        .getSource()
                        .getBindingContext(
                            "history"
                        );


                if (!oContext) {
                    return;
                }


                const oHistoryItem =
                    oContext.getObject();


                this.byId(
                    "myTimesheetsDialog"
                ).close();


                /*
                 * Next backend integration:
                 *
                 * load selected Timesheet and entries
                 * by oHistoryItem.ID.
                 */


                MessageToast.show(
                    "Opening timesheet " +
                    oHistoryItem.weekLabel
                );
            }

        }
    );
});