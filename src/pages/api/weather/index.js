// pages/api/weather.js
import axios from 'axios';

export default async function handler(req, res) {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and Longitude are required' });
  }

  try {
    const weatherResponse = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        hourly: 'temperature_2m',
      },
    });

    res.status(200).json(weatherResponse.data);
  } catch (error) {
    console.error('OpenMeteo API error:', error.message);
    res.status(500).json({ error: 'Error fetching weather data from OpenMeteo' });
  }
}
