class AppMultiplier {
    constructor(appName, appCost, multiplierValue, number) {
        this.name = appName;
        this.cost = appCost;
        this.value = multiplierValue;
        this.multiplierNumber = number;
        this.quantity = 0;
    }

    buyMultiplier(qty) {
        this.quantity += qty;
    }

    getCost(qty) {
        var price = 0;
        var upperBounds = this.quantity + qty;

        for (var i = this.quantity; i < upperBounds; i++) {
            price += this.cost * Math.pow(1.25, i);
        }

        return price;
    }
}
