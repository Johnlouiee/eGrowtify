#!/usr/bin/env python3
"""
Simple OpenAI API test
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_simple():
    try:
        # Check if API key exists
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            print("❌ No API key found")
            return False
        
        print(f"✅ API key found: {api_key[:20]}...")
        
        # Set the environment variable explicitly
        os.environ['OPENAI_API_KEY'] = api_key
        
        # Try to import and use OpenAI
        from openai import OpenAI
        
        print("✅ OpenAI library imported successfully")
        
        # Create client
        client = OpenAI()
        print("✅ OpenAI client created successfully")
        
        # Test a simple call
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": "Say 'Hello' and nothing else."}
            ],
            max_tokens=10
        )
        
        result = response.choices[0].message.content
        print(f"✅ API call successful: {result}")
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    test_simple()
