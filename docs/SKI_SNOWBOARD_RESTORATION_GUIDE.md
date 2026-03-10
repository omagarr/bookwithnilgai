# Ski/Snowboard Functionality Restoration Guide

This document provides step-by-step instructions for restoring ski/snowboard functionality when SkiLifts bookingUrl supports ski/snowboard parameters.

## Overview
The ski/snowboard functionality has been temporarily hidden from both frontend and backend to prevent issues with SkiLifts bookingUrl not supporting these parameters. All code remains in place but is disabled through comments and default values.

## Frontend Restoration (nilgaib2b)

### 1. TransferOption Component (`src/TransferOption.tsx`)
**File**: `src/TransferOption.tsx`  
**Lines**: 65-72  
**Action**: Uncomment the ski/snowboard display section

```tsx
// RESTORE: Uncomment this section
<div className="flex items-center text-[11px] text-gray-500">
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-0.5">
    <path d="M5 18L17 6"></path>
    <path d="M11 18L23 6"></path>
  </svg>
  {skis_snowboards}
</div>
```

### 2. Type Definitions (`src/types/chat.ts`)
**File**: `src/types/chat.ts`  
**Line**: 18  
**Action**: Remove the HIDDEN comment

```typescript
// BEFORE:
skis_snowboards: number; // HIDDEN: Currently not displayed in UI - TODO: Remove when bookingUrl supports ski/snowboard parameters

// AFTER:
skis_snowboards: number;
```

### 3. ChatInterface Component (`src/ChatInterface.tsx`)
**File**: `src/ChatInterface.tsx`  
**Lines**: Multiple instances (135, 320, 369, 498, 803, 886, 935)  
**Action**: Replace hardcoded 0 values with actual data

```typescript
// BEFORE:
skis_snowboards: 0, // HIDDEN: option.actualSkisSnowboards || 0,

// AFTER:
skis_snowboards: option.actualSkisSnowboards || 0,
```

**Specifically update these instances:**
- Line 135: `convertBackendOptionToFrontend` function
- Line 320: First transfer options rendering
- Line 369: Second transfer options rendering  
- Line 498: Quote restoration
- Line 803: Follow-up message handling
- Line 886: Regular message processing
- Line 935: Final transfer options rendering

## Backend Restoration (nilgaib2bbackend)

### 1. AI Service (`src/modules/chat/services/ai.service.ts`)

#### System Prompt Updates
**Lines**: 214-216  
**Action**: Add ski/snowboard back to required fields and template

```typescript
// RESTORE to:
- MUST include: pickup location, destination, full dates with year, passenger count, children count, luggage count, ski/snowboard count, flight times, journey type
- REQUIRED TEMPLATE: "Perfect! Let me confirm: [pickup] to [destination] from [date] to [returnDate], [adults] adults, [children] children, [luggage] pieces of luggage, [skis_snowboards] ski/snowboard pairs, [flightTime] flight times, [journeyType] trip. Should I check what's available?"
```

#### Confirmation Summaries
**Line**: 283  
**Action**: Restore ski/snowboard instruction

```typescript
// RESTORE:
- ALWAYS include ski/snowboard count in confirmation summaries (defaults to 0 unless user changes it)
```

#### Example Confirmation
**Line**: 302  
**Action**: Add ski/snowboard pairs back to example

```typescript
// RESTORE to:
✅ AI: "Perfect! Let me confirm: Geneva Airport to Chamonix from April 15th to 19th, 2025, 4 adults, 0 children, 4 pieces of luggage, 0 ski/snowboard pairs, 10:00 AM arrival and 3:00 PM departure flights, return trip. Should I check what's available?"
```

#### Booking Context Display
**Line**: 470  
**Action**: Show actual ski/snowboard count

```typescript
// RESTORE to:
- Ski/Snowboard pairs: ${data.skis_snowboards || 0}
```

#### Transfer Options Message
**Lines**: 678, 682, 688  
**Action**: Include ski/snowboard in prompts

```typescript
// RESTORE:
- Ski/Snowboard pairs: ${skis_snowboards}

// And restore in instructions:
2. BRIEFLY summarize the key booking details: route, dates, passengers, luggage, ski/snowboard pairs

// And in example format:
"Excellent! I found [X] transfer options for [route] [dates], [passengers], [luggage] pieces of luggage, [skis_snowboards] ski/snowboard pairs. [family suggestion if applicable] Here are your choices:"
```

**Also restore the variable declaration:**
```typescript
// Add back:
const skis_snowboards = bookingData?.skis_snowboards || 0;
```

### 2. SkiLifts API Service (`src/modules/chat/services/skilifts-api.service.ts`)

#### API Request Parameters
**Lines**: 80, 105  
**Action**: Uncomment skis_snowboards parameters

```typescript
// RESTORE both instances:
skis_snowboards: bookingData.skis_snowboards || 0,
```

#### Frontend Display Data
**Line**: 362  
**Action**: Uncomment actualSkisSnowboards field

```typescript
// RESTORE:
actualSkisSnowboards: bookingData?.skis_snowboards || 0, // Include ski/snowboard count for frontend display
```

### 3. Quote Service (`src/modules/chat/services/quote.service.ts`)

#### Quote Creation
**Lines**: 35, 66, 113  
**Action**: Uncomment all ski/snowboard references

```typescript
// RESTORE in createOrUpdateQuote:
skis_snowboards: bookingData.skis_snowboards || 0, // Include ski/snowboard count

// RESTORE in update section:
skis_snowboards: bookingData.skis_snowboards !== undefined ? bookingData.skis_snowboards : 0, // Include ski/snowboard count

// RESTORE in inheritFromPreviousQuote:
skis_snowboards: newBookingData.skis_snowboards !== undefined ? newBookingData.skis_snowboards : activeQuote.bookingData.skis_snowboards,
```

### 4. Booking Data Service (`src/modules/chat/services/booking-data.service.ts`)

#### AI Extraction Instructions
**Lines**: 101, 211  
**Action**: Restore full ski/snowboard extraction instructions

```typescript
// RESTORE full instruction:
"skis_snowboards": "number - Extract when mentioned in ANY form (e.g., '3 ski pairs', '2 snowboards', 'changing to 3', 'make it 3', 'change from 0 to 3', 'update to 4', 'set to 2', 'I want 3', 'need 4 pairs'). Otherwise default to 0",

// And restore in rules:
- "skis_snowboards" - defaults to 0 unless explicitly mentioned
```

#### Calculation Logic
**Lines**: 308-314  
**Action**: Restore full calculation logic

```typescript
// RESTORE:
// Set default skis_snowboards to 0 if not explicitly provided
if (bookingData.skis_snowboards === null || bookingData.skis_snowboards === undefined) {
  bookingData.skis_snowboards = 0;
  console.info(`[SKIS-SNOWBOARDS-CALC] Auto-set skis_snowboards to default: 0`);
} else {
  console.info(`[SKIS-SNOWBOARDS-CALC] Using explicit skis_snowboards count: ${bookingData.skis_snowboards}`);
}
```

#### Default Booking Data
**Line**: 756  
**Action**: Remove HIDDEN comment

```typescript
// BEFORE:
skis_snowboards: 0, // HIDDEN: Always set to 0

// AFTER:
skis_snowboards: 0,
```

### 5. Database Schema (`src/models/conversation.schema.ts`)
**File**: `src/models/conversation.schema.ts`  
**Line**: 67  
**Action**: Remove HIDDEN comment

```typescript
// BEFORE:
skis_snowboards: number; // HIDDEN: Field maintained for backward compatibility but functionality is hidden

// AFTER:
skis_snowboards: number;
```

### 6. FAQ Knowledge Base (`src/knowledge/faqs.md`)
**File**: `src/knowledge/faqs.md`  
**Line**: 96  
**Action**: Restore ski/snowboard equipment mention

```markdown
<!-- BEFORE: -->
A: All transfers include: luggage handling, /* ski/snowboard equipment, */ child seats (if needed), and any route amendments. No hidden fees.

<!-- AFTER: -->
A: All transfers include: luggage handling, ski/snowboard equipment, child seats (if needed), and any route amendments. No hidden fees.
```

## Testing After Restoration

### 1. Frontend Testing
- [ ] Verify ski/snowboard icons appear in transfer options
- [ ] Test that ski/snowboard counts display correctly
- [ ] Confirm transfer option cards show all fields properly

### 2. Backend Testing
- [ ] Verify AI includes ski/snowboard in confirmation messages
- [ ] Test that SkiLifts API receives ski/snowboard parameters
- [ ] Confirm ski/snowboard data persists in quotes
- [ ] Test ski/snowboard extraction from user messages

### 3. Integration Testing
- [ ] Full booking flow with ski/snowboard mentions
- [ ] Verify bookingUrl includes ski/snowboard parameters
- [ ] Test quote restoration with ski/snowboard data
- [ ] Confirm currency conversion preserves ski/snowboard counts

## Notes
- All database schema remains intact, so no migrations needed
- All interface definitions are preserved
- Changes are minimal and reversible
- Token optimization achieved by removing wasteful HIDDEN comments from AI prompts

## Rollback
To disable ski/snowboard functionality again, simply reverse all the above changes by:
1. Commenting out display sections in frontend
2. Setting ski/snowboard values to 0 in backend
3. Removing ski/snowboard references from AI prompts
4. Adding explanatory comments where needed 