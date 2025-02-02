// create integration tests for as much as possible
// document.getElementById("Open SourceCreate").click()

class IntegrationTesting {
    devIdle = null;
    appGrid = null;
    defeseMultipliers = null;
    achievements = null;

    availableTestMethods = [];
    allScripts = ["tests/integrationTests/IntegrationAchievementTests.js"];

    testFramework = new TestFramework(
        "emptyCell",
        "Integration",
        this.allScripts,
        this.availableTestMethods,
        this.PopulateClasses.bind(this)
    );

    constructor(devIdle) {
        this.devIdle = devIdle;
        this.appGrid = devIdle.appGrid;
        this.defeseMultipliers = this.appGrid.defenseMultipliers;
        this.achievements = this.appGrid.achievements;

        this.testFramework.AddTestingScripts();
        this.testFramework.CreateUnitTestElements();
    }

    PopulateClasses() {
        var testList = [];

        testList.push([
            IntegrationAchievementTests,
            new IntegrationAchievementTests(this.achievements)
        ]);

        this.testFramework.PopulateTests(testList);
    }
}
