class Achievements {
    constructor(showMessage) {
        this.deploymentsLevel = 0;
        this.deploymentsQty = 0;
        this.defensesLevel = 0;
        this.defensesQty = 0;
        this.incomeLevel = 0;
        this.cashLevel = 0;
        this.loansQty = 0;
        this.loansLevel = 0;
        this.loansMaxLevel = 0;
        this.attacksTotal = 0;
        this.attacksLevel = 0;
        this.adsWatched = 0;
        this.adsLevel = 0;

        this.incomeWentNegative = false;
        this.creditsWentNegative = false;

        this.attackTypes = getAttacks().map((item) => item.name);
        this.defenseTypes = getMultipliers().map((item) => item.name);

        this.bigMoneyLevel = 11;
        this.extraterrestrialLevel = 17;
        this.extradimensionalLevel = 26;

        this.isBigMoney = false;
        this.isExtraterrestrial = false;
        this.isExtradimensional = false;
        this.allDefenseTypes = false;
        this.allAttackTypes = false;
        this.hasWon = false;
        this.hasWonNoLoans = false;
        this.negativeIncome = false;
        this.hasRestarted = false;
        this.brownPants = false;
        this.neroFiddled = false;
        this.allStar = false;

        this.ShowMessage = showMessage;

        this.UpdateAchievements();
    }

    Reset(credits) {
        this.defensesQty = 0;
        this.deploymentsQty = 0;
        this.loansQty = 0;
        this.attacksTotal = 0;
        this.adsWatched = 0;
        this.loansLevel = 0;
        this.incomeWentNegative = false;
        this.creditsWentNegative = false;

        if (!this.hasRestarted) {
            this.hasRestarted = true;

            this.ShowMessage(
                "You earned the You Restarted achievement.",
                10,
                false
            );
            this.UpdateAchievements();
        }

        if (
            credits < 0 &&
            !this.neroFiddled &&
            document.getElementById("achievementsModal").style.display !==
                "none"
        ) {
            this.neroFiddled = true;
            this.ShowMessage(
                "You earned the Nero Fiddled achievement.",
                10,
                false
            );
            this.UpdateAchievements();
        }
    }

    CheckDeployments(value, level) {
        this.deploymentsQty += value;

        if (this.deploymentsQty >= 100 * (this.deploymentsLevel + 1)) {
            this.deploymentsLevel++;
            this.ShowMessage(
                `You earned the Deployments Purchased achievement, level ${this.deploymentsLevel}.`,
                10,
                false
            );
            this.UpdateAchievements();
        }

        switch (level) {
            case this.bigMoneyLevel:
                this.isBigMoney = true;
                this.ShowMessage(
                    "You earned the Big Money achievement.",
                    10,
                    false
                );
                this.UpdateAchievements();
                break;
            case this.extraterrestrialLevel:
                this.isExtraterrestrial = true;
                this.ShowMessage(
                    "You earned the Extraterrestrial achievement.",
                    10,
                    false
                );
                this.UpdateAchievements();
                break;
            case this.extradimensionalLevel:
                this.isExtradimensional = true;
                this.ShowMessage(
                    "You earned the Extradimensional achievement.",
                    10,
                    false
                );
                this.UpdateAchievements();
                break;
        }
    }

    CheckDefenses(name, quantity) {
        this.defensesQty += quantity;

        if (this.defensesQty >= 100 * (this.defensesLevel + 1)) {
            this.defensesLevel++;
            this.ShowMessage(
                `You earned the Defenses/Multipliers Purchased achievement, level ${this.defensesLevel}.`,
                10,
                false
            );
            this.UpdateAchievements();
        }

        if (this.allDefenseTypes) return;

        var index = this.defenseTypes.indexOf(name);

        if (index === -1) {
            return;
        }

        this.defenseTypes.splice(index, 1);

        if (this.defenseTypes.length === 0) {
            this.allDefenseTypes = true;
            this.ShowMessage(
                "You earned the All Defenses/Multipliers Types Purchased achievement.",
                10,
                false
            );
            this.UpdateAchievements();
        }
    }

    CheckAttacks(name, quantity) {
        this.attacksTotal += quantity;

        if (this.attacksTotal >= 100 * (this.attacksLevel + 1)) {
            this.attacksLevel++;
            this.ShowMessage(
                `You earned the Attacks Defended achievement, level ${this.attacksLevel}.`,
                10,
                false
            );
            this.UpdateAchievements();
        }

        if (this.allAttackTypes) return;

        var index = this.attackTypes.indexOf(name);

        if (index === -1) {
            return;
        }

        this.attackTypes.splice(index, 1);

        if (this.attackTypes.length === 0) {
            this.allAttackTypes = true;
            this.ShowMessage(
                "You earned the All Attacks Defended Against achievement.",
                10,
                false
            );
            this.UpdateAchievements();
        }
    }

    CheckIncome(value) {
        if (this.IsEqualOrGreaterThan(value, 100, this.incomeLevel)) {
            this.incomeLevel++;
            this.ShowMessage(
                `You earned the Max Income achievement, level ${this.incomeLevel}.`,
                10,
                false
            );
            this.UpdateAchievements();
        }

        if (
            Big(value).lt(0) &&
            !this.incomeWentNegative &&
            !this.negativeIncome
        ) {
            this.incomeWentNegative = true;
        }

        if (
            Big(value).gt(0) &&
            !this.negativeIncome &&
            this.incomeWentNegative
        ) {
            this.negativeIncome = true;

            this.ShowMessage(
                "You earned the Surviving Negative Income achievement.",
                10,
                false
            );
            this.UpdateAchievements();
        }
    }

    CheckCredits(creditsValue, incomeValue) {
        if (this.IsEqualOrGreaterThan(creditsValue, 1000, this.cashLevel)) {
            this.cashLevel++;
            this.ShowMessage(
                `You earned the Max Credits achievement, level ${this.cashLevel}.`,
                10,
                false
            );
            this.UpdateAchievements();
        }

        if (Big(creditsValue).gt(0) && this.creditsWentNegative) {
            this.creditsWentNegative = false;

            if (
                !this.brownPants &&
                this.incomeWentNegative &&
                Big(incomeValue).gt(0)
            ) {
                this.brownPants = true;

                this.ShowMessage(
                    "You earned the Brown Pants achievement.",
                    10,
                    false
                );
                this.UpdateAchievements();
            }

            this.incomeWentNegative = false;
        }

        if (Big(creditsValue).lt(0) && !this.creditsWentNegative) {
            this.creditsWentNegative = true;
        }
    }

    CheckLoans(value) {
        this.loansQty++;
        if (this.loansQty >= 10 * (this.loansLevel + 1)) {
            this.loansLevel++;
            this.ShowMessage(
                `You earned the Number of Loans achievement, level ${this.loansLevel}.`,
                10,
                false
            );
            this.UpdateAchievements();
        }

        if (this.IsEqualOrGreaterThan(value, 1000, this.loansMaxLevel)) {
            this.loansMaxLevel++;
            this.ShowMessage(
                `You earned the Max Amount of a Single of Loan achievement, level ${this.loansMaxLevel}.`,
                10,
                false
            );
            this.UpdateAchievements();
        }
    }

    WatchedAd() {
        this.adsWatched++;

        if (this.adsWatched % 5 === 0) {
            this.adsLevel++;
            this.ShowMessage(
                `You earned the Ads Watched achievement, level ${this.adsLevel}.`,
                10,
                false
            );
            this.UpdateAchievements();
        }
    }

    DidWin() {
        this.hasWon = true;
        this.ShowMessage("You earned the You Won achievement.", 10, false);

        if (this.loansQty === 0) {
            this.hasWonNoLoans = true;
            this.ShowMessage(
                "You earned the You won without needing a loan achievement.",
                10,
                false
            );
        }

        this.UpdateAchievements();
    }

    IsEqualOrGreaterThan(value, increment, target) {
        return Big(value).gte(Math.pow(increment, target + 1));
    }

    UpdateAchievements() {
        var achievementsCollected = 0;

        achievementsCollected += this.CheckAchievement(
            this.deploymentsLevel,
            "deploymentsAchievement",
            "deploymentsLevel"
        );
        achievementsCollected += this.CheckAchievement(
            this.defensesLevel,
            "multipliersAchievement",
            "defensesLevel"
        );
        achievementsCollected += this.CheckAchievement(
            this.cashLevel,
            "cashAchievement",
            "cashLevel"
        );
        achievementsCollected += this.CheckAchievement(
            this.incomeLevel,
            "incomeAchievement",
            "incomeLevel"
        );
        achievementsCollected += this.CheckAchievement(
            this.loansLevel,
            "loansNumberAchievement",
            "loansLevel"
        );
        achievementsCollected += this.CheckAchievement(
            this.loansMaxLevel,
            "loansAmountAchievement",
            "loansMaxLevel"
        );
        achievementsCollected += this.CheckAchievement(
            this.attacksLevel,
            "attacksAchievement",
            "attacksLevel"
        );
        achievementsCollected += this.CheckAchievement(
            this.adsLevel,
            "adsAchievement",
            "adsLevel"
        );

        if (this.isBigMoney) {
            achievementsCollected++;
            this.SetGoldStar("bigMoneyAchievement");
        }

        if (this.isExtraterrestrial) {
            achievementsCollected++;
            this.SetGoldStar("extraterrestrialAchievement");
        }

        if (this.isExtradimensional) {
            achievementsCollected++;
            this.SetGoldStar("extradimensionalAchievement");
        }

        if (this.allDefenseTypes) {
            achievementsCollected++;
            this.SetGoldStar("allMultipliersAchievement");
        }

        if (this.allAttackTypes) {
            achievementsCollected++;
            this.SetGoldStar("allAttacksAchievement");
        }

        if (this.hasWon) {
            achievementsCollected++;
            this.SetGoldStar("winAchievement");
        }

        if (this.hasWonNoLoans) {
            achievementsCollected++;
            this.SetGoldStar("winLoanAchievement");
        }

        if (this.negativeIncome) {
            achievementsCollected++;
            this.SetGoldStar("negativeIncomeAchievement");
        }

        if (this.hasRestarted) {
            achievementsCollected++;
            this.SetGoldStar("restartedAchievement");
        }

        if (this.brownPants) {
            achievementsCollected++;
            this.SetGoldStar("brownPantsAchievement");
        }

        if (this.neroFiddled) {
            achievementsCollected++;
            document
                .getElementById("neroDiv")
                .setAttributeNS(null, "class", "");
            this.SetGoldStar("neroAchievement");
        }

        if (!this.allStar && achievementsCollected === 19) {
            this.allStar = true;

            this.ShowMessage("You earned the All Star achievement.", 10, false);

            document
                .getElementById("allStarDiv")
                .setAttributeNS(null, "class", "");
            this.SetGoldStar("allstarAchievement");
        }
    }

    CheckAchievement(value, achievementId, levelId = null) {
        if (levelId) {
            document.getElementById(levelId).innerHTML = value;
        }

        if (value !== 0) {
            this.SetGoldStar(achievementId);
            return 1;
        } else {
            return 0;
        }
    }

    SetGoldStar(id) {
        document
            .getElementById(id)
            .setAttributeNS(null, "class", "achievementWon");
    }
}
