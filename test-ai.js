import aiService from './frontend/src/services/aiService.js';

// Test the AI service
async function testAI() {
  console.log('Testing AI Service...\n');
  
  const testQueries = [
    'I have a headache',
    'Find cardiologists',
    'Book appointment',
    'Emergency help needed',
    'What doctors specialize in skin problems?'
  ];
  
  for (let query of testQueries) {
    console.log(`Query: "${query}"`);
    try {
      const response = await aiService.processQuery(query);
      console.log(`Response: ${response.response.substring(0, 100)}...\n`);
    } catch (error) {
      console.log(`Error: ${error.message}\n`);
    }
  }
}

testAI();