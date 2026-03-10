import React, { useState } from 'react';
import ChatPopup from '../ChatPopup';

export interface ChatWidgetProps {
  // Optional props that can be passed to customize the widget
  initialMinimized?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  initialMinimized = true,
  position = 'bottom-right',
}) => {
  // Component state is fully contained within the widget
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  // Generate positioning classes based on position prop
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-6 right-6';
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      default:
        return 'bottom-6 right-6';
    }
  };

  return (
    <div 
      className={`fixed ${getPositionClasses()} z-50`}
    >
      <ChatPopup initialMinimized={initialMinimized} position={position} />
    </div>
  );
};

export default ChatWidget; 