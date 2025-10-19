const fs = require('fs');

// Create .env.local file with proper encoding
const envContent = 'MISTRAL_API_KEY=L1Jnjozk76gUwpy2ZPqZgH8wXuK5biZr\n';

fs.writeFileSync('.env.local', envContent, 'utf8');

console.log('Created .env.local file with content:', envContent.trim());