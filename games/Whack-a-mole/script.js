window.addEventListener('DOMContentLoaded', function() {
  // Глобальный объект игры
  const game = {
    lives: 3,
    timerId: null,
    minSpeed: window.innerWidth <= 768 ? 400 : 700,
    gameSpeed: 1700,
    board: 16,
    startTime: 0,
    timer: 0
  };

  // Получаем элементы DOM
  const startScreen = document.getElementById("start-screen"),
        gameContainer = document.getElementById("game-container"),
        gameOverScreen = document.getElementById("game-over"),
        grid = document.getElementById("grid"),
        livesDisplay = document.getElementById("lives"),
        timerDisplay = document.getElementById("timer"),
        finalTime = document.getElementById("final-time"),
        startBtn = document.getElementById("start-btn"),
        restartBtn = document.getElementById("restart-btn");

  // Звуки
  const sounds = {
    hit: document.getElementById("hitSound"),
    miss: document.getElementById("missSound"),
    gameOver: document.getElementById("gameOverSound"),
    hitHeart: document.getElementById("hitHeartSound"),
    missHeart: document.getElementById("missHeartSound"),
  };

  const cells = [];

  function createGrid() {
    grid.innerHTML = "";
    cells.length = 0;
    for (let i = 0; i < game.board; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      grid.appendChild(cell);
      cells.push(cell);
    }
  }

  function getRandomCell() {
    return cells[Math.floor(Math.random() * cells.length)];
  }

  function spawnElement(type) {
    if (game.lives <= 0) {
      checkGameOver();
      return;
    }

    const cell = getRandomCell();
    const element = document.createElement("img");
    element.src = type === "mole" ? "assets/mole.png" : "assets/heart.png";
    element.classList.add(type);
    element.dataset.clicked = "false";
    cell.appendChild(element);

    element.addEventListener("click", () => {
      if (element.dataset.clicked == "false")
        handleClick(type, element);
    });

    setTimeout(() => {
      if (cell.contains(element) && type == "mole" && element.dataset.clicked == "false") {
        element.dataset.clicked = "true";
        game.lives--;
        checkGameOver();
        livesDisplay.textContent = "❤️".repeat(game.lives);
        livesDisplay.classList.add("blink");
        sounds.miss.play();
        setTimeout(() => livesDisplay.classList.remove("blink"), 300);
      }

      if (type == "heart" && element.dataset.clicked == "false") {
        element.dataset.clicked = "true";
        element.classList.add("heart-blink");
        sounds.missHeart.play();
      } else {
        element.classList.add("mole-hide");
      }

      setTimeout(() => {
        delete element.dataset.clicked;
        element.remove();
      }, 500);
    }, Math.max(game.minSpeed, game.gameSpeed));

    setTimeout(gettingFaster, game.gameSpeed);
  }

  function handleClick(type, element) {
    if (element.dataset.clicked == "true") return;

    element.dataset.clicked = "true";
    element.classList.add(type === "mole" ? "mole-hit" : "heart-glow");

    setTimeout(() => {
      delete element.dataset.clicked;
      element.remove();
    }, 500);

    if (type === "mole") {
      sounds.hit.play();
    } else {
      game.lives++;
      livesDisplay.textContent = "❤️".repeat(game.lives);
      livesDisplay.classList.add("blink");
      setTimeout(() => livesDisplay.classList.remove("blink"), 300);
      sounds.hitHeart.play();
    }
  }

  function startGame() {
    startScreen.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    game.lives = 3;
    game.startTime = Date.now();
    game.timer = 0;
    game.gameSpeed = 1700;
    livesDisplay.innerText = "❤️".repeat(game.lives);
    game.timerId = setInterval(updateTime, 1000);

    setTimeout(gettingFaster, game.gameSpeed);
  }

  function updateTime() {
    game.timer++;
    timerDisplay.innerText = `Время: ${Math.floor(game.timer / 60)}:${(game.timer % 60).toString().padStart(2, "0")}`;
  }

  function gettingFaster() {
    spawnElement(Math.random() < 0.9 ? "mole" : "heart");
    game.gameSpeed = Math.max(game.minSpeed, game.gameSpeed - 50);
    console.log("Новая скорость:", game.gameSpeed);
  }

  function checkGameOver() {
    if (game.lives <= 0) {
      clearInterval(game.timerId);
      gameOverScreen.classList.remove("hidden");
      gameContainer.classList.add("hidden");
      if (game.timer / 60 >= 1) {
        finalTime.innerText = `Ты продержался ${Math.floor(game.timer / 60)} мин. ${game.timer % 60} сек.`;
      } else {
        finalTime.innerText = `Ты продержался ${game.timer} сек.`;
      }
      sounds.gameOver.play();
    }
  }

  startBtn.addEventListener("click", () => {
    createGrid();
    startGame();
  });

  restartBtn.addEventListener("click", () => {
    location.reload();
  });
});
