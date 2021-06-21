class DevIdle
{
	context = document.getElementById("devIdle");
	credits = document.getElementById("credits");
	credits2 = document.getElementById("credits2");
	income = document.getElementById("income");
	income2 = document.getElementById("income2");
	message = document.getElementById("message");
	message2 = document.getElementById("message2");
	multiplierTable = document.getElementById('multiplierTable');
	closeMultiplier = document.getElementById('closeMultiplier');
	mask2 = document.getElementById("mask2");
	multiplierModal = document.getElementById("multiplierModal");
	attackList = document.getElementById("attackList");
	appName = document.getElementById("appName");
	
	allApps = [
		new AppType("Open Source", 1, 0.05),
		new AppType("Personal Website", 20, 0.25),
		new AppType("1 Player Game", 50, 1),
		new AppType("Business Website", 250, 5),
		new AppType("2 Player Game", 1000, 10),
		new AppType("Mobile Game", 2000, 20),
		new AppType("Internal Utility", 5000, 50),
		new AppType("e-Commerce Site", 10000, 100),
		new AppType("Payment Gateway", 100000, 1000),
		new AppType("Crypto-currency Gateway", 100000, 100000),
		new AppType("MMORPG", 5000000, 10000),
		new AppType("Military Contract", 15000000, 15000),
		new AppType("Streaming Site", 100000000, 100000),
		new AppType("Medical Billing", 500000000, 500000),
		new AppType("Online Shopping Site", 10000000000, 10000000),
		new AppType("Government Contract", 1000000000000, 1000000000)
	];
	
	// The quantity of "multipliers" and "attacks" should be the same
	// so that increasing the available "multipliers" and "attacks" is syncronized
	multipliers = [
		new AppMultiplier("In-App Purchases", 1, 1.25, 0),
		new AppMultiplier("Advertising", 10, 1.5, 1),
		new AppMultiplier("Code Reviews", 50, 1.75, 2),
		new AppMultiplier("Anti-virus", 150, 2, 3),
		new AppMultiplier("Scrum Meetings", 500, 3, 4),
		new AppMultiplier("Task Management", 1000, 5, 5),
		new AppMultiplier("Server RAM", 1500, 10, 6),
		new AppMultiplier("Server Storage", 3500, 20, 7),
		new AppMultiplier("Server CPU", 4500, 50, 8),
		new AppMultiplier("Server Database", 6000, 100, 9),
		new AppMultiplier("Server Internet", 10000, 200, 10),
		new AppMultiplier("Refactors", 20000, 300, 11),
		new AppMultiplier("Product Owner", 40000, 500, 12),
		new AppMultiplier("Customer Service", 80000, 1000, 13),
		new AppMultiplier("Server Quantity", 150000, 10000, 14),
		new AppMultiplier("Employee Benefits", 350000, 100000, 15),
		new AppMultiplier("Employee Raises", 500000, 2000000, 16),
		new AppMultiplier("Tech Refresh", 5000000, 5000000, 17),
		new AppMultiplier("Remote Server Farm", 50000000, 15000000, 18)
	];

	attacks = [
		new AttackVector("Script Kiddie", 1, 1),
		new AttackVector("Bug", 10, 3),
		new AttackVector("Customer Dissatisfaction", 50, 10),
		new AttackVector("Worm", 100, 20),
		new AttackVector("Trojan", 500, 50),
		new AttackVector("Rootkit", 1000, 100),
		new AttackVector("Technical Debt", 5000, 150),
		new AttackVector("Cooling Failure", 10000, 250),
		new AttackVector("Zero-Day Exploit", 15000, 1250),
		new AttackVector("Lead Dev Quits", 150000, 5000),
		new AttackVector("Active Hack", 1500000, 50000),
		new AttackVector("2 Devs Quit", 15000000, 150000),
		new AttackVector("Backdoor", 150000000, 500000),
		new AttackVector("Micromanagement", 500000000, 1500000),
		new AttackVector("Server Failure", 1500000000, 5000000),
		new AttackVector("5 Devs Quit", 15000000000, 100000000),
		new AttackVector("Dev Department Quits", 50000000000, 5000000000),
		new AttackVector("Switch Failure", 150000000000, 50000000000),
		new AttackVector("DDOS", 1500000000000, 5000000000000)
	];
	
	availableModifiers = -3;
	cycleMultiplier = 1;
	incomeTimerLength = 1 / 4 * 1000;
	attackTimerLength = 15 * 1000;
	level = 0;
	bankAccount = 1;
	loanSeconds = 4;
	// maxAttackStrength = 6;
	activeApp = -1;
	allowAttacks = false;
	

	pause = false;

	appList = null;
	buildMultiplier = null;
	multiplierMultiplier = null;
	attackStrength = null;
	defenseStrength = null;
	messageTimer = null;

	BeginGame()
	{
		var ddl = "<select id='BuildMultiplier'><option value='1'>1</option><option value='5'>5</option><option value='10'>10</option><option value='25'>25</option><option value='50'>50</option><option value='100'>100</option></select>";
		
		this.context.innerHTML = "<thead><th>App Type</th><th>Cost</th><th>Income (each)</th><th>" + ddl + "</th><th>Published</th><th>Multipliers</th><th>Current Attacks</th><th>Defended Attacks</th></thead>";
		this.context.innerHTML += "<tbody id ='appList'></tbody";
	
		this.SetupInstructions();
		this.SetupModifierModal();

		this.attackList.onclick = this.CloseAttackList.bind(this);
		this.attackList.onmouseout = this.CloseAttackList.bind(this);

		this.UpdateCredits(0);
		
		var me = this;
		var pauseButton = document.createElement('button');

		pauseButton.innerText = "Pause";
		
		pauseButton.onclick = function (e)
		{
			if (me.pause)
			{
				pauseButton.innerText = "Pause";
			}
			else 
			{
				pauseButton.innerText = "Resume";
			}
			
			me.pause = !me.pause;
		};
		
		document.getElementById("pauseCell").appendChild(pauseButton);
		
		this.buildMultiplier = document.getElementById("BuildMultiplier");

		this.buildMultiplier.onchange = function(ev)
		{
			var createMultiplier = ev.srcElement.value * 1;
			
			for (var i = 0; i < me.level; i++)
			{
				var app = me.allApps[i];

				document.getElementById(app.name + "Create").innerHTML = "Create " + createMultiplier + "x";
				document.getElementById(app.name + "Cost").innerHTML = "&#575;" + me.DisplayNumber(app.getCost(createMultiplier));
			}
		};
		
		this.AddAppType();
		
		this.SetupTimers();
	}
	
	SetupTimers()
	{
		var me = this;

		// set up income timer
		setInterval(
			function (e)
			{
				if (!me.pause)
				{
					var payment = (me.GetTotalIncome.bind(me))() || 0;
					
					me.bankAccount += payment;
					me.UpdateCredits(payment);
				}
			},
			this.incomeTimerLength
		);
		
		// setup attack timer
		setInterval(
			function (e)
			{
				if (!me.pause)
				{
					if (!me.allowAttacks && me.GetTotalIncome() > 2.5)
					{
						me.allowAttacks = true;
					}
					
					if (me.allowAttacks)
					{
						var randomApp = Math.floor(Math.random() * me.level);

						if (randomApp >= 0 && randomApp < me.level && me.allApps[randomApp].qtyBuilt > 0)
						{
							var app = me.allApps[randomApp];
							var randomAttack = Math.floor(Math.random() * app.multipliers.length + 2) - 1;

							if (randomAttack >= 0 && randomAttack < me.attacks.length)
							{
								var randomStrength = Math.random() * me.level;
								var randomQuantity = Math.ceil(Math.random() * (app.multipliers.length + 1));

								if (randomStrength > 0 && randomQuantity > 0)
								{
									var attack = me.attacks[randomAttack];
									
									var newAttack = new AttackVector(attack.name, attack.cost, attack.strength * randomStrength, randomQuantity);

									app.addAttack(newAttack);
									
									if (me.activeApp == -1)
									{
										me.ShowMessage("New attack: " + newAttack.name + " on " + app.name + ".", 10);
									}
									else
									{
										me.ShowMessage2("New attack: " + newAttack.name + " on " + app.name + ".", 10);
									}
								}
							}
						}
						
						me.UpdateAttacks();
					}
				}
			},
			this.attackTimerLength
		);
	}
	
	SetupModifierModal()
	{
		var header = document.createElement('thead');
		var ddl = "<select id='MultiplierMultiplier'><option value='1'>1</option><option value='5'>5</option><option value='10'>10</option><option value='25'>25</option><option value='50'>50</option><option value='100'>100</option></select>";
		
		header.innerHTML = "<tr><td>Name</td><td>Cost</td><td>Multiplier</td><td>" + ddl + "</td><td>Purchased</td><td>Total</td></tr>";
		this.multiplierTable.appendChild(header);

		var footer = document.createElement('tfoot');
		footer.innerHTML = "<tr><td></td><td></td><td class='plain'>Attack:</td><td id='attackStrength' class='trouble'>0</td><td class='plain'>Defense:</td><td id='defenseStrength' class='healthy'>0</td></tr>";

		this.multiplierTable.appendChild(footer);
		
		this.attackStrength = document.getElementById("attackStrength");
		this.defenseStrength = document.getElementById("defenseStrength");

		this.mask2.onclick = this.CloseMultipliers.bind(this);
		this.closeMultiplier.onclick = this.CloseMultipliers.bind(this);
		
		var me = this;
		
		this.multiplierMultiplier = document.getElementById("MultiplierMultiplier");
		this.multiplierMultiplier.onchange = function(ev)
		{
			var createMultiplier = ev.srcElement.value * 1;
			var appNumber = me.multiplierMultiplier.getAttributeNS(null, "appNumber");
			var app = me.allApps[appNumber * 1];
			var appMultipliers = app.multipliers;

			for (var i = 0; i < appMultipliers.length; i++)
			{
				var cost = app.getMultiplierCost(appMultipliers[i], createMultiplier);

				document.getElementById(appMultipliers[i].name + "Create").innerHTML = "Create " + me.multiplierMultiplier.value + "x";
				document.getElementById(appMultipliers[i].name + "Cost").innerHTML = "&#575;" + me.DisplayNumber(appMultipliers[i].getCost(createMultiplier));
			}
			
			if (appMultipliers.length < me.multipliers.length)
			{
				var cost = me.DisplayNumber(app.qtyBuilt * me.multipliers[appMultipliers.length].getCost(createMultiplier));
				
				document.getElementById(me.multipliers[appMultipliers.length].name + "Create").innerHTML = "Create " + me.multiplierMultiplier.value + "x";
				document.getElementById(me.multipliers[appMultipliers.length].name + "Cost").innerHTML = "&#575;" + cost;
			}
		};
	}
	
	SetupInstructions()
	{
		var instructionsButton = document.createElement('button');
		instructionsButton.innerText = "Instructions";
		document.getElementById("instructions").appendChild(instructionsButton);
		
		var modal = document.getElementById("instructionsModal");
		var mask = document.getElementById("mask");

		instructionsButton.onclick = function (e)
		{
			modal.style.display = "block";
			mask.style.display = "block";
		};

		var closeButton = document.getElementById("closeInstructions");

		closeButton.onclick = function() {
			modal.style.display = "none";
			mask.style.display = "none";
		}

		window.onclick = function(event) {
			if (event.target == modal || event.target == mask) {
				modal.style.display = "none";
				mask.style.display = "none";
			}
		}
	}
	
	DisplayNumber(value)
	{
		return value > 100000 ? value.toExponential(4) : value.toFixed(2);
	}
	
	CloseMultipliers()
	{
		this.mask2.style.display = "none";
		this.multiplierModal.style.display = "none";
		
		this.activeApp = -1;
		this.ClearMessage();
	}
	
	UpdateAttacks()
	{
		for (var i = 0; i < this.level && this.allApps[i].qtyBuilt > 0; i++)
		{
			var app = this.allApps[i];
			
			this.UpdateAppCss(app.name, app.getAttackCount() == 0 ? "healthy" : "trouble");
			
			document.getElementById(app.name + "Current").innerHTML = app.getAttackCount();
			document.getElementById(app.name + "Defended").innerHTML = app.defendedAttacks;
			
			if (i == this.activeApp)
			{
				this.attackStrength.innerText = this.DisplayNumber(app.getAttackStrength());
				this.defenseStrength.innerText = this.DisplayNumber(app.getDefense());
			}
		}
	}
	
	GetTotalIncome()
	{
		var totalIncome = 0;
				
		for (var i = 0; i < this.level; i++)
		{
			totalIncome += this.allApps[i].getIncome();
		}
		
		return totalIncome;
	}
	
	UpdateCredits(totalIncome)
	{
		if (!isNaN(totalIncome))
		{
			var incomePerSecond = this.DisplayNumber(totalIncome * (1000 / this.incomeTimerLength));
			
			this.income.innerText = incomePerSecond;
			this.income2.innerText = incomePerSecond;

			if (totalIncome >= 0)
			{
				this.income.className = "healthy";
				this.income2.className = "healthy";
			}
			else
			{
				this.income.className = "trouble";
				this.income2.className = "trouble";
			}
		}
		
		this.credits.innerText = this.DisplayNumber(this.bankAccount);
		this.credits2.innerText = this.DisplayNumber(this.bankAccount);
		
		if (this.bankAccount >= 0)
		{
			this.credits.className = "healthy";
			this.credits2.className = "healthy";
		}
		else
		{
			this.credits.className = "trouble";
			this.credits2.className = "trouble";
		}
		
		if (this.bankAccount == Infinity)
		{
			this.pause = true;
			document.getElementById("mask3").style.display = "block";
			document.getElementById("win").style.display = "block";
		}

		if (this.bankAccount < 0 && !isNaN(totalIncome) && totalIncome < 0)
		{
			this.pause = true;
			document.getElementById("mask3").style.display = "block";
			document.getElementById("lose").style.display = "block";
		}
	}
	
	AddAppType()
	{
		if (!this.pause)
		{
			if (!this.appList)
			{
				this.appList = document.getElementById("appList");
			}
			
			var newApp = this.allApps[this.level];
			var row = document.createElement('tr');
			var createMultiplier = this.buildMultiplier.value;
			
			row.innerHTML = "<td id='" + newApp.name + "' class='unlocked'>" + newApp.name + "</td>" +
				"<td id='" + newApp.name + "Cost' class='unlocked'>&#575;" + this.DisplayNumber(newApp.getCost(createMultiplier)) + "</td>" +
				"<td id='" + newApp.name + "Income' class='unlocked'>&#575;" + this.DisplayNumber(newApp.income) + "</td>" +
				"<td id='" + newApp.name + "Button' class='unlocked'><button id='" + newApp.name + "Create' appNumber='" + this.level + "'>Create " + createMultiplier + "x</button></td>" +
				"<td id='" + newApp.name + "Qty' class='unlocked'>" + newApp.qtyBuilt + "</td>" +
				"<td id='" + newApp.name + "Multipliers' class='unlocked'><button id='" + newApp.name + "MultipliersButton' appNumber='" + this.level + "' disabled>View</button></td>" +
				"<td id='" + newApp.name + "Current' class='unlocked'>" + newApp.currentAttacks.length + "</td>" +
				"<td id='" + newApp.name + "Defended' class='unlocked' appNumber='" + this.level + "'>" + newApp.defendedAttacks + "</td>";

			this.appList.appendChild(row);
			
			this.level++;
			
			document.getElementById(newApp.name + "Create").onclick = this.AddNewApp.bind(this);
			document.getElementById(newApp.name + "Multipliers").onclick = this.ShowMultipliers.bind(this);
			document.getElementById(newApp.name + "Defended").onmouseover = this.ShowPreviousAttacks.bind(this);
		}
	}
	
	AddNewApp(ev)
	{
		if (!this.pause) 
		{
			if (this.bankAccount >= 0)
			{
				var appNumber = ev.srcElement.getAttribute("appNumber");
				var createMultiplier = this.buildMultiplier.value * 1;
				var app = this.allApps[appNumber];
				var cost = app.getCost(createMultiplier);
				
				if (this.bankAccount - cost >= (-1 * (this.GetTotalIncome() * (1000 / this.incomeTimerLength) * this.loanSeconds)))
				{
					this.ClearMessage();
					
					if (this.level > 0)
					{
						var currentApp = this.allApps[this.level - 1];
						document.getElementById(currentApp.name + "MultipliersButton").disabled = false;
					}
					
					if (this.level < this.allApps.length)
					{
						this.AddAppType();
					}
			
					this.UpdateAppCss(app.name, "healthy");
					
					ev.srcElement.onclick = this.CreateApp.bind(this);
					this.CreateApp(ev);
				}
				else
				{
					this.ShowMessage("You can't get a loan for that much.", 10);
				}
			}
			else
			{
				this.ShowMessage("You already have loan.", 10);
			}
		}
	}
	
	UpdateAppCss(appName, className)
	{
		var appNameElement = document.getElementById(appName);
		
		if (appNameElement.className != className)
		{
			appNameElement.setAttributeNS(null, "class", className);
			document.getElementById(appName + "Cost").setAttributeNS(null, "class", className);
			document.getElementById(appName + "Income").setAttributeNS(null, "class", className);
			document.getElementById(appName + "Button").setAttributeNS(null, "class", className);
			document.getElementById(appName + "Qty").setAttributeNS(null, "class", className);
			document.getElementById(appName + "Multipliers").setAttributeNS(null, "class", className);
			document.getElementById(appName + "Current").setAttributeNS(null, "class", className);
			document.getElementById(appName + "Defended").setAttributeNS(null, "class", className);
		}
	}
	
	UpdateMultiplierCss(multiplierName)
	{
		var className = "plain";
		
		document.getElementById(multiplierName).setAttributeNS(null, "class", className);
		document.getElementById(multiplierName + "Cost").setAttributeNS(null, "class", className);
		document.getElementById(multiplierName + "Value").setAttributeNS(null, "class", className);
		document.getElementById(multiplierName + "Button").setAttributeNS(null, "class", className);
		document.getElementById(multiplierName + "Qty").setAttributeNS(null, "class", className);
		document.getElementById(multiplierName + "Total").setAttributeNS(null, "class", className);
	}
	
	CreateApp(ev)
	{
		if (!this.pause)
		{
			if (this.bankAccount >= 0)
			{
				var appNumber = ev.srcElement.getAttribute("appNumber") * 1;
				var createMultiplier = this.buildMultiplier.value * 1;
				var app = this.allApps[appNumber];
				var cost = app.getCost(createMultiplier);

				if (this.bankAccount - cost >= (-1 * (this.GetTotalIncome() * (1000 / this.incomeTimerLength) * this.loanSeconds)))
				{
					this.ClearMessage();
					
					app.buyApp(createMultiplier);
					app.updateDefense();
					
					this.bankAccount -= cost;
					this.UpdateCredits();

					document.getElementById(app.name + "Qty").innerText = app.qtyBuilt;
					document.getElementById(app.name + "Cost").innerHTML = "&#575;" + this.DisplayNumber(app.getCost(createMultiplier));
				}
				else
				{
					this.ShowMessage("You can't get a loan for that much.", 10);
				}
			}
			else
			{
				this.ShowMessage("You already have loan.", 10);
			}
		}
	}
	
	ShowMessage(textMessage, duration, warning = true)
	{
		var me = this;
		
		this.ClearMessage();
		
		this.message.innerHTML = "<label class='" + (warning ? "warning" : "allClear") + "'>" + textMessage + "</label>";
		
		if (this.messageTimer)
		{
			clearTimeout(this.messageTimer);
		}
		
		this.messageTimer = setTimeout(this.ClearMessage.bind(this), duration * 1000);
	}
	
	ShowMessage2(textMessage, duration, warning = true)
	{
		var me = this;
		
		this.ClearMessage();
		
		this.message2.innerHTML = "<label class='" + (warning ? "warning" : "allClear") + "'>" + textMessage + "</label>";
		
		if (this.messageTimer)
		{
			clearTimeout(this.messageTimer);
		}
		
		this.messageTimer = setTimeout(this.ClearMessage.bind(this), duration * 1000);
	}
	
	ClearMessage()
	{
		this.message.innerText = "";
		this.message2.innerText = "";
		
		clearTimeout(this.messageTimer);
		this.messageTimer = null;
	}
	
	ShowMultipliers(ev)
	{
		if (!this.pause)
		{
			this.CloseAttackList();
					
			var appNumber = ev.srcElement.getAttribute("appNumber") * 1;
			var app = this.allApps[appNumber];
			
			this.appName.innerText = app.name;
			
			this.activeApp = appNumber;
			this.mask2.style.display = "block";
			this.multiplierModal.style.display = "block";
			
			this.UpdateAttacks();
			this.ClearMessage();
			
			var body = document.createElement('tbody');		

			body.id = "MultipliersBody";
			
			if (this.multiplierTable.tBodies.length > 0)
			{
				this.multiplierTable.removeChild(this.multiplierTable.tBodies[0]);
			}
			
			this.multiplierTable.appendChild(body);

			var div = document.createElement('div');	

			div.innerHTML = "<button id='closeMultipliers'>Close</button>";
			div.className = "centered";

			var createMultiplier = this.multiplierMultiplier.value * 1;
			
			this.multiplierMultiplier.setAttributeNS(null, "appNumber", appNumber);
			
			for (var i = 0; i < app.multipliers.length; i++)
			{
				this.AddMultiplier(body, app, createMultiplier, appNumber, app.multipliers[i]);
			}
			
			if (app.multipliers.length < this.multipliers.length - 1)
			{
				var multiplier = this.multipliers[app.multipliers.length];

				this.AddMultiplier(body, app, createMultiplier, appNumber, multiplier);
			}
		}
	}
	
	AddMultiplier(body, app, createMultiplier, appNumber, multiplier)
	{
		var row = document.createElement('tr');	
		var className = multiplier.quantity == 0 ? "unlocked" : "plain";
		var purchasedMultiplier = app.findMultiplier(multiplier);
		
		var cost = purchasedMultiplier ? app.getMultiplierCost(purchasedMultiplier, createMultiplier) : app.qtyBuilt * multiplier.getCost(createMultiplier);
		
		row.innerHTML = "<td id='" + multiplier.name + "' class='" + className + "'>" + multiplier.name + "</td>" +
			"<td id='" + multiplier.name + "Cost' class='" + className + "'>&#575;" + this.DisplayNumber(cost) + "</td>" +
			"<td id='" + multiplier.name + "Value' class='" + className + "'>" + this.DisplayNumber(multiplier.value) + "</td>" +
			"<td id='" + multiplier.name + "Button' class='" + className + "'><button id='" + multiplier.name + "Create' multiplierNumber='" + multiplier.multiplierNumber + "' appNumber='" + appNumber + "'>Create " + createMultiplier + "x</button></td>" +
			"<td id='" + multiplier.name + "Qty' class='" + className + "'>" + multiplier.quantity + "</td>" +
			"<td id='" + multiplier.name + "Total' class='" + className + "'>" + (multiplier.quantity * multiplier.value) + "</td>";
		
		body.appendChild(row);
		
		document.getElementById(multiplier.name + "Create").onclick = multiplier.quantity == 0 ? this.AddMultipliers.bind(this) : this.CreateMultipliers.bind(this);
	}
	
	AddMultipliers(ev)
	{
		if (!this.pause)
		{
			if (this.bankAccount >= 0)
			{
				var multiplierNumber = ev.srcElement.getAttribute("multiplierNumber") * 1;
				var multiplier = this.multipliers[multiplierNumber];
				var createMultiplier = this.multiplierMultiplier.value * 1;
				var cost = multiplier.getCost(createMultiplier);

				if (this.bankAccount - cost >= (-1 * (this.GetTotalIncome() * (1000 / this.incomeTimerLength) * this.loanSeconds)))
				{
					var appNumber = ev.srcElement.getAttribute("appNumber") * 1;
					var app = this.allApps[appNumber];
					
					if (app.multipliers.length < this.multipliers.length - 1)
					{
						var body = document.getElementById("MultipliersBody");
						
						this.AddMultiplier(body, app, createMultiplier, appNumber, this.multipliers[multiplierNumber + 1]);
					}
					
					this.UpdateMultiplierCss(multiplier.name);
		
					ev.srcElement.onclick = this.CreateMultipliers.bind(this);
					
					this.CreateMultipliers(ev);
				}
				else
				{
					this.ShowMessage2("You can't get a loan for that much.", 10);
				}
			}
			else
			{
				this.ShowMessage2("You already have loan.", 10);
			}
		}
	}
	
	CreateMultipliers(ev)
	{
		if (!this.pause)
		{
			if (this.bankAccount >= 0)
			{
				var appNumber = ev.srcElement.getAttribute("appNumber") * 1;
				var createMultiplier = this.multiplierMultiplier.value * 1;
				var app = this.allApps[appNumber];
				var multiplierNumber = ev.srcElement.getAttribute("multiplierNumber") * 1;
				var multiplier = this.multipliers[multiplierNumber];
				var purchasedMultiplier = app.findMultiplier(multiplier);
				
				var cost = purchasedMultiplier ? app.getMultiplierCost(purchasedMultiplier, createMultiplier) : app.qtyBuilt * multiplier.getCost(createMultiplier);

				if (this.bankAccount - cost >= (-1 * (this.GetTotalIncome() * (1000 / this.incomeTimerLength) * this.loanSeconds)))
				{
					this.ClearMessage();
					
					app.buyMultiplier(multiplier, createMultiplier);
					
					if (!purchasedMultiplier)
					{
						purchasedMultiplier = app.findMultiplier(multiplier);
					}
					
					this.bankAccount -= cost;
					this.UpdateAttacks();
					this.UpdateCredits();
					
					document.getElementById(purchasedMultiplier.name + "Qty").innerText = purchasedMultiplier.quantity;
					document.getElementById(purchasedMultiplier.name + "Cost").innerHTML = "&#575;" + this.DisplayNumber(app.getMultiplierCost(purchasedMultiplier, createMultiplier));
					document.getElementById(purchasedMultiplier.name + "Total").innerHTML = purchasedMultiplier.quantity * purchasedMultiplier.value;
				}
				else
				{
					this.ShowMessage2("You can't get a loan for that much.", 10);
				}
			}
			else
			{
				this.ShowMessage2("You already have loan.", 10);
			}
		}
	}
	
	ShowPreviousAttacks(ev)
	{
		if (!this.pause)
		{
			if (attackList.style.display != "block" && ev.srcElement.className != "unlocked")
			{
				var appNumber = ev.srcElement.getAttribute("appNumber") * 1;
				var app = this.allApps[appNumber];
				
				if (app.defendedAttacks != 0)
				{
					attackList.style.top = (ev.clientY - 15) + "px";
					attackList.style.display = "block";
					attackList.innerHTML = "Previous attacks:<br />";
					
					for (var i = 0; i < app.previousAttacks.length; i++)
					{
						attackList.innerHTML += app.previousAttacks[i].name + " x " + app.previousAttacks[i].quantity + "<br />";
					}
					
					var box = attackList.getBoundingClientRect();
					
					attackList.style.left = (ev.clientX - box.width) + "px";
				}
			}
		}
	}
	
	CloseAttackList()
	{
		attackList.style.display = "none";
		attackList.innerHTML = "";
	}
}
