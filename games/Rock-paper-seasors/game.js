const card = document.getElementById('card');
const buttons = document.querySelectorAll('button');
const scoreboard = document.getElementById('scoreboard');

const choices = ['✊', '✌️', '📄'];

let playerScore = 0;
let computerScore = 0;

function decideWinner(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    return 'draw';
  }
  if (playerChoice === '✊' && computerChoice === '✌️') {
    return 'player';
  }
  if (playerChoice === '✌️' && computerChoice === '📄') {
    return 'player';
  }
  if (playerChoice === '📄' && computerChoice === '✊') {
    return 'player';
  }
  return 'computer';
}

function updateScoreboard() {
  scoreboard.textContent = 'Player: ' + playerScore + ' — Computer: ' + computerScore;
}

function disableButtons(value) {
  buttons.forEach(btn => {
    btn.disabled = value;
  });
}

function clearSelected() {
  buttons.forEach(btn => btn.classList.remove('selected'));
}

function showModal(winner) {
  const modal = document.createElement('div');
  modal.classList.add('modal');

  let message = '';
  let emoji = '';

  if (winner === 'player') {
    message = 'Ты выиграл! 🎉';
    emoji = '🏆';
  } else if (winner === 'computer') {
    message = 'Компьютер победил! 💻';
    emoji = '🤖';
  } else {
    message = 'Ничья! 🤝';
    emoji = '⚖️';
  }

  modal.innerHTML = `<div>${emoji} ${message}</div>`;

  const btn = document.createElement('button');
  btn.textContent = 'Начать заново';
  btn.addEventListener('click', ()=>{
    playerScore = 0;
    computerScore = 0;
    updateScoreboard();
    card.textContent = '❓';
    document.body.removeChild(modal);
    disableButtons(false);
  }); 

  modal.appendChild(btn);
  document.body.appendChild(modal);
}

function playRound(playerChoice) {
  disableButtons(true);
  clearSelected();

  // Подсветка выбранной кнопки игрока
  buttons.forEach(btn => {
    if (btn.textContent === playerChoice) {
      btn.classList.add('selected');
    }
  });

  // Компьютер выбирает случайно
  const computerChoice = choices[Math.floor(Math.random() * choices.length)];

  // Поворот карточки (начинается анимация)
  card.classList.add('rotate');

  // Через полсекунды меняем содержимое на выбор компьютера
  setTimeout(function() {
    card.textContent = computerChoice;

    // Решаем, кто победил
    const winner = decideWinner(playerChoice, computerChoice);
    if (winner === 'player') {
      playerScore++;
    } else if (winner === 'computer') {
      computerScore++;
    }

    updateScoreboard();
  }, 170);

  // Еще через полсекунды поворачиваем обратно и убираем класс
  setTimeout(function() {
    card.classList.remove('rotate');
    clearSelected();

    // После поворота показываем вопрос
    setTimeout(function() {
      card.textContent = '❓';
      disableButtons(false);

      // Проверяем, есть ли победитель до трех очков
      if (playerScore === 3 || computerScore === 3) {
        let winner = '';
        if (playerScore > computerScore) {
          winner = 'player';
        } else if (computerScore > playerScore) {
          winner = 'computer';
        } else {
          winner = 'draw';
        }
        disableButtons(true);
        showModal(winner);
      }
    }, 170);
  }, 2000);
}

buttons.forEach(button => {
  button.addEventListener('click', function() {
    playRound(this.textContent);
  });
});