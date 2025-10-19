const fs = require('fs');
const path = require('path');

console.log('=== Tadashi AI - Comprehensive System Test ===\n');

// Test 1: Check if required files exist
console.log('1. Checking required files...');
const requiredFiles = [
  'components/chat-bot.tsx',
  'components/tts-stt-chat-box.tsx',
  'lib/email.ts',
  'contexts/theme-context.tsx',
  'components/theme-selector.tsx',
  'app/globals.css',
  'data/database.json'
];

let allFilesExist = true;
for (const file of requiredFiles) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`   ✓ ${file}`);
  } else {
    console.log(`   ✗ ${file} - MISSING`);
    allFilesExist = false;
  }
}

if (allFilesExist) {
  console.log('   All required files are present.\n');
} else {
  console.log('   Some required files are missing!\n');
}

// Test 2: Check if GIF files exist
console.log('2. Checking GIF files...');
const gifFiles = [
  'public/images/tadashi-caring.gif',
  'public/images/tadashi-hello.gif',
  'public/images/tadashi-thumbs-up.gif'
];

let allGifFilesExist = true;
for (const file of gifFiles) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`   ✓ ${file}`);
  } else {
    console.log(`   ✗ ${file} - MISSING`);
    allGifFilesExist = false;
  }
}

if (allGifFilesExist) {
  console.log('   All GIF files are present.\n');
} else {
  console.log('   Some GIF files are missing!\n');
}

// Test 3: Check database structure
console.log('3. Checking database structure...');
try {
  const databasePath = path.join(__dirname, 'data/database.json');
  const databaseContent = fs.readFileSync(databasePath, 'utf8');
  const database = JSON.parse(databaseContent);
  
  if (database.users && Array.isArray(database.users)) {
    console.log(`   ✓ Database has ${database.users.length} users`);
    console.log('   ✓ Database structure is correct\n');
  } else {
    console.log('   ✗ Database structure is incorrect\n');
  }
} catch (error) {
  console.log('   ✗ Error reading database:', error.message, '\n');
}

// Test 4: Check environment variables
console.log('4. Checking environment variables...');
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('MISTRAL_API_KEY')) {
    console.log('   ✓ MISTRAL_API_KEY is configured');
  } else {
    console.log('   ✗ MISTRAL_API_KEY is missing');
  }
  
  if (envContent.includes('EMAIL_HOST')) {
    console.log('   ✓ EMAIL_HOST is configured');
  } else {
    console.log('   ✗ EMAIL_HOST is missing');
  }
  
  if (envContent.includes('EMAIL_PORT')) {
    console.log('   ✓ EMAIL_PORT is configured');
  } else {
    console.log('   ✗ EMAIL_PORT is missing');
  }
  
  if (envContent.includes('EMAIL_USER')) {
    console.log('   ✓ EMAIL_USER is configured');
  } else {
    console.log('   ✗ EMAIL_USER is missing');
  }
  
  if (envContent.includes('EMAIL_PASS')) {
    console.log('   ✓ EMAIL_PASS is configured');
  } else {
    console.log('   ✗ EMAIL_PASS is missing');
  }
  
  console.log('   Environment variables file exists.\n');
} else {
  console.log('   ✗ .env.local file is missing\n');
}

// Test 5: Check theme configuration
console.log('5. Checking theme configuration...');
const cssPath = path.join(__dirname, 'app/globals.css');
if (fs.existsSync(cssPath)) {
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  const themes = ['theme-default', 'theme-calm', 'theme-energetic', 'theme-focus', 'theme-relax'];
  let allThemesFound = true;
  
  for (const theme of themes) {
    if (cssContent.includes(theme)) {
      console.log(`   ✓ ${theme} is configured`);
    } else {
      console.log(`   ✗ ${theme} is missing`);
      allThemesFound = false;
    }
  }
  
  if (allThemesFound) {
    console.log('   All themes are properly configured.\n');
  } else {
    console.log('   Some themes are missing!\n');
  }
} else {
  console.log('   ✗ globals.css file is missing\n');
}

console.log('=== Test Summary ===');
console.log('If all checks above show ✓, the Tadashi AI system is properly configured.');
console.log('The development server should be running on http://localhost:3008');