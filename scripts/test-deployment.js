#!/usr/bin/env node

// Test deployment configuration
const fs = require('fs');
const path = require('path');

console.log('=== Tadashi AI Deployment Test ===\n');

// Test 1: Environment variables
console.log('1. Checking environment variables...');
const requiredEnvVars = [
  'MISTRAL_API_KEY',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASS'
];

let allEnvVarsPresent = true;
for (const envVar of requiredEnvVars) {
  if (process.env[envVar]) {
    console.log(`   ✓ ${envVar} is set`);
  } else {
    console.log(`   ✗ ${envVar} is missing`);
    allEnvVarsPresent = false;
  }
}

if (allEnvVarsPresent) {
  console.log('   All required environment variables are present.\n');
} else {
  console.log('   Some required environment variables are missing!\n');
}

// Test 2: Database file
console.log('2. Checking database file...');
try {
  const dbPath = path.join(__dirname, '../data/database.json');
  if (fs.existsSync(dbPath)) {
    const dbContent = fs.readFileSync(dbPath, 'utf8');
    const db = JSON.parse(dbContent);
    if (db.users && Array.isArray(db.users)) {
      console.log(`   ✓ Database file exists with ${db.users.length} users`);
    } else {
      console.log('   ✗ Database structure is incorrect');
    }
  } else {
    console.log('   ✗ Database file does not exist');
  }
} catch (error) {
  console.log('   ✗ Error reading database file:', error.message);
}

console.log('\n=== Test Complete ===');
console.log('If all checks show ✓, your deployment should work correctly.');