function getApps() {
    // AppType(appName, appCost, appIncomePerTick)
    return [
        new AppType("Open Source", 1, 0.05),
        new AppType("Personal Website", 20, 0.25),
        new AppType("1 Player Game", 50, 1),
        new AppType("Business Website", 250, 5),
        new AppType("2 Player Game", 1000, 10),
        new AppType("Mobile Game", 2000, 20),
        new AppType("Internal Utility", 5000, 50),
        new AppType("e-Commerce Site", 10000, 100),
        new AppType("Payment Gateway", 100000, 1000),
        new AppType("Crypto-currency Gateway", 1000000, 100000),
        new AppType("MMORPG", 5000000, 10000),
        new AppType("Military Contract", 15000000, 15000),
        new AppType("Streaming Site", 100000000, 100000),
        new AppType("Medical Billing", 500000000, 500000),
        new AppType("Online Shopping Site", 10000000000, 10000000),
        new AppType("Government Contract", 1000000000000, 1000000000),
        new AppType(
            "International Corporate Contract",
            5000000000000,
            5000000000
        ),
        new AppType("Interstellar Module", 10000000000000, 10000000000),
        new AppType("Moon Colony Contract", 100000000000000, 100000000000),
        new AppType("Mars Colony Contract", 500000000000000, 500000000000),
        new AppType("Europa Colony Contract", 1000000000000000, 1000000000000),
        new AppType(
            "First Contact Language Translator",
            5000000000000000,
            5000000000000
        ),
        new AppType(
            "Ansible Communications Network",
            15000000000000000n,
            15000000000000
        ),
        new AppType(
            "Interstellar Commerce Site",
            50000000000000000n,
            50000000000000
        ),
        new AppType(
            "Superluminal Starship Embedded Software",
            500000000000000000n,
            500000000000000
        ),
        new AppType(
            "Interstellar Travel Portal",
            1500000000000000000n,
            1500000000000000
        ),
        new AppType(
            "Inter Dimensional Travel Portal",
            150000000000000000000n,
            150000000000000000n
        ),
        new AppType(
            "Inter Dimensional Communications",
            50000000000000000000000n,
            50000000000000000000n
        )
    ];
}

// The quantity of "multipliers" and "attacks" should be the same
// so that increasing the available "multipliers" and "attacks" is syncronized/equal
function getMultipliers() {
    // AppMultiplier(appName, appCost, multiplierValue, multiplierNumber)
    return [
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
        new AppMultiplier("Server Quantity", 150000, 5000, 14),
        new AppMultiplier("Employee Benefits", 350000, 10000, 15),
        new AppMultiplier("Employee Raises", 500000, 50000, 16),
        new AppMultiplier("Tech Refresh", 5000000, 80000, 17),
        new AppMultiplier("Remote Server Farm", 50000000, 100000, 18),
        new AppMultiplier("Dedicated Satellite", 150000000, 150000, 19),
        new AppMultiplier("Direct FBI Connection", 500000000, 500000, 20),

        new AppMultiplier("MIB", 1500000000, 1000000, 21),
        new AppMultiplier(
            "Solar System Defence Force",
            5000000000,
            10000000,
            22
        ),
        new AppMultiplier("Strategic Alliance HQ", 15000000000, 50000000, 23),
        new AppMultiplier("White Hats of Mars", 50000000000, 350000000, 24),
        new AppMultiplier("Star Force", 250000000000, 2500000000, 25),
        new AppMultiplier(
            "United Federation of Species",
            750000000000,
            20000000000,
            26
        ),
        new AppMultiplier("White Hats of UFS", 2500000000000, 1500000000000, 27)
    ];
}

function getAttacks() {
    // AttackVector(attackName, attackCost, difficulty, qty = 0)
    return [
        new AttackVector("Script Kiddie", 1, 5),
        new AttackVector("Bug", 10, 15),
        new AttackVector("Customer Dissatisfaction", 50, 30),
        new AttackVector("Worm", 150, 50),
        new AttackVector("Trojan", 500, 80),
        new AttackVector("Rootkit", 1000, 150),
        new AttackVector("Technical Debt", 1500, 500),
        new AttackVector("Cooling Failure", 3500, 800),
        new AttackVector("Zero-Day Exploit", 4500, 1000),
        new AttackVector("Lead Dev Quits", 6000, 1500),
        new AttackVector("Active Hack", 10000, 2500),
        new AttackVector("2 Devs Quit", 20000, 5000),
        new AttackVector("Backdoor", 40000, 8000),
        new AttackVector("Micromanagement", 80000, 12000),
        new AttackVector("Server Failure", 150000, 50000),
        new AttackVector("5 Devs Quit", 350000, 100000),
        new AttackVector("Dev Department Quits", 500000, 200000),
        new AttackVector("Switch Failure", 5000000, 500000),
        new AttackVector("DDOS", 50000000, 1500000),
        new AttackVector("Bot farm", 150000000, 5000000),
        new AttackVector("Zombie net", 500000000, 15000000),
        new AttackVector("Hacker Group Attacks", 4500000000, 500000000),
        new AttackVector("Satellite Failure", 30000000000, 15000000000),
        new AttackVector("Rocket Failure", 150000000000, 75000000000),
        new AttackVector("Planet-wide EMP", 2000000000000, 3500000000000),
        new AttackVector(
            "Interstellar Terrorists",
            25000000000000,
            15000000000000
        ),
        new AttackVector("Anti-matter Bomb", 150000000000000, 75000000000000),
        new AttackVector("Supernova", 150000000000000000n, 775000000000000)
    ];
}
