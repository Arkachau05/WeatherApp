import React from 'react';

const ForecastCard = ({ day, index, selectedDayIndex, handleDayClick, convertTemperature, isCelsius }) => {
    const date = new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    const temperature = convertTemperature(day.main.temp).toFixed(1);
    
    return (
        <div
            className={`flex-shrink-0 w-32 sm:w-40 bg-gray-800 rounded-lg p-2 sm:p-3 transition duration-300 
                ${selectedDayIndex === index ? 'border-2 border-blue-500' : ''} 
                cursor-pointer mx-1 sm:mx-2`} // Add margin for spacing
            onClick={() => handleDayClick(index)}
        >
            {/* Date Display */}
            <div className="mb-1 p-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg text-center">
                <h4 className="text-xs sm:text-sm font-bold">{date}</h4>
            </div>
            {/* Weather Icon */}
            <img
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt={day.weather[0].description}
                className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-1"
            />
            {/* Temperature Display */}
            <p className="text-xl sm:text-2xl font-bold text-orange-400 text-center">{temperature}°{isCelsius ? 'C' : 'F'}</p>
            {/* Weather Description */}
            <p className="text-xs text-gray-300 text-center">{day.weather[0].description}</p>
            {/* Min and Max Temperatures */}
            <div className="flex justify-between mt-1 text-xs sm:text-sm text-gray-400">
                <p>Min: {convertTemperature(day.main.temp_min).toFixed(1)}°{isCelsius ? 'C' : 'F'}</p>
                <p>Max: {convertTemperature(day.main.temp_max).toFixed(1)}°{isCelsius ? 'C' : 'F'}</p>
            </div>
            {/* Additional Weather Information */}
            <div className="mt-1 text-xs sm:text-sm text-gray-300">
                <p>H: {day.main.humidity}%</p>
                <p>W: {day.wind.speed} m/s</p>
            </div>
        </div>
    );
};

export default ForecastCard;
