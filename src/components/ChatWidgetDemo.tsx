import React from 'react';
import ChatWidget from './ChatWidget';

const ChatWidgetDemo: React.FC = () => {
  return (
    <div>
      {/* The chat widget can be placed anywhere in your application */}
      <ChatWidget 
        position="bottom-right" 
        initialMinimized={true}
      />
    </div>
  );
};

export default ChatWidgetDemo; 