// pages/api/weather.js
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { LATITUDE, LONGITUDE } = process.env;

    // Fetch weather data from OpenMeteo API
    const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
      params: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        hourly: 'temperature_2m',
      },
    });

    // Send the data back to the client
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
}
