// Global type declarations

interface DebugChatWidget {
  logs: Array<{time: string, message: string}>;
  log: (message: string) => void;
  getEnvironment: () => {
    url: string;
    hostname: string;
    pathname: string;
    search: string;
    userAgent: string;
  };
}

declare global {
  interface Window {
    debugChatWidget?: DebugChatWidget;
    __CHAT_WIDGET_CONFIG?: Record<string, any>;
    SkiLiftsChat?: any;
  }
}

export {}; 