// create unit tests for as much as possible

class UnitTesting {
    devIdle = null;
    appGrid = null;
    defeseMultipliers = null;

    availableTestMethods = [];
    allScripts = ["tests/unitTests/UnitAchievementTests.js"];

    testFramework = new TestFramework(
        "emptyCell",
        "Unit",
        this.allScripts,
        this.availableTestMethods,
        this.PopulateClasses.bind(this)
    );

    constructor(devIdle) {
        this.devIdle = devIdle;
        this.appGrid = devIdle.appGrid;
        this.defeseMultipliers = this.appGrid.defenseMultipliers;

        this.testFramework.AddTestingScripts();
        this.testFramework.CreateUnitTestElements();
    }

    PopulateClasses() {
        var testList = [];

        testList.push([
            UnitAchievementTests,
            new UnitAchievementTests(
                this.appGrid.ShowMessage.bind(this.appGrid),
                this.appGrid.ClearMessageList.bind(this.appGrid)
            )
        ]);

        this.testFramework.PopulateTests(testList);
    }
}
