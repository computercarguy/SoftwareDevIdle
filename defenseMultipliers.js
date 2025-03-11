class DefenseMultipliers {
    constructor(
        allAppsList,
        achievements,
        clearMessage,
        getAccountMinimum,
        bankAccount,
        showMessage,
        displayNumber,
        updateAttacks,
        updateCredits,
        updateIncomeDefense,
        updatePurchaseButton
    ) {
        this.multiplierMultiplier = document.getElementById(
            "MultiplierMultiplier"
        );
        this.multipliers = getMultipliers(); // staticData.js
        this.activeApp = -1;
        this.appLevel = 0;

        this.allApps = allAppsList;
        this.achievements = achievements;
        this.ClearMessage = clearMessage;
        this.GetAccountMinimum = getAccountMinimum;
        this.BankAccount = bankAccount;
        this.ShowMessage = showMessage;
        this.DisplayNumber = displayNumber;
        this.UpdateAttacks = updateAttacks;
        this.UpdateCredits = updateCredits;
        this.UpdateIncomeDefense = updateIncomeDefense;
        this.UpdatePurchaseButton = updatePurchaseButton;

        var appName = document.getElementById("appName");

        appName.onchange = this.UpdateMultiplierEvent.bind(this);
        document.getElementById("message2").onmouseover =
            this.ShowMessageModal.bind(this);
        document.getElementById("message2").onmouseout =
            this.HideMessageModal.bind(this);

        this.allApps.forEach((item, i) => {
            var opt = document.createElement("option");
            opt.value = i;
            opt.innerHTML = item.name;

            if (i !== 0) {
                opt.style.display = "none";
            }

            appName.appendChild(opt);
        });

        appName.selectedIndex = 0;
    }

    Reset(allApps) {
        this.allApps = allApps;
        var appName = document.getElementById("appName");

        for (var i = 1; i < appName.options.length; i++) {
            appName.options[i].style.display = "none";
        }
    }

    ShowMultipliers(appNumber) {
        document.getElementById("mask2").style.display = "block";
        document.getElementById("multiplierModal").style.display = "block";

        this.UpdateMultiplierModal(appNumber);
    }

    UpdateMultiplierEvent(e) {
        this.UpdateMultiplierModal(e.target.value * 1);
    }

    SetAppLevel(level) {
        this.appLevel = level;
    }

    UpdateMultiplierModal(appNumber) {
        var app = this.allApps[appNumber];

        var appName = document.getElementById("appName");
        appName.value = appNumber;

        for (var i = 1; i < this.appLevel; i++) {
            appName.options[i].style.display = "block";
        }

        this.activeApp = appNumber;
        var body = document.createElement("tbody");
        var multiplierTable = document.getElementById("multiplierTable");

        body.id = "MultipliersBody";

        if (multiplierTable.tBodies.length > 0) {
            multiplierTable.removeChild(multiplierTable.tBodies[0]);
        }

        multiplierTable.appendChild(body);

        if (!this.multiplierMultiplier) {
            this.multiplierMultiplier = document.getElementById(
                "MultiplierMultiplier"
            );
        }

        var createMultiplier = this.multiplierMultiplier.value * 1;

        this.multiplierMultiplier.setAttributeNS(null, "appNumber", appNumber);

        this.UpdateMultiplierTotals(appNumber);

        for (var i = 0; i < app.multipliers.length; i++) {
            this.AddMultiplier(
                body,
                app,
                createMultiplier,
                appNumber,
                app.multipliers[i]
            );
        }

        if (app.multipliers.length < this.multipliers.length - 1) {
            var multiplier = this.multipliers[app.multipliers.length];

            this.AddMultiplier(
                body,
                app,
                createMultiplier,
                appNumber,
                multiplier
            );
        }
    }

    UpdateMultiplierTotals(appNumber) {
        if (this.activeApp === appNumber) {
            var app = this.allApps[appNumber];

            document.getElementById("attackStrength").innerHTML =
                this.DisplayNumber(app.getAttackStrength());

            document.getElementById("attackCost").innerHTML =
                "&#575;" + this.DisplayNumber(app.getAttackCost());
            document.getElementById("defenseStrength").innerText =
                this.DisplayNumber(app.getDefense());
        }
    }

    AddMultiplier(body, app, createMultiplier, appNumber, multiplier) {
        var row = document.createElement("tr");
        var className = multiplier.quantity == 0 ? "unlocked" : "plain";
        var purchasedMultiplier = app.findMultiplier(multiplier);

        var cost = purchasedMultiplier
            ? app.getMultiplierCost(purchasedMultiplier, createMultiplier)
            : app.qtyBuilt * multiplier.getCost(createMultiplier);

        row.innerHTML =
            `<td id='${multiplier.name}' class='fontSize nameDefenseCol ${className}'>${multiplier.name}</td>` +
            `<td id='${
                multiplier.name
            }Cost' class='costDefenseCol ${className}'>&#575;${this.DisplayNumber(
                cost
            )}</td>` +
            `<td id='${
                multiplier.name
            }Value' class='multiplierDefenseCol ${className}'>${this.DisplayNumber(
                multiplier.value
            )}</td>` +
            `<td id='${multiplier.name}Button' class='multiplierDdlDefenseCol ${className}'><button id='${multiplier.name}Create' multiplierNumber='${multiplier.multiplierNumber}' appNumber='${appNumber}'>Create ${createMultiplier}x</button></td>` +
            `<td id='${multiplier.name}Qty' class='purchasedDefenseCol ${className}'>${multiplier.quantity}</td>` +
            `<td id='${
                multiplier.name
            }Total' class='totalDefenseCol ${className}'>${
                multiplier.quantity * multiplier.value
            }</td>`;

        body.appendChild(row);

        document.getElementById(multiplier.name + "Create").onclick =
            multiplier.quantity === 0
                ? this.AddMultipliers.bind(this)
                : this.CreateMultipliers.bind(this);
    }

    AddMultipliers(ev) {
        if (this.BankAccount() >= 0) {
            var multiplierNumber =
                ev.srcElement.getAttribute("multiplierNumber") * 1;
            var multiplier = this.multipliers[multiplierNumber];
            var createMultiplier = this.multiplierMultiplier.value * 1;
            var appNumber = ev.srcElement.getAttribute("appNumber") * 1;
            var app = this.allApps[appNumber];
            var purchasedMultiplier = app.findMultiplier(multiplier);

            var cost = purchasedMultiplier
                ? app.getMultiplierCost(purchasedMultiplier, createMultiplier)
                : app.qtyBuilt * multiplier.getCost(createMultiplier);

            if (this.BankAccount() - cost >= this.GetAccountMinimum()) {
                if (app.multipliers.length < this.multipliers.length - 1) {
                    var body = document.getElementById("MultipliersBody");

                    this.AddMultiplier(
                        body,
                        app,
                        createMultiplier,
                        appNumber,
                        this.multipliers[multiplierNumber + 1]
                    );
                }

                this.UpdateMultiplierCss(multiplier.name);

                ev.srcElement.onclick = this.CreateMultipliers.bind(this);

                this.CreateMultipliers(ev);
            } else {
                this.ShowMessage("You can't get a loan for that much.", 10);
            }
        } else {
            this.ShowMessage("You already have loan.", 10);
        }
    }

    CreateMultipliers(ev) {
        if (this.BankAccount() >= 0) {
            var appNumber = ev.srcElement.getAttribute("appNumber") * 1;
            var createMultiplier = this.multiplierMultiplier.value * 1;
            var app = this.allApps[appNumber];
            var multiplierNumber =
                ev.srcElement.getAttribute("multiplierNumber") * 1;
            var multiplier = this.multipliers[multiplierNumber];
            var purchasedMultiplier = app.findMultiplier(multiplier);

            var cost = purchasedMultiplier
                ? app.getMultiplierCost(purchasedMultiplier, createMultiplier)
                : app.qtyBuilt * multiplier.getCost(createMultiplier);

            if (this.BankAccount() - cost >= this.GetAccountMinimum()) {
                this.ClearMessage();

                app.buyMultiplier(multiplier, createMultiplier);

                if (!purchasedMultiplier) {
                    purchasedMultiplier = app.findMultiplier(multiplier);
                }

                this.achievements.CheckDefenses(
                    multiplier.name,
                    createMultiplier
                );
                this.BankAccount(-cost);
                this.UpdateAttacks();
                this.UpdateCredits();
                this.UpdatePurchaseButton(appNumber);

                document.getElementById(
                    purchasedMultiplier.name + "Qty"
                ).innerText = purchasedMultiplier.quantity;
                document.getElementById(
                    purchasedMultiplier.name + "Cost"
                ).innerHTML =
                    "&#575;" +
                    this.DisplayNumber(
                        app.getMultiplierCost(
                            purchasedMultiplier,
                            createMultiplier
                        )
                    );
                document.getElementById(
                    purchasedMultiplier.name + "Total"
                ).innerHTML =
                    purchasedMultiplier.quantity * purchasedMultiplier.value;
                this.UpdateIncomeDefense(app);
                this.UpdatePurchaseButton(appNumber, multiplierNumber);
            } else {
                this.ShowMessage("You can't get a loan for that much.", 10);
            }
        } else {
            this.ShowMessage("You already have loan.", 10);
        }
    }

    CloseMultipliers() {
        document.getElementById("mask2").style.display = "none";
        document.getElementById("multiplierModal").style.display = "none";

        this.activeApp = -1;
        this.ClearMessage();
    }

    MultiplierMultiplierOnchange(ev) {
        var createMultiplier = ev.srcElement.value * 1;
        var appNumber = this.multiplierMultiplier.getAttributeNS(
            null,
            "appNumber"
        );
        var app = this.allApps[appNumber * 1];
        var appMultipliers = app.multipliers;

        for (var i = 0; i < appMultipliers.length; i++) {
            var cost = app.getMultiplierCost(
                appMultipliers[i],
                createMultiplier
            );

            document.getElementById(
                appMultipliers[i].name + "Create"
            ).innerHTML = "Create " + this.multiplierMultiplier.value + "x";
            document.getElementById(appMultipliers[i].name + "Cost").innerHTML =
                "&#575;" +
                this.DisplayNumber(appMultipliers[i].getCost(createMultiplier));

            this.UpdatePurchaseButton(appNumber * 1, i);
        }

        if (appMultipliers.length < this.multipliers.length) {
            var cost = this.DisplayNumber(
                app.qtyBuilt *
                    this.multipliers[appMultipliers.length].getCost(
                        createMultiplier
                    )
            );

            document.getElementById(
                this.multipliers[appMultipliers.length].name + "Create"
            ).innerHTML = "Create " + this.multiplierMultiplier.value + "x";
            document.getElementById(
                this.multipliers[appMultipliers.length].name + "Cost"
            ).innerHTML = "&#575;" + cost;
        }
    }

    UpdateMultiplierCss(multiplierName) {
        var className = "plain";

        document
            .getElementById(multiplierName)
            .setAttributeNS(
                null,
                "class",
                `fontSize nameDefenseCol ${className}`
            );
        document
            .getElementById(multiplierName + "Cost")
            .setAttributeNS(null, "class", `costDefenseCol ${className}`);
        document
            .getElementById(multiplierName + "Value")
            .setAttributeNS(null, "class", `multiplierDefenseCol ${className}`);
        document
            .getElementById(multiplierName + "Button")
            .setAttributeNS(
                null,
                "class",
                `multiplierDdlDefenseCol ${className}`
            );
        document
            .getElementById(multiplierName + "Qty")
            .setAttributeNS(null, "class", `purchasedDefenseCol ${className}`);
        document
            .getElementById(multiplierName + "Total")
            .setAttributeNS(null, "class", `totalDefenseCol ${className}`);
    }

    UpdatePurchaseButton(appNumber, multiplierNumber) {
        var app = this.allApps[appNumber];
        var multiplier = this.multipliers[multiplierNumber];
        var appMultiplier = app.findMultiplier(multiplier);

        var createButton = document.getElementById(multiplier.name + "Create");
        var multiplierMultiplier = this.multiplierMultiplier.value * 1;
        var newTotal =
            (appMultiplier.quantity + multiplierMultiplier) * multiplier.value;

        createButton.title = `Total after purchase: ${this.DisplayNumber(
            newTotal
        )}`;
    }

    ShowMessageModal() {
        var messagesModal = document.getElementById("messagesModal");
        messagesModal.style.display = "block";
        messagesModal.setAttributeNS(
            null,
            "class",
            "messagesModal multipliersMessages"
        );
    }

    HideMessageModal() {
        document.getElementById("messagesModal").style.display = "none";
    }

    UpdateDdlCss(appNumber, isUnderAttack) {
        var ddl = document.getElementById("appName");
        var className = isUnderAttack ? "trouble2" : "";
        ddl.options[appNumber].setAttributeNS(null, "class", className);
    }
}
