import { Message } from '@/types/chat';
import { User, Bot } from 'lucide-react';
import { parseMarkdown } from '@/utils/markdown';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="h-full overflow-y-auto px-4 py-4 space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-start gap-3 ${
            message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
          }`}
        >
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.role === 'assistant' ? 'bg-gray-100' : 'bg-blue-100'
            }`}
          >
            {message.role === 'assistant' ? (
              <Bot className="w-5 h-5 text-gray-600" />
            ) : (
              <User className="w-5 h-5 text-blue-600" />
            )}
          </div>
          
          <div
            className={`flex flex-col space-y-2 max-w-[80%] ${
              message.role === 'assistant' ? 'items-start' : 'items-end'
            }`}
          >
            <div className="bg-white p-3 rounded-2xl shadow-sm">
              {parseMarkdown(message.content)}
            </div>
            
            {message.attachments && message.attachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {message.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg"
                  >
                    {file.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
            <Bot className="w-5 h-5 text-gray-600" />
          </div>
          <div className="bg-white p-3 rounded-2xl shadow-sm">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 