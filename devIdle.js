class DevIdle {
    ticksPerSecond = 4;
    incomeTimerLength = (1 / this.ticksPerSecond) * 1000;
    attackTimerLength = 15 * 1000;
    instructionsModal = null;
    mask = null;
    runningTests = false; // change this if you want to run tests without the timers, or do it in the constructor

    appGrid = null;

    testScriptsLoaded = 0;
    testScripts = [
        "testFramework/testFramework.js",
        "tests/integrationTesting.js",
        "tests/unitTesting.js"
    ];

    constructor() {
        this.appGrid = new AppGrid(this.ticksPerSecond);

        document.getElementById("pauseButton").onclick =
            this.appGrid.Pause.bind(this.appGrid);

        document.getElementById("achievementsButton").onclick =
            this.ShowAchievements.bind(this);

        this.SetupInstructions();
        this.SetupModifierModal();

        if (
            false &&
            ["localhost", "127.0.0.1", ""].indexOf(location.hostname) !== -1
        ) {
            this.SetupTesting();
            this.runningTests = true; // if the purpose is to run automated testing, then don't start the timers.
        }
    }

    SetupTesting() {
        this.testScripts.forEach((item) => {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = item;
            script.onload = this.ScriptHelper.bind(this);

            document.head.appendChild(script);
        });
    }

    ScriptHelper() {
        this.testScriptsLoaded++;

        if (this.testScriptsLoaded === this.testScripts.length) {
            new UnitTesting(this);
            new IntegrationTesting(this);
        }
    }

    BeginGame() {
        var attackList = document.getElementById("attackList");

        attackList.onclick = this.appGrid.CloseAttackList.bind(this);
        attackList.onmouseout = this.appGrid.CloseAttackList.bind(this);

        document.getElementById("BuildMultiplier").onchange =
            this.appGrid.BuildMultiplierOnChange.bind(this.appGrid);

        document.getElementById("wonButton").onclick = this.Reset.bind(this);
        document.getElementById("lostButton").onclick = this.Reset.bind(this);
        document.getElementById("mask4").onclick =
            this.HideAchievements.bind(this);

        document.getElementById("achievementsClose").onclick =
            this.HideAchievements.bind(this);

        this.appGrid.UpdateCredits(0);
        this.appGrid.AddAppType();

        this.SetupTimers();
    }

    Reset() {
        document.getElementById("devIdle").tBodies[0].innerHTML = "";
        document.getElementById("multiplierTable").tBodies[0].innerHTML = "";
        document.getElementById("message").innerHTML = "";
        document.getElementById("message2").innerHTML = "";

        document.getElementById("BuildMultiplier").selectedIndex = 0;
        document.getElementById("MultiplierMultiplier").selectedIndex = 0;

        document.getElementById("lose").style.display = "none";
        document.getElementById("win").style.display = "none";
        document.getElementById("multiplierModal").style.display = "none";
        document.getElementById("mask2").style.display = "none";
        document.getElementById("mask3").style.display = "none";

        this.instructionsModal.style.display = "none";
        this.mask.style.display = "none";

        this.appGrid.Reset();
    }

    SetupTimers() {
        // if the purpose is to run automated testing, then don't start the timers.
        if (this.runningTests) {
            return;
        }

        // set up income timer
        setInterval(
            this.appGrid.IncomeTimer.bind(this.appGrid),
            this.incomeTimerLength
        );

        // setup attack timer
        setInterval(
            this.appGrid.AttackTimer.bind(this.appGrid),
            this.attackTimerLength
        );
    }

    SetupModifierModal() {
        document.getElementById("mask2").onclick =
            this.appGrid.CloseMultipliers.bind(this.appGrid);
        document.getElementById("closeMultiplier").onclick =
            this.appGrid.CloseMultipliers.bind(this.appGrid);

        document.getElementById("MultiplierMultiplier").onchange =
            this.appGrid.MultiplierMultiplierOnchange.bind(this.appGrid);
    }

    SetupInstructions() {
        this.instructionsModal = document.getElementById("instructionsModal");
        this.mask = document.getElementById("mask");

        mask.onclick = this.appGrid.CloseMultipliers.bind(this.appGrid);

        document.getElementById("instructionsButton").onclick =
            this.ViewInstructions.bind(this);

        document.getElementById("closeInstructions").onclick =
            this.HideInstructions.bind(this);

        window.onclick = this.CheckInstructionModal.bind(this);
    }

    ViewInstructions() {
        this.instructionsModal.style.display = "block";
        this.mask.style.display = "block";
    }

    HideInstructions() {
        this.instructionsModal.style.display = "none";
        this.mask.style.display = "none";
    }

    ShowAchievements() {
        document.getElementById("achievementsModal").style.display = "block";
        document.getElementById("mask4").style.display = "block";
    }

    HideAchievements() {
        document.getElementById("achievementsModal").style.display = "none";
        document.getElementById("mask4").style.display = "none";
    }

    CheckInstructionModal(event) {
        if (event.target == this.instructionsModal || event.target == mask) {
            this.HideInstructions();
        }
    }
}
