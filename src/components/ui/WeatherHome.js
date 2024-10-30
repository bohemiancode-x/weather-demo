"use client"

import { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Cloud, Search, Loader, Sun, Thermometer } from "lucide-react"

export default function WeatherApp() {
  const [city, setCity] = useState("")
  const [weatherData, setWeatherData] = useState(null)
  const [error, setError] = useState(null)
  const [loading,  setLoading] = useState(true)

  const getCurrentTemp = () => {
    if (weatherData && weatherData.hourly.temperature_2m.length > 0) {
      return weatherData.hourly.temperature_2m[0]
    }
    return null
  }
  

  // Placeholder weather data
  const MockWeatherData = {
    city: "New York",
    temperature: 72,
    condition: "Partly Cloudy",
    icon: <Cloud className="h-16 w-16 text-blue-500" />
  }

  //function to fetch data via the open-meteo api with the user latitude and longitude retrieved from the geolocation function
  const fetchWeather = async (latitude, longitude) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/weather?latitude=${latitude}&longitude=${longitude}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setWeatherData(data);
      setLoading(false); 
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Failed to fetch weather data');
      setLoading(false); 
    }
  };


  //function  to get access to user location when component mounts
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to retrieve your location');
          setLoading(false); 
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false); 
    }
  };

  //function being used to call open-meteo api with new york latitude and longitude
  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true)
        const response = await fetch('/api/weatherv1');
        const data = await response.json();
        setWeatherData(data);
        setLoading(false)
      } catch (error) {
        console.error('Error fetching weather:', error);
        setLoading(false)
      }
    }
    fetchWeather();
  }, []);

  //console.log(weatherData)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center justify-center p-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-2">Weather App</h1>
        <p className="text-blue-600">New york weather retrieved via the open-meteo api.</p>
      </header>

      <main className="w-full max-w-md">

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="h-12 w-12 text-blue-500 animate-spin" />
          </div>
        ) : weatherData ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">{city || "Location"}</h2>
              <Cloud className="h-10 w-10 text-gray-500" />
            </div>
            <div className="flex items-center mb-4">
              <Thermometer className="h-6 w-6 text-red-500 mr-2" />
              <span className="text-4xl font-bold text-gray-900">
                {getCurrentTemp()}{weatherData.hourly_units.temperature_2m}
              </span>
            </div>
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">Hourly Forecast</h3>
              <div className="flex justify-between">
                {weatherData.hourly.time.slice(0, 4).map((time, index) => (
                  <div key={time} className="text-center">
                    <p className="text-sm text-gray-600">{new Date(time).getHours()}:00</p>
                    <p className="font-medium">
                      {weatherData.hourly.temperature_2m[index]}
                      {weatherData.hourly_units.temperature_2m}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600">
            This app needs your location to display weather information.
          </div>
        )}

        {weatherData == null && !loading || error ? (<div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">{MockWeatherData.city}</h2>
            {MockWeatherData.icon}
          </div>
          <div className="flex items-center mb-2">
            <Thermometer className="h-6 w-6 text-red-500 mr-2" />
            <span className="text-4xl font-bold text-gray-900">{MockWeatherData.temperature}°F</span>
          </div>
          <p className="text-gray-600">{MockWeatherData.condition}</p>
        </div>) : <></>}
      </main>

      <footer className="mt-8 text-center text-blue-800">
        <p>&copy; 2024 Weather App. All rights reserved.</p>
      </footer>
    </div>
  )
}