class AttackVector {
    constructor(attackName, attackCost, difficulty = 0, qty = 0) {
        this.name = attackName;
        this.cost = attackCost;
        this.strength = difficulty;
        this.quantity = qty;
    }

    getAttackStrength() {
        return Big(this.strength).toNumber();
    }

    getCost() {
        return Big(this.cost).mul(this.quantity).toNumber();
    }
}
