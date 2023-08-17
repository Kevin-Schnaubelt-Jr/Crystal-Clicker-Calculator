let gameState = JSON.parse(localStorage.getItem('gameState')) || {
    buildings: {
        Canteen: {
            name: 'Canteen',
            amount: 0,
            baseCost: 1,
            baseReturn: 0,
        },
        PowerStation: {
            name: 'PowerStation',
            amount: 0,
            baseCost: 2,
            baseReturn: 2,
        },
        SupportStation: {
            name: 'SupportStation',
            amount: 0,
            baseCost: 11,
            baseReturn: 8,
        },
        UpgradeStation: {
            name: 'UpgradeStation',
            amount: 0,
            baseCost: 120,
            baseReturn: 47,
        },
        GeologicalCenter: {
            name: 'GeologicalCenter',
            amount: 0,
            baseCost: 1300,
            baseReturn: 260,
        },
        OreRefinery: {
            name: 'OreRefinery',
            amount: 0,
            baseCost: 14000,
            baseReturn: 1400,
        },
        SuperTeleport: {
            name: 'SuperTeleport',
            amount: 0,
            baseCost: 200000,
            baseReturn: 7800,
        },
        MiningLaser: {
            name: 'MiningLaser',
            amount: 0,
            baseCost: 3300000,
            baseReturn: 44000,
        }

    },
};

// Create empty object for storing adjusted buildings
let adjustedBuildings = {};
let totalcps = 0;
let efficiencies = [];


window.onload = function() {
    GoActionGo();
    addEventListeners();
    // Other onload tasks...
    console.log("adjusted", adjustedBuildings);
    console.log("gamestate", gameState);

};


function AdjustBuildings() {
    for (let building in gameState.buildings) {
        let amount = gameState.buildings[building].amount;
        let baseCost = gameState.buildings[building].baseCost;
        let baseReturn = gameState.buildings[building].baseReturn;
        let newCost = baseCost * Math.pow(1.50, amount);
        let cps = amount ? amount * baseReturn : baseReturn;

        adjustedBuildings[building] = {
            name: building,
            amount: amount,
            cost: newCost,
            cps: cps,
            baseReturn: baseReturn,
        }

        // Add building's cps to totalcps
        totalcps += amount ? cps : 0;
    }
}

function CalculateBuyEfficiency() {   
    for (let building in adjustedBuildings) {
        let cost = adjustedBuildings[building].cost;
        let cpsIncrease = adjustedBuildings[building].baseReturn;

        adjustedBuildings[building].buyEfficiency = BuyEfficiency(cost, totalcps, cpsIncrease);

        // Create an object with the building's name and efficiency, and add it to the array
        efficiencies.push({
            name: building,
            buyEfficiency: adjustedBuildings[building].buyEfficiency,
        });
    }

    // Sort the array by the efficiency values, from lowest to highest
    efficiencies.sort((a, b) => {
        return a.buyEfficiency - b.buyEfficiency;
    });

}



function BuyEfficiency(cost, totalcps, cpsIncrease){
    let efficiency = Math.floor(cost) / (cpsIncrease);
    let waitTime = totalcps ? cost / (totalcps): 0;
    returnEfficiency = efficiency + waitTime;
    return Math.round(returnEfficiency * 10) / 10;
}


function Display() {
    for (let buildingKey in adjustedBuildings) {
        let building = adjustedBuildings[buildingKey];


        document.getElementById(`${building.name}Number`).value = building.amount;
        document.getElementById(`${building.name}Cost`).innerHTML = Math.floor(building.cost),
        document.getElementById(`${building.name}CpS`).innerHTML = building.cps;
        document.getElementById(`${building.name}Buy`).innerHTML = building.buyEfficiency;
    }

    document.getElementById('totalCpS').innerHTML = `Total CpS: ${totalcps}`;

    // loop through efficiencies array and place the buildings name in id="best-buy-1" through id="best-buy-5". stop after 5.
    for (let i = 0; i < 3; i++) {
        document.getElementById(`best-buy-${i+1}`).innerHTML = `${i+1}: ${efficiencies[i].name}`;
    }
    
}

function addEventListeners() {
    // For the buildings
    BuildingsEvent();

    
}

function BuildingsEvent() {
    for (let buildingKey in gameState.buildings) {
        let building = gameState.buildings[buildingKey];

        let amountInput = document.getElementById(`${building.name}Number`);

        // Add event listener for 'keyup' event
        [amountInput].forEach(inputElement => {
            if (inputElement) {
                inputElement.addEventListener('keyup', (event) => {
                    // Check for 'Enter' key
                    if (event.key === 'Enter') {
                        // Update gameState
                        if (inputElement === amountInput) {
                            gameState.buildings[buildingKey].amount = parseInt(inputElement.value, 10);
                        }
                        // Save to local storage
                        localStorage.setItem('gameState', JSON.stringify(gameState));

                        // Recalculate
                        GoActionGo();

                        // Lose focus from the input
                        event.target.blur();
                    }
                });
            }
        });
    }
}

function GoActionGo() {
    adjustedBuildings = {};
    totalcps = 0;
    efficiencies = [];

    AdjustBuildings();
    CalculateBuyEfficiency();
    Display();
}

function clearStorage() {
    let confirmClear = confirm('Are you sure you want to clear all data?');
    if (confirmClear) {
        localStorage.clear();
        console.log('All data cleared from localStorage');
    }
}