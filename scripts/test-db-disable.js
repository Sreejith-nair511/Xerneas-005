#!/usr/bin/env node

// Test script to verify database disable functionality
const fs = require('fs');
const path = require('path');

console.log('=== Tadashi AI Database Disable Test ===\n');

// Test 1: Check environment variable
console.log('1. Checking ENABLE_DATABASE environment variable...');
const enableDatabase = process.env.ENABLE_DATABASE;
if (enableDatabase === 'false') {
  console.log('   ✓ Database is correctly disabled (ENABLE_DATABASE=false)');
} else if (enableDatabase === 'true') {
  console.log('   ✗ Database is enabled (ENABLE_DATABASE=true)');
} else if (enableDatabase === undefined) {
  console.log('   ? ENABLE_DATABASE not set (default behavior may vary)');
} else {
  console.log(`   ? Unexpected ENABLE_DATABASE value: ${enableDatabase}`);
}

// Test 2: Check .env.local file
console.log('\n2. Checking .env.local configuration...');
try {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('ENABLE_DATABASE=false')) {
      console.log('   ✓ .env.local correctly configured to disable database');
    } else if (envContent.includes('ENABLE_DATABASE=true')) {
      console.log('   ✗ .env.local configured to enable database');
    } else {
      console.log('   ? ENABLE_DATABASE not found in .env.local');
    }
  } else {
    console.log('   ✗ .env.local file not found');
  }
} catch (error) {
  console.log('   ✗ Error reading .env.local:', error.message);
}

// Test 3: Check temporary user store exists
console.log('\n3. Checking temporary user store...');
try {
  const tempStorePath = path.join(__dirname, '../lib/temp-user-store.ts');
  if (fs.existsSync(tempStorePath)) {
    console.log('   ✓ Temporary user store exists');
  } else {
    console.log('   ✗ Temporary user store not found');
  }
} catch (error) {
  console.log('   ✗ Error checking temporary user store:', error.message);
}

// Test 4: Check database library modifications
console.log('\n4. Checking database library...');
try {
  const dbLibPath = path.join(__dirname, '../lib/db.ts');
  const dbLibContent = fs.readFileSync(dbLibPath, 'utf8');
  if (dbLibContent.includes('ENABLE_DATABASE')) {
    console.log('   ✓ Database library correctly modified for conditional usage');
  } else {
    console.log('   ✗ Database library not properly modified');
  }
} catch (error) {
  console.log('   ✗ Error reading database library:', error.message);
}

// Test 5: Check API route modifications
console.log('\n5. Checking API route modifications...');
const apiRoutes = [
  'app/api/auth/signup/route.ts',
  'app/api/auth/login/route.ts',
  'app/api/premium/upgrade/route.ts'
];

let allRoutesModified = true;
for (const route of apiRoutes) {
  try {
    const routePath = path.join(__dirname, '../', route);
    const routeContent = fs.readFileSync(routePath, 'utf8');
    if (routeContent.includes('ENABLE_DATABASE')) {
      console.log(`   ✓ ${route} correctly modified`);
    } else {
      console.log(`   ✗ ${route} not properly modified`);
      allRoutesModified = false;
    }
  } catch (error) {
    console.log(`   ✗ Error reading ${route}:`, error.message);
    allRoutesModified = false;
  }
}

console.log('\n=== Test Summary ===');
console.log('If all checks show ✓, the database disable feature is properly configured.');
console.log('The application should now work without requiring file-based database access.');