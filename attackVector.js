class AttackVector
{
	name = "";
	cost = 0;
	quantity = 0;
	strength = 0;
	
	constructor(attackName, attackCost, difficulty, qty = 0)
	{
		this.name = attackName;
		this.cost = attackCost;
		this.strength = difficulty;
		this.quantity = qty;
	}
	
	getCost(qty)
	{
		var price = 0;
		
		for (var i = 0; i < this.quantity; i++)
		{
			price += this.cost * Math.pow(1.2, i);
		}
		
		return price * this.strength * this.quantity;
	}
}