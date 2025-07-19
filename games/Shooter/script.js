/* 1. Создать поле с размерами на весь экран
2. Создать функцию-конструктор для объекта игрока
3. Добавить метод draw() и нарисовать на странице

4. Создать снаряды, добавлять по клику
5. Cоздать метод update 
6. animete()
7. Массив снарядов 
8. forEach в анимейт
9. push в обработчике при клике
10. Посчитать тригонометрию 
11. Создать enemy, spawnEnemy()
12. Заставить их спавнится вне поля и двигаться к игроку
13. Коллизия с снаряда и врага 
14. Коллизия снаряда и игрока 
15. Удаление лишних снарядов
16. Черный экран и след 
17. Цвет пуль, рандом цвет врагов
18. Партиклы, создание, разлет
19. Альфа, c.save, c.resrore
*/

let highScore = 0;
let inervalId = null;
let animationId = null;

const canvas = document.querySelector('canvas');
const scoreEl = document.querySelector('#scoreEl');
const recordEl = document.getElementById('recordEl');
const startBtn = document.getElementById('startBtn');
const modal = document.querySelector('.game-modal');
const bigScore = document.getElementById('bigScore');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth - 6;
canvas.height = window.innerHeight- 6;
highScore = localStorage.getItem('shooterRecord') || 0;
recordEl.textContent = highScore;

function Player(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.score = 0;
    this.draw = function() {
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        c.fill();
    };
}

function Projectile(x, y, radius, color, velocity, speed=6) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.speed = speed;
    this.draw = function() {
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        c.fill();
    };
    this.update = function() {
        this.draw();
        this.x += this.velocity.x * this.speed;
        this.y += this.velocity.y * this.speed;
    };
}

function Enemy (x, y, radius, color, velocity, speed=2) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.speed = window.innerWidth < 768 ? 1 : 2;
    this.draw = function() {
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        c.fill();
    };
    this.update = function() {
        this.draw();
        this.x += this.velocity.x * this.speed;
        this.y += this.velocity.y * this.speed;
    };
}

const friction = 0.99;
function Particle (x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.speed = Math.random() * 10;
    this.alpha = 1;
    this.draw = function() {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        c.fill();
        c.restore();
    };
    this.update = function() {
        this.draw();
        this.velocity.x *= friction;
        this.x += this.velocity.x * this.speed;
        this.y += this.velocity.y * this.speed;
        this.alpha -= 0.01;
    };
}

let player = new Player(canvas.width/2, canvas.height/2, 10, '#fff');
let projectiles = [];
let enemies = [];
let particles = [];

function init() {
    player = new Player(canvas.width/2, canvas.height/2, 10, '#fff');
    projectiles = [];
    enemies = [];
    particles = [];
    player.score = 0;
    scoreEl.textContent = player.score;
    highScore = localStorage.getItem('shooterRecord') || 0;
    recordEl.textContent = highScore;
    bigScore.textContent = player.score;
}


function spawnEnemies() {
    inervalId = setInterval(() => {
        const radius = 6 + Math.random() * (30 - 6);
        let x;
        let y;
        console.log(enemies);
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
            x = Math.random() * canvas.width;
        }
        
        const angle = Math.atan2(player.y - y, player.x - x); 
        enemies.push(new Enemy(
            x,
            y,
            radius,
            `hsl(${Math.random() * 360}, 50%, 50%)`,
            {
                x: Math.cos(angle),
                y: Math.sin(angle)
            }
        ));
    }, 1000);
}

function animate() {
    animationId = requestAnimationFrame(animate);
    c.fillStyle = `rgba(0, 0, 0, 0.2)`;
    c.fillRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle, particleIndex) => {
        if (particle.alpha <= 0) {
            particles.splice(particleIndex, 1);
        } else {
            particle.update();
        }
    });
    projectiles.forEach((projectile, projectileIndex) => {
        projectile.update();
        // delete proj over frame
        if (projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height) {
                setTimeout(()=> {
                    projectiles.splice(projectileIndex, 1);
                });
            }
    });
    player.draw();

    enemies.forEach((enemy, enemyIndex) => {
        enemy.update();

        const distance = 
        Math.hypot(player.x - enemy.x, player.y - enemy.y);
        // enemy hits player
        // game over
        if (distance - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId);
            clearInterval(inervalId);
            animationId = inervalId = null;
            if(player.score > highScore) {
                highScore = player.score;
                localStorage.setItem('shooterRecord', highScore);
            }
            scoreEl.textContent = player.score;
            recordEl.textContent = highScore;
            modal.style.display = 'flex';
            bigScore.textContent = player.score;
        }
        
        projectiles.forEach((projectile, projectileIndex) => {
            // расстояние между точками
            const distance = 
            Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

            // projectile hits enemy
            if (distance - enemy.radius - projectile.radius < 1) {
                
                for(let i = 0; i < Math.random() * (enemy.radius * 4); i++) {
                    particles.push(new Particle(
                        projectile.x, projectile.y,
                        1 + Math.random() * 4,
                        enemy.color, 
                        {x: Math.random() - 0.5, y: Math.random() - 0.5}
                        ));
                }

                if(enemy.radius - 10 > 5) {
                    player.score += 10;
                    scoreEl.textContent = player.score;
                    setTimeout(()=>{
                        gsap.to(enemy, {
                            radius: enemy.radius - 10
                        });
                        projectiles.splice(projectileIndex, 1);
                    }, 0);
                } else {
                    player.score += 30;
                    scoreEl.textContent = player.score;
                    setTimeout(()=> {
                        enemies.splice(enemyIndex, 1);
                        projectiles.splice(projectileIndex, 1);
                    }, 0);
                }
            }
        });
    });
}

function shoot(x, y) {
    const angle = Math.atan2(y - player.y, x - player.x);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    };
    projectiles.push(new Projectile(
      player.x,
      player.y,
      5,
      '#fff',
      velocity
    ));
  }
  
  window.addEventListener('click', (e)=> {
    shoot(e.clientX, e.clientY);
  });
  
  window.addEventListener('touchstart', (e)=>{
    const touch = e.touches[0];
    shoot(touch.clientX, touch.clientY);
  });

startBtn.addEventListener('click', ()=> {
    init();
    animate();
    spawnEnemies();
    modal.style.display = 'none';
});
