/*1. Создать канвас, подключить переменные
2. Создать объект кружка
3. Нарисовать
4. Добавить направление, заставить двигаться
5. Условия отскока
6. Смена цвета
7. Создать функцию конструктор 
8. draw и update
9. Случайно задавать коорды и скорость
10. Массив из кружков и цикл*/
const toggleAqua = document.createElement('button');
toggleAqua.textContent = '🌊';
toggleAqua.id = 'toggle-aquarium';
document.body.append(toggleAqua);

const canvas = document.createElement('canvas');
canvas.id = 'aquarium-canvas';
document.body.append(canvas);

canvas.width = window.innerWidth-10; 
canvas.height = window.innerHeight-10;
const c = canvas.getContext('2d');
let animateID = null;
let active = false;
const colors = ['black', 'white'];
const animaSpeed = window.innerWidth <= 768 ? 1.5 : 5;
const minSize = window.innerWidth <= 768 ? 5 : 10;
const maxSize = window.innerWidth <= 768 ? 12 : 30;
const count = window.innerWidth <= 768 ? 3000 : 2000;

function Circle(x, y, radius) {
    this.x = x ;
    this.y = y;
    this.radius = radius;
    this.color = `${colors[Math.floor(Math.random()*2)]}`;
    this.dir = 
    {   dx: (Math.random() - 0.5) * animaSpeed, 
        dy:(Math.random() - 0.5) * animaSpeed
    };

    this.changeColor = function() {
        this.color = `${colors[Math.floor(Math.random()*2)]}`;
    };
    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    };

    this.update = function() {
        if(this.x + this.radius > canvas.width ||
           this.x - this.radius < 0) {
            this.dir.dx = -this.dir.dx;
            this.changeColor();
        }
    
        if(this.y + this.radius > canvas.height ||
           this.y - this.radius < 0) {
            this.dir.dy = -this.dir.dy;
            this.changeColor();
        }
        this.x += this.dir.dx;
        this.y += this.dir.dy;
        this.draw();
    };
}

let circlArray = [];

function animate() {
    animateID = requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    circlArray.forEach((item)=>item.update());
}

function createCircles() {
    circlArray = [];
    for (let i = 0; i < count; i++) {
        const radius = minSize + Math.random() * maxSize;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * (canvas.height - radius * 2) + radius;
        circlArray.push(new Circle(x, y, radius));
    }
}

function startAquarium() {
    canvas.classList.remove('hide');
    canvas.classList.add('show');
    createCircles();
    animate();
    canvas.style.display = 'block';
}

function stopAquarium() {
    canvas.classList.remove('show');
    canvas.classList.add('hide');
    setTimeout(() => {
        cancelAnimationFrame(animateID);
        canvas.classList.add('hide');
        canvas.style.display = 'none';
    }, 600);
}


toggleAqua.addEventListener('click', () => {
    active = !active;
    active ? startAquarium() : stopAquarium();
});

