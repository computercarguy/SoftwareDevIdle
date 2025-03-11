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
    // Just names of the attack types, since everything else gets set programmatically
    return [
        "Script Kiddie",
        "Bug",
        "Customer Dissatisfaction",
        "Worm",
        "Trojan",
        "Rootkit",
        "Technical Debt",
        "Cooling Failure",
        "Zero-Day Exploit",
        "Lead Dev Quits",
        "Active Hack",
        "2 Devs Quit",
        "Backdoor",
        "Micromanagement",
        "Server Failure",
        "5 Devs Quit",
        "Dev Department Quits",
        "Switch Failure",
        "DDOS",
        "Bot farm",
        "Zombie net",
        "Hacker Group Attacks",
        "Satellite Failure",
        "Rocket Failure",
        "Planet-wide EMP",
        "Interstellar Terrorists",
        "Anti-matter Bomb",
        "Supernova"
    ];
}
