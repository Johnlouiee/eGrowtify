#!/usr/bin/env python3
"""
Test script to verify invalid city handling
"""

import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_invalid_cities():
    base_url = "http://127.0.0.1:5000"
    
    print("🧪 Testing Invalid City Handling...")
    print("=" * 50)
    
    # Test cases for invalid cities
    invalid_cities = [
        "Asdfasdfasdf",  # Random string
        "Xyz123",        # Numbers in city name
        "NonExistentCity123",  # Non-existent city
        "Qwertyuiop",    # Random letters
        "123456",        # Only numbers
        "!@#$%",         # Special characters
    ]
    
    for city in invalid_cities:
        print(f"\n🔍 Testing city: '{city}'")
        try:
            response = requests.get(f"{base_url}/api/weather?city={city}")
            
            if response.status_code == 404:
                data = response.json()
                print(f"✅ Correctly rejected: {data.get('error', 'City not found')}")
            elif response.status_code == 200:
                data = response.json()
                if data.get('success') == False:
                    print(f"✅ Correctly rejected: {data.get('error', 'City not found')}")
                else:
                    print(f"❌ Unexpected success for invalid city: {data.get('city', city)}")
            else:
                print(f"⚠️  Unexpected status code: {response.status_code}")
                print(f"   Response: {response.text[:100]}...")
                
        except Exception as e:
            print(f"❌ Error testing city '{city}': {e}")
    
    # Test valid cities for comparison
    print(f"\n✅ Testing valid cities for comparison:")
    valid_cities = ["Cebu", "Manila", "Tokyo"]
    
    for city in valid_cities:
        print(f"\n🔍 Testing valid city: '{city}'")
        try:
            response = requests.get(f"{base_url}/api/weather?city={city}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') != False:
                    print(f"✅ Correctly accepted: {data.get('city', city)} - {data.get('temperature', 'N/A')}°C")
                else:
                    print(f"❌ Incorrectly rejected valid city: {data.get('error', 'Unknown error')}")
            else:
                print(f"❌ Unexpected status code for valid city: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error testing valid city '{city}': {e}")

if __name__ == "__main__":
    test_invalid_cities()
