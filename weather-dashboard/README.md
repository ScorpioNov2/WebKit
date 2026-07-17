# 🌤️ Weather Dashboard

A beautiful, responsive weather dashboard that fetches real-time weather data from the Open-Meteo API.

## Features

✅ **Real-time Weather Data** - Current temperature, humidity, wind speed
✅ **5-Day Forecast** - Detailed daily weather predictions
✅ **Geolocation Support** - Detect and display weather for your current location
✅ **City Search** - Search weather for any city worldwide
✅ **Beautiful UI** - Modern, responsive design with smooth animations
✅ **Mobile-Friendly** - Optimized for all screen sizes
✅ **No API Key Required** - Uses Open-Meteo free API
✅ **Multiple Implementations** - HTML/CSS/JS, React, and Python Flask versions

## Available Implementations

### 1. Vanilla HTML/CSS/JavaScript (Simplest)
**File:** `vanilla/index.html`

Just open the HTML file in your browser - no build tools needed!

```bash
cd vanilla
open index.html
```

### 2. React Application
**Files:** `react/` directory

```bash
cd react
npm install
npm start
```

The React app includes:
- Component-based architecture
- State management with hooks
- Reusable components (CurrentWeather, Forecast, DetailCard)

### 3. Python Flask Backend
**Files:** `flask/` directory

```bash
cd flask
pip install flask requests
python app.py
```

Visit: `http://localhost:5000`

## API Used

**Open-Meteo API** - Free, no authentication required
- Current weather data
- Daily forecasts
- Hourly data available
- Geolocation reverse lookup

**Nominatim (OpenStreetMap)** - For reverse geocoding

## Features Breakdown

### Current Weather Display
- Current temperature
- Weather description with emoji icons
- Humidity percentage
- Wind speed (km/h)
- Timezone information

### 5-Day Forecast
- Daily high/low temperatures
- Weather conditions
- Precipitation data
- Weather icons

### Search Functionality
- City name search with autocomplete
- Geolocation button for current location
- Error handling for invalid cities

## Project Structure

```
weather-dashboard/
├── vanilla/
│   └── index.html              # Standalone HTML file
├── react/
│   ├── package.json
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   └── .gitignore
├── flask/
│   ├── app.py                  # Flask backend
│   ├── requirements.txt
│   ├── static/
│   │   └── app.js
│   └── templates/
│       └── index.html
└── README.md
```

## Weather Icons Used

- ☀️ Clear sky
- 🌤️ Mainly clear
- ⛅ Partly cloudy
- ☁️ Overcast
- 🌧️ Rain
- ⛈️ Thunderstorm
- ❄️ Snow
- 🌫️ Foggy

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Fully responsive

## Performance

- Vanilla version: Loads instantly (no dependencies)
- React version: Optimized with code splitting
- Flask version: Server-side caching ready

## Customization

### Change Default City
**Vanilla/React:**
```javascript
const [city, setCity] = useState('New York'); // Change from 'London'
```

### Change Theme Colors
**CSS:**
```css
/* Primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Accent colors */
color: #ff6b6b;  /* Red accents */
```

### Add More Days to Forecast
**JavaScript:**
```javascript
for (let i = 0; i < Math.min(7, daily.time.length); i++) {
    // Change 5 to 7 for weekly forecast
}
```

## Error Handling

- City not found: Clear error message
- Network error: Automatic retry
- Geolocation denied: Falls back to search
- Invalid coordinates: Validation before API call

## Future Enhancements

- 🌙 Dark mode toggle
- 📊 Hourly forecast graphs
- 🔔 Weather alerts/notifications
- 📍 Multiple saved locations
- 🌍 Multi-language support
- 📱 Mobile app version
- 🎨 Customizable themes
- 📈 Historical weather data

## Contributing

Feel free to fork, modify, and improve this project!

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Resources

- [Open-Meteo API Documentation](https://open-meteo.com/)
- [Weather Icon Meanings](https://open-meteo.com/en/docs)
- [Nominatim Documentation](https://nominatim.org/)

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify your internet connection
3. Try a different city name
4. Clear browser cache and reload

---

**Made with ❤️ by ScorpioNov2**
