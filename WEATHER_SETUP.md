# Weather Feature Setup Guide

## OpenWeatherMap API Setup

The weather feature uses the OpenWeatherMap API to provide real-time weather data and planting advice. Follow these steps to set it up:

### 1. Get Your API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to your API keys section
4. Copy your API key

### 2. Add API Key to Environment

Create a `.env` file in your project root (if it doesn't exist) and add:

```env
OPENWEATHER_API_KEY=your_api_key_here
```

### 3. Features

The weather component includes:

- **Real-time weather data** for any city worldwide
- **City search** - users can input their city name
- **Default location** - Cebu, Philippines as the default
- **Planting advice** - intelligent recommendations based on weather conditions
- **Weather icons** - visual representation of current conditions
- **Responsive design** - works on all devices

### 4. Weather Data Includes

- Temperature (in Celsius)
- Humidity percentage
- Wind speed (in km/h)
- Visibility (in km)
- Weather description
- Planting recommendations

### 5. Planting Advice Logic

The system provides planting advice based on:

- **Temperature**: Optimal ranges for different plant types
- **Humidity**: Moisture considerations for plant health
- **Wind conditions**: Protection needs for young plants
- **Weather conditions**: Rain, storms, and seasonal factors

### 6. Fallback Behavior

If the API key is not set or the API is unavailable, the system will:
- Display mock weather data for Cebu
- Still provide planting advice based on the mock data
- Show a notification that real-time data is unavailable

### 7. API Limits

The free OpenWeatherMap plan includes:
- 1,000 API calls per day
- Current weather data
- 5-day/3-hour forecast

This should be sufficient for most users of the eGrowtify application.

### 8. Testing

To test the weather feature:

1. Start the backend server: `python main.py`
2. Start the frontend: `npm run dev`
3. Navigate to the dashboard
4. The weather card should appear in the right column
5. Try searching for different cities
6. Check the planting advice updates based on weather conditions

### 9. Troubleshooting

**Weather data not loading:**
- Check if the API key is correctly set in `.env`
- Verify the API key is valid on OpenWeatherMap
- Check browser console for any error messages

**City not found:**
- Try using the full city name (e.g., "New York" instead of "NYC")
- Include country name for ambiguous cities (e.g., "London, UK")
- Check spelling of the city name

**Planting advice not showing:**
- Ensure the weather data is loading properly
- Check that the component is receiving weather data
- Verify the advice generation logic is working

### 10. Customization

You can customize the weather feature by:

- Modifying the default city in `WeatherCard.jsx`
- Adjusting the planting advice logic in the `generatePlantingAdvice` function
- Changing the weather icons and styling
- Adding more weather parameters (pressure, UV index, etc.)

## Support

If you encounter any issues with the weather feature, please check:
1. API key configuration
2. Network connectivity
3. Browser console for errors
4. Backend server logs

The weather feature is designed to gracefully handle API failures and provide useful information even when real-time data is unavailable.
