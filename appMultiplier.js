class AppMultiplier
{
	name = "";
	cost = 0;
	value = 1;
	quantity = 0;
	multiplierNumber = 0;
	
	constructor(appName, appCost, multiplierValue, number)
	{
		this.name = appName;
		this.cost = appCost;
		this.value = multiplierValue;
		this.multiplierNumber = number;
	}
	
	buyMultiplier(qty)
	{
		this.quantity += qty;
	}
	
	getCost(qty)
	{
		var price = 0;
		var upperBounds = this.quantity + qty;
		
		for (var i = this.quantity; i < upperBounds; i++)
		{
			price += this.cost * Math.pow(1.5, i);
		}
		
		return price;
	}
}