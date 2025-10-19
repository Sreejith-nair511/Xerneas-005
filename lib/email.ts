import nodemailer from 'nodemailer';

// Create a transporter using SMTP
const createTransport = () => {
  // Check if required environment variables exist
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Missing required email configuration environment variables');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    // Skip email sending in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] Sending welcome email to ${name} (${email})`);
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { 
        success: true, 
        message: 'Welcome email sent successfully (simulated in dev)',
        status: 'success'
      };
    }

    // Check if email configuration exists
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email configuration missing. Skipping email send.');
      return { 
        success: true, 
        message: 'Email configuration not set. Email skipped in production.',
        status: 'warning'
      };
    }

    const transporter = createTransport();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Tadashi AI - Your Personal Healthcare Companion',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3b82f6; text-align: center;">Welcome to Tadashi AI!</h1>
          <p>Dear ${name},</p>
          <p>Welcome to Tadashi AI, your personal healthcare companion. We're excited to have you on board!</p>
          <p>Tadashi AI is designed to help you monitor your health, provide wellness tips, and offer personalized health recommendations.</p>
          <p>Here's what you can do with Tadashi AI:</p>
          <ul>
            <li>Chat with our AI healthcare companion</li>
            <li>Track your health metrics</li>
            <li>Get personalized health recommendations</li>
            <li>Access Text-to-Speech and Speech-to-Text features (Premium)</li>
            <li>Complete AI-powered health assessments</li>
          </ul>
          <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
          <p>Best regards,<br>The Tadashi AI Team</p>
          <hr>
          <p style="font-size: 12px; color: #666;">This is an automated email. Please do not reply.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    
    return { 
      success: true, 
      message: 'Welcome email sent successfully',
      status: 'success',
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // In production, we don't want to fail the entire operation if email fails
    if (process.env.NODE_ENV === 'production') {
      console.warn('Email sending failed in production, but continuing with operation');
      return { 
        success: true, 
        message: 'User created successfully (email delivery failed)',
        status: 'warning'
      };
    }
    return { 
      success: false, 
      message: 'Failed to send welcome email',
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    };
  }
};

export const sendPremiumUpgradeEmail = async (email: string, name: string) => {
  try {
    // Skip email sending in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] Sending premium upgrade email to ${name} (${email})`);
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { 
        success: true, 
        message: 'Premium upgrade email sent successfully (simulated in dev)',
        status: 'success'
      };
    }

    // Check if email configuration exists
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email configuration missing. Skipping email send.');
      return { 
        success: true, 
        message: 'Email configuration not set. Email skipped in production.',
        status: 'warning'
      };
    }

    const transporter = createTransport();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Tadashi AI Premium - Upgrade Successful!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3b82f6; text-align: center;">Premium Upgrade Successful!</h1>
          <p>Dear ${name},</p>
          <p>Congratulations! Your Tadashi AI account has been successfully upgraded to Premium.</p>
          <p>As a Premium member, you now have access to exclusive features including:</p>
          <ul>
            <li>Unlimited chat with Tadashi AI</li>
            <li>Advanced health monitoring</li>
            <li>Personalized health recommendations</li>
            <li>Text-to-Speech (TTS) capabilities</li>
            <li>Speech-to-Text (STT) capabilities</li>
            <li>AI-powered health check assessments</li>
            <li>Priority health advice</li>
            <li>24/7 healthcare support</li>
          </ul>
          <p>Your Premium subscription is active immediately. Enjoy your enhanced healthcare experience!</p>
          <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
          <p>Best regards,<br>The Tadashi AI Team</p>
          <hr>
          <p style="font-size: 12px; color: #666;">This is an automated email. Please do not reply.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Premium upgrade email sent:', info.messageId);
    
    return { 
      success: true, 
      message: 'Premium upgrade email sent successfully',
      status: 'success',
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Error sending premium upgrade email:', error);
    // In production, we don't want to fail the entire operation if email fails
    if (process.env.NODE_ENV === 'production') {
      console.warn('Email sending failed in production, but continuing with operation');
      return { 
        success: true, 
        message: 'Premium upgrade successful (email delivery failed)',
        status: 'warning'
      };
    }
    return { 
      success: false, 
      message: 'Failed to send premium upgrade email',
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    };
  }
};