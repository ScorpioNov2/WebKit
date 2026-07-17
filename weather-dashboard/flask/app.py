from flask import Flask, render_template, jsonify, request
import requests
from datetime import datetime

app = Flask(__name__)

OPENMETEO_API = 'https://api.open-meteo.com/v1/forecast'
GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search'

WEATHER_ICONS = {
    0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
    45: '🌫️', 48: '🌫️',
    51: '🌧️', 53: '🌧️', 55: '🌧️',
    61: '🌧️', 63: '⛈️', 65: '⛈️',
    71: '❄️', 73: '❄️', 75: '❄️',
    77: '❄️', 80: '🌧️', 81: '⛈️', 82: '⛈️',
    85: '❄️', 86: '❄️', 95: '⛈️', 96: '⛈️', 99: '⛈️'
}

WEATHER_DESCRIPTIONS = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Foggy', 51: 'Drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
    61: 'Rain', 63: 'Rain', 65: 'Heavy rain', 71: 'Snow', 73: 'Snow',
    75: 'Heavy snow', 77: 'Snow grains', 80: 'Rain showers', 81: 'Rain showers',
    82: 'Rain showers', 85: 'Snow showers', 86: 'Snow showers',
    95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm'
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/geocode/<city>')
def geocode(city):
    try:
        response = requests.get(
            f'{GEOCODING_API}?name={city}&count=1&language=en&format=json'
        )
        data = response.json()

        if not data.get('results'):
            return jsonify({'error': 'City not found'}), 404

        result = data['results'][0]
        return jsonify({
            'latitude': result['latitude'],
            'longitude': result['longitude'],
            'name': result['name'],
            'country': result['country']
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/weather')
def get_weather():
    try:
        latitude = request.args.get('latitude')
        longitude = request.args.get('longitude')
        city_name = request.args.get('city_name')
        country_name = request.args.get('country_name')

        if not all([latitude, longitude]):
            return jsonify({'error': 'Missing coordinates'}), 400

        response = requests.get(
            f'{OPENMETEO_API}?'
            f'latitude={latitude}&'
            f'longitude={longitude}&'
            f'current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&'
            f'daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&'
            f'timezone=auto'
        )

        data = response.json()

        # Process current weather
        current = data['current']
        weather_code = current['weather_code']

        processed_data = {
            'city': city_name,
            'country': country_name,
            'timezone': data.get('timezone', 'UTC'),
            'current': {
                'temperature': round(current['temperature_2m']),
                'humidity': current['relative_humidity_2m'],
                'wind_speed': round(current['wind_speed_10m']),
                'weather_code': weather_code,
                'icon': WEATHER_ICONS.get(weather_code, '🌤️'),
                'description': WEATHER_DESCRIPTIONS.get(weather_code, 'Unknown')
            },
            'forecast': []
        }

        # Process daily forecast
        daily = data['daily']
        for i in range(min(5, len(daily['time']))):
            forecast_day = {
                'date': daily['time'][i],
                'day_name': datetime.fromisoformat(daily['time'][i]).strftime('%a'),
                'max_temp': round(daily['temperature_2m_max'][i]),
                'min_temp': round(daily['temperature_2m_min'][i]),
                'weather_code': daily['weather_code'][i],
                'icon': WEATHER_ICONS.get(daily['weather_code'][i], '🌤️'),
                'description': WEATHER_DESCRIPTIONS.get(daily['weather_code'][i], 'Unknown'),
                'precipitation': round(daily['precipitation_sum'][i], 2)
            }
            processed_data['forecast'].append(forecast_day)

        return jsonify(processed_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
