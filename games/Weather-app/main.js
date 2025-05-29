const weatherIcons = {
    0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
    45: "🌫️", 48: "🌫️❄️", 51: "🌦️",
    61: "🌧️", 71: "🌨️", 95: "⛈️", 99: "⛈️🧊"
};

const button = document.getElementById('getWeather');
const result = document.getElementById('result');

button.addEventListener('click', () => {
    const city = document.getElementById('cityInp').value.trim();
    if (!city) {
        alert('Введите город!');
        return;
    }

    const spinner = document.createElement('img');
    spinner.src = 'img/spinner.svg';
    spinner.style.cssText = `display: block; margin: 10px auto;`;
    result.innerHTML = '';
    result.appendChild(spinner);
    button.disabled = true;

    let lat, lon;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`)
        .then(response => response.json())
        .then(geoData => {
            if (geoData.length === 0) {
                throw new Error('Город не найден.');
            }
            lat = geoData[0].lat;
            lon = geoData[0].lon;

            // Параллельно запускаем оба запроса — к погоде и реверсу
            return Promise.all([
                fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
                    .then(res => res.json()),
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
                    .then(res => res.json())
            ]);
        })
        .then(([weatherData, reverseData]) => {
            const temperature = weatherData.current_weather.temperature;
            const wind = weatherData.current_weather.windspeed;
            const code = weatherData.current_weather.weathercode;
            const icon = weatherIcons[code] || "❓";

            const address = reverseData.address;
            const locationName = address.city || address.town || address.village || address.state || reverseData.display_name;

            result.innerHTML = `
                <p style="margin-left: 10px; margin-bottom: 0; font-size: 1.8rem;"><b>${locationName}</b></p>
                <p><b>Температура:</b> <span>${temperature} °C ${icon}</span></p>
                <p><b>Скорость ветра:</b> <span>${wind} км/ч</span></p>
            `;
        })
        .catch(err => {
            result.innerHTML = `<p><b>Ошибка:</b> ${err.message}</p>`;
            console.error('Ошибка: ', err);
        })
        .finally(() => {
            button.disabled = false;
            document.getElementById('cityInp').value = '';
        });
});
