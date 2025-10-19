// Environment variable validation utility
export const validateEnvironment = () => {
  const errors: string[] = [];
  
  // Check required environment variables
  if (!process.env.MISTRAL_API_KEY) {
    errors.push('MISTRAL_API_KEY is missing');
  }
  
  // For email configuration, only validate if we're not in development
  if (process.env.NODE_ENV !== 'development') {
    if (!process.env.EMAIL_HOST) {
      errors.push('EMAIL_HOST is missing');
    }
    
    if (!process.env.EMAIL_PORT) {
      errors.push('EMAIL_PORT is missing');
    }
    
    if (!process.env.EMAIL_USER) {
      errors.push('EMAIL_USER is missing');
    }
    
    if (!process.env.EMAIL_PASS) {
      errors.push('EMAIL_PASS is missing');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Helper function to get environment variables with fallbacks
export const getEnvVar = (name: string, fallback?: string): string | undefined => {
  const value = process.env[name];
  if (!value && fallback) {
    return fallback;
  }
  return value;
};