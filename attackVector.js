class AttackVector {
    name = "";
    cost = 0;
    quantity = 0;
    strength = 0;

    constructor(attackName, attackCost, difficulty, qty = 0) {
        this.name = attackName;
        this.cost = attackCost;
        this.strength = difficulty;
        this.quantity = qty;
    }

    getAttackStrength() {
        return Big(this.strength).mul(this.quantity).toNumber();
    }

    getCost() {
        return Big(this.cost).mul(this.quantity).toNumber();
    }
}
