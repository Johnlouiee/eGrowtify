#!/usr/bin/env python3
"""
Test script for the weather API endpoint
Run this to verify the weather feature is working correctly
"""

import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_weather_api():
    """Test the weather API endpoint"""
    base_url = "http://127.0.0.1:5000"
    
    print("🌤️  Testing Weather API...")
    print("=" * 50)
    
    # Test 1: Default city (Cebu)
    print("\n1. Testing default city (Cebu):")
    try:
        response = requests.get(f"{base_url}/api/weather")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success! Temperature: {data.get('temperature')}°C")
            print(f"   Humidity: {data.get('humidity')}%")
            print(f"   Description: {data.get('description')}")
            print(f"   City: {data.get('city')}")
            print(f"   Mock data: {data.get('mock', False)}")
        else:
            print(f"❌ Failed with status: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 2: Custom city
    print("\n2. Testing custom city (Manila):")
    try:
        response = requests.get(f"{base_url}/api/weather?city=Manila")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success! Temperature: {data.get('temperature')}°C")
            print(f"   Humidity: {data.get('humidity')}%")
            print(f"   Description: {data.get('description')}")
            print(f"   City: {data.get('city')}")
            print(f"   Mock data: {data.get('mock', False)}")
        else:
            print(f"❌ Failed with status: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 3: International city
    print("\n3. Testing international city (Tokyo):")
    try:
        response = requests.get(f"{base_url}/api/weather?city=Tokyo")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success! Temperature: {data.get('temperature')}°C")
            print(f"   Humidity: {data.get('humidity')}%")
            print(f"   Description: {data.get('description')}")
            print(f"   City: {data.get('city')}")
            print(f"   Country: {data.get('country', 'N/A')}")
            print(f"   Mock data: {data.get('mock', False)}")
        else:
            print(f"❌ Failed with status: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Check API key status
    print("\n4. API Key Status:")
    api_key = os.getenv('OPENWEATHER_API_KEY')
    if api_key:
        print(f"✅ API key is set (length: {len(api_key)} characters)")
        print("   Real weather data should be available")
    else:
        print("⚠️  No API key found in environment variables")
        print("   Using mock data - add OPENWEATHER_API_KEY to .env for real data")
    
    print("\n" + "=" * 50)
    print("🌤️  Weather API test completed!")

if __name__ == "__main__":
    test_weather_api()
