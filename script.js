// Function to fetch weather data
function getWeather() {
    const apiKey = process.env.API_KEY;
    const city = document.getElementById('city').value.trim();

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    // Fetch current weather data
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Current Weather Data:', data); // For debugging
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    // Fetch forecast data
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Forecast Data:', data); // For debugging
            displayHourlyForecast(data.list); // hourly forecast
            displayFourDayForecast(data.list); // New 4-day forecast
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            alert('Error fetching forecast data. Please try again.');
        });
}
function getWeatherByLocation(lat, lon) {
    const apiKey = 'a95f658418e1c09a2f0979825e38ebda';
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    // Fetch current weather data
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Current Weather Data by Location:', data); // For debugging
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data by location:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    // Fetch forecast data
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Forecast Data by Location:', data); // For debugging
            displayHourlyForecast(data.list); // hourly forecast
            displayFourDayForecast(data.list); // New 4-day forecast
        })
        .catch(error => {
            console.error('Error fetching forecast data by location:', error);
            alert('Error fetching forecast data. Please try again.');
        });
}
// Function to display current weather
function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp); // Already in Celsius
        const description = data.weather[0].description;
        const weatherCondition = data.weather[0].main.toLowerCase(); // Lowercase for matching
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `<p>${temperature}°C</p>`;
        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;
        weatherIcon.style.display = 'block'; // Ensure it's visible

        // Change the background based on the weather condition
        updateBackground(weatherCondition);
    }
}

// Function to display hourly forecast
function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    hourlyForecastDiv.innerHTML = ''; // Clear previous content

    const next24Hours = hourlyData.slice(0, 8); // Display the next 24 hours (3-hour intervals)

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp); // Already in Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;  // Append each card to the hourly forecast container
    });
}

// Function to display 4-day weather forecast
function displayFourDayForecast(forecastData) {
    const dailyForecastDiv = document.getElementById('four-day-forecast');
    dailyForecastDiv.innerHTML = ''; // Clear previous content

    // Create an object to store daily forecasts
    const dailyForecasts = {};

    // Loop through forecast data to extract daily summaries (3-hour intervals for 5 days)
    forecastData.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString(); // Get date (without time)
        const temperature = Math.round(item.main.temp); // Temperature in Celsius
        const weatherCondition = item.weather[0].description;
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        // If the date is not yet in dailyForecasts, add it with the current forecast data
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = {
                tempMin: temperature,
                tempMax: temperature,
                weatherCondition,
                iconUrl
            };
        } else {
            // Update min and max temperatures
            dailyForecasts[date].tempMin = Math.min(dailyForecasts[date].tempMin, temperature);
            dailyForecasts[date].tempMax = Math.max(dailyForecasts[date].tempMax, temperature);
        }
    });

    // Display the next 4 days of weather (excluding the current day)
    const forecastDates = Object.keys(dailyForecasts).slice(1, 5); // Get the next 4 days

    forecastDates.forEach(date => {
        const { tempMin, tempMax, weatherCondition, iconUrl } = dailyForecasts[date];

        const dailyForecastHtml = `
            <div class="daily-forecast-item">
                <p>${date}</p>
                <img src="${iconUrl}" alt="${weatherCondition}">
                <p>${weatherCondition}</p>
                <p>Min: ${tempMin}°C / Max: ${tempMax}°C</p>
            </div>
        `;

        dailyForecastDiv.innerHTML += dailyForecastHtml; // Append each day's forecast
    });
}

// Function to update the background based on weather condition
function updateBackground(weatherCondition) {
    // Reset the body's class
    document.body.className = '';

    // Map weather conditions to CSS classes
    switch (weatherCondition) {
        case 'clear':
            document.body.classList.add('clear');
            break;
        case 'clouds':
            document.body.classList.add('clouds');
            break;
        case 'rain':
            document.body.classList.add('rain');
            break;
        case 'snow':
            document.body.classList.add('snow');
            break;
        case 'thunderstorm':
            document.body.classList.add('thunderstorm');
            break;
        case 'night':
            document.body.classList.add('night');
            break;
        case 'mist':
            document.body.classList.add('mist');
            break;
        case 'haze':
            document.body.classList.add('haze');
            break;
        case 'fog':
            document.body.classList.add('fog');
            break;
        default:
            document.body.classList.add('default-bg'); // Fallback background
    }

    console.log(`Applied background class: ${weatherCondition}`); // For debugging
}

// Function to get user's current location and fetch weather data
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    getWeatherByLocation(latitude, longitude);
}

function error() {
    alert("Unable to retrieve your location.");
}

// Along with search button hitting "Enter" also leads to result
document.getElementById("city").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevents the default action (submitting a form, etc.)
        getWeather(); // Calls the weather fetching function when Enter is pressed
    }
});

// Event listener for getting weather based on current location
document.getElementById('get-location').onclick = function() {
    getUserLocation();
};
