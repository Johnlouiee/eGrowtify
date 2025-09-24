#!/usr/bin/env python3
"""
Quick test script to verify your OpenWeatherMap API key
"""

import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_api_key():
    api_key = os.getenv('OPENWEATHER_API_KEY')
    
    if not api_key:
        print("❌ No API key found in .env file")
        return
    
    print(f"🔑 Testing API key: {api_key[:8]}...{api_key[-4:]}")
    
    # Test with Cebu
    url = "http://api.openweathermap.org/data/2.5/weather"
    params = {
        'q': 'Cebu',
        'appid': api_key,
        'units': 'metric'
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ API key is valid!")
            print(f"   City: {data['name']}")
            print(f"   Temperature: {data['main']['temp']}°C")
            print(f"   Description: {data['weather'][0]['description']}")
            print(f"   Humidity: {data['main']['humidity']}%")
            return True
        else:
            print(f"❌ API key is invalid (Status: {response.status_code})")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing API: {e}")
        return False

if __name__ == "__main__":
    test_api_key()
