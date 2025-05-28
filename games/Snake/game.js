let intervalID = null;
const canvas = document.querySelector('canvas');
const scoreEl = document.getElementById('score');
const overlay = document.getElementById('overlay');

const size = 25;

const rows = Math.floor((window.innerWidth - 50)/25);
const colls = Math.floor((window.innerHeight - 50)/25);
canvas.width = rows * size;
canvas.height = colls * size;

const c = canvas.getContext('2d');
let gameRunning = false;
let directionChanged = false;
const gameSpeed = window.innerWidth < 900 ? 150 : 100;

const touch = {
    startX: 0,
    startY: 0
};

const snake = {
    body: [{
        x: Math.floor((rows/2) * size),
        y: Math.floor((colls/2) * size)
    }],
    diraction: {dx: 1, dy: 0},
    speed: size,
    length: 1
};

const food = {
    x: undefined,
    y: undefined,
    placeFood: function() {
        food.x = Math.floor(1 + Math.random() * (rows - 2)) * size;
        food.y = Math.floor(1 + Math.random() * (colls - 2)) * size;
    }
};

function startGame() {
    resetGame();
    food.placeFood();
    intervalID = setInterval(draw, gameSpeed);
    overlay.classList.remove('show');
    gameRunning = true;
}

function resetGame() {
    snake.body = [{
        x: Math.floor((rows / 2)) * size,
        y: Math.floor((colls / 2)) * size
    }];
    snake.length = 1;
    snake.diraction = { dx: 1, dy: 0 };
    updateScore();
}

function draw() {
    directionChanged = false;
    c.clearRect(0, 0, canvas.width, canvas.height);
        //draw our food
    c.fillStyle = 'red';
    c.fillRect(food.x, food.y, size, size);

        //draw our snake head and tail
    c.fillStyle = 'yellow';
    for(let i = 0; i < snake.body.length; i++) {
        const segment = snake.body[i];
        c.fillRect(segment.x, segment.y, size, size);
    }
  
    const newHead = {
        x: snake.body[0].x + (snake.diraction.dx * snake.speed),
        y: snake.body[0].y + (snake.diraction.dy * snake.speed)
    };
    
    
 
    if(collision(newHead, snake.body)) {
        clearInterval(intervalID);
        gameOver();
        return;
    }
    snake.body.unshift(newHead);
    if (snake.body[0].x == food.x && snake.body[0].y == food.y) {
        snake.length++;
        food.placeFood();
        updateScore();
    } else {
        snake.body.pop();
    }
}

function collision(head, tail) {
    // snake is outside of frame
    if(head.x < 0 || head.y < 0 ||
        head.x + size > canvas.width ||
        head.y + size > canvas.height) {
        return true;
    }
    // snake collision 
    for(let i = 0; i < tail.length; i++) {
        if(head.x == tail[i].x && head.y == tail[i].y) {
            return true;
        }
    }
    return false;
}

function updateScore() {
    scoreEl.textContent = `Score: ${snake.length}`;
}

function gameOver() {
    overlay.innerHTML = `GAME OVER<br><span class="small">Press Space</span>`;
    overlay.classList.add('show');
    gameRunning = false;
}

document.addEventListener('keydown', function(event) {
    const dir = snake.diraction;
    if (!gameRunning && event.code === 'Space') {
        startGame();
    }
    
    if (directionChanged) return;

    if(event.key == 'ArrowUp' && dir.dy != 1){
        dir.dy = -1;
        dir.dx = 0;
        directionChanged = true;
    }
    else if(event.key == 'ArrowDown' && dir.dy != -1) {
        dir.dx = 0;
        dir.dy = 1;
        directionChanged = true;
    }

    else if(event.key == 'ArrowLeft' && dir.dx != 1) {
        dir.dx = -1;
        dir.dy = 0;
        directionChanged = true;
    }
    else if(event.key == 'ArrowRight' && dir.dx != -1) {
        dir.dx = 1;
        dir.dy = 0;
        directionChanged = true;
    }
});

/*document.getElementById('mobile-controls').addEventListener('click', function(e) {
    if (!e.target.matches('button')) return;

    const dir = e.target.dataset.dir;
    const keyMap = {
        up: 'ArrowUp',
        down: 'ArrowDown',
        left: 'ArrowLeft',
        right: 'ArrowRight'
    };

    const event = new KeyboardEvent('keydown', { key: keyMap[dir], code: keyMap[dir] });
    document.dispatchEvent(event);
});*/

canvas.addEventListener('touchstart', e => {
    const startTouch = e.touches[0];
    touch.startX = startTouch.clientX;
    touch.startY = startTouch.clientY;

});

canvas.addEventListener('touchend', e => {
    const endTouch = e.changedTouches[0];
    const swipeX = touch.startX - endTouch.clientX;
    const swipeY = touch.startY - endTouch.clientY;

    if (Math.abs(swipeX) > Math.abs(swipeY)) {
        if (swipeX > 20) simulateKey('ArrowLeft');
        else if (swipeX < -20) simulateKey('ArrowRight');
        
    } else {
        if (swipeY > 20) simulateKey('ArrowUp');
        else if (swipeY < -20) simulateKey('ArrowDown');
    }
});

function simulateKey(key) {
    const eventKey = new KeyboardEvent('keydown', { key });
    document.dispatchEvent(eventKey);
}

document.addEventListener('touchstart', function () {
    if(gameRunning) return;
    const eventStart = new KeyboardEvent('keydown', { key: ' ', code: 'Space' });
    document.dispatchEvent(eventStart);
});