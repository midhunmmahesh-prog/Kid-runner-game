// =======================
// GAME VARIABLES
// =======================

// DOM Elements
const gameContainer = document.getElementById('game');
const playerElement = document.getElementById('player');
const groundElement = document.getElementById('ground');
const objectsContainer = document.getElementById('objects');
const platformsContainer = document.getElementById('platforms');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const coinsDisplay = document.getElementById('coins');
const gameOverScreen = document.getElementById('gameOverScreen');
const levelCompleteScreen = document.getElementById('levelCompleteScreen');
const finalScoreDisplay = document.getElementById('finalScore');
const finalCoinsDisplay = document.getElementById('finalCoins');
const levelScoreDisplay = document.getElementById('levelScore');
const playAgainBtn = document.getElementById('playAgainBtn');
const nextLevelBtn = document.getElementById('nextLevelBtn');

// Game State
let gameRunning = false;
let gameOver = false;
let levelComplete = false;
let score = 0;
let coinsCollected = 0;
let currentLevel = 1;

// Player Physics
let isJumping = false;
let playerY = 0;
let velocityY = 0;
const gravity = 0.5;
const jumpPower = 15;
const playerWidth = 40;
const playerHeight = 50;

// Player Movement
let playerX = 50;
const playerSpeed = 7;
let moveLeft = false;
let moveRight = false;

// Ground
const groundHeight = 50;
const playerGroundY = groundHeight;
const gameWidth = gameContainer.offsetWidth;
const gameHeight = gameContainer.offsetHeight;

// Game Speed and Spawning
let gameSpeed = 5;
let enemySpawnCounter = 0;
const enemySpawnInterval = 200;
let coinSpawnCounter = 0;
const coinSpawnInterval = 180;
let mushroomSpawnCounter = 0;
const mushroomSpawnInterval = 400;

// Containers for objects
let enemies = [];
let coins = [];
let mushrooms = [];
let platforms = [];

// =======================
// SETUP AND INITIALIZATION
// =======================

function initGame() {
    gameRunning = true;
    gameOver = false;
    levelComplete = false;
    score = 0;
    coinsCollected = 0;
    playerY = 0;
    velocityY = 0;
    playerX = 50;
    isJumping = false;
    gameSpeed = 4 + (currentLevel * 0.5);
    enemySpawnCounter = 0;
    coinSpawnCounter = 0;
    mushroomSpawnCounter = 0;

    // Clear existing objects
    enemies = [];
    coins = [];
    mushrooms = [];
    platforms = [];
    objectsContainer.innerHTML = '';
    platformsContainer.innerHTML = '';

    // Create starting platforms
    createLevel(currentLevel);

    // Update display
    updateHUD();
    gameOverScreen.classList.add('hidden');
    levelCompleteScreen.classList.add('hidden');

    // Start game loop
    gameLoop();
}

function createLevel(level) {
    // Create different platform layouts for each level
    if (level === 1) {
        addPlatform(150, 100, 150, 30);
        addPlatform(400, 150, 150, 30);
        addPlatform(650, 100, 150, 30);
        addPlatform(800, 250, 150, 30);
    } else if (level === 2) {
        addPlatform(120, 80, 120, 30);
        addPlatform(300, 120, 120, 30);
        addPlatform(480, 160, 120, 30);
        addPlatform(660, 200, 120, 30);
        addPlatform(840, 140, 120, 30);
    } else {
        // Level 3+
        addPlatform(100, 100, 100, 25);
        addPlatform(250, 150, 100, 25);
        addPlatform(400, 100, 100, 25);
        addPlatform(550, 180, 100, 25);
        addPlatform(700, 120, 100, 25);
    }
    
    // Add flag at the end
    addFlag(gameWidth - 50, groundHeight + 80);
}

function addPlatform(x, y, width, height) {
    const platform = document.createElement('div');
    platform.className = 'platform';
    platform.style.left = x + 'px';
    platform.style.bottom = y + 'px';
    platform.style.width = width + 'px';
    platform.style.height = height + 'px';
    platformsContainer.appendChild(platform);

    platforms.push({
        element: platform,
        x: x,
        y: y,
        width: width,
        height: height
    });
}

function addFlag(x, y) {
    const flag = document.createElement('div');
    flag.className = 'flag';
    flag.style.left = x + 'px';
    flag.style.bottom = y + 'px';
    platformsContainer.appendChild(flag);

    platforms.push({
        element: flag,
        x: x,
        y: y,
        width: 15,
        height: 100,
        isFlag: true
    });
}

// =======================
// PLAYER JUMPING AND MOVEMENT
// =======================

function handleJump() {
    if (!isJumping && playerY <= 5) {
        velocityY = jumpPower;
        isJumping = true;
        playerElement.classList.add('jumping');
    }
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleJump();
    }
    if (e.code === 'ArrowLeft') {
        moveLeft = true;
    }
    if (e.code === 'ArrowRight') {
        moveRight = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft') {
        moveLeft = false;
    }
    if (e.code === 'ArrowRight') {
        moveRight = false;
    }
});

// =======================
// GAME LOOP
// =======================

function gameLoop() {
    if (!gameRunning || gameOver || levelComplete) return;

    // === Update Player Position (Physics) ===
    velocityY -= gravity;
    playerY += velocityY;

    // Check if on ground
    let onGround = false;
    if (playerY <= 0) {
        playerY = 0;
        velocityY = 0;
        isJumping = false;
        playerElement.classList.remove('jumping');
        onGround = true;
    }

    // Check platform collision
    for (let platform of platforms) {
        if (checkPlatformCollision(playerElement, platform)) {
            if (velocityY <= 0) {
                playerY = platform.y + platform.height;
                velocityY = 0;
                isJumping = false;
                playerElement.classList.remove('jumping');
                onGround = true;
            }
        }
    }

    // === Update Player Horizontal Position ===
    if (moveLeft && playerX > 0) {
        playerX -= playerSpeed;
    }
    if (moveRight && playerX < gameWidth - playerWidth) {
        playerX += playerSpeed;
    }

    // Update player DOM position
    playerElement.style.left = playerX + 'px';
    playerElement.style.bottom = playerY + 'px';

    // === Spawn Enemies ===
    enemySpawnCounter++;
    if (enemySpawnCounter >= enemySpawnInterval) {
        spawnEnemy();
        enemySpawnCounter = 0;
    }

    // === Spawn Coins ===
    coinSpawnCounter++;
    if (coinSpawnCounter >= coinSpawnInterval) {
        spawnCoin();
        coinSpawnCounter = 0;
    }

    // === Spawn Mushrooms ===
    mushroomSpawnCounter++;
    if (mushroomSpawnCounter >= mushroomSpawnInterval) {
        if (Math.random() > 0.6) {
            spawnMushroom();
        }
        mushroomSpawnCounter = 0;
    }

    // === Move Enemies ===
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].x -= gameSpeed;
        enemies[i].element.style.left = enemies[i].x + 'px';

        if (checkCollision(playerElement, enemies[i].element)) {
            triggerGameOver();
            return;
        }

        if (enemies[i].x < -50) {
            enemies[i].element.remove();
            enemies.splice(i, 1);
        }
    }

    // === Move Coins ===
    for (let i = coins.length - 1; i >= 0; i--) {
        coins[i].x -= gameSpeed;
        coins[i].element.style.left = coins[i].x + 'px';

        if (checkCollision(playerElement, coins[i].element)) {
            collectCoin(i);
            continue;
        }

        if (coins[i].x < -40) {
            coins[i].element.remove();
            coins.splice(i, 1);
        }
    }

    // === Move Mushrooms ===
    for (let i = mushrooms.length - 1; i >= 0; i--) {
        mushrooms[i].x -= gameSpeed;
        mushrooms[i].element.style.left = mushrooms[i].x + 'px';

        if (checkCollision(playerElement, mushrooms[i].element)) {
            collectMushroom(i);
            continue;
        }

        if (mushrooms[i].x < -40) {
            mushrooms[i].element.remove();
            mushrooms.splice(i, 1);
        }
    }

    // === Check for Flag (Level Complete) ===
    const flagPlatform = platforms.find(p => p.isFlag);
    if (flagPlatform && checkCollision(playerElement, flagPlatform.element)) {
        triggerLevelComplete();
        return;
    }

    // === Fall off screen ===
    if (playerY < -100) {
        triggerGameOver();
        return;
    }

    // Increase difficulty
    gameSpeed += 0.0001;

    requestAnimationFrame(gameLoop);
}

// =======================
// PLATFORM COLLISION
// =======================

function checkPlatformCollision(player, platform) {
    const playerRect = player.getBoundingClientRect();
    const platformRect = platform.element.getBoundingClientRect();

    return !(playerRect.right < platformRect.left || 
             playerRect.left > platformRect.right || 
             playerRect.bottom < platformRect.top || 
             playerRect.top > platformRect.bottom);
}

// =======================
// SPAWNING OBJECTS
// =======================

function spawnEnemy() {
    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    enemy.style.left = gameWidth + 'px';
    enemy.style.bottom = groundHeight + 'px';
    objectsContainer.appendChild(enemy);

    enemies.push({
        element: enemy,
        x: gameWidth,
        width: 40,
        height: 35
    });
}

function spawnCoin() {
    const coin = document.createElement('div');
    coin.className = 'coin';

    const randomHeight = Math.random() * 150 + groundHeight + 40;
    coin.style.left = gameWidth + 'px';
    coin.style.bottom = randomHeight + 'px';
    objectsContainer.appendChild(coin);

    coins.push({
        element: coin,
        x: gameWidth,
        width: 25,
        height: 25
    });
}

function spawnMushroom() {
    const mushroom = document.createElement('div');
    mushroom.className = 'mushroom';
    mushroom.style.left = gameWidth + 'px';
    mushroom.style.bottom = groundHeight + 20 + 'px';
    objectsContainer.appendChild(mushroom);

    mushrooms.push({
        element: mushroom,
        x: gameWidth,
        width: 30,
        height: 35
    });
}

// =======================
// COLLISION DETECTION
// =======================

function checkCollision(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
}

// =======================
// SCORING AND COLLECTION
// =======================

function collectCoin(coinIndex) {
    score += 10;
    coinsCollected += 1;
    coins[coinIndex].element.remove();
    coins.splice(coinIndex, 1);
    updateHUD();
}

function collectMushroom(mushroomIndex) {
    score += 50;
    mushrooms[mushroomIndex].element.remove();
    mushrooms.splice(mushroomIndex, 1);
    updateHUD();
}

function updateHUD() {
    scoreDisplay.textContent = `Score: ${score}`;
    coinsDisplay.textContent = `Coins: ${coinsCollected}`;
    levelDisplay.textContent = `Level: ${currentLevel}`;
}

// =======================
// GAME OVER AND LEVEL COMPLETE
// =======================

function triggerGameOver() {
    gameRunning = false;
    gameOver = true;

    finalScoreDisplay.textContent = `Your Score: ${score}`;
    finalCoinsDisplay.textContent = `Coins: ${coinsCollected}`;
    gameOverScreen.classList.remove('hidden');
}

function triggerLevelComplete() {
    gameRunning = false;
    levelComplete = true;

    levelScoreDisplay.textContent = `Score: ${score}`;
    levelCompleteScreen.classList.remove('hidden');
}

// =======================
// EVENT LISTENERS
// =======================

playAgainBtn.addEventListener('click', () => {
    currentLevel = 1;
    score = 0;
    coinsCollected = 0;
    initGame();
});

nextLevelBtn.addEventListener('click', () => {
    currentLevel++;
    initGame();
});

// =======================
// START GAME
// =======================

window.addEventListener('load', () => {
    setTimeout(initGame, 100);
});
