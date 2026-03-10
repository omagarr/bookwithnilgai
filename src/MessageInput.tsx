'use client';

import { useState, useRef, useEffect } from 'react';
import { Paperclip, Send, Mic } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string, attachments?: File[]) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Force scroll to bottom on any content change
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [message]);

  // Set up continuous scroll check
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const checkScroll = () => {
      container.scrollTop = container.scrollHeight;
    };

    // Check scroll position frequently
    const interval = setInterval(checkScroll, 100);
    
    // Also check on any DOM changes
    const observer = new MutationObserver(checkScroll);
    observer.observe(container, { 
      childList: true, 
      subtree: true, 
      characterData: true 
    });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message, attachments);
      setMessage('');
      setAttachments([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  return (
    <div className="flex-shrink-0 bg-gradient-to-t from-white via-white to-transparent pt-6 pb-4 px-4">
      <div className="max-w-[650px] mx-auto">
        <div className="flex flex-col gap-3">
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Choose files</span>
                <span className="text-sm text-gray-500">No file chosen</span>
              </div>
            </div>
          )}
          
          <div className="relative">
            <div className="absolute left-2 bottom-2 flex items-center gap-2 z-10">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Paperclip className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Mic className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div 
                ref={containerRef}
                className="relative min-h-[60px] max-h-[150px] overflow-y-auto"
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <textarea
                  value={message}
                  onChange={handleInput}
                  placeholder="Message AI Assistant..."
                  className="w-full pl-24 pr-16 py-4 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-gray-300 shadow-[0_0_10px_rgba(0,0,0,0.05)] resize-none"
                  style={{ minHeight: '60px', maxHeight: '150px' }}
                  spellCheck={false}
                />
              </div>
              
              <button
                type="submit"
                className="absolute right-2 bottom-2 p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
                disabled={!message.trim() && attachments.length === 0}
              >
                <Send className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </form>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 