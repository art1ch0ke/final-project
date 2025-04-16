const MIN_NUMBER = 1;
const MAX_NUMBER = 100;

let answer;
let attempts = 0;

const guessInput = document.getElementById("guess-input");
const sumbitGuess = document.getElementById("submit-guess");
const feedback = document.getElementById("feedback");
const hint = document.getElementById("hint");
const attemtsDisplay = document.getElementById('attempts');
const newGame = document.getElementById('new-game');
guessInput.disabled = true;

function checkGuess() {
    let userGuess = parseInt(guessInput.value);

    if (isNaN(userGuess) || userGuess < MIN_NUMBER || userGuess > MAX_NUMBER) {
        feedback.textContent = "Введите допустимое число!";
        hint.textContent = "";
        console.log(userGuess, answer);
        return;
    }
    attempts++;
    attemtsDisplay.textContent = `Попытки: ${attempts}`;

    if (userGuess === answer) {
        feedback.textContent = "Вы угадали число!";
        hint.textContent = "";
        hint.style.color = "#5cb85c";
        sumbitGuess.classList.toggle("hidden");
        newGame.classList.toggle("hidden");
        guessInput.disabled = true;
    } else if (userGuess > answer) {
        feedback.textContent = "";
        hint.textContent = "Число меньше!";
    }
     else {
        feedback.textContent = "";
        hint.textContent = "Число больше!";
     }
        guessInput.value = '';
}


newGame.addEventListener('click', ()=>{
    answer = parseInt((Math.random() * (MAX_NUMBER - MIN_NUMBER) + 1));
    guessInput.disabled = false;
    newGame.classList.toggle("hidden");
    sumbitGuess.classList.toggle("hidden");
    
    attempts = 0;
    attemtsDisplay.textContent = `Попытки: ${attempts}`;
    hint.style.color = '#f44336';

    sumbitGuess.addEventListener('click', checkGuess);
});