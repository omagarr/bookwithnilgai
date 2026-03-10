# Microphone Recording Troubleshooting Guide

## Issue: Microphone starts recording but immediately stops

This guide helps diagnose and fix microphone recording issues on the ski-lifts.nilgai.travel website.

## Quick Fixes to Try First

### 1. Check Browser Permissions
- Click the microphone icon in your browser's address bar
- Ensure microphone access is set to "Allow"
- If blocked, click "Allow" and refresh the page

### 2. Try a Different Browser
- **Recommended browsers**: Chrome, Edge, Firefox, Safari
- **Best compatibility**: Chrome (latest version)

### 3. Check HTTPS Connection
- Ensure you're on `https://ski-lifts.nilgai.travel` (not HTTP)
- Microphone access requires a secure connection

## Detailed Troubleshooting Steps

### Step 1: Browser Compatibility Check
Test your browser's microphone support:
1. Open browser developer tools (F12)
2. Go to Console tab
3. Paste this code and press Enter:
```javascript
console.log('Secure context:', window.isSecureContext);
console.log('MediaDevices API:', !!navigator.mediaDevices);
console.log('MediaRecorder API:', !!window.MediaRecorder);
console.log('WebM Opus support:', MediaRecorder.isTypeSupported('audio/webm;codecs=opus'));
```

**Expected results:**
- All should show `true`
- If any show `false`, try a different browser

### Step 2: Test Microphone Permissions
```javascript
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    console.log('✅ Microphone access granted');
    stream.getTracks().forEach(track => track.stop());
  })
  .catch(error => {
    console.error('❌ Microphone error:', error.message);
  });
```

### Step 3: Check Audio Format Support
```javascript
const formats = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/ogg;codecs=opus',
  'audio/wav'
];

formats.forEach(format => {
  console.log(`${format}: ${MediaRecorder.isTypeSupported(format) ? '✅ Supported' : '❌ Not supported'}`);
});
```

## Common Issues and Solutions

### Issue: "Microphone access requires a secure connection"
**Solution:** Ensure you're using HTTPS
- URL should start with `https://`
- Check for security warnings in browser

### Issue: "No supported audio format found"
**Solution:** Update your browser
- Chrome: Version 49+
- Firefox: Version 52+
- Safari: Version 10+
- Edge: Version 16+

### Issue: Permission denied
**Solutions:**
1. **Chrome/Edge:**
   - Click the microphone icon in address bar
   - Select "Always allow"
   - Refresh the page

2. **Firefox:**
   - Click the microphone icon in address bar
   - Select "Allow" and check "Remember this decision"

3. **Safari:**
   - Go to Safari > Preferences > Websites > Microphone
   - Set ski-lifts.nilgai.travel to "Allow"

### Issue: Recording starts then immediately stops
**Possible causes and solutions:**

1. **Browser security policy:**
   - Ensure you're on HTTPS
   - Check for mixed content warnings

2. **Microphone hardware issues:**
   - Test microphone in other applications
   - Check system microphone settings
   - Try a different microphone/headset

3. **Browser extensions:**
   - Disable ad blockers temporarily
   - Try incognito/private browsing mode

4. **Network connectivity:**
   - Check internet connection
   - Try refreshing the page

## Debug Tool

For advanced troubleshooting, use our debug tool:
1. Go to `https://ski-lifts.nilgai.travel/debug-microphone.html`
2. Click "Test Microphone Permissions"
3. Click "Test Audio Formats"
4. Click "Start Recording Test"
5. Share the debug log with support if issues persist

## Browser-Specific Instructions

### Chrome
1. Click the lock/microphone icon in address bar
2. Set Microphone to "Allow"
3. Refresh the page

### Firefox
1. Click the microphone icon in address bar
2. Select "Allow" and check "Remember this decision"
3. Refresh the page

### Safari
1. Safari > Preferences > Websites > Microphone
2. Set ski-lifts.nilgai.travel to "Allow"
3. Refresh the page

### Edge
1. Click the lock icon in address bar
2. Set Microphone to "Allow"
3. Refresh the page

## Still Having Issues?

If the problem persists after trying these steps:

1. **Collect debug information:**
   - Browser name and version
   - Operating system
   - Error messages from browser console
   - Results from debug tool

2. **Contact support:**
   - Include the debug information
   - Describe exactly what happens when you try to record
   - Mention which troubleshooting steps you've tried

## Technical Details

The microphone recording system uses:
- **WebRTC MediaDevices API** for microphone access
- **MediaRecorder API** for audio capture
- **WebSocket connection** to backend speech service
- **Google Cloud Speech API** for transcription

**Requirements:**
- HTTPS connection (secure context)
- Modern browser with MediaRecorder support
- Microphone permissions granted
- Stable internet connection 