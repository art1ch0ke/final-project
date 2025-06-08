// 📌 Создаём массив для хранения фильмов и сериалов
const movies = JSON.parse(localStorage.getItem('movies')) || [];
renderMovies(movies);

// 📌 Конструктор для создания объектов фильмов/сериалов
function Movie(title, year, rating, type, perEpisode, episodes = 1) {
    this.title = title;
    this.year = year;
    this.rating = rating;
    this.type = type;
    this.duration = {
        episodes,
        perEpisode
    };

    this.getInfo = function () {
        console.log(`${this.title} (${this.year}) - ${this.type === 'фильм' ? 'Фильм' : 'Сериал'}`);
        console.log(`Рейтинг: ${this.rating}`);
    };

    this.getTotalDuration = function () {
        const total = this.duration.episodes * this.duration.perEpisode;
        console.log(`Общая длительность: ${total} минут`);
    };
}

// 📌 Обработчик для изменения типа фильма/сериала
document.getElementById('type').addEventListener('change', function () {
    const episodesInput = document.getElementById('episodes');
    episodesInput.style.display = this.value === 'сериал' ? 'block' : 'none';
    if (this.value !== 'сериал') {
        episodesInput.value = ''; 
    }
});

// 📌 Функция для сортировки фильмов
function sortMovies(criteria) {
    if (criteria === 'year') {
        movies.sort((a, b) => a.year - b.year);
    } else if (criteria === 'rating') {
        movies.sort((a, b) => b.rating - a.rating);
    } else if (criteria === 'duration') {
        movies.sort((a, b) => 
            (a.duration.episodes * a.duration.perEpisode) - 
            (b.duration.episodes * b.duration.perEpisode)
        );
    } else {
        console.log('Ошибка: критерий должен быть "year", "rating" или "duration"');
        return;
    }
    renderMovies(movies);
}

// 📌 Функция для рендера списка фильмов
function renderMovies(movies) {
    const movieList = document.getElementById('movieList');
    movieList.innerHTML = '';
    
    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');
        movieItem.innerHTML = `
            <h3>${movie.title} (${movie.year})</h3>
            <p>Рейтинг: ${movie.rating}</p>
            <p>Тип: ${movie.type === 'фильм' ? 'Фильм' : 'Сериал'}</p>
            <p>Длительность: ${movie.duration.episodes * movie.duration.perEpisode} мин.</p>
        `;
        movieList.appendChild(movieItem);
    });
}

// 📌 Добавление нового фильма/сериала
document.getElementById('addMovie').addEventListener('click', () => {
    const title = document.getElementById('title').value;
    const type = document.getElementById('type').value;
    const year = parseInt(document.getElementById('year').value);
    const rating = parseFloat(document.getElementById('rating').value);
    const duration = parseInt(document.getElementById('duration').value);
    const episodes = type === 'фильм' ? 1 : parseInt(document.getElementById('episodes').value) || 1;
    
    if (!title || isNaN(year) || isNaN(rating) || isNaN(duration)) {
        alert('Заполните все поля корректно!');
        return;
    }
    
    const media = new Movie(title, year, rating, type, duration, episodes);
    movies.push(media);
    localStorage.setItem('movies', JSON.stringify(movies));
    renderMovies(movies);

    // Очищаем поля
    document.getElementById('title').value = '';
    document.getElementById('year').value = '';
    document.getElementById('rating').value = '';
    document.getElementById('duration').value = '';
    document.getElementById('episodes').value = '';
});

// 📌 Обработчик сортировки
document.getElementById('sortMovies').addEventListener('click', () => {
    const criteria = document.getElementById('sort').value;
    sortMovies(criteria);
});

if(movies.length === 0) {
    // 📌 Инициализация тестовых данных
    movies.push(new Movie('Интерстеллар', 2014, 8.6, 'фильм', 169));
    movies.push(new Movie('Во все тяжкие', 2008, 9.5, 'сериал', 47, 62));
    movies.push(new Movie('Джон Уик', 2014, 7.4, 'фильм', 101));
    movies.push(new Movie('Шерлок', 2010, 9.1, 'сериал', 88, 13));
}

renderMovies(movies);