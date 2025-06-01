Dynamic Weather Forecast

## 🌍 Project Overview

Dynamic Weather Forecast is a responsive web application that provides current weather conditions and a 5-day forecast for any city worldwide, or automatically for the user's current location. It showcases asynchronous JavaScript for API integration, dynamic content updates, and interactive CSS 3D button effects.

This project demonstrates proficiency in fetching and displaying real-time data from external APIs, handling user permissions (geolocation), and creating an intuitive, visually appealing user interface.

## ✨ Features

* **Current Weather Display:** Shows temperature, weather description, humidity, wind speed, and an illustrative icon for the searched location.
* **5-Day Forecast:** Provides a multi-day forecast with daily high/low temperatures and weather conditions.
* **City Search:** Users can manually enter a city name to get weather information.
* **Geolocation Integration:** Automatically detects and displays weather for the user's current location (requires browser permission).
* **Interactive Buttons:** The "Get Weather" and "Current Location" buttons feature a subtle **3D press effect** on click, enhancing user interaction.
* **Robust Error Handling:** Provides user-friendly error messages for invalid city names, API key issues, geolocation permission denials, and network problems.
* **Responsive Design:** Optimized for seamless viewing and interaction across various devices, from mobile phones to desktops.

## 🛠️ Technologies Used

* **HTML5:** Standard markup for the web application structure.
* **CSS3:** Comprehensive styling, including Flexbox and Grid for layout, responsive design (`@media` queries), and advanced **3D Transformations** for button effects (`transform`, `box-shadow`).
* **JavaScript (ES6+):**
    * Asynchronous programming with `async/await` and `fetch` for API requests.
    * **OpenWeatherMap API:** Used to retrieve current weather data and 5-day forecast.
    * **Geolocation API:** Used to get the user's current latitude and longitude.
    * DOM manipulation for dynamically updating weather information.
    * Event handling for user interactions.

## 🏃 How to Run Locally

1.  **Clone the repository (or download the files):**
    ```bash
    git clone [YOUR_REPOSITORY_URL_HERE]
    cd weather-app-project
    ```
2.  **Get Your OpenWeatherMap API Key:**
    * Go to [https://openweathermap.org/](https://openweathermap.org/).
    * Sign up for a **free account**.
    * Once logged in, navigate to your "API keys" section to find and copy your personal API key.
    * **Important:** It can take up to 2 hours for a newly generated API key to become active.
3.  **Update `script.js`:**
    * Open `script.js` in a text editor.
    * Locate the line: `const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';`
    * Replace `'YOUR_OPENWEATHERMAP_API_KEY'` with the actual API key you copied from OpenWeatherMap.
4.  **Serve with a Local Server (Recommended):**
    * Due to browser security policies (CORS) and Geolocation API requirements, it's best to run this project using a local web server.
    * **Using VS Code Live Server:** If you use VS Code, install the "Live Server" extension. Right-click `index.html` in your file explorer and select "Open with Live Server."
    * **Using Python's Simple HTTP Server:**
        * Navigate to your project directory in the terminal.
        * Run: `python -m http.server` (for Python 3) or `python -m SimpleHTTPServer` (for Python 2).
        * Open your browser and go to `http://localhost:8000` (or whatever port Python indicates).

## 📝 Learning & Development Notes

During the development of the Dynamic Weather Forecast, I focused on:

* Mastering `async/await` and the `fetch` API for making clean, readable asynchronous requests to external services.
* Integrating third-party APIs (OpenWeatherMap) and handling their responses, including different error codes (`404`, `401`, `500`).
* Implementing the browser's Geolocation API, handling user permissions, and providing appropriate feedback for various scenarios (e.g., permission denied, timeout).
* Creating dynamic and responsive UI elements using CSS Flexbox and Grid.
* Adding interactive flair with CSS 3D transforms on buttons to enhance user engagement.
* Improving user experience with informative loading messages and clear error feedback.

## 🔮 Future Enhancements

* **Unit Conversion:** Add a toggle for Celsius/Fahrenheit.
* **Search History:** Store recent searches using Local Storage.
* **Dynamic Backgrounds:** Change the background image or color based on current weather conditions.
* **More Detailed Forecast:** Expand to show hourly forecast data for a selected day.
* **Weather Alerts:** Integrate a weather alert API (if available in a free tier).
* **Animations:** Introduce more subtle entry/exit animations for weather data.
* **Preloader:** Implement a simple loading spinner while fetching data.
