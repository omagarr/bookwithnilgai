# Frontend SSE Migration Checklist

## Phase 1: Dependencies
```bash
cd nilgaib2b
```
- [ ] No new dependencies needed (EventSource is native)

## Phase 2: Chat Service Refactor
```typescript
// src/services/chat.service.ts
```
- [ ] Create `streamMessage()` method using EventSource
- [ ] Add connection management (open, close, error)
- [ ] Handle message chunks incrementally
- [ ] Add retry logic with exponential backoff
- [ ] Implement abort controller for cancellation
- [ ] Keep existing `sendMessage()` as fallback

## Phase 3: Update Chat Components
```typescript
// src/components/ChatWidget.tsx or equivalent
```
- [ ] Add `isStreaming` state
- [ ] Add `partialMessage` state for chunks
- [ ] Update message rendering logic
- [ ] Add typing indicator component
- [ ] Handle stream start/end events
- [ ] Update error boundaries

## Phase 4: SSE Implementation
```typescript
// New: src/services/sse-client.ts
```
- [ ] Create SSE client class
- [ ] Handle reconnection logic
- [ ] Parse server-sent events
- [ ] Queue messages during disconnection
- [ ] Implement heartbeat mechanism

## Phase 5: State Management Updates
- [ ] Update message store/context
- [ ] Add streaming message state
- [ ] Handle partial message updates
- [ ] Manage connection status
- [ ] Update optimistic UI updates

## Phase 6: UI/UX Enhancements
- [ ] Add smooth text animation for streaming
- [ ] Show connection status indicator
- [ ] Add "Stop generating" button
- [ ] Implement message retry UI
- [ ] Add network error toast

## Phase 7: Testing
- [ ] Test connection interruptions
- [ ] Test long message streaming
- [ ] Test concurrent messages
- [ ] Test mobile browser compatibility
- [ ] Test with slow connections

## Phase 8: Cleanup
- [ ] Remove old axios polling logic (if any)
- [ ] Remove unused message queueing
- [ ] Update TypeScript types
- [ ] Clean up console logs

## Success Criteria
- [ ] Messages stream word-by-word
- [ ] No message loss on reconnection
- [ ] Smooth UI with no flicker
- [ ] < 100ms latency for first byte
- [ ] Graceful error handling

---
**Linked to:** LANGCHAIN_MIGRATION_CHECKLIST.md Phase 8
