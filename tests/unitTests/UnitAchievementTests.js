// -------------------------------------
//
// Always run ClearMessageList and CheckAllstarAchievement at the end of the test.
//
// Run CheckAllMessages for any won achievements you're testing for.
//
// Make helper methods static so they don't show up in the test list.
//
// -------------------------------------

class UnitAchievementTests {
    ShowMessage = null;
    ClearMessageList = null;

    static achievements = [
        ["deploymentsAchievement", "deploymentsLevel"],
        ["multipliersAchievement", "defensesLevel"],
        ["cashAchievement", "cashLevel"],
        ["incomeAchievement", "incomeLevel"],
        ["attacksAchievement", "attacksLevel"],
        ["loansNumberAchievement", "loansLevel"],
        ["loansAmountAchievement", "loansMaxLevel"],
        ["adsAchievement", "adsLevel"],
        ["allMultipliersAchievement"],
        ["allAttacksAchievement"],
        ["negativeIncomeAchievement"],
        ["restartedAchievement"],
        ["bigMoneyAchievement"],
        ["extraterrestrialAchievement"],
        ["extradimensionalAchievement"],
        ["brownPantsAchievement"],
        ["neroAchievement", "neroDiv"],
        ["winAchievement"],
        ["winLoanAchievement"],
        ["allstarAchievement", "allStarDiv"]
    ];

    static messageBox = document.getElementById("message");
    static message2Box = document.getElementById("message2");
    static messageList = document.getElementById("messageList");

    constructor(showMessage, clearMessageList) {
        this.ShowMessage = showMessage;
        this.ClearMessageList = clearMessageList;
        this.constructor.ResetAchievementView();
    }

    async WinAchievement() {
        var returnMessage = "";
        var testPassed = true;
        var achievementObject = new Achievements(this.ShowMessage);

        achievementObject.CheckLoans(12);

        [testPassed, returnMessage] = this.constructor.AchievementChecker(
            17,
            achievementObject.DidWin.bind(achievementObject),
            testPassed,
            returnMessage,
            "You Won",
            this.ClearMessageList
        );

        return [testPassed, testPassed ? "Test passed." : returnMessage];
    }

    WinAchievementWithLoan() {
        var returnMessage = "";
        var testPassed = true;
        var achievementObject = new Achievements(this.ShowMessage);

        var achievement = document.getElementById(
            this.constructor.achievements[18][0]
        );

        if (achievement.className !== "achievementPlaceholder") {
            returnMessage += "Initial state is not correct.\r\n";
            testPassed = false;
        }

        achievementObject.CheckLoans(12);

        [testPassed, returnMessage] = this.constructor.AchievementChecker(
            17,
            achievementObject.DidWin.bind(achievementObject),
            testPassed,
            returnMessage,
            "You Won",
            this.ClearMessageList
        );

        if (achievement.className !== "achievementPlaceholder") {
            returnMessage +=
                "Final state for You won without needing a loan is not correct.\r\n";
            testPassed = false;
        }

        var message2 =
            "You earned the You won without needing a loan achievement.";
        [testPassed, returnMessage] = this.constructor.CheckAllMessages(
            testPassed,
            returnMessage,
            message2,
            false
        );

        return [testPassed, testPassed ? "Test passed." : returnMessage];
    }

    WinAchievementWithoutLoan() {
        var returnMessage = "";
        var testPassed = true;
        var achievementObject = new Achievements(this.ShowMessage);

        var achievement = document.getElementById(
            this.constructor.achievements[17][0]
        );

        if (achievement.className !== "achievementPlaceholder") {
            returnMessage += "Initial state for You Won is not correct.\r\n";
            testPassed = false;
        }

        [testPassed, returnMessage] = this.constructor.AchievementChecker(
            18,
            achievementObject.DidWin.bind(achievementObject),
            testPassed,
            returnMessage,
            "You won without needing a loan",
            null
        );

        if (achievement.className === "achievementPlaceholder") {
            returnMessage += "Final state for You Won is not correct.\r\n";
            testPassed = false;
        }

        var message = "You earned the You Won achievement.";
        if (!this.constructor.CheckMessageList(message)) {
            returnMessage +=
                "Achievement message for You Won is not in MessageList.\r\n";
            testPassed = false;
        }

        this.constructor.ResetAchievementView();
        this.ClearMessageList();

        return [testPassed, testPassed ? "Test passed." : returnMessage];
    }

    // All other achievements have to be collected first
    AllstarAchievement() {
        var returnMessage = "";
        var testPassed = true;
        var achievementObject = new Achievements(this.ShowMessage);

        [testPassed, returnMessage] = this.constructor.CheckAllstarAchievement(
            testPassed,
            returnMessage,
            false
        );

        // You Won, 17
        // You Won without needing a loan, 18
        achievementObject.DidWin();

        // Restarted, 11
        // Nero Fiddled, 16
        document.getElementById("achievementsModal").style.display = "block";
        achievementObject.Reset(-1);
        document.getElementById("achievementsModal").style.display = "none";

        // Ads watched, 7
        for (var i = 0; i < 5; i++) {
            achievementObject.WatchedAd();
        }

        // Big Money, 12
        achievementObject.CheckDeployments(0, 11);

        // Extraterrestrial, 13
        achievementObject.CheckDeployments(0, 17);

        // Extradimensional, 14
        achievementObject.CheckDeployments(0, 26);

        // Deployments Purchased, 0
        achievementObject.CheckDeployments(110, 1);

        // Defenses/Multipliers Purchased, 1
        // All Defenses/Multipliers Types Purchased, 8
        var multipliers = getMultipliers(); // staticData.js
        var multipliersTotal = multipliers.length;
        var multipliersIncrement = Math.ceil(110 / multipliersTotal);

        for (var i = 0; i < multipliersTotal; i++) {
            var index = Math.floor(Math.random() * multipliers.length);
            achievementObject.CheckDefenses(
                multipliers[index].name,
                multipliersIncrement
            );
            multipliers.splice(index, 1);
        }

        // Attacks Defended, 4
        // All Attacks Defended Against, 9
        var attacks = getAttacks(); // staticData.js
        var attacksTotal = attacks.length;
        var attacksIncrement = Math.ceil(110 / attacksTotal);

        for (var i = 0; i < attacksTotal; i++) {
            var index = Math.floor(Math.random() * attacks.length);
            achievementObject.CheckAttacks(
                attacks[index].name,
                attacksIncrement
            );
            attacks.splice(index, 1);
        }

        // Number of Loans, 5
        // Max Amount of a Single Loan, 6
        for (var i = 0; i < 10; i++) {
            achievementObject.CheckLoans(1100);
        }

        // Surviving Negative Income, 10
        achievementObject.CheckIncome(-1);
        achievementObject.CheckIncome(1);

        // Brown Pants, 15
        achievementObject.CheckIncome(-1);
        achievementObject.CheckCredits(-1, 1);
        achievementObject.CheckCredits(1, 1);

        // Check Credits, 2
        achievementObject.CheckCredits(1100, 0);

        // Check Income, 3
        achievementObject.CheckIncome(110);

        [testPassed, returnMessage] = this.constructor.CheckAllstarAchievement(
            testPassed,
            returnMessage,
            true
        );

        this.constructor.ResetAchievementView();
        this.ClearMessageList();

        return [testPassed, testPassed ? "Test passed." : returnMessage];
    }

    AllstarAchievementFalse() {
        var returnMessage = "";
        var testPassed = true;

        [testPassed, returnMessage] = this.constructor.CheckAllstarAchievement(
            testPassed,
            returnMessage,
            false
        );

        this.constructor.ResetAchievementView();
        this.ClearMessageList();

        return [testPassed, testPassed ? "Test passed." : returnMessage];
    }

    WatchedAds1() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function () {
            achievementObject.WatchedAd();
        };

        return this.constructor.CheckLeveledAchievements(
            7,
            "Ads Watched",
            testMethod,
            1,
            1,
            this.ClearMessageList,
            5
        );
    }

    WatchedAds4() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function () {
            achievementObject.WatchedAd();
        };

        return this.constructor.CheckLeveledAchievements(
            7,
            "Ads Watched",
            testMethod,
            4,
            1,
            this.ClearMessageList,
            5
        );
    }

    WatchedAds5() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function () {
            achievementObject.WatchedAd();
        };

        return this.constructor.CheckLeveledAchievements(
            7,
            "Ads Watched",
            testMethod,
            5,
            1,
            this.ClearMessageList,
            5
        );
    }

    WatchedAds6() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function () {
            achievementObject.WatchedAd();
        };

        return this.constructor.CheckLeveledAchievements(
            7,
            "Ads Watched",
            testMethod,
            6,
            1,
            this.ClearMessageList,
            5
        );
    }

    WatchedAds26() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function () {
            achievementObject.WatchedAd();
        };

        return this.constructor.CheckLeveledAchievements(
            7,
            "Ads Watched",
            testMethod,
            26,
            1,
            this.ClearMessageList,
            5
        );
    }

    BigMoney() {
        var returnMessage = "";
        var testPassed = true;
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function () {
            achievementObject.CheckDeployments(0, 11);
        };

        [testPassed, returnMessage] = this.constructor.AchievementChecker(
            12,
            testMethod,
            testPassed,
            returnMessage,
            "Big Money",
            this.ClearMessageList
        );

        return [testPassed, testPassed ? "Test passed." : returnMessage];
    }

    Extraterrestrial() {
        var returnMessage = "";
        var testPassed = true;
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function () {
            achievementObject.CheckDeployments(0, 17);
        };

        [testPassed, returnMessage] = this.constructor.AchievementChecker(
            13,
            testMethod,
            testPassed,
            returnMessage,
            "Extraterrestrial",
            this.ClearMessageList
        );

        return [testPassed, testPassed ? "Test passed." : returnMessage];
    }

    Extradimensional() {
        var returnMessage = "";
        var testPassed = true;
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function () {
            achievementObject.CheckDeployments(0, 26);
        };

        [testPassed, returnMessage] = this.constructor.AchievementChecker(
            14,
            testMethod,
            testPassed,
            returnMessage,
            "Extradimensional",
            this.ClearMessageList
        );

        return [testPassed, testPassed ? "Test passed." : returnMessage];
    }

    Deployments1() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function (increment) {
            achievementObject.CheckDeployments(increment, 1);
        };

        return this.constructor.CheckLeveledAchievements(
            0,
            "Deployments Purchased",
            testMethod,
            1,
            1,
            this.ClearMessageList
        );
    }

    Deployments99() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function (increment) {
            achievementObject.CheckDeployments(increment, 1);
        };

        return this.constructor.CheckLeveledAchievements(
            0,
            "Deployments Purchased",
            testMethod,
            99,
            11,
            this.ClearMessageList
        );
    }

    Deployments100() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function (increment) {
            achievementObject.CheckDeployments(increment, 1);
        };

        return this.constructor.CheckLeveledAchievements(
            0,
            "Deployments Purchased",
            testMethod,
            100,
            10,
            this.ClearMessageList
        );
    }

    Deployments110() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function (increment) {
            achievementObject.CheckDeployments(increment, 1);
        };

        return this.constructor.CheckLeveledAchievements(
            0,
            "Deployments Purchased",
            testMethod,
            110,
            10,
            this.ClearMessageList
        );
    }

    Deployments999() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function (increment) {
            achievementObject.CheckDeployments(increment, 1);
        };

        return this.constructor.CheckLeveledAchievements(
            0,
            "Deployments Purchased",
            testMethod,
            999,
            111,
            this.ClearMessageList
        );
    }

    Deployments1000() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function (increment) {
            achievementObject.CheckDeployments(increment, 1);
        };

        return this.constructor.CheckLeveledAchievements(
            0,
            "Deployments Purchased",
            testMethod,
            1000,
            100,
            this.ClearMessageList
        );
    }

    Defenses1() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function (increment) {
            achievementObject.CheckDefenses("Advertising", increment);
        };

        return this.constructor.CheckLeveledAchievements(
            1,
            "Defenses/Multipliers Purchased",
            testMethod,
            1,
            1,
            this.ClearMessageList
        );
    }

    Defenses99() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function (increment) {
            achievementObject.CheckDefenses("Advertising", increment);
        };

        return this.constructor.CheckLeveledAchievements(
            1,
            "Defenses/Multipliers Purchased",
            testMethod,
            99,
            11,
            this.ClearMessageList
        );
    }

    Defenses100() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function (increment) {
            achievementObject.CheckDefenses("Advertising", increment);
        };

        return this.constructor.CheckLeveledAchievements(
            1,
            "Defenses/Multipliers Purchased",
            testMethod,
            100,
            10,
            this.ClearMessageList
        );
    }

    Defenses110() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function (increment) {
            achievementObject.CheckDefenses("Advertising", increment);
        };

        return this.constructor.CheckLeveledAchievements(
            1,
            "Defenses/Multipliers Purchased",
            testMethod,
            110,
            10,
            this.ClearMessageList
        );
    }

    Defenses999() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function (increment) {
            achievementObject.CheckDefenses("Advertising", increment);
        };

        return this.constructor.CheckLeveledAchievements(
            1,
            "Defenses/Multipliers Purchased",
            testMethod,
            999,
            111,
            this.ClearMessageList
        );
    }

    Defenses1000() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function (increment) {
            achievementObject.CheckDefenses("Advertising", increment);
        };

        return this.constructor.CheckLeveledAchievements(
            1,
            "Defenses/Multipliers Purchased",
            testMethod,
            1000,
            100,
            this.ClearMessageList
        );
    }

    Attacks1() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function (increment) {
            achievementObject.CheckAttacks("Bug", increment);
        };

        return this.constructor.CheckLeveledAchievements(
            4,
            "Attacks Defended",
            testMethod,
            1,
            1,
            this.ClearMessageList
        );
    }

    Attacks99() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function (increment) {
            achievementObject.CheckAttacks("Bug", increment);
        };

        return this.constructor.CheckLeveledAchievements(
            4,
            "Attacks Defended",
            testMethod,
            99,
            11,
            this.ClearMessageList
        );
    }

    Attacks100() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function (increment) {
            achievementObject.CheckAttacks("Bug", increment);
        };

        return this.constructor.CheckLeveledAchievements(
            4,
            "Attacks Defended",
            testMethod,
            100,
            10,
            this.ClearMessageList
        );
    }

    Attacks110() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function (increment) {
            achievementObject.CheckAttacks("Bug", increment);
        };

        return this.constructor.CheckLeveledAchievements(
            4,
            "Attacks Defended",
            testMethod,
            110,
            10,
            this.ClearMessageList
        );
    }

    Attacks999() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function (increment) {
            achievementObject.CheckAttacks("Bug", increment);
        };

        return this.constructor.CheckLeveledAchievements(
            4,
            "Attacks Defended",
            testMethod,
            999,
            111,
            this.ClearMessageList
        );
    }

    Attacks1000() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function (increment) {
            achievementObject.CheckAttacks("Bug", increment);
        };

        return this.constructor.CheckLeveledAchievements(
            4,
            "Attacks Defended",
            testMethod,
            1000,
            100,
            this.ClearMessageList
        );
    }

    AllDefenses() {
        var multipliers = getMultipliers(); // staticData.js
        var returnMessage = "";
        var testPassed = true;
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function () {
            var total = multipliers.length;

            for (var i = 0; i < total; i++) {
                var index = Math.floor(Math.random() * multipliers.length);
                achievementObject.CheckDefenses(multipliers[index].name, 1);
                multipliers.splice(index, 1);
            }
        };

        [testPassed, returnMessage] = this.constructor.AchievementChecker(
            8,
            testMethod,
            testPassed,
            returnMessage,
            "All Defenses/Multipliers Types Purchased",
            this.ClearMessageList
        );

        return [testPassed, testPassed ? "Test passed." : returnMessage];
    }

    AllAttacks() {
        var attacks = getAttacks(); // staticData.js
        var returnMessage = "";
        var testPassed = true;
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function () {
            var total = attacks.length;

            for (var i = 0; i < total; i++) {
                var index = Math.floor(Math.random() * attacks.length);
                achievementObject.CheckAttacks(attacks[index].name, 1);
                attacks.splice(index, 1);
            }
        };

        [testPassed, returnMessage] = this.constructor.AchievementChecker(
            9,
            testMethod,
            testPassed,
            returnMessage,
            "All Attacks Defended Against",
            this.ClearMessageList
        );

        return [testPassed, testPassed ? "Test passed." : returnMessage];
    }

    Restarted() {
        var returnMessage = "";
        var testPassed = true;
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function () {
            document.getElementById("achievementsModal").style.display = "none";
            achievementObject.Reset(-1);
        };

        [testPassed, returnMessage] = this.constructor.AchievementChecker(
            11,
            testMethod,
            testPassed,
            returnMessage,
            "You Restarted",
            this.ClearMessageList
        );

        return [testPassed, testPassed ? "Test passed." : returnMessage];
    }

    NeroFiddled() {
        var returnMessage = "";
        var testPassed = true;
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function () {
            document.getElementById("achievementsModal").style.display =
                "block";
            achievementObject.Reset(-1);
        };

        var achievementDiv = document.getElementById(
            this.constructor.achievements[16][1]
        );

        if (achievementDiv.className !== "hidden") {
            returnMessage += "Initial state is not hidden.\r\n";
            testPassed = false;
        }

        [testPassed, returnMessage] = this.constructor.AchievementChecker(
            16,
            testMethod,
            testPassed,
            returnMessage,
            "Nero Fiddled",
            null
        );

        if (achievementDiv.className === "hidden") {
            returnMessage += "Final state is not visible.\r\n";
            testPassed = false;
        }

        document.getElementById("achievementsModal").style.display = "none";

        this.constructor.ResetAchievementView();
        this.ClearMessageList();

        return [testPassed, testPassed ? "Test passed." : returnMessage];
    }

    NeroFiddledFailed() {
        var returnMessage = "";
        var testPassed = true;
        var achievementObject = new Achievements(this.ShowMessage);

        var achievement = document.getElementById(
            this.constructor.achievements[16][0]
        );
        var achievementDiv = document.getElementById(
            this.constructor.achievements[16][1]
        );

        if (achievement.className !== "achievementPlaceholder") {
            returnMessage += "Initial state is not correct.\r\n";
            testPassed = false;
        }

        if (achievementDiv.className !== "hidden") {
            returnMessage += "Initial state is not hidden.\r\n";
            testPassed = false;
        }

        document.getElementById("achievementsModal").style.display = "block";
        achievementObject.Reset(1);

        if (achievement.className !== "achievementPlaceholder") {
            returnMessage += "Final state is not correct.\r\n";
            testPassed = false;
        }

        if (achievementDiv.className !== "hidden") {
            returnMessage += "Final state visible.\r\n";
            testPassed = false;
        }

        [testPassed, returnMessage] = this.constructor.CheckAllstarAchievement(
            testPassed,
            returnMessage,
            false
        );

        document.getElementById("achievementsModal").style.display = "none";

        this.constructor.ResetAchievementView();
        this.ClearMessageList();

        return [testPassed, testPassed ? "Test passed." : returnMessage];
    }

    NeroFiddledFailed2() {
        var returnMessage = "";
        var testPassed = true;
        var achievementObject = new Achievements(this.ShowMessage);

        var achievement = document.getElementById(
            this.constructor.achievements[16][0]
        );
        var achievementDiv = document.getElementById(
            this.constructor.achievements[16][1]
        );

        if (achievement.className !== "achievementPlaceholder") {
            returnMessage += "Initial state is not correct.\r\n";
            testPassed = false;
        }

        if (achievementDiv.className !== "hidden") {
            returnMessage += "Initial state is not hidden.\r\n";
            testPassed = false;
        }

        document.getElementById("achievementsModal").style.display = "none";
        achievementObject.Reset(-1);

        if (achievement.className !== "achievementPlaceholder") {
            returnMessage += "Final state is not correct.\r\n";
            testPassed = false;
        }

        if (achievementDiv.className !== "hidden") {
            returnMessage += "Final state visible.\r\n";
            testPassed = false;
        }

        [testPassed, returnMessage] = this.constructor.CheckAllstarAchievement(
            testPassed,
            returnMessage,
            false
        );

        document.getElementById("achievementsModal").style.display = "none";

        this.constructor.ResetAchievementView();
        this.ClearMessageList();

        return [testPassed, testPassed ? "Test passed." : returnMessage];
    }

    CheckLoans1() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function () {
            achievementObject.CheckLoans(1);
        };

        return this.constructor.CheckLeveledAchievements(
            5,
            "Number of Loans",
            testMethod,
            1,
            1,
            this.ClearMessageList,
            5
        );
    }

    CheckLoans9() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function () {
            achievementObject.CheckLoans(1);
        };

        return this.constructor.CheckLeveledAchievements(
            5,
            "Number of Loans",
            testMethod,
            9,
            1,
            this.ClearMessageList,
            10
        );
    }

    CheckLoans10() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function () {
            achievementObject.CheckLoans(1);
        };

        return this.constructor.CheckLeveledAchievements(
            5,
            "Number of Loans",
            testMethod,
            10,
            1,
            this.ClearMessageList,
            10
        );
    }

    CheckLoans11() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function () {
            achievementObject.CheckLoans(1);
        };

        return this.constructor.CheckLeveledAchievements(
            5,
            "Number of Loans",
            testMethod,
            11,
            1,
            this.ClearMessageList,
            10
        );
    }

    CheckLoans30() {
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function () {
            achievementObject.CheckLoans(1);
        };

        return this.constructor.CheckLeveledAchievements(
            5,
            "Number of Loans",
            testMethod,
            30,
            1,
            this.ClearMessageList,
            10
        );
    }

    SurvivingNegativeIncome() {
        var returnMessage = "";
        var testPassed = true;
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function () {
            achievementObject.CheckIncome(1);
        };

        var achievement = document.getElementById(
            this.constructor.achievements[10][0]
        );

        if (achievement.className !== "achievementPlaceholder") {
            returnMessage += "First state is not correct.\r\n";
            testPassed = false;
        }

        achievementObject.CheckIncome(-1);

        [testPassed, returnMessage] = this.constructor.AchievementChecker(
            10,
            testMethod,
            testPassed,
            returnMessage,
            "Surviving Negative Income",
            this.ClearMessageList
        );

        return [testPassed, testPassed ? "Test passed." : returnMessage];
    }

    BrownPants() {
        var returnMessage = "";
        var testPassed = true;
        var achievementObject = new Achievements(this.ShowMessage);
        var testMethod = function () {
            achievementObject.CheckCredits(1, 1);
        };

        var achievement = document.getElementById(
            this.constructor.achievements[15][0]
        );

        if (achievement.className !== "achievementPlaceholder") {
            returnMessage += "First state is not correct.\r\n";
            testPassed = false;
        }

        achievementObject.CheckIncome(-1);

        if (achievement.className !== "achievementPlaceholder") {
            returnMessage += "Second state is not correct.\r\n";
            testPassed = false;
        }

        achievementObject.CheckCredits(-1, 1);

        [testPassed, returnMessage] = this.constructor.AchievementChecker(
            15,
            testMethod,
            testPassed,
            returnMessage,
            "Brown Pants",
            this.ClearMessageList
        );

        return [testPassed, testPassed ? "Test passed." : returnMessage];
    }

    CheckCredits100() {
        var achievementObject = new Achievements(this.ShowMessage);
        var credits = 0;
        var testMethod = function (increment) {
            credits += increment;
            achievementObject.CheckCredits(credits, 0);
        };

        return this.constructor.CheckLeveledAchievements(
            2,
            "Max Credits",
            testMethod,
            100,
            10,
            this.ClearMessageList,
            1000,
            true
        );
    }

    CheckCredits1100() {
        var achievementObject = new Achievements(this.ShowMessage);
        var credits = 0;
        var testMethod = function (increment) {
            credits += increment;
            achievementObject.CheckCredits(credits, 0);
        };

        return this.constructor.CheckLeveledAchievements(
            2,
            "Max Credits",
            testMethod,
            1100,
            100,
            this.ClearMessageList,
            1000,
            true
        );
    }

    CheckCredits1100000() {
        var achievementObject = new Achievements(this.ShowMessage);
        var credits = 0;
        var testMethod = function (increment) {
            credits += increment;
            achievementObject.CheckCredits(credits, 0);
        };

        return this.constructor.CheckLeveledAchievements(
            2,
            "Max Credits",
            testMethod,
            1100000,
            100000,
            this.ClearMessageList,
            1000,
            true
        );
    }

    CheckCredits1100000000() {
        var achievementObject = new Achievements(this.ShowMessage);
        var credits = 0;
        var testMethod = function (increment) {
            credits += increment;
            achievementObject.CheckCredits(credits, 0);
        };

        return this.constructor.CheckLeveledAchievements(
            2,
            "Max Credits",
            testMethod,
            1100000000,
            100000000,
            this.ClearMessageList,
            1000,
            true
        );
    }

    CheckIncome10() {
        var achievementObject = new Achievements(this.ShowMessage);
        var income = 0;
        var testMethod = function (increment) {
            income += increment;
            achievementObject.CheckIncome(income);
        };

        return this.constructor.CheckLeveledAchievements(
            3,
            "Max Income",
            testMethod,
            10,
            1,
            this.ClearMessageList,
            100,
            true
        );
    }

    CheckIncome110() {
        var achievementObject = new Achievements(this.ShowMessage);
        var income = 0;
        var testMethod = function (increment) {
            income += increment;
            achievementObject.CheckIncome(income);
        };

        return this.constructor.CheckLeveledAchievements(
            3,
            "Max Income",
            testMethod,
            110,
            10,
            this.ClearMessageList,
            100,
            true
        );
    }

    CheckIncome11000() {
        var achievementObject = new Achievements(this.ShowMessage);
        var income = 0;
        var testMethod = function (increment) {
            income += increment;
            achievementObject.CheckIncome(income);
        };

        return this.constructor.CheckLeveledAchievements(
            3,
            "Max Income",
            testMethod,
            11000,
            1000,
            this.ClearMessageList,
            100,
            true
        );
    }

    CheckIncome11000000() {
        var achievementObject = new Achievements(this.ShowMessage);
        var income = 0;
        var testMethod = function (increment) {
            income += increment;
            achievementObject.CheckIncome(income);
        };

        return this.constructor.CheckLeveledAchievements(
            3,
            "Max Income",
            testMethod,
            11000000,
            1000000,
            this.ClearMessageList,
            100,
            true
        );
    }

    CheckMaxLoan100() {
        var achievementObject = new Achievements(this.ShowMessage);
        var loan = 0;
        var testMethod = function (increment) {
            loan += increment;
            achievementObject.CheckLoans(loan);
        };

        return this.constructor.CheckLeveledAchievements(
            6,
            "Max Amount of a Single of Loan",
            testMethod,
            100,
            10,
            this.ClearMessageList,
            1000,
            true
        );
    }

    CheckMaxLoan1100() {
        var achievementObject = new Achievements(this.ShowMessage);
        var loan = 0;
        var testMethod = function (increment) {
            loan += increment;
            achievementObject.CheckLoans(loan);
        };

        return this.constructor.CheckLeveledAchievements(
            6,
            "Max Amount of a Single of Loan",
            testMethod,
            1100,
            100,
            this.ClearMessageList,
            1000,
            true
        );
    }

    CheckMaxLoan1100000() {
        var achievementObject = new Achievements(this.ShowMessage);
        var loan = 0;
        var testMethod = function (increment) {
            loan += increment;
            achievementObject.CheckLoans(loan);
        };

        return this.constructor.CheckLeveledAchievements(
            6,
            "Max Amount of a Single of Loan",
            testMethod,
            1100000,
            100000,
            this.ClearMessageList,
            1000,
            true
        );
    }

    CheckMaxLoan1100000000() {
        var achievementObject = new Achievements(this.ShowMessage);
        var loan = 0;
        var testMethod = function (increment) {
            loan += increment;
            achievementObject.CheckLoans(loan);
        };

        return this.constructor.CheckLeveledAchievements(
            6,
            "Max Amount of a Single of Loan",
            testMethod,
            1100000000,
            100000000,
            this.ClearMessageList,
            1000,
            true
        );
    }

    static CheckAllMessages(
        testPassed,
        returnMessage,
        message,
        targetValue = true
    ) {
        if ((this.messageBox.innerText !== message) === targetValue) {
            returnMessage += "Achievement message not in Message.\r\n";
            testPassed = false;
        }

        if ((this.message2Box.innerText !== message) === targetValue) {
            returnMessage += "Achievement message not in Message2.\r\n";
            testPassed = false;
        }

        if (!this.CheckMessageList(message) === targetValue) {
            returnMessage += "Achievement message not in MessageList.\r\n";
            testPassed = false;
        }

        return [testPassed, returnMessage];
    }

    static CheckMessageList(message) {
        for (var i = 0; i < this.messageList.rows.length; i++) {
            if (this.messageList.rows[i].innerText === message) {
                return true;
            }
        }

        return false;
    }

    static CheckAllstarAchievement(
        testPassed,
        returnMessage,
        isDisplayed = false
    ) {
        var achievement = document.getElementById(this.achievements[19][0]);
        var achievementDiv = document.getElementById(this.achievements[19][1]);

        if (!isDisplayed) {
            if (achievement.className !== "achievementPlaceholder") {
                returnMessage += "AllstarAchievement has been won.\r\n";
                testPassed = false;
            }

            if (achievementDiv.className !== "hidden") {
                returnMessage += "AllstarAchievement is visible.\r\n";
                testPassed = false;
            }
        }

        if (isDisplayed) {
            if (achievement.className === "achievementPlaceholder") {
                returnMessage += "AllstarAchievement has not been won.\r\n";
                testPassed = false;
            }

            if (isDisplayed && achievementDiv.className === "hidden") {
                returnMessage += "AllstarAchievement is not visible.\r\n";
                testPassed = false;
            }

            var message = "You earned the All Star achievement.";
            [testPassed, returnMessage] = this.CheckAllMessages(
                testPassed,
                returnMessage,
                message
            );
        }

        return [testPassed, returnMessage];
    }

    // Pass null for ClearMessageList if you need to check MessageList or the state of an achievement after this method has run.
    // But then don't forget to run ResetAchievementView and ClearMessageList at the end of the test
    static AchievementChecker(
        index,
        testMethod,
        testPassed,
        returnMessage,
        name,
        ClearMessageList
    ) {
        var achievement = document.getElementById(this.achievements[index][0]);

        if (achievement.className !== "achievementPlaceholder") {
            returnMessage += "Initial state is not correct.\r\n";
            testPassed = false;
        }

        testMethod();

        if (achievement.className === "achievementPlaceholder") {
            returnMessage += "Final state is not correct.\r\n";
            testPassed = false;
        }

        [testPassed, returnMessage] = this.CheckAllstarAchievement(
            testPassed,
            returnMessage,
            false
        );

        var message = `You earned the ${name} achievement.`;
        [testPassed, returnMessage] = this.CheckAllMessages(
            testPassed,
            returnMessage,
            message
        );

        if (ClearMessageList) {
            this.ResetAchievementView();
            ClearMessageList();
        }

        return [testPassed, returnMessage];
    }

    static ResetAchievementView() {
        this.achievements.forEach((element) => {
            document
                .getElementById(element[0])
                .setAttributeNS(null, "class", "achievementPlaceholder");

            if (element[1]) {
                if (element[1] === "neroDiv" || element[1] === "allStarDiv") {
                    document
                        .getElementById(element[1])
                        .setAttributeNS(null, "class", "hidden");
                } else {
                    document.getElementById(element[1]).innerHTML = 0;
                }
            }
        });
    }

    static ShowAchievements() {
        document.getElementById("achievementsModal").style.display = "block";
        document.getElementById("mask4").style.display = "block";
    }

    static HideAchievements() {
        document.getElementById("achievementsModal").style.display = "none";
        document.getElementById("mask4").style.display = "none";
    }

    static CheckLeveledAchievements(
        index,
        name,
        testMethod,
        total,
        increment,
        ClearMessageList,
        levelIncrement = 100,
        isExponentialIncrement = false
    ) {
        var returnMessage = "";
        var testPassed = true;

        var achievement = document.getElementById(this.achievements[index][0]);
        var achievementLevel = document.getElementById(
            this.achievements[index][1]
        );

        if (achievement.className !== "achievementPlaceholder") {
            returnMessage += "Initial state is not correct.\r\n";
            testPassed = false;
        }

        if (achievementLevel.innerText * 1 !== 0) {
            returnMessage += "Initial level not correct.\r\n";
            testPassed = false;
        }

        for (var i = 0; i < total; i += increment) {
            testMethod(increment);
        }

        if (total < levelIncrement) {
            if (achievement.className !== "achievementPlaceholder") {
                returnMessage += "Final state is not correct.\r\n";
                testPassed = false;
            }

            if (achievementLevel.innerText * 1 !== 0) {
                returnMessage += "Final level not correct.\r\n";
                testPassed = false;
            }
        } else {
            var level = 0;
            if (isExponentialIncrement) {
                while (Math.floor(total) > 0) {
                    total /= levelIncrement;
                    level++;
                }
                level--;
            } else {
                level = Math.floor(total / levelIncrement);
            }

            if (achievement.className === "achievementPlaceholder") {
                returnMessage += "Final state is not correct.\r\n";
                testPassed = false;
            }

            if (achievementLevel.innerText * 1 !== level) {
                returnMessage += "Final level not correct.\r\n";
                testPassed = false;
            }

            var message = `You earned the ${name} achievement, level ${level}.`;
            [testPassed, returnMessage] = this.CheckAllMessages(
                testPassed,
                returnMessage,
                message
            );
        }

        [testPassed, returnMessage] = this.CheckAllstarAchievement(
            testPassed,
            returnMessage,
            false
        );

        this.ResetAchievementView();
        ClearMessageList();

        return [testPassed, testPassed ? "Test passed." : returnMessage];
    }
}
