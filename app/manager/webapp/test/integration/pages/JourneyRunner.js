sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"manager/test/integration/pages/ProjectOverviewList.gen",
	"manager/test/integration/pages/ProjectOverviewObjectPage.gen"
], function (JourneyRunner, ProjectOverviewListGenerated, ProjectOverviewObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('manager') + '/test/flp.html#app-preview',
        pages: {
			onTheProjectOverviewListGenerated: ProjectOverviewListGenerated,
			onTheProjectOverviewObjectPageGenerated: ProjectOverviewObjectPageGenerated
        },
        async: true
    });

    return runner;
});

