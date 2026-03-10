# SKI-LIFTS FRONTEND WIDGET REFERENCE

## OVERVIEW
- **Application**: Ski-Lifts Chat Widget Frontend
- **Purpose**: Embeddable chat widget for ski transfer inquiries with AI backend
- **Key Features**: Location recommendations, AI conversation handling, session management, speech recognition, transfer options display
- **Technology Stack**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Critical Update**: Enhanced location recommendation system with improved UX (January 2025)

## QUICK START
```bash
git clone https://github.com/yourusername/nilgaib2b.git
cd nilgaib2b
npm install
cp .env.example .env
npm run dev  # Port 3001
```

## ENVIRONMENT VARIABLES
```
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

## WIDGET INTEGRATION

### Simple Integration
```html
<script src="https://chat.ski-lifts.com/widget.js"></script>
<div data-ski-lifts-chat="auto"></div>
```

### Advanced Integration
```html
<script src="https://chat.ski-lifts.com/widget.js"></script>
<script>
  window.SkiLiftsChat.init({
    position: 'bottom-right',
    initiallyMinimized: true,
    widgetUrl: 'https://chat.ski-lifts.com'
  });
</script>
```

## CORE COMPONENTS

| Component | Purpose | Location |
|-----------|---------|----------|
| `ChatWidget` | Main widget container | `src/components/ChatWidget.tsx` |
| `ChatPopup` | Popup with minimize/maximize | `src/components/ChatPopup.tsx` |
| `ChatInterface` | Main chat with AI integration | `src/components/ChatInterface.tsx` |
| `MessageList` | Message display | `src/components/MessageList.tsx` |
| `MessageInput` | Input with speech recognition | `src/components/MessageInput.tsx` |
| `TransferOption` | Transfer booking cards | `src/components/TransferOption.tsx` |
| `WelcomeSection` | Initial welcome screen | `src/components/WelcomeSection.tsx` |

## TYPESCRIPT INTERFACES

### Core Interfaces
```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  transferOption?: TransferOptionData;
}

interface TransferOptionData {
  image: string;
  title: string;
  badge: { text: string; type: 'eco' | 'premium' | 'budget' };
  feature: string;
  capacity: number;
  pricing: { total: string; perPerson?: string; isLimited?: boolean };
  buttonType: 'book' | 'enquire';
  onButtonClick: () => void;
}

interface ChatResponse {
  text: string;
  sessionId: string;
  error?: string;
}

interface LocationMatch {
  name: string;           // Standardized property name
  type: string;
  country: string;
  countryCode: string;
  skiLiftsId?: number;
  relevanceScore?: number;
}
```

## ENHANCED LOCATION RECOMMENDATION SYSTEM (January 2025)

### Problem Solved
- **Before**: Users asking "What locations support transfers to Chamonix?" got generic responses
- **After**: System provides specific categorized pickup location recommendations

### Frontend Implementation
```typescript
// Enhanced message handling for location-focused queries
const handleLocationQuery = async (message: string) => {
  const response = await sendMessageToGemini(messages, sessionId);
  
  // Frontend displays structured location recommendations
  if (response.locationRecommendations) {
    setLocationSuggestions(response.locationRecommendations);
  }
};

// Frontend location suggestion display
const LocationSuggestions: React.FC<{ suggestions: LocationMatch[] }> = ({ suggestions }) => {
  return (
    <div className="location-suggestions">
      {suggestions.map((location, index) => (
        <button
          key={index}
          onClick={() => handleLocationSelect(location)}
          className="location-suggestion-item"
        >
          {location.name} ({location.type})
        </button>
      ))}
    </div>
  );
};
```

## API INTEGRATION (Frontend Perspective)

### Backend Communication
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Message sending with session management
async function sendMessageToGemini(messages: ChatMessage[], sessionId?: string): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: getUserId(),
      message: messages[messages.length - 1].content,
      sessionId: sessionId,
      preferGemini: true
    }),
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
}

// Location normalization API call
async function normalizeLocation(name: string, type: string = 'any'): Promise<{
  found: boolean;
  normalized: string;
  matches: LocationMatch[];
}> {
  const response = await fetch(`${API_URL}/locations/normalize?name=${name}&type=${type}`);
  return response.json();
}
```

## SESSION MANAGEMENT (Frontend)

### Frontend Session Features
- **Conversation Persistence**: Chat history restored on widget initialization
- **Session Restoration**: Automatic loading of existing conversations
- **Local State Management**: React state synchronized with backend sessions
- **Session Continuity**: Conversations persist across browser sessions

### Frontend Implementation
```typescript
const [messages, setMessages] = useState<Message[]>([]);
const [sessionId, setSessionId] = useState<string | null>(null);
const [isInitialized, setIsInitialized] = useState(false);

// Load conversation history on component mount
useEffect(() => {
  const loadConversationHistory = async () => {
    try {
      const history = await getConversationHistory();
      if (history?.messages?.length > 0) {
        setMessages(history.messages);
        setSessionId(history.sessionId);
        setIsInitialized(true);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      setIsInitialized(true); // Continue with empty state
    }
  };
  
  loadConversationHistory();
}, []);

// Save messages to backend
const saveMessage = async (message: Message) => {
  try {
    await fetch(`${API_URL}/api/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        message,
        userId: getUserId()
      })
    });
  } catch (error) {
    console.error('Error saving message:', error);
  }
};
```

## SPEECH RECOGNITION (Frontend)

### Features
- **Continuous listening** with auto-stop on silence
- **Browser support detection** with graceful fallback
- **Permission handling** with user-friendly prompts
- **Error recovery** for network issues

### Implementation
```typescript
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const isSpeechSupported = !!SpeechRecognition;

const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!isSpeechSupported) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return { isListening, transcript, startListening, stopListening, isSupported: isSpeechSupported };
};
```

## FRONTEND ERROR HANDLING

### Error Boundaries
```typescript
class ChatErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Chat widget error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong with the chat widget.</h2>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### API Error Handling
```typescript
const handleApiError = (error: Error, context: string) => {
  console.error(`${context} error:`, error);
  
  // Show user-friendly error message
  const errorMessage = error.message.includes('Network') 
    ? 'Connection issue. Please try again.' 
    : 'Something went wrong. Please try again.';
    
  setMessages(prev => [...prev, {
    id: Date.now().toString(),
    role: 'assistant',
    content: errorMessage,
    timestamp: Date.now()
  }]);
};
```

## TRANSFER OPTIONS DISPLAY

### Frontend Component
```typescript
const TransferOption: React.FC<TransferOptionData> = ({
  image,
  title,
  badge,
  feature,
  capacity,
  pricing,
  buttonType,
  onButtonClick
}) => {
  return (
    <div className="transfer-option-card">
      <div className="transfer-option-header">
        <img src={image} alt={title} className="transfer-option-image" />
        <span className={`badge badge-${badge.type}`}>{badge.text}</span>
      </div>
      <div className="transfer-option-content">
        <h3>{title}</h3>
        <p>{feature}</p>
        <div className="capacity">Up to {capacity} passengers</div>
        <div className="pricing">
          <span className="total">{pricing.total}</span>
          {pricing.perPerson && <span className="per-person">{pricing.perPerson} per person</span>}
          {pricing.isLimited && <span className="limited-time">Limited time offer</span>}
        </div>
        <button 
          className={`action-button ${buttonType}`}
          onClick={onButtonClick}
        >
          {buttonType === 'book' ? 'Book Now' : 'Get Quote'}
        </button>
      </div>
    </div>
  );
};
```

## STYLING SYSTEM

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#F59E0B'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
```

### Key Style Classes
```css
/* Widget positioning */
.chat-widget {
  @apply fixed bottom-6 right-6 z-50 w-80 h-96 bg-white shadow-lg rounded-lg;
}

/* Message styling */
.message {
  @apply p-3 mb-2 rounded-lg max-w-xs;
}

.message-user {
  @apply bg-blue-500 text-white ml-auto;
}

.message-assistant {
  @apply bg-gray-100 text-gray-800 mr-auto;
}

/* Transfer option cards */
.transfer-option-card {
  @apply bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow;
}

/* Responsive design */
@media (max-width: 768px) {
  .chat-widget {
    @apply w-full h-full fixed inset-0 rounded-none;
  }
}
```

## BROWSER COMPATIBILITY

### Supported Browsers
- Chrome 49+, Firefox 52+, Safari 10+, Edge 16+, Opera 36+

### Feature Detection
```typescript
const browserSupport = {
  speechRecognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
  localStorage: typeof Storage !== 'undefined',
  webSockets: typeof WebSocket !== 'undefined',
  fetch: typeof fetch !== 'undefined'
};

// Graceful fallbacks
if (!browserSupport.speechRecognition) {
  console.warn('Speech recognition not supported in this browser');
}

if (!browserSupport.localStorage) {
  console.warn('Local storage not supported - session persistence disabled');
}
```

## DEPLOYMENT

### Build Process
```bash
npm run build    # Production build
npm run start    # Production server
npm run lint     # Code linting
npm run type-check # TypeScript checking
```

### Widget Distribution
```bash
# Build widget for distribution
npm run build:widget

# Generated files:
# - dist/widget/widget.js (standalone loader)
# - dist/widget/index.html (widget iframe)
# - dist/widget/example.html (integration example)
```

### Production Configuration
```javascript
// next.config.js
module.exports = {
  output: 'standalone',
  distDir: 'dist',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  }
};
```

## DEVELOPMENT WORKFLOW

### Local Development
```bash
npm run dev          # Development server (localhost:3001)
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # TypeScript checking
```

### Code Quality
```bash
# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check

# Testing
npm run test
npm run test:watch
npm run test:coverage
```

## TROUBLESHOOTING

### Common Frontend Issues

#### Widget Not Loading
```javascript
// Check if widget script loaded
if (typeof window.SkiLiftsChat === 'undefined') {
  console.error('Widget script not loaded - check script URL');
}

// Check API connectivity
fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`)
  .then(response => console.log('API accessible:', response.ok))
  .catch(error => console.error('API connection failed:', error));
```

#### Speech Recognition Issues
```javascript
// Check browser support
if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
  console.warn('Speech recognition not supported in this browser');
}

// Check microphone permissions
navigator.permissions.query({name: 'microphone'})
  .then(result => console.log('Microphone permission:', result.state));
```

#### Session Management Issues
```javascript
// Check session storage
const sessionData = localStorage.getItem('ski-lifts-session');
if (!sessionData) {
  console.log('No existing session found');
}

// Verify session ID format
const isValidSessionId = sessionId && sessionId.length > 0;
console.log('Valid session ID:', isValidSessionId);
```

## IMPLEMENTATION CHECKLIST

### Setup
- [ ] Clone repository and install dependencies
- [ ] Configure environment variables
- [ ] Set up development server
- [ ] Verify API connectivity

### Integration
- [ ] Add widget script to target website
- [ ] Configure widget positioning and styling
- [ ] Test location recommendation display
- [ ] Verify session persistence

### Production
- [ ] Build production bundle
- [ ] Deploy to CDN
- [ ] Configure HTTPS and security headers
- [ ] Test cross-browser compatibility

### Quality Assurance
- [ ] Test location recommendation system
- [ ] Verify speech recognition functionality
- [ ] Test responsive design on mobile
- [ ] Accessibility audit (WCAG compliance)
- [ ] Performance optimization

## RECENT UPDATES (January 2025)

### Enhanced Location Recommendation System
- **Improved UX**: Users get specific location recommendations instead of generic questions
- **Better Error Handling**: Standardized data structure prevents property access errors
- **Consistent Interface**: All location objects use standardized `name` property
- **Enhanced Display**: Structured location suggestions with clear categorization

### Bug Fixes
- **Fixed**: `TypeError: Cannot read properties of undefined (reading 'toLowerCase')`
- **Resolved**: Data structure inconsistencies between frontend and backend
- **Improved**: Error boundary handling for better user experience

### Performance Improvements
- **Optimized**: Component re-rendering with better state management
- **Enhanced**: API call efficiency with proper error handling
- **Improved**: Widget loading performance with code splitting 