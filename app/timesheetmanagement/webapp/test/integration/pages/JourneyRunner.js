sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"timesheetmanagement/test/integration/pages/TimesheetsList.gen",
	"timesheetmanagement/test/integration/pages/TimesheetsObjectPage.gen",
	"timesheetmanagement/test/integration/pages/TimesheetEntriesObjectPage.gen"
], function (JourneyRunner, TimesheetsListGenerated, TimesheetsObjectPageGenerated, TimesheetEntriesObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('timesheetmanagement') + '/test/flp.html#app-preview',
        pages: {
			onTheTimesheetsListGenerated: TimesheetsListGenerated,
			onTheTimesheetsObjectPageGenerated: TimesheetsObjectPageGenerated,
			onTheTimesheetEntriesObjectPageGenerated: TimesheetEntriesObjectPageGenerated
        },
        async: true
    });

    return runner;
});

