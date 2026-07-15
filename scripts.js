// =======================================================
// Vegas Syndicate
// Main Game Script
// =======================================================

// ------------------------------
// Game State
// ------------------------------
let balance = 1000;
let currentBet = 10;

const betStep = 5;
const minBet = 5;
const maxBet = 100;

// ------------------------------
// Player Progress
// ------------------------------
let playerLevel = 1;
let playerXP = 0;

// ------------------------------
// Symbol List
// ------------------------------
const symbolsList = [
    "coin",
    "gold-bar",
    "diamond-ring",
    "lucky-card",
    "vegas-sign"
];

// ------------------------------
// Paytable
// ------------------------------
const payTableValues = {

    "coin": {
        3: 20,
        4: 50,
        5: 100
    },

    "gold-bar": {
        3: 30,
        4: 75,
        5: 150
    },

    "diamond-ring": {
        3: 50,
        4: 125,
        5: 300
    },

    "lucky-card": {
        3: 75,
        4: 200,
        5: 500
    },

    "vegas-sign": {
        3: 100,
        4: 500,
        5: 1000
    }

};

// ------------------------------
// DOM References
// ------------------------------
const elBalance =
    document.getElementById("goldCoins");

const elBet =
    document.getElementById("currentBet");

const elWin =
    document.getElementById("winAmount");

const elLevel =
    document.getElementById("playerLevel");

const elXP =
    document.getElementById("playerXP");

const btnSpin =
    document.getElementById("btnSpin");

const btnBetUp =
    document.getElementById("btnBetUp");

const btnBetDown =
    document.getElementById("btnBetDown");

const loadingScreen =
    document.getElementById("loadingScreen");

// ------------------------------
// Loading Screen
// ------------------------------
if (loadingScreen) {

    loadingScreen.addEventListener("click", () => {

        loadingScreen.style.display = "none";

    });

    setTimeout(() => {

        loadingScreen.style.display = "none";

    }, 1500);

}

// ------------------------------
// Update UI
// ------------------------------
function updateUI() {

    elBalance.textContent = balance;
    elBet.textContent = currentBet;
    elLevel.textContent = playerLevel;
    elXP.textContent = playerXP;

}

// ------------------------------
// Bet Controls
// ------------------------------
btnBetUp.addEventListener("click", () => {

    if (currentBet + betStep <= maxBet) {

        currentBet += betStep;

        updateUI();

    }

});

btnBetDown.addEventListener("click", () => {

    if (currentBet - betStep >= minBet) {

        currentBet -= betStep;

        updateUI();

    }

});

updateUI();
// =======================================================
// Spin Engine
// =======================================================

btnSpin.addEventListener("click", spin);

function spin() {

    // Prevent spinning without enough coins
    if (balance < currentBet) {

        alert("Not enough Gold Coins!");

        return;
    }

    btnSpin.disabled = true;

    // Deduct bet
    balance -= currentBet;

    updateUI();

    elWin.textContent = "0";

    // Create 3x5 result grid
    const grid = [
        [],
        [],
        []
    ];

    // Spin each reel
    for (let col = 1; col <= 5; col++) {

        const reel =
            document.getElementById(`reel${col}`);

        const symbolElements =
            reel.querySelectorAll(".symbol");

        symbolElements.forEach((symbolElement, row) => {

            const randomSymbol =
                symbolsList[
                    Math.floor(
                        Math.random() *
                        symbolsList.length
                    )
                ];

            symbolElement.dataset.symbol =
                randomSymbol;

            const img =
                symbolElement.querySelector("img");

            img.src =
                `images/${randomSymbol}.png`;

            img.alt =
                randomSymbol;

            grid[row].push(randomSymbol);

        });

    }

    // Evaluate winnings
    const totalWin =
        evaluatePayout(grid);

    if (totalWin > 0) {

        balance += totalWin;

        elWin.textContent =
            totalWin;

        // XP reward
        playerXP += 10;

        if (playerXP >= 100) {

            playerXP = 0;

            playerLevel++;

        }

    }

    updateUI();

    btnSpin.disabled = false;

}
// =======================================================
// Win Evaluation
// =======================================================

function evaluatePayout(grid) {

    let spinEarnings = 0;

    // Check each horizontal row
    for (let row = 0; row < 3; row++) {

        const rowSymbols = grid[row];

        let matchCount = 1;

        const targetSymbol = rowSymbols[0];

        // Count matching symbols from left to right
        for (let col = 1; col < 5; col++) {

            if (rowSymbols[col] === targetSymbol) {

                matchCount++;

            } else {

                break;

            }

        }

        // Award payout for 3, 4, or 5 matches
        if (matchCount >= 3) {

            const payoutConfig =
                payTableValues[targetSymbol];

            if (
                payoutConfig &&
                payoutConfig[matchCount]
            ) {

                const lineWin =
                    payoutConfig[matchCount] *
                    (currentBet / 10);

                spinEarnings += lineWin;

            }

        }

    }

    return spinEarnings;

}

// =======================================================
// Initialize Game
// =======================================================

updateUI();

console.log("Vegas Syndicate loaded successfully.");

