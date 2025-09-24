#!/usr/bin/env python3
"""
Test script for OpenAI integration in eGrowtify
Run this script to verify your OpenAI API key is working correctly
"""

import os
import sys
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_openai_connection():
    """Test basic OpenAI API connection"""
    try:
        openai_key = os.getenv('OPENAI_API_KEY')
        if not openai_key:
            print("❌ OPENAI_API_KEY not found in environment variables")
            print("Please add your OpenAI API key to the .env file")
            return False
        
        print(f"✅ Found OpenAI API key: {openai_key[:10]}...")
        
        # Test basic API call
        from openai import OpenAI
        client = OpenAI()
        
        # Simple test completion
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Say 'OpenAI integration test successful' and nothing else."}
            ],
            max_tokens=50
        )
        
        result = response.choices[0].message.content.strip()
        print(f"✅ OpenAI API test successful: {result}")
        return True
        
    except Exception as e:
        print(f"❌ OpenAI API test failed: {str(e)}")
        return False

def test_plant_analysis_prompt():
    """Test the plant analysis prompt structure"""
    try:
        openai_key = os.getenv('OPENAI_API_KEY')
        if not openai_key:
            return False
            
        from openai import OpenAI
        client = OpenAI()
        
        system_prompt = (
            "You are an expert horticulturist and plant pathologist with 20+ years of experience. "
            "Analyze the provided plant identification data and return detailed, accurate guidance. "
            "Return your analysis as strict JSON with these exact keys: "
            "health_status (detailed assessment), growth_stage (specific stage with timing), "
            "care_recommendations (object with watering, sunlight, soil, fertilizing, pruning), "
            "common_issues (array of specific problems with solutions), estimated_yield (realistic expectations), "
            "seasonal_notes (seasonal care tips), pest_diseases (common threats and prevention). "
            "Be specific, practical, and accurate for home gardening."
        )
        
        test_data = {
            "plant_name": "Tomato",
            "scientific_name": "Solanum lycopersicum",
            "confidence": 95.0,
            "wiki_description": "Tomato is a widely cultivated plant known for its edible fruit."
        }
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Analyze this plant and provide detailed care guidance: {test_data}"}
            ],
            temperature=0.3,
            max_tokens=500
        )
        
        content = response.choices[0].message.content
        result = json.loads(content)
        
        print("✅ Plant analysis prompt test successful")
        print(f"   Health Status: {result.get('health_status', 'N/A')}")
        print(f"   Growth Stage: {result.get('growth_stage', 'N/A')}")
        print(f"   Care Recommendations: {len(result.get('care_recommendations', {}))} items")
        print(f"   Common Issues: {len(result.get('common_issues', []))} items")
        
        return True
        
    except Exception as e:
        print(f"❌ Plant analysis prompt test failed: {str(e)}")
        return False

def test_soil_analysis_prompt():
    """Test the soil analysis prompt structure"""
    try:
        openai_key = os.getenv('OPENAI_API_KEY')
        if not openai_key:
            return False
            
        from openai import OpenAI
        client = OpenAI()
        
        system_prompt = (
            "You are an expert soil scientist and agronomist with extensive experience in soil analysis. "
            "Analyze the provided soil image and return detailed, accurate soil assessment. "
            "Return your analysis as strict JSON with these exact keys: "
            "moisture_level (detailed assessment with visual indicators), texture (specific soil type with characteristics), "
            "ph (estimated pH range with visual indicators), organic_matter (assessment of organic content), "
            "drainage (drainage quality assessment), recommendations (array of specific improvement suggestions), "
            "suitable_plants (array of plants that would thrive in this soil), "
            "nutrient_indicators (visual signs of nutrient status), compaction_assessment (soil structure analysis). "
            "Be specific, practical, and accurate for home gardening."
        )
        
        # Test without image (text-only analysis)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": "Analyze typical garden soil and provide detailed soil assessment for home gardening."}
            ],
            temperature=0.3,
            max_tokens=500
        )
        
        content = response.choices[0].message.content
        result = json.loads(content)
        
        print("✅ Soil analysis prompt test successful")
        print(f"   Moisture Level: {result.get('moisture_level', 'N/A')}")
        print(f"   Texture: {result.get('texture', 'N/A')}")
        print(f"   pH: {result.get('ph', 'N/A')}")
        print(f"   Recommendations: {len(result.get('recommendations', []))} items")
        print(f"   Suitable Plants: {len(result.get('suitable_plants', []))} items")
        
        return True
        
    except Exception as e:
        print(f"❌ Soil analysis prompt test failed: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing OpenAI Integration for eGrowtify")
    print("=" * 50)
    
    # Test 1: Basic connection
    print("\n1. Testing OpenAI API connection...")
    connection_ok = test_openai_connection()
    
    if not connection_ok:
        print("\n❌ Cannot proceed with other tests. Please fix the API key issue first.")
        sys.exit(1)
    
    # Test 2: Plant analysis prompt
    print("\n2. Testing plant analysis prompt...")
    plant_ok = test_plant_analysis_prompt()
    
    # Test 3: Soil analysis prompt
    print("\n3. Testing soil analysis prompt...")
    soil_ok = test_soil_analysis_prompt()
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Summary:")
    print(f"   OpenAI Connection: {'✅ PASS' if connection_ok else '❌ FAIL'}")
    print(f"   Plant Analysis: {'✅ PASS' if plant_ok else '❌ FAIL'}")
    print(f"   Soil Analysis: {'✅ PASS' if soil_ok else '❌ FAIL'}")
    
    if all([connection_ok, plant_ok, soil_ok]):
        print("\n🎉 All tests passed! Your OpenAI integration is ready to use.")
        print("\nNext steps:")
        print("1. Start your backend: python main.py")
        print("2. Start your frontend: npm run dev")
        print("3. Test the AI features in your app!")
    else:
        print("\n⚠️  Some tests failed. Please check the error messages above.")
        sys.exit(1)

if __name__ == "__main__":
    main()
