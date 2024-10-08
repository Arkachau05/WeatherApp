import React from 'react';

const HourlyCard = ({ hour, convertTemperature, isCelsius }) => {
    const date = new Date(hour.dt * 1000);

    return (
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 flex flex-col items-center shadow-md flex-shrink-0 w-32 sm:w-40 bg-gray-800 rounded-xl p-2 sm:p-3 transition duration-300 ">
            {/* Time */}
            <p className="text-sm sm:text-base font-semibold text-white mb-2">
                {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>

            {/* Weather Icon */}
            <img
                src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                alt={hour.weather[0].description}
                className="w-16 h-16 sm:w-20 sm:h-20 mb-2"
            />

            {/* Temperature */}
            <p className="text-xl sm:text-2xl font-bold text-yellow-300 mb-1">
                {convertTemperature(hour.main.temp).toFixed(1)}°{isCelsius ? 'C' : 'F'}
            </p>

            {/* Weather Description */}
            <p className="text-sm sm:text-base text-gray-300 italic mb-2">
                {hour.weather[0].description}
            </p>

            {/* Additional Info */}
            <div className="text-xs sm:text-sm text-gray-400 text-center space-y-1">
                <p>Humidity: {hour.main.humidity}%</p>
                <p>Wind: {hour.wind.speed} m/s</p>
            </div>
        </div>
    );
};

export default HourlyCard;
