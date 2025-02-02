class AppGrid {
    allApps = getApps(); // staticData.js
    attacks = getAttacks(); // staticData.js
    appList = document.getElementById("appList");
    income = document.getElementById("income");
    income2 = document.getElementById("income2");
    attackList = document.getElementById("attackList");
    credits = document.getElementById("credits");
    credits2 = document.getElementById("credits2");
    buildMultiplier = document.getElementById("BuildMultiplier");
    messageList = document.getElementById("messageList");
    message = document.getElementById("message");
    message2 = document.getElementById("message2");

    pause = false;
    level = 0;
    bankAccount = 1; // 1000000000000000000000000n;
    allowAttacks = false;
    loanSeconds = 4;
    messageTimer = null;
    ticksPerSecond = 0;
    minimumIncomeForAttacks = 2.5;

    defenseMultipliers = null;
    achievements = null;

    bigIntFormat /*: BigIntToLocaleStringOptions */ = {
        notation: "scientific",
        maximumFractionDigits: 4
    };

    constructor(ticksPerSecondValue) {
        this.ticksPerSecond = ticksPerSecondValue;

        this.achievements = new Achievements(this.ShowMessage.bind(this));

        this.message.onmouseover = this.ShowMessageModal.bind(this);
        this.message.onmouseout = this.HideMessageModal.bind(this);

        this.defenseMultipliers = new DefenseMultipliers(
            this.allApps,
            this.achievements,
            this.ClearMessage.bind(this),
            this.GetAccountMinimum.bind(this),
            this.BankAccount.bind(this),
            this.ShowMessage.bind(this),
            this.DisplayNumber.bind(this),
            this.UpdateAttacks.bind(this),
            this.UpdateCredits.bind(this),
            this.UpdateIncomeDefense.bind(this),
            this.UpdatePurchaseButton.bind(this)
        );
    }

    Reset() {
        this.allApps = getApps(); // staticData.js
        this.attacks = getAttacks(); // staticData.js
        this.pause = false;
        this.level = 0;
        this.bankAccount = 1;
        this.allowAttacks = false;
        this.messageTimer = null;

        this.achievements.Reset(this.bankAccount);
        this.defenseMultipliers.Reset(this.allApps);

        this.UpdateCredits(0);

        this.AddAppType();
    }

    AddAppType() {
        if (this.pause) {
            return;
        }

        var newApp = this.allApps[this.level];
        var row = document.createElement("tr");
        var createMultiplier = this.buildMultiplier.value;
        newApp.achievements = this.achievements;
        this.defenseMultipliers.SetAppLevel(this.level);

        row.innerHTML =
            `<td id='${newApp.name}' class='fontSize appTypeCol unlocked'>${newApp.name}</td>` +
            `<td id='${
                newApp.name
            }Cost' class='rightJustified costCol unlocked'>&#575;${this.DisplayNumber(
                newApp.getCost(createMultiplier)
            )}</td>` +
            `<td id='${
                newApp.name
            }Income' class='rightJustified incomeEachCol unlocked'>&#575;${this.DisplayNumber(
                Big(newApp.income).mul(this.ticksPerSecond).toNumber()
            )}</td>` +
            `<td id='${newApp.name}TotalIncome' class='rightJustified incomeTotalCol unlocked'>&#575;0.00</td>` +
            `<td id='${newApp.name}Button' class='multiplierDdlCol unlocked'><button id='${newApp.name}Create' appNumber='${this.level}'>Create ${createMultiplier}x</button></td>` +
            `<td id='${newApp.name}Qty' class='rightJustified publishedCol unlocked'>${newApp.qtyBuilt}</td>` +
            `<td id='${newApp.name}Multipliers' class='defenseViewCol unlocked'><button id='${newApp.name}MultipliersButton' appNumber='${this.level}' disabled>View</button></td>` +
            `<td id='${newApp.name}TotalMultipliers' class='rightJustified defenseTotalCol unlocked'>0</td>` +
            `<td id='${newApp.name}Current' class='rightJustified attacksCol unlocked'>${newApp.currentAttacks.length}</td>` +
            `<td id='${newApp.name}Defended' class='rightJustified defendedCol unlocked' appNumber='${this.level}'>${newApp.defendedAttacks}</td>`;

        this.appList.appendChild(row);

        this.level++;

        document.getElementById(newApp.name + "Create").onclick =
            this.AddNewApp.bind(this);
        document.getElementById(newApp.name + "MultipliersButton").onclick =
            this.ShowMultipliers.bind(this);
        document.getElementById(newApp.name + "Defended").onmouseover =
            this.ShowPreviousAttacks.bind(this);
    }

    ShowMultipliers(ev) {
        if (this.pause) {
            return;
        }

        this.CloseAttackList();
        this.UpdateAttacks();
        this.ClearMessage();

        var appNumber = ev.srcElement.getAttribute("appNumber") * 1;
        this.defenseMultipliers.ShowMultipliers(appNumber);
    }

    AddNewApp(ev) {
        if (this.pause) {
            return;
        }

        if (this.bankAccount >= 0) {
            var appNumber = ev.srcElement.getAttribute("appNumber");
            var createMultiplier = this.buildMultiplier.value * 1;
            var app = this.allApps[appNumber];
            var cost = app.getCost(createMultiplier);
            var afterCost = Big(this.bankAccount).sub(cost).toNumber();

            if (afterCost >= this.GetAccountMinimum()) {
                this.ClearMessage();

                if (this.level > 0) {
                    var currentApp = this.allApps[this.level - 1];
                    document.getElementById(
                        currentApp.name + "MultipliersButton"
                    ).disabled = false;
                }

                if (this.level < this.allApps.length) {
                    this.AddAppType();
                } else {
                    this.ShowWin();
                }

                this.UpdateAppCss(app.name, "healthy");

                ev.srcElement.onclick = this.CreateApp.bind(this);
                this.CreateApp(ev);
            } else {
                this.ShowMessage("You can't get a loan for that much.", 10);
            }
        } else {
            this.ShowMessage("You already have loan.", 10);
        }
    }

    UpdateAppCss(appName, className) {
        var appNameElement = document.getElementById(appName);

        if (appNameElement.className != className) {
            appNameElement.setAttributeNS(
                null,
                "class",
                `fontSize appTypeCol ${className}`
            );
            document
                .getElementById(appName + "Cost")
                .setAttributeNS(
                    null,
                    "class",
                    `rightJustified costCol ${className}`
                );
            document
                .getElementById(appName + "Income")
                .setAttributeNS(
                    null,
                    "class",
                    `rightJustified incomeEachCol ${className}`
                );
            document
                .getElementById(appName + "TotalIncome")
                .setAttributeNS(
                    null,
                    "class",
                    `rightJustified incomeTotalCol ${className}`
                );
            document
                .getElementById(appName + "Button")
                .setAttributeNS(null, "class", `multiplierDdlCol ${className}`);
            document
                .getElementById(appName + "Qty")
                .setAttributeNS(
                    null,
                    "class",
                    `rightJustified publishedCol ${className}`
                );
            document
                .getElementById(appName + "Multipliers")
                .setAttributeNS(null, "class", `defenseViewCol ${className}`);
            document
                .getElementById(appName + "TotalMultipliers")
                .setAttributeNS(
                    null,
                    "class",
                    `rightJustified defenseTotalCol ${className}`
                );
            document
                .getElementById(appName + "Current")
                .setAttributeNS(
                    null,
                    "class",
                    `rightJustified attacksCol ${className}`
                );
            document
                .getElementById(appName + "Defended")
                .setAttributeNS(
                    null,
                    "class",
                    `rightJustified defendedCol ${className}`
                );
        }
    }

    DisplayNumber(value) {
        if (typeof value === "bigint") {
            return value.toLocaleString(
                Intl.NumberFormat("currency"),
                this.bigIntFormat
            );
        } else {
            return value > 100000 || value < -100000
                ? value.toExponential(4)
                : value.toLocaleString(Intl.NumberFormat("currency"), {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                  });
        }
    }

    UpdateAttacks() {
        for (var i = 0; i < this.level && this.allApps[i].qtyBuilt > 0; i++) {
            var app = this.allApps[i];

            this.UpdateAppCss(
                app.name,
                app.getAttackCount() == 0 ? "healthy" : "trouble"
            );

            document.getElementById(app.name + "Current").innerHTML =
                app.getAttackCount();
            document.getElementById(app.name + "Defended").innerHTML =
                app.defendedAttacks;

            this.defenseMultipliers.UpdateMultiplierTotals(i);
        }
    }

    UpdateCredits(totalIncome) {
        if (!isNaN(totalIncome)) {
            var incomePerSecond = this.DisplayNumber(
                totalIncome * this.ticksPerSecond
            );
            this.achievements.CheckIncome(totalIncome * this.ticksPerSecond);

            this.income.innerText = incomePerSecond;
            this.income2.innerText = incomePerSecond;

            var incomeClassName = totalIncome >= 0 ? "healthy" : "trouble";
            this.income.className = incomeClassName;
            this.income2.className = incomeClassName;
        }

        this.achievements.CheckCredits(this.bankAccount, totalIncome);

        var credits = this.DisplayNumber(this.bankAccount);
        this.credits.innerText = credits;
        this.credits2.innerText = credits;

        var creditsClassName = this.bankAccount >= 0 ? "healthy" : "trouble";
        this.credits.className = creditsClassName;
        this.credits2.className = creditsClassName;

        if (this.bankAccount == Infinity || this.level === 29) {
            this.ShowWin();
        }

        if (this.bankAccount < 0 && !isNaN(totalIncome) && totalIncome < 0) {
            this.pause = true;

            document.getElementById("mask3").style.display = "block";
            document.getElementById("lose").style.display = "block";
        }
    }

    UpdatePurchaseButton(appNumber) {
        var app = this.allApps[appNumber];
        var createButton = document.getElementById(app.name + "Create");
        var createMultiplier = this.buildMultiplier.value * 1;
        var nextIncome = app.getNextPurchaseIncome(
            app.qtyBuilt + createMultiplier
        );

        createButton.title = `Income after purchase: ${String.fromCharCode(
            575
        )}${this.DisplayNumber(nextIncome * this.ticksPerSecond)}`;
    }

    CreateApp(ev) {
        if (this.pause) {
            return;
        }

        if (this.bankAccount >= 0) {
            var appNumber = ev.srcElement.getAttribute("appNumber") * 1;
            var createMultiplier = this.buildMultiplier.value * 1;
            var app = this.allApps[appNumber];
            var cost = app.getCost(createMultiplier);
            var afterCost = Big(this.bankAccount).sub(cost).toNumber();

            if (afterCost >= this.GetAccountMinimum()) {
                this.ClearMessage();

                app.buyApp(createMultiplier);
                app.updateDefense();

                this.achievements.CheckDeployments(createMultiplier, appNumber);

                this.bankAccount = afterCost;

                this.UpdateCredits();

                document.getElementById(app.name + "Qty").innerText =
                    app.qtyBuilt;
                document.getElementById(app.name + "Cost").innerHTML =
                    "&#575;" +
                    this.DisplayNumber(app.getCost(createMultiplier));
                this.UpdateIncomeDefense(app);
                this.UpdatePurchaseButton(appNumber);
            } else {
                this.ShowMessage("You can't get a loan for that much.", 10);
            }
        } else {
            this.ShowMessage("You already have loan.", 10);
        }
    }

    UpdateIncomeDefense(app) {
        document.getElementById(app.name + "TotalIncome").innerHTML =
            "&#575;" +
            this.DisplayNumber(app.getIncome() * this.ticksPerSecond);
        document.getElementById(app.name + "TotalMultipliers").innerHTML =
            this.DisplayNumber(app.getDefense());
    }

    GetAccountMinimum() {
        var income = this.GetTotalIncome();
        var minimum = -(income * this.ticksPerSecond * this.loanSeconds);
        return income < 0 ? income : minimum;
    }

    ShowMessage(textMessage, duration, warning = true) {
        this.ClearMessage();
        // add list of messages, with the newest on top
        var message = `<label class='${
            warning ? "warning" : "allClear"
        }'>${textMessage}</label>`;

        this.message.innerHTML = message;
        this.message2.innerHTML = message;

        if (textMessage.trim().length > 0) {
            this.AddRow(message, warning);
        }

        if (this.messageTimer) {
            clearTimeout(this.messageTimer);
        }

        this.messageTimer = setTimeout(
            this.ClearMessage.bind(this),
            duration * 1000
        );
    }

    AddRow(message, warning = true) {
        var row = document.createElement("tr");
        row.innerHTML = `<td class='${
            warning ? "warning" : "allClear"
        }'>${message}</td>`;

        this.messageList.insertBefore(row, this.messageList.rows[0]);

        while (this.messageList.rows.length > 10) {
            this.messageList.rows[10].remove();
        }
    }

    ClearMessageList() {
        // For automated testing
        while (this.messageList.rows.length > 0) {
            this.messageList.rows[0].remove();
        }
    }

    ClearMessage() {
        this.message.innerText = "";
        this.message2.innerText = "";

        clearTimeout(this.messageTimer);
        this.messageTimer = null;
    }

    ShowPreviousAttacks(ev) {
        if (this.pause) {
            return;
        }

        if (ev.srcElement.className != "unlocked") {
            var appNumber = ev.srcElement.getAttribute("appNumber") * 1;
            var appAttacks = ev.srcElement.getAttribute("appAttacks") * 1;
            var app = this.allApps[appNumber];

            if (app.defendedAttacks != 0 && appAttacks != app) {
                attackList.style.top = ev.clientY - 15 + "px";
                attackList.style.display = "block";
                attackList.innerHTML = `<label id='appAttacks' class='hidden'>${appNumber}</label>`;
                attackList.innerHTML += "Previous attacks:<br />";

                for (var i = 0; i < app.previousAttacks.length; i++) {
                    attackList.innerHTML +=
                        app.previousAttacks[i].name +
                        " x " +
                        app.previousAttacks[i].quantity +
                        "<br />";
                }

                var box = attackList.getBoundingClientRect();

                attackList.style.left = ev.clientX - box.width + "px";
            }
        }
    }

    GetTotalIncome() {
        var totalIncome = 0;

        for (var i = 0; i < this.level; i++) {
            totalIncome += this.allApps[i].getIncome();
        }

        return totalIncome;
    }

    CloseAttackList() {
        attackList.style.display = "none";
        attackList.innerHTML = "";
    }

    CloseMultipliers() {
        this.defenseMultipliers.CloseMultipliers();
    }

    BuildMultiplierOnChange(ev) {
        var createMultiplier = ev.srcElement.value * 1;

        for (var i = 0; i < this.level; i++) {
            var app = this.allApps[i];

            document.getElementById(app.name + "Create").innerHTML =
                "Create " + createMultiplier + "x";
            document.getElementById(app.name + "Cost").innerHTML =
                "&#575;" + this.DisplayNumber(app.getCost(createMultiplier));

            this.UpdatePurchaseButton(i);
        }
    }

    IncomeTimer(e) {
        if (this.pause) {
            return;
        }

        var payment = this.GetTotalIncome() || 0;
        this.bankAccount = Big(this.bankAccount).add(payment).toNumber();

        this.UpdateCredits(payment);
    }

    AttackTimer(e) {
        if (this.pause) {
            return;
        }

        if (
            !this.allowAttacks &&
            this.minimumIncomeForAttacks <
                this.ticksPerSecond * this.GetTotalIncome()
        ) {
            this.allowAttacks = true;
        }

        if (this.allowAttacks) {
            var randomApp = Math.floor(Math.random() * this.level);

            if (
                randomApp >= 0 &&
                randomApp < this.level &&
                this.allApps[randomApp].qtyBuilt > 0
            ) {
                var app = this.allApps[randomApp];
                var randomAttack = Math.floor(
                    Math.random() * (app.multipliers.length + 2)
                );

                if (randomAttack >= 0 && randomAttack < this.attacks.length) {
                    var randomStrength = Math.random() * this.level;
                    var randomQuantity = app.multipliers[randomAttack]
                        ? Math.ceil(
                              Math.random() *
                                  app.multipliers[randomAttack].quantity *
                                  2
                          )
                        : Math.ceil(Math.random() * 2);

                    if (randomStrength > 0 && randomQuantity > 0) {
                        var attack = this.attacks[randomAttack];

                        var newAttack = new AttackVector(
                            attack.name,
                            attack.cost,
                            attack.strength * randomStrength,
                            randomQuantity
                        );

                        app.addAttack(newAttack);

                        this.ShowMessage(
                            `New attack: ${newAttack.name} on ${app.name}.`,
                            10
                        );
                    }
                }
            }

            this.UpdateAttacks();
        }
    }

    Pause(e) {
        pauseButton.innerText = this.pause ? "Pause" : "Resume";

        this.pause = !this.pause;
    }

    BankAccount(value = 0) {
        this.bankAccount = Big(this.bankAccount).add(value).toNumber();

        return this.bankAccount;
    }

    MultiplierMultiplierOnchange(ev) {
        this.defenseMultipliers.MultiplierMultiplierOnchange(ev);
    }

    ShowMessageModal() {
        var messagesModal = document.getElementById("messagesModal");
        messagesModal.style.display = "block";
        messagesModal.setAttribute("class", "messagesModal mainMessages");
    }

    HideMessageModal() {
        document.getElementById("messagesModal").style.display = "none";
    }

    ShowWin() {
        this.pause = true;
        this.achievements.DidWin();

        document.getElementById("mask3").style.display = "block";
        document.getElementById("win").style.display = "block";
    }
}
