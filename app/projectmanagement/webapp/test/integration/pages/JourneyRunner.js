sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"projectmanagement/test/integration/pages/ProjectsList.gen",
	"projectmanagement/test/integration/pages/ProjectsObjectPage.gen",
	"projectmanagement/test/integration/pages/MilestonesObjectPage.gen"
], function (JourneyRunner, ProjectsListGenerated, ProjectsObjectPageGenerated, MilestonesObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('projectmanagement') + '/test/flp.html#app-preview',
        pages: {
			onTheProjectsListGenerated: ProjectsListGenerated,
			onTheProjectsObjectPageGenerated: ProjectsObjectPageGenerated,
			onTheMilestonesObjectPageGenerated: MilestonesObjectPageGenerated
        },
        async: true
    });

    return runner;
});

