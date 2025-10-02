'use client';

import { useEffect } from 'react';

interface ChatWidgetConfig {
  token: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'light' | 'dark';
  width?: string;
  height?: string;
  autoOpen?: boolean;
  showNotification?: boolean;
}

interface ChatWidgetAPI {
  init: (config: ChatWidgetConfig) => void;
}

declare global {
  interface Window {
    ChatWidget?: ChatWidgetAPI;
  }
}

interface ChatWidgetProps {
  config: ChatWidgetConfig;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ config }) => {
  useEffect(() => {
    // Function to initialize the chat widget
    const initializeChatWidget = () => {
      try {
        if (window.ChatWidget) {
          window.ChatWidget.init(config);
          console.log(`✅ Chat widget initialized for ${config.token} token`);
        } else {
          console.warn('⚠️ ChatWidget not available on window');
        }
      } catch (error) {
        console.error('❌ Error initializing chat widget:', error);
      }
    };

    // Check if the script is already loaded
    if (window.ChatWidget) {
      initializeChatWidget();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://cdn-agent.up.railway.app/chat-widget-cdn.js';
    script.async = true;

    // Handle script load
    script.onload = () => {
      // Wait a bit for the ChatWidget to be available
      setTimeout(initializeChatWidget, 100);
    };

    script.onerror = () => {
      console.error('❌ Failed to load chat widget script');
    };

    // Append script to document
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Remove script if component unmounts
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [config]);

  return <div id="chat-widget" />;
};

export default ChatWidget;
