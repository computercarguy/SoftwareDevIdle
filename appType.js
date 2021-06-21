class AppType
{
	name = "";
	cost = 0;
	income = 0;
	incomeMultiplication = 1;
	qtyBuilt = 0;
	multipliers = [];
	currentAttacks = [];
	previousAttacks = [];
	defendedAttacks = 0;
	defenseMultiplier = 5;
	
	constructor(appName, appCost, appIncome)
	{
		this.name = appName;
		this.cost = appCost;
		this.income = appIncome;
	}
	
	buyApp(quantity)
	{
		this.qtyBuilt += quantity;
	}
	
	getCost(quantity)
	{
		var price = 0;
		var upperBounds = this.qtyBuilt + quantity;
		
		for (var i = this.qtyBuilt; i < upperBounds; i++)
		{
			price += this.cost * Math.pow(1.5, i);
		}
		
		return price;
	}
	
	getIncome()
	{
		return (this.incomeMultiplication * this.qtyBuilt * this.income) - this.getAttackCost();
	}
	
	getMultipliersTotal()
	{
		this.incomeMultiplication = 0;
		
		for (var i = 0; i < this.multipliers.length; i++)
		{
			this.incomeMultiplication += this.multipliers[i].value * this.multipliers[i].quantity;
		}
		
		this.incomeMultiplication = this.incomeMultiplication == 0 ? 1 : this.incomeMultiplication;
		
		return this.incomeMultiplication;
	}
	
	buyMultiplier(newMultiplier, quantity)
	{
		if (!newMultiplier || quantity == 0)
		{
			return;
		}
		
		var multiplier = this.findMultiplier(newMultiplier);
		
		if (!multiplier)
		{
			multiplier = new AppMultiplier(newMultiplier.name, newMultiplier.cost, newMultiplier.value, newMultiplier.multiplierNumber);
			this.multipliers.push(multiplier);
		}
		
		multiplier.buyMultiplier(quantity);
		
		this.getMultipliersTotal();
		
		this.updateDefense();
	}
	
	findMultiplier(multiplier)
	{
		for (var i = 0; i < this.multipliers.length; i++)
		{
			if (this.multipliers[i].multiplierNumber === multiplier.multiplierNumber)
			{
				return this.multipliers[i];
			}
		}
	}
	
	addAttack(newAttack)
	{
		if (this.getDefense() >= newAttack.quantity * newAttack.strength)
		{
			this.defendedAttacks += newAttack.quantity;
			this.addPreviousAttack(newAttack);
			
			return;
		}
		
		var attack = null;
		
		for (var i = 0; i < this.currentAttacks.length; i++)
		{
			if (this.currentAttacks[i].name === newAttack.name)
			{
				attack = this.currentAttacks[i];
			}
		}
		
		if (attack)
		{
			attack.quantity += newAttack.quantity;
			attack.strength += newAttack.strength;
		}
		else
		{
			this.currentAttacks.push(newAttack);
		}
	}
	
	getAttackCount()
	{
		var attackCount = 0;

		for (var i = 0; i < this.currentAttacks.length; i++)
		{
			attackCount += this.currentAttacks[i].quantity;
		}
		
		return attackCount;
	}
	
	getAttackStrength()
	{
		var attackStrength = 0;
		
		for (var i = 0; i < this.currentAttacks.length; i++)
		{
			attackStrength += this.currentAttacks[i].quantity * this.currentAttacks[i].strength;
		}
		
		return attackStrength;
	}
	
	getMultiplierCost(multiplier, quantity)
	{
		var priceCheck = this.findMultiplier(multiplier);
		
		return this.qtyBuilt * priceCheck.getCost(quantity);
	}
	
	getDefense()
	{
		if (this.multipliers.length == 0)
		{
			return 0;
		}
		else
		{
			return this.getMultipliersTotal() * this.qtyBuilt * this.defenseMultiplier;
		}
	}
	
	updateDefense()
	{
		if (this.currentAttacks.length > 0)
		{
			var totalDefense = this.getDefense();
			
			for (var i = this.currentAttacks.length - 1; i >= 0 ; i--)
			{
				var attackStrength = this.currentAttacks[i].quantity * this.currentAttacks[i].strength;
				
				if (totalDefense >= attackStrength)
				{
					this.defendedAttacks += this.currentAttacks[i].quantity;
					this.addPreviousAttack(this.currentAttacks[i]);
					
					this.currentAttacks.splice(i, 1);
				}
			}
		}
	}
	
	getAttackCost()
	{
		var attackCost = 0;
		
		for (var i = 0; i < this.currentAttacks.length; i++)
		{
			attackCost += this.currentAttacks[i].quantity * this.currentAttacks[i].cost;
		}
	
		return attackCost;
	}
	
	addPreviousAttack(attack)
	{
		var availableAttack = null;
		
		for (var i = 0; i < this.previousAttacks.length; i++)
		{
			if (this.previousAttacks[i].name == attack.name)
			{
				availableAttack = this.previousAttacks[i];
				break;
			}
		}
		
		if (availableAttack)
		{
			availableAttack.quantity += attack.quantity;
		}
		else
		{
			this.previousAttacks.push(attack);
		}
	}
}