// Test email functionality
require('dotenv').config({ path: '.env.local' });

console.log('=== Email Configuration Test ===\n');

console.log('Environment Variables:');
console.log('MISTRAL_API_KEY:', process.env.MISTRAL_API_KEY ? '✓ Configured' : '✗ Missing');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST ? '✓ Configured' : '✗ Missing');
console.log('EMAIL_PORT:', process.env.EMAIL_PORT ? '✓ Configured' : '✗ Missing');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✓ Configured' : '✗ Missing');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✓ Configured' : '✗ Missing');

console.log('\n=== Test Complete ===');