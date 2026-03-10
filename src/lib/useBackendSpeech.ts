import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import config from '../config';

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  [index: number]: {
    isFinal: boolean;
    [index: number]: {
      transcript: string;
      confidence: number;
    };
  };
  length: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface BackendSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

// Global socket instance to prevent multiple connections
let globalSocket: Socket | null = null;
let globalConnectionPromise: Promise<Socket> | null = null;
let hookInstanceCount = 0;

export function useBackendSpeech(): {
  recognition: BackendSpeechRecognition | null;
  isSupported: boolean;
} {
  // Removed initialization logging
  hookInstanceCount++;
  
  const [isSupported, setIsSupported] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isRecordingRef = useRef(false);
  const resultIndexRef = useRef(0);
  const instanceIdRef = useRef(Math.random().toString(36).substring(7));
  const stopRecordingRef = useRef<(() => void) | null>(null);

  // Recognition object that mimics browser SpeechRecognition API
  const recognitionRef = useRef<BackendSpeechRecognition>({
    continuous: true,
    interimResults: true,
    lang: 'en-US',
    onresult: null,
    onerror: null,
    onend: null,
    start: () => {},
    stop: () => {},
  });

  const connectSocket = useCallback(() => {
    if (globalSocket?.connected) {
      // Removed debugging console.log
      socketRef.current = globalSocket;
      return Promise.resolve(globalSocket);
    }

    if (globalConnectionPromise) {
      // Removed debugging console.log
      return globalConnectionPromise.then(() => {
        socketRef.current = globalSocket;
        return globalSocket!;
      });
    }

    // Removed debugging console.log
    
    globalConnectionPromise = new Promise((resolve, reject) => {
      const socket = io(`${config.apiUrl}/speech`, {
        transports: ['websocket'],
        autoConnect: false,
      });

      socket.on('connect', () => {
        // Removed debugging console.log
        globalSocket = socket;
        socketRef.current = socket;
        globalConnectionPromise = null;
        resolve(socket);
      });

      socket.on('connect_error', (error) => {
        console.error('❌ Connection error:', error);
        globalConnectionPromise = null;
        reject(error);
      });

      socket.on('disconnect', (reason) => {
        // Removed debugging console.log
        console.warn('🔌 Socket disconnected:', reason);
        globalSocket = null;
        globalConnectionPromise = null;
        stopRecordingRef.current?.();
      });

      socket.on('speechResult', (data: { transcript: string; isFinal: boolean; confidence: number }) => {
        // Removed debugging console.log
        if (recognitionRef.current.onresult) {
          // Create proper results structure that matches browser SpeechRecognition API
          const results: any = {
            [resultIndexRef.current]: {
              isFinal: data.isFinal,
              [0]: {
                transcript: data.transcript,
                confidence: data.confidence,
              },
            },
            length: resultIndexRef.current + 1,
          };

          const event: SpeechRecognitionEvent = {
            results: results as SpeechRecognitionResultList,
            resultIndex: resultIndexRef.current,
          };

          recognitionRef.current.onresult(event);

          if (data.isFinal) {
            resultIndexRef.current++;
          }
        }
      });

      socket.on('speechError', (data: { error: string }) => {
        console.error('🔥 Speech recognition error:', data.error);
        if (recognitionRef.current.onerror) {
          recognitionRef.current.onerror({ error: data.error });
        }
        stopRecordingRef.current?.();
      });

      socket.on('speechStarted', () => {
        console.log('✅ Speech recognition started on backend');
      });

      socket.on('speechStopped', () => {
        console.log('⏹️ Speech recognition stopped on backend');
        if (recognitionRef.current.onend) {
          recognitionRef.current.onend();
        }
      });

      // Removed debugging console.log
      socket.connect();
    });

    return globalConnectionPromise.then(() => {
      socketRef.current = globalSocket;
      return globalSocket!;
    });
  }, []);

  const stopRecording = useCallback(() => {
    if (!isRecordingRef.current) {
      return;
    }

    // Removed debugging console.log
    isRecordingRef.current = false;

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    // Stop all tracks to release microphone
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Stop backend speech recognition
    if (socketRef.current?.connected) {
      socketRef.current.emit('stopSpeech');
    }

    mediaRecorderRef.current = null;
  }, []);

  const startRecording = useCallback(async () => {
    // Removed debugging console.log
    
    if (isRecordingRef.current) {
      console.warn('Already recording');
      return;
    }

    // Check if we're in a secure context (required for microphone access)
    if (!window.isSecureContext && window.location.protocol !== 'http:') {
      if (recognitionRef.current.onerror) {
        recognitionRef.current.onerror({ 
          error: 'Microphone access requires a secure connection (HTTPS)' 
        });
      }
      return;
    }

    // Check for supported MIME types and use fallback if needed
    let mimeType = 'audio/webm;codecs=opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      // Try alternative formats
      const alternatives = [
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
        'audio/wav'
      ];
      
      mimeType = alternatives.find(type => MediaRecorder.isTypeSupported(type)) || '';
      
      if (!mimeType) {
        if (recognitionRef.current.onerror) {
          recognitionRef.current.onerror({ 
            error: 'No supported audio format found for recording' 
          });
        }
        return;
      }
      
      console.warn(`Using fallback audio format: ${mimeType}`);
    }

    try {
      // Removed debugging console.log
      // Connect to backend first
      const socket = await connectSocket();

      if (!socket) {
        throw new Error('Failed to connect to speech service');
      }

      // Removed debugging console.log
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 48000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // Removed debugging console.log
      streamRef.current = stream;
      resultIndexRef.current = 0;

      // Start backend speech recognition
      // Removed debugging console.log
      socket.emit('startSpeech', { audioFormat: mimeType });

      // Set up MediaRecorder to capture audio
      // Removed debugging console.log
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: mimeType,
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0 && socket?.connected) {
          // Removed debugging console.log
          // Convert audio blob to base64 and send to backend
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = (reader.result as string).split(',')[1];
            socket?.emit('audioData', { audio: base64data });
          };
          reader.readAsDataURL(event.data);
        }
      };

      mediaRecorderRef.current.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        if (recognitionRef.current.onerror) {
          recognitionRef.current.onerror({ error: 'Recording error' });
        }
        stopRecording();
      };

      mediaRecorderRef.current.onstop = () => {
        console.log('MediaRecorder stopped');
      };

      mediaRecorderRef.current.onstart = () => {
        console.log('MediaRecorder started successfully');
      };

      // Start recording with small chunks for real-time processing
      // Removed debugging console.log
      mediaRecorderRef.current.start(100); // 100ms chunks
      isRecordingRef.current = true;
      // Removed debugging console.log

    } catch (error) {
      console.error('❌ Error starting speech recognition:', error);
      if (recognitionRef.current.onerror) {
        // Check if we're in an iframe context
        const isIframe = window.self !== window.top;
        let errorMessage = error instanceof Error ? error.message : 'Failed to start recording';
        
        if (isIframe && (errorMessage.includes('Permission denied') || errorMessage.includes('not-allowed'))) {
          errorMessage = 'Microphone access denied. If you\'re seeing this in an embedded widget, the hosting website needs to allow microphone permissions. You can also try using the widget on our main site.';
        }
        
        recognitionRef.current.onerror({ 
          error: errorMessage
        });
      }
    }
  }, [connectSocket, stopRecording]);

  const disconnectSocket = useCallback(() => {
    stopRecording();
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, [stopRecording]);

  // Set up the recognition object methods
  useEffect(() => {
    // Removed debugging console.log
    recognitionRef.current.start = startRecording;
    recognitionRef.current.stop = stopRecording;
  }, [startRecording, stopRecording]);

  // Check if speech recognition is supported (always true for our backend implementation)
  useEffect(() => {
    // Removed debugging console.log
    setIsSupported(true);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, [disconnectSocket]);

  // Update the ref whenever stopRecording changes
  useEffect(() => {
    stopRecordingRef.current = stopRecording;
  }, [stopRecording]);

  return {
    recognition: recognitionRef.current,
    isSupported,
  };
} 