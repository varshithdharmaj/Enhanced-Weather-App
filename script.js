document.addEventListener('DOMContentLoaded', () => {
    const locationInput = document.getElementById('location-input');
    const searchButton = document.getElementById('search-button');
    const currentLocationButton = document.getElementById('current-location-button');
    const weatherDisplay = document.getElementById('weather-display');
    const forecastDisplay = document.getElementById('forecast-display');
    const forecastCardsContainer = forecastDisplay.querySelector('.forecast-cards');
    const forecastMessage = document.getElementById('forecast-message');

    // IMPORTANT: Replace with your actual OpenWeatherMap API Key
    // You can get one by signing up at https://openweathermap.org/api
    const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
    const CURRENT_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
    const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'; // 5-day / 3-hour forecast

    // --- Event Listeners ---
    searchButton.addEventListener('click', () => fetchWeatherByLocation(locationInput.value));
    locationInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            fetchWeatherByLocation(locationInput.value);
        }
    });
    currentLocationButton.addEventListener('click', fetchWeatherByGeolocation);

    // --- Core Fetch Functions ---

    async function fetchWeatherByLocation(location) {
        if (!location) {
            displayError('Please enter a city name.');
            clearForecast();
            return;
        }
        await getWeatherData(`${CURRENT_WEATHER_URL}?q=${location}&appid=${API_KEY}&units=metric`,
                             `${FORECAST_URL}?q=${location}&appid=${API_KEY}&units=metric`);
    }

    async function fetchWeatherByGeolocation() {
        if (!navigator.geolocation) {
            displayError('Geolocation is not supported by your browser.');
            clearForecast();
            return;
        }

        displayMessage('Getting your current location...', 'info');
        weatherDisplay.innerHTML = '<p class="message">Locating you...</p>';
        clearForecast(); // Clear previous forecast

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                await getWeatherData(`${CURRENT_WEATHER_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`,
                                     `${FORECAST_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
            },
            (error) => {
                let errorMessage = 'Unable to retrieve your location.';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Geolocation permission denied. Please allow location access in your browser settings.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'The request to get user location timed out.';
                        break;
                    default:
                        errorMessage = `An unknown error occurred: ${error.message}`;
                }
                displayError(errorMessage);
                clearForecast();
            }
        );
    }

    async function getWeatherData(currentWeatherUrl, forecastUrl) {
        try {
            // Fetch current weather
            const currentWeatherResponse = await fetch(currentWeatherUrl);
            if (!currentWeatherResponse.ok) {
                await handleApiResponseError(currentWeatherResponse);
                return;
            }
            const currentWeatherData = await currentWeatherResponse.json();
            displayCurrentWeather(currentWeatherData);

            // Fetch forecast
            const forecastResponse = await fetch(forecastUrl);
            if (!forecastResponse.ok) {
                // Forecast error doesn't prevent current weather display, just logs
                console.error('Error fetching forecast:', forecastResponse.status, forecastResponse.statusText);
                forecastMessage.textContent = 'Could not fetch 5-day forecast.';
                forecastCardsContainer.innerHTML = '';
                return;
            }
            const forecastData = await forecastResponse.json();
            displayForecast(forecastData);

        } catch (error) {
            console.error('Error fetching weather data:', error);
            displayError('Could not fetch weather data. Please check your internet connection or try again later.');
            clearForecast();
        }
    }

    // --- Display Functions ---

    function displayCurrentWeather(data) {
        const { name, main, weather, wind } = data;
        const iconCode = weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

        weatherDisplay.innerHTML = `
            <h2 class="location-name">${name}</h2>
            <img src="${iconUrl}" alt="${weather[0].description}" class="weather-icon">
            <p class="temperature">${main.temp.toFixed(1)}°C</p>
            <p class="description">${weather[0].description.charAt(0).toUpperCase() + weather[0].description.slice(1)}</p>
            <p>Feels like: ${main.feels_like.toFixed(1)}°C</p>
            <p>Humidity: ${main.humidity}%</p>
            <p>Wind Speed: ${wind.speed.toFixed(1)} m/s</p>
        `;
        weatherDisplay.classList.remove('error-message', 'message'); // Clean up any previous messages
        forecastDisplay.style.display = 'block'; // Ensure forecast section is visible
    }

    function displayForecast(data) {
        forecastCardsContainer.innerHTML = '';
        forecastMessage.textContent = ''; // Clear any previous forecast messages

        const dailyForecasts = {}; // Group forecasts by date

        data.list.forEach(item => {
            const date = new Date(item.dt * 1000); // Convert timestamp to Date object
            const day = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

            // Only consider forecast for days AFTER today
            const today = new Date();
            today.setHours(0,0,0,0); // Reset time to compare just dates
            if (date.getTime() < today.getTime()) {
                return; // Skip past dates
            }

            if (!dailyForecasts[day]) {
                dailyForecasts[day] = {
                    minTemp: item.main.temp_min,
                    maxTemp: item.main.temp_max,
                    weather: item.weather[0], // Take the first weather condition for simplicity
                    count: 1
                };
            } else {
                dailyForecasts[day].minTemp = Math.min(dailyForecasts[day].minTemp, item.main.temp_min);
                dailyForecasts[day].maxTemp = Math.max(dailyForecasts[day].maxTemp, item.main.temp_max);
                // For simplicity, we just use the first weather item of the day.
                // A more advanced approach would involve averaging or picking the most dominant.
                dailyForecasts[day].count++;
            }
        });

        // Convert the object to an array and sort by date for consistent display
        const sortedDays = Object.keys(dailyForecasts).sort((a, b) => new Date(a) - new Date(b));

        // Display up to 5 days of forecast
        let daysToShow = 0;
        for (const day of sortedDays) {
            if (daysToShow >= 5) break; // Limit to 5 days
            const forecast = dailyForecasts[day];
            const iconUrl = `http://openweathermap.org/img/wn/${forecast.weather.icon}@2x.png`;

            const forecastCard = document.createElement('div');
            forecastCard.classList.add('forecast-card');
            forecastCard.innerHTML = `
                <span class="day">${day.split(',')[0]}</span>
                <span class="date">${day.split(', ')[1]}</span>
                <img src="${iconUrl}" alt="${forecast.weather.description}" class="icon">
                <span class="temp">${forecast.minTemp.toFixed(0)}° / ${forecast.maxTemp.toFixed(0)}°C</span>
                <span class="desc">${forecast.weather.description.charAt(0).toUpperCase() + forecast.weather.description.slice(1)}</span>
            `;
            forecastCardsContainer.appendChild(forecastCard);
            daysToShow++;
        }

        if (daysToShow === 0) {
            forecastMessage.textContent = 'No future forecast data available.';
        }
    }

    function clearForecast() {
        forecastCardsContainer.innerHTML = '';
        forecastMessage.textContent = '';
        forecastDisplay.style.display = 'none'; // Hide forecast section if no data
    }

    // --- Error and Message Handling ---

    function displayError(message) {
        weatherDisplay.innerHTML = `<p class="error-message">${message}</p>`;
        weatherDisplay.classList.add('error-message'); // Add class for specific styling
        weatherDisplay.classList.remove('message'); // Remove default message class
        locationInput.value = ''; // Clear input on error
        clearForecast();
    }

    function displayMessage(message, type = 'info') {
        weatherDisplay.innerHTML = `<p class="message ${type}">${message}</p>`;
        weatherDisplay.classList.add('message');
        weatherDisplay.classList.remove('error-message');
    }

    async function handleApiResponseError(response) {
        if (response.status === 404) {
            displayError('City not found. Please check the spelling or try a different city.');
        } else if (response.status === 401) {
            displayError('Invalid API Key. Please make sure your OpenWeatherMap API key is correct and active.');
        } else if (response.status >= 500) {
            displayError('Server error. Please try again later.');
        } else {
            const errorText = await response.text(); // Try to get more specific error from response body
            displayError(`Error: ${response.status} - ${errorText || response.statusText}`);
        }
    }

    // Initial load: try to get weather for current location
    fetchWeatherByGeolocation();
});
