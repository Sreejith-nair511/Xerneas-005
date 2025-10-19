const fs = require('fs');
// Load environment variables from .env.local
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Test Mistral API functionality
require('dotenv').config({ path: '.env.local' });

async function testMistralAPI() {
  console.log('=== Mistral API Test ===\n');
  
  const apiKey = process.env.MISTRAL_API_KEY;
  
  if (!apiKey) {
    console.log('✗ MISTRAL_API_KEY is not configured');
    return;
  }
  
  console.log('✓ MISTRAL_API_KEY is configured');
  console.log('API Key preview:', apiKey.substring(0, 5) + '...');
  
  try {
    console.log('\nTesting API connection...');
    
    const response = await fetch('https://api.mistral.ai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      console.log('✓ Mistral API is accessible');
      const data = await response.json();
      console.log(`Found ${data.data.length} available models`);
    } else {
      console.log('✗ Mistral API connection failed');
      const errorText = await response.text();
      console.log('Error:', errorText);
    }
  } catch (error) {
    console.log('✗ Error testing Mistral API:', error.message);
  }
  
  console.log('\n=== Test Complete ===');
}

testMistralAPI();