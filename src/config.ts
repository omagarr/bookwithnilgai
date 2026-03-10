/**
 * Central configuration file for the chat widget
 * 
 * ONLY UPDATE THESE TWO VARIABLES WHEN DEPLOYING TO PRODUCTION:
 * - widgetUrl: URL of the widget frontend 
 * - apiUrl: URL of the backend API
 */

// CHANGE THESE TWO VARIABLES WHEN DEPLOYING
const PRODUCTION = {
  widgetUrl: 'https://ski-lifts.nilgai.travel',
  apiUrl: 'https://apib2b.nilgai.travel'
};

// Staging URLs
const STAGING = {
  widgetUrl: 'https://stagingb2b.nilgai.travel',
  apiUrl: 'https://stagingapib2b.nilgai.travel'
};

// Local development URLs (don't change these)
const DEVELOPMENT = {
  widgetUrl: 'http://localhost:3001',
  apiUrl: 'http://localhost:3000'
};

// Function to determine environment
function getEnvironment() {
  // Check if window is defined (client-side)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Check for staging domain
    if (hostname === 'stagingb2b.nilgai.travel') {
      return 'staging';
    }
    
    // Check for production domains
    if (hostname === 'ski-lifts.nilgai.travel' || hostname === 'b2b.nilgai.travel') {
      return 'production';
    }
    
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'development';
    }
  }
  
  // Fall back to NODE_ENV check
  if (process.env.NODE_ENV === 'production') {
    // Check for staging-specific env var
    if (process.env.NEXT_PUBLIC_ENV === 'staging') {
      return 'staging';
    }
    return 'production';
  }
  
  return 'development';
}

// Get the appropriate config based on environment
function getConfig() {
  const env = getEnvironment();
  let baseConfig;
  
  switch(env) {
    case 'production':
      baseConfig = PRODUCTION;
      break;
    case 'staging':
      baseConfig = STAGING;
      break;
    default:
      baseConfig = DEVELOPMENT;
  }
  
  return baseConfig;
}

// Environment-aware configuration
const config = {
  // Use environment variables if set, otherwise use the defaults above
  widgetUrl: process.env.NEXT_PUBLIC_WIDGET_URL || getConfig().widgetUrl,
  
  apiUrl: process.env.NEXT_PUBLIC_API_URL || getConfig().apiUrl,
  
  // Other settings
  defaultPosition: 'bottom-right' as const,
  initiallyMinimized: true,
  containerId: 'ski-lifts-chat-widget-container'
};

export default config; 