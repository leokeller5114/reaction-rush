// script.js

const targets =
    document.querySelectorAll(".target");

const scoreText =
    document.getElementById("score");

const timerText =
    document.getElementById("timer");

const highscoreText =
    document.getElementById("highscore");

const comboText =
    document.getElementById("combo");

const coinsText =
    document.getElementById("coins");

const menuCoins =
    document.getElementById("menuCoins");

const achievement =
    document.getElementById("achievement");

const gameArea =
    document.getElementById("gameArea");

const restartBtn =
    document.getElementById("restartBtn");

const startScreen =
    document.getElementById("startScreen");

const startBtn =
    document.getElementById("startBtn");

const gameContent =
    document.getElementById("gameContent");

const modeButtons =
    document.querySelectorAll(".modeBtn");

const shopButtons =
    document.querySelectorAll(".shopBtn");

const shopToggle =
    document.getElementById("shopToggle");

const shop =
    document.getElementById("shop");

let score = 0;
let time = 30;

let combo = 1;

let timerInterval;

let currentMode = "classic";

let correctTarget = 0;

let memoryTarget = 0;

let chaosInterval;

let selectedSkin = "#ff0055";

let highscore =
    localStorage.getItem("highscore") || 0;

let coins =
    localStorage.getItem("coins") || 0;

highscoreText.innerText =
    "Highscore: " + highscore;

coinsText.innerText =
    "Coins: " + coins;

menuCoins.innerText =
    "Coins: " + coins;

/* SHOP */

shopToggle.addEventListener("click", () => {

    if (shop.style.display === "block") {

        shop.style.display = "none";

    } else {

        shop.style.display = "block";
    }
});

/* MODE BUTTONS */

modeButtons.forEach(button => {

    button.addEventListener("click", () => {

        modeButtons.forEach(btn => {

            btn.classList.remove("selected");
        });

        button.classList.add("selected");

        currentMode =
            button.dataset.mode;
    });
});

/* SHOP BUTTONS */

shopButtons.forEach(button => {

    button.addEventListener("click", () => {

        const price =
            Number(button.dataset.price);

        const color =
            button.dataset.color;

        if (coins >= price) {

            coins -= price;

            localStorage.setItem(
                "coins",
                coins
            );

            coinsText.innerText =
                "Coins: " + coins;

            menuCoins.innerText =
                "Coins: " + coins;

            selectedSkin = color;

        } else {

            alert("Nicht genug Coins!");
        }
    });
});

/* ACHIEVEMENTS */

function showAchievement(text) {

    achievement.innerText = text;

    achievement.style.display =
        "block";

    setTimeout(() => {

        achievement.style.display =
            "none";

    }, 1200);
}

/* MOVE TARGETS */

function moveTargets() {

    targets.forEach(target => {

        const rect =
            gameArea.getBoundingClientRect();

        const size =
            target.offsetWidth;

        const maxX =
            rect.width - size;

        const maxY =
            rect.height - size;

        const randomX =
            Math.random() * maxX;

        const randomY =
            Math.random() * maxY;

        target.style.left =
            randomX + "px";

        target.style.top =
            randomY + "px";
    });
}

/* MEMORY ROUND */

function startMemoryRound() {

    moveTargets();

    memoryTarget =
        Math.floor(
            Math.random() * 3
        );

    targets.forEach((target, index) => {

        target.style.background =
            "#333";

        target.style.boxShadow =
            "none";

        if (index === memoryTarget) {

            target.style.background =
                "lime";
        }
    });

    setTimeout(() => {

        targets.forEach(target => {

            target.style.background =
                "#333";
        });

    }, 1000);
}

/* CLICK SYSTEM */

targets.forEach((target, index) => {

    target.addEventListener("click", () => {

        if (time <= 0) return;

        /* TARGET MODE */

        if (currentMode === "target") {

            if (index === correctTarget) {

                score++;
                combo++;

            } else {

                score--;
                combo = 1;
            }

            scoreText.innerText =
                "Punkte: " + score;

            comboText.innerText =
                "Combo: x" + combo;

            correctTarget =
                Math.floor(
                    Math.random() * 3
                );

            moveTargets();

            targets.forEach((t, i) => {

                if (i === correctTarget) {

                    t.style.background =
                        "lime";

                } else {

                    t.style.background =
                        "red";
                }
            });

            return;
        }

        /* MEMORY MODE */

        if (currentMode === "memory") {

            if (index === memoryTarget) {

                score++;
                combo++;

                showAchievement(
                    "Richtig!"
                );

            } else {

                combo = 1;

                showAchievement(
                    "Falsch!"
                );
            }

            scoreText.innerText =
                "Punkte: " + score;

            comboText.innerText =
                "Combo: x" + combo;

            startMemoryRound();

            return;
        }

        /* NORMAL MODES */

        score += combo;

        combo++;

        scoreText.innerText =
            "Punkte: " + score;

        comboText.innerText =
            "Combo: x" + combo;

        target.style.background =
            selectedSkin;

        target.style.boxShadow =
            `0 0 10px ${selectedSkin},
             0 0 20px ${selectedSkin}`;

        moveTargets();
    });
});

/* TIMER */

function updateTimer() {

    time--;

    timerText.innerText =
        "Zeit: " + time;

    if (time <= 0) {

        clearInterval(timerInterval);

        clearInterval(chaosInterval);

        coins =
            Number(coins) + score;

        localStorage.setItem(
            "coins",
            coins
        );

        coinsText.innerText =
            "Coins: " + coins;

        menuCoins.innerText =
            "Coins: " + coins;

        if (score > highscore) {

            highscore = score;

            localStorage.setItem(
                "highscore",
                highscore
            );
        }

        highscoreText.innerText =
            "Highscore: " + highscore;

        targets.forEach(target => {

            target.style.display =
                "none";
        });

        restartBtn.style.display =
            "block";
    }
}

/* START */

startBtn.addEventListener("click", () => {

    /* RESET */

    targets.forEach(target => {

        target.style.display =
            "none";

        target.style.width = "80px";
        target.style.height = "80px";

        target.style.background =
            selectedSkin;

        target.style.boxShadow =
            `0 0 10px ${selectedSkin},
             0 0 20px ${selectedSkin}`;
    });

    /* NORMALE MODES */

    if (
        currentMode === "classic"
        ||
        currentMode === "speed"
        ||
        currentMode === "precision"
        ||
        currentMode === "chaos"
    ) {

        targets[0].style.display =
            "flex";
    }

    /* TARGET & MEMORY */

    if (
        currentMode === "target"
        ||
        currentMode === "memory"
    ) {

        targets.forEach(target => {

            target.style.display =
                "flex";
        });
    }

    /* SPEED */

    if (currentMode === "speed") {

        time = 15;

    } else {

        time = 30;
    }

    /* PRECISION */

    if (currentMode === "precision") {

        targets[0].style.width =
            "40px";

        targets[0].style.height =
            "40px";
    }

    /* CHAOS */

    if (currentMode === "chaos") {

        chaosInterval =
            setInterval(() => {

            const randomSize =
                Math.random() * 80 + 30;

            targets[0].style.width =
                randomSize + "px";

            targets[0].style.height =
                randomSize + "px";

        }, 1000);
    }

    /* TARGET MODE */

    if (currentMode === "target") {

        correctTarget =
            Math.floor(
                Math.random() * 3
            );

        targets.forEach((target, index) => {

            if (index === correctTarget) {

                target.style.background =
                    "lime";

            } else {

                target.style.background =
                    "red";
            }
        });

        moveTargets();
    }

    /* MEMORY MODE */

    if (currentMode === "memory") {

        targets.forEach(target => {

            target.style.width =
                "120px";

            target.style.height =
                "120px";
        });

        startMemoryRound();
    }

    /* NORMALE MODES POSITION */

    if (
        currentMode !== "target"
        &&
        currentMode !== "memory"
    ) {

        moveTargets();
    }

    timerText.innerText =
        "Zeit: " + time;

    startScreen.style.display =
        "none";

    gameContent.style.display =
        "block";

    timerInterval =
        setInterval(updateTimer, 1000);
});

/* RESTART */

restartBtn.addEventListener("click", () => {

    location.reload();
});