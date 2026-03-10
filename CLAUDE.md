# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
- `npm run dev` - Start development server on port 3001 with hot reload
- `npm run build` - Build the Next.js application for production
- `npm run start` - Start production server on port 3001
- `npm run lint` - Lint TypeScript files with ESLint

### Docker
- `npm run dev:docker` - Build and run in Docker locally

### Testing
- No testing framework is currently configured in this repository

## Architecture Overview

### Core Technology Stack
- **Framework**: Next.js 14.1.0 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS with CSS Modules for component isolation
- **Icons**: Heroicons and Lucide React
- **Real-time**: Socket.IO client for speech-to-text WebSocket communication
- **State Management**: React hooks (useState, useEffect, useCallback) + localStorage for persistence

### Application Structure
This is a chat widget frontend for a ski transfer booking system. It supports three deployment modes:

1. **Floating Widget** - Injected via `public/widget.js` script tag, runs in an iframe
2. **Embedded Chat** - Full-page embed at `/embed` route
3. **Home Page** - Landing page at `/` with integrated chat

All components use `'use client'` directive - this is a client-side rendered application.

### Routing (Next.js App Router)
- `/` - Home page with chat integration (`app/page.tsx`)
- `/embed` - Embeddable chat interface (`app/embed/page.tsx`)
- `/docs` - Widget/embed integration documentation (`app/docs/page.tsx`)
- `/api/health` - Health check endpoint (`app/api/health/`)

### Key Components

**Chat Core** (`src/`):
- `ChatInterface.tsx` - Main chat UI: message history, voice input, transfer option rendering, message streaming
- `ChatPopup.tsx` - Minimizable/maximizable popup wrapper with state persistence
- `ChatWidget.tsx` - Widget container component
- `ChatEmbed.tsx` - Embedded chat variant
- `WelcomeSection.tsx` - Welcome screen UI
- `TransferOption.tsx` - Transfer booking option cards with pricing

**Shared Components** (`src/components/`):
- `MessageInput.tsx` - Message input with file upload support
- `MessageList.tsx` - Chat message display
- `LoadingSpinner.tsx` - Loading states
- `BadgesSection.tsx` - UI badges
- `TrustpilotWidget.tsx` - Trustpilot integration
- `SkeletonLayout.tsx` - Skeleton loading states

**API & Utilities** (`src/lib/`):
- `api.ts` - Backend API communication, message handling, session management
- `useBackendSpeech.ts` - Speech-to-text integration hook via WebSocket
- `chat/responses.ts` - Fallback responses

**Configuration** (`src/`):
- `config.ts` - Environment detection (local/staging/production), API URL management

**Types** (`src/types/`):
- `chat.ts` - Chat message interfaces and types
- `global.d.ts` - Global type declarations

**Utilities** (`src/utils/`):
- `markdown.tsx` - Markdown-like parsing for chat messages (URLs, emails, bold text)

### Widget Integration
- `public/widget.js` - Standalone script for third-party websites to embed the chat widget
- `public/embed.js` - Embed loader script
- `public/examples/` - HTML integration examples (widget, embed, combined)
- Uses `postMessage` API for cross-origin communication between parent page and iframe

### Environment Configuration
- `NEXT_PUBLIC_API_URL` - Backend API URL (the only required env variable)
  - Local: `http://localhost:3000`
  - Staging: `https://stagingapib2b.nilgai.travel`
  - Production: `https://apib2b.nilgai.travel`

Environment files: `.env.local`, `.env.staging`, `.env.production`, `.env.example`

### Key Patterns
- **No server-side rendering** of interactive components - all use `'use client'`
- **Dynamic imports** with Suspense boundaries for code splitting
- **localStorage** for user state persistence (minimized state, user IDs, chat history)
- **Props-based data flow** - no Redux/Zustand/Context for state management
- **Debug mode** available via `window.debugChatWidget`

### Deployment
- AWS Elastic Beanstalk (`.ebextensions/` config)
- Docker-ready (`Dockerfile.frontend`)
- GitHub Actions CI/CD (`.github/workflows/`)

### Code Style
- ESLint with Next.js recommended rules
- Tailwind CSS utility-first approach
- Functional React components with hooks
