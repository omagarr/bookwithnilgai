'use client';

import { useEffect, useRef, useState } from 'react';

// Use browser's native SpeechRecognition API
// Same interface as useBackendSpeech so WelcomeSection works identically
export function useBrowserSpeech(): {
  recognition: any;
  isSupported: boolean;
} {
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      setIsSupported(true);
    } else {
      setIsSupported(false);
    }
  }, []);

  return {
    recognition: recognitionRef.current,
    isSupported,
  };
}
