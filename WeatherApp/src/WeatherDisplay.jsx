import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ForecastCard from './ForecastCard';
import HourlyCard from './HourlyCard';
import Loader from './Loader'; // Import the Loader


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const WeatherComponent = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [currentWeather, setCurrentWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCelsius, setIsCelsius] = useState(true);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [cityName, setCityName] = useState("London");
    const [searchInput, setSearchInput] = useState("");
    
  
    const API_KEY = "474532abab6d05c2aa0259be1e658ff7";

    useEffect(() => {
        const fetchWeatherData = async () => {
            setLoading(true);
            try {
                const forecastResponse = await axios.get(
                    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
                );
                setWeatherData(forecastResponse.data);
        
                const currentResponse = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
                );
                setCurrentWeather(currentResponse.data);
            } catch (error) {
                // Removed error handling
            } finally {
                setLoading(false);
            }
        };

        if (cityName) {
            fetchWeatherData();
        }
    }, [cityName]);

    const toggleUnit = () => {
        setIsCelsius(prev => !prev);
    };

    const convertTemperature = (temp) => {
        return isCelsius ? temp : (temp * 9 / 5) + 32;
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchInput.trim() !== "") {
            setCityName(searchInput.trim());
            setSearchInput("");
        } else {
            toast.warn("Please enter a city name.");
        }
    };

    if (loading) return <Loader />; // Show the loader while loading
if (!weatherData || !currentWeather) {
    return (
        <div className="flex-1 flex flex-col justify-center items-center p-6">
            <h2 className="text-4xl font-extrabold text-center mb-4 text-blue-500">5-Day Weather Forecast for {cityName}</h2>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-4 w-full max-w-md text-center">
                <p className="text-lg">Please search for a city to get the weather data.</p>
            </div>
        </div>
    );
}

    const dailyData = weatherData.list.filter((_, index) => index % 8 === 0);

    const handleDayClick = (index) => {
        setSelectedDayIndex(index);
    };

    const getHourlyData = (day) => {
        const selectedDate = new Date(day.dt * 1000);
        return weatherData.list.filter(item => {
            const date = new Date(item.dt * 1000);
            return date.getDate() === selectedDate.getDate() &&
                   date.getMonth() === selectedDate.getMonth() &&
                   date.getFullYear() === selectedDate.getFullYear();
        });
    };

    const selectedDay = dailyData[selectedDayIndex];

    const getChartData = (hourlyData) => {
        const labels = hourlyData.map(hour => new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        const temperatures = hourlyData.map(hour => convertTemperature(hour.main.temp).toFixed(1));
        const humidities = hourlyData.map(hour => hour.main.humidity);

        return {
            labels,
            datasets: [
                {
                    label: `Temperature (${isCelsius ? '°C' : '°F'})`,
                    data: temperatures,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 3,
                },
                {
                    label: 'Humidity (%)',
                    data: humidities,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 3,
                },
            ],
        };
    };

    return (
        <div className="min-h-screen flex flex-col bg-black text-white">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover draggable />

            <div className="flex justify-center p-6">
                <form onSubmit={handleSearch} className="flex items-center bg-gray-800 rounded-lg overflow-hidden shadow-lg w-full max-w-md">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Enter city name"
                        className="p-4 bg-transparent text-white focus:outline-none placeholder-gray-400 w-full"
                    />
                    <button type="submit" className="p-4 bg-blue-500 text-white hover:bg-blue-600 transition duration-300">
                        Search
                    </button>
                </form>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center p-6">
                <h2 className="text-4xl font-extrabold text-center mb-4 text-blue-500">5-Day Weather Forecast for {cityName}</h2>

       

    <div className="bg-gray-800 bg-opacity-80 p-6 rounded-lg shadow-2xl mb-4 w-full max-w-md flex flex-col items-center relative overflow-hidden transition-transform transform hover:scale-105 duration-300 ease-in-out">
        <h3 className="text-2xl font-semibold mb-2 text-white">
            Current Weather in <span className="text-yellow-400">{currentWeather.name}</span>
        </h3>
        <div className="flex flex-col md:flex-row items-center mb-2">
            <img
                src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
                alt={currentWeather.weather[0].description}
                className="w-24 h-24 mb-4 md:mb-0 md:mr-4 transform transition-transform duration-300 hover:scale-110"
            />
            <div className="text-center text-white">
                <p className="text-5xl font-bold">
                    {convertTemperature(currentWeather.main.temp).toFixed(1)}°{isCelsius ? 'C' : 'F'}
                </p>
                <p className="text-lg italic">{currentWeather.weather[0].description}</p>
                <p className="text-sm">Feels Like: {convertTemperature(currentWeather.main.feels_like).toFixed(1)}°{isCelsius ? 'C' : 'F'}</p>
            </div>
        </div>
        <div className="flex flex-wrap justify-around w-full mt-2 text-white">
            <div className="text-center flex-1">
                <p className="text-sm">Humidity</p>
                <p className="text-lg">{currentWeather.main.humidity}%</p>
            </div>
            <div className="text-center flex-1">
                <p className="text-sm">Wind Speed</p>
                <p className="text-lg">{currentWeather.wind.speed} m/s</p>
            </div>
            <div className="text-center flex-1">
                <p className="text-sm">Pressure</p>
                <p className="text-lg">{currentWeather.main.pressure} hPa</p>
            </div>
            <div className="text-center flex-1">
                <p className="text-sm">Visibility</p>
                <p className="text-lg">{(currentWeather.visibility / 1000).toFixed(1)} km</p>
            </div>
        </div>
    </div>



                <div className="flex justify-center mb-4">
    <button
        onClick={toggleUnit}
        className={`flex items-center justify-center px-6 py-3 rounded-full 
            transition-all duration-300 
            bg-gradient-to-r from-blue-500 to-yellow-400 text-white 
            font-bold text-lg border-2 border-transparent 
            shadow-lg hover:shadow-2xl hover:border-blue-300 
            transform hover:scale-105`}
    >
        <span className="mr-2 text-xl">
            {isCelsius ? '🌡️' : '🌡️'}
        </span>
        <span className="transition-transform duration-300 transform hover:translate-x-1">
            {isCelsius ? 'Switch to Fahrenheit' : 'Switch to Celsius'}
        </span>
    </button>
</div>






                <div className="flex justify-start md:justify-center flex-nowrap overflow-x-auto mb-4 p-2 w-full">
    {dailyData.map((day, index) => (
        <ForecastCard
            key={day.dt}
            day={day}
            index={index}
            selectedDayIndex={selectedDayIndex}
            handleDayClick={handleDayClick}
            convertTemperature={convertTemperature}
            isCelsius={isCelsius}
        />
    ))}
</div>



                <h3 className="text-2xl font-semibold mb-4">Hourly Forecast</h3>
                <div className="flex justify-start md:justify-center flex-nowrap overflow-x-auto mb-4 space-x-2 w-full">
                    {getHourlyData(selectedDay).map((hour) => (
                        <HourlyCard 
                            key={hour.dt} 
                            hour={hour} 
                            convertTemperature={convertTemperature} 
                            isCelsius={isCelsius} 
                        />
                    ))}
                </div>

                <div className="w-full max-w-lg mb-4">
                    <Line 
                        data={getChartData(getHourlyData(selectedDay))}
                        options={{
                            responsive: true,
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Time',
                                        color: '#fff',
                                    },
                                    ticks: {
                                        color: '#fff',
                                    },
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Temperature (°C)',
                                        color: '#fff',
                                    },
                                    ticks: {
                                        color: '#fff',
                                    },
                                },
                            },
                            plugins: {
                                legend: {
                                    labels: {
                                        color: '#fff',
                                    },
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default WeatherComponent;
