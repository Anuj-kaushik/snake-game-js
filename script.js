const board = document.querySelector(".board");
const modal = document.querySelector(".modal");
const startBtn = document.querySelector(".start-btn");
const startElement = document.querySelector(".start-game");
const restartBtn = document.querySelector(".restart-btn");
const restartElement = document.querySelector(".restart-game");

const scoreElement = document.querySelector("#score");
const highScoreElement = document.querySelector("#high-score");
const timerElement = document.querySelector("#timer");

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
highScoreElement.textContent = highScore;

let timerId = null;

let timer = `00:00`;
function timerFunction() {
  let [m, s] = timer.split(":");

  s = parseInt(s);
  m = parseInt(m);

  if (s === 59) {
    m += 1;
    s = 0;
  } else {
    s++;
  }

  timer = `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  timerElement.textContent = timer;
}

// Board Calculation
const blockHeight = 50;
const blockWidth = 50;
let cols = Math.floor(board.clientWidth / blockWidth);
let rows = Math.floor(board.clientHeight / blockHeight);

let blocks = [];
let direction = "down";
let intervalId = null;

let snake = [{ x: 1, y: 3 }];
let food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };

// board display
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    let block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${row} - ${col}`] = block;
    // block.textContent = `${row} - ${col}`;
  }
}

// Snake & Food logic
function render() {
  let head = null;

  blocks[`${food.x} - ${food.y}`].classList.add("food");

  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  }

  // collision
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(intervalId);
    clearInterval(timerId);
    modal.style.display = "flex";
    restartElement.style.display = "flex";
    return;
  }
  // self collision
  if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
    clearInterval(intervalId);
    clearInterval(timerId);
    modal.style.display = "flex";
    restartElement.style.display = "flex";
    return;
  }

  // food consume
  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x} - ${food.y}`].classList.remove("food");
    food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };
    score += 10;
    scoreElement.textContent = score;

    if (score > parseInt(highScore)) {
      localStorage.setItem("highScore", score.toString());
    }

    snake.unshift(head);
  }

  snake.forEach((segment) => {
    blocks[`${segment.x} - ${segment.y}`].classList.remove("fill");
  });

  snake.unshift(head);
  snake.pop();

  snake.forEach((segment) => {
    blocks[`${segment.x} - ${segment.y}`].classList.add("fill");
  });
}

//start game
startBtn.addEventListener("click", () => {
  modal.style.display = "none";
  startElement.style.display = "none";
  intervalId = setInterval(() => {
    render();
  }, 200);

  timerId = setInterval(() => {
    timerFunction();
  }, 1000);
});

//restart game
restartBtn.addEventListener("click", () => {
  modal.style.display = "none";
  restartElement.style.display = "none";
  direction = "down";
  snake.forEach((segment) => {
    blocks[`${segment.x} - ${segment.y}`].classList.remove("fill");
  });
  blocks[`${food.x} - ${food.y}`].classList.remove("food");

  snake = [{ x: 1, y: 3 }];
  food = { x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols) };

  score = 0;
  scoreElement.textContent = 0;
  highScore = localStorage.getItem("highScore");
  highScoreElement.textContent = highScore;
  timer = `00:00`;
  timerElement.textContent = timer;
  intervalId = setInterval(() => {
    render();
  }, 200);

  timerId = setInterval(() => {
    timerFunction();
  }, 1000);
});

//arrow key logic
addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== "down") {
    direction = "up";
  } else if (e.key === "ArrowRight" && direction !== "left") {
    direction = "right";
  } else if (e.key === "ArrowDown" && direction !== "up") {
    direction = "down";
  } else if (e.key === "ArrowLeft" && direction !== "right") {
    direction = "left";
  }
});
  // console.log(e.key);
