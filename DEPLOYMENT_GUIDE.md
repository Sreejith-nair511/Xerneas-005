# Tadashi AI - Deployment Guide

This guide will help you deploy the Tadashi AI application successfully and avoid common issues like the "Internal Server Error" during signup/login.

## Environment Variables Configuration

The application requires several environment variables to function properly. Create a `.env.local` file in the root directory with the following variables:

```env
# Mistral AI API Key (required for AI features)
MISTRAL_API_KEY=your_mistral_api_key_here

# Email Configuration (required for sending emails)
EMAIL_HOST=smtp.your-email-provider.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password

# Node Environment
NODE_ENV=production
```

### Getting a Mistral AI API Key

1. Visit [Mistral AI Console](https://console.mistral.ai/)
2. Sign up for an account
3. Navigate to the API keys section
4. Create a new API key
5. Copy the key and add it to your environment variables

### Email Configuration

For Gmail:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_app_password
```

**Important**: For Gmail, you need to use an App Password, not your regular password:
1. Enable 2-Factor Authentication on your Google account
2. Go to your Google Account settings
3. Navigate to Security > App passwords
4. Generate a new app password
5. Use this app password as your EMAIL_PASS

For other email providers, check their SMTP settings documentation.

## Database Initialization

The application uses a file-based JSON database. On first run, it will automatically create the necessary files. However, you can manually initialize it by calling:

```bash
curl https://your-deployed-app.com/api/init-db
```

## Common Issues and Solutions

### 1. Internal Server Error on Signup/Login

This is typically caused by missing environment variables. Ensure all required variables are set:

- `MISTRAL_API_KEY`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`
- `NODE_ENV`

### 2. Email Sending Failures

If emails aren't being sent:
1. Verify your email credentials are correct
2. Check that you're using an App Password for Gmail
3. Ensure your email provider allows SMTP connections
4. Check spam/junk folders

### 3. Database Access Issues

If there are database-related errors:
1. Ensure the application has write permissions to the `data/` directory
2. Check that the `data/database.json` file exists and is writable
3. Manually initialize the database using the `/api/init-db` endpoint

## Deployment Platforms

### Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in the Vercel dashboard under "Settings > Environment Variables"
3. Deploy the application

### Netlify

1. Connect your GitHub repository to Netlify
2. Add environment variables in the Netlify dashboard under "Site settings > Build & deploy > Environment"
3. Set the build command to `next build` and publish directory to `.next`

### Docker

1. Build the Docker image:
   ```bash
   docker build -t tadashi-ai .
   ```

2. Run with environment variables:
   ```bash
   docker run -p 3000:3000 \
     -e MISTRAL_API_KEY=your_key \
     -e EMAIL_HOST=smtp.example.com \
     -e EMAIL_PORT=587 \
     -e EMAIL_USER=your_email \
     -e EMAIL_PASS=your_password \
     tadashi-ai
   ```

## Testing Your Deployment

After deployment, test the following endpoints:

1. **Database Initialization**: `GET /api/init-db`
2. **Environment Test**: `GET /api/test-env`
3. **Email Test**: `POST /api/test-email` with JSON body:
   ```json
   {
     "email": "test@example.com",
     "name": "Test User"
   }
   ```

## Troubleshooting

### Checking Logs

Most deployment platforms provide access to application logs. Check these logs for detailed error messages.

### Manual Testing

You can test API endpoints directly using curl:

```bash
# Test environment variables
curl https://your-app.com/api/test-env

# Initialize database
curl https://your-app.com/api/init-db

# Test email functionality
curl -X POST https://your-app.com/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

## Security Considerations

1. Never commit `.env.local` files to version control
2. Use strong, unique passwords for email accounts
3. Rotate API keys regularly
4. Use HTTPS in production
5. Implement proper rate limiting for API endpoints

## Support

If you continue to experience issues, please check the application logs for specific error messages and open an issue on GitHub with:
1. The error message
2. Steps to reproduce
3. Your environment configuration (without sensitive data)