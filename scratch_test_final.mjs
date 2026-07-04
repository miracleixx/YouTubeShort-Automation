import { generateContent } from './src/aiRouter.mjs';

async function testKeys() {
  console.log('Testing description generation (expected: Gemini)...');
  try {
    const desc = await generateContent('What is the capital of Japan? Just say the city name.', 'description', 50);
    console.log('Description Response:', desc);
  } catch (e) {
    console.error('Failed to generate description:', e.message);
  }

  console.log('\nTesting hook generation (expected: Claude)...');
  try {
    const hook = await generateContent('Give me a 5 word hook about space.', 'hook', 50);
    console.log('Hook Response:', hook);
  } catch (e) {
    console.error('Failed to generate hook:', e.message);
  }
}

testKeys();
