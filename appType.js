class AppType {
    constructor(appName, appCost, appIncome) {
        this.name = appName;
        this.cost = appCost;
        this.income = appIncome;
        this.incomeMultiplication = 1;
        this.qtyBuilt = 0;
        this.multipliers = [];
        this.currentAttacks = [];
        this.previousAttacks = [];
        this.defendedAttacks = 0;
        this.defenseMultiplier = 5;
        this.achievements = null;
    }

    buyApp(quantity) {
        this.qtyBuilt += quantity;
    }

    getCost(quantity) {
        var price = 0;
        var upperBounds = this.qtyBuilt + quantity;

        for (var i = this.qtyBuilt; i < upperBounds; i++) {
            price = Big(this.cost).mul(Math.pow(1.25, i)).add(price).toNumber();
        }

        return price;
    }

    getIncome() {
        return Big(this.incomeMultiplication)
            .mul(this.qtyBuilt)
            .mul(this.income)
            .sub(this.getAttackCost())
            .toNumber();
    }

    getNextPurchaseIncome(qty) {
        return Big(this.incomeMultiplication)
            .mul(qty)
            .mul(this.income)
            .sub(this.getAttackCost())
            .toNumber();
    }

    updateMultipliersTotal() {
        var total = Big(0);

        for (var i = 0; i < this.multipliers.length; i++) {
            total = Big(this.multipliers[i].value)
                .mul(this.multipliers[i].quantity)
                .add(total);
        }

        this.incomeMultiplication = total == 0 ? 1 : total.toNumber();
    }

    buyMultiplier(newMultiplier, quantity) {
        if (!newMultiplier || quantity == 0) {
            return;
        }

        var multiplier = this.findMultiplier(newMultiplier);

        if (!multiplier) {
            multiplier = new AppMultiplier(
                newMultiplier.name,
                newMultiplier.cost,
                newMultiplier.value,
                newMultiplier.multiplierNumber
            );
            this.multipliers.push(multiplier);
        }

        multiplier.buyMultiplier(quantity);

        this.updateMultipliersTotal();

        this.updateDefense();
    }

    findMultiplier(multiplier) {
        for (var i = 0; i < this.multipliers.length; i++) {
            if (
                this.multipliers[i].multiplierNumber ===
                multiplier.multiplierNumber
            ) {
                return this.multipliers[i];
            }
        }
    }

    addAttack(newAttack) {
        if (this.getDefense() >= newAttack.getAttackStrength()) {
            this.defendedAttacks += newAttack.quantity;
            this.addPreviousAttack(newAttack);
            this.achievements.CheckAttacks(newAttack.name, newAttack.quantity);
        } else {
            this.currentAttacks.push(newAttack);
        }
    }

    isUnderAttack() {
        return this.currentAttacks.length > 0;
    }

    getAttackCount() {
        var attackCount = 0;

        for (var i = 0; i < this.currentAttacks.length; i++) {
            attackCount += this.currentAttacks[i].quantity;
        }

        return attackCount;
    }

    getAttackStrength() {
        var attackStrength = 0;

        for (var i = 0; i < this.currentAttacks.length; i++) {
            attackStrength += this.currentAttacks[i].getAttackStrength();
        }

        return attackStrength;
    }

    getMultiplierCost(multiplier, quantity) {
        var priceCheck = this.findMultiplier(multiplier);

        return this.qtyBuilt * priceCheck.getCost(quantity);
    }

    getDefense() {
        if (this.multipliers.length == 0) {
            return 0;
        } else {
            return (
                this.incomeMultiplication *
                this.qtyBuilt *
                this.defenseMultiplier
            );
        }
    }

    updateDefense() {
        if (this.currentAttacks.length > 0) {
            var totalDefense = this.getDefense();

            for (var i = this.currentAttacks.length - 1; i >= 0; i--) {
                var attackStrength = this.currentAttacks[i].getAttackStrength();

                if (totalDefense >= attackStrength) {
                    this.defendedAttacks += this.currentAttacks[i].quantity;
                    this.addPreviousAttack(this.currentAttacks[i]);
                    this.achievements.CheckAttacks(
                        this.currentAttacks[i].name,
                        this.currentAttacks[i].quantity
                    );
                    this.currentAttacks.splice(i, 1);
                }
            }
        }
    }

    getAttackCost() {
        var attackCost = Big(0);

        for (var i = 0; i < this.currentAttacks.length; i++) {
            attackCost = Big(this.currentAttacks[i].getCost()).add(attackCost);
        }

        return attackCost.toNumber();
    }

    addPreviousAttack(attack) {
        var availableAttack = null;

        for (var i = 0; i < this.previousAttacks.length; i++) {
            if (this.previousAttacks[i].name == attack.name) {
                availableAttack = this.previousAttacks[i];
                break;
            }
        }

        if (availableAttack) {
            availableAttack.quantity += attack.quantity;
        } else {
            this.previousAttacks.push(attack);
        }
    }
}
