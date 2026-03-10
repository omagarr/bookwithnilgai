# Ski-Lifts Chat Widget

A standalone, embeddable chat widget for the Ski-Lifts website that can be integrated into any webpage.

> **Note:** Looking for an inline embed version instead of a floating widget? Check out [README-EMBED.md](README-EMBED.md) for the embedded chat interface that integrates directly into your page layout.

## Features

- Fully self-contained chat widget
- Works in both minimized and expanded states
- Customizable positioning (bottom-right, bottom-left, top-right, top-left)
- Easy to integrate with a single script tag
- API for programmatic control
- Responsive design for all devices

## Quick Integration

Add the chat widget to any website with just a few lines of code:

```html
<!-- Include the chat widget script -->
<script src="https://chat.ski-lifts.com/widget.js"></script>

<!-- Auto-initialize the widget -->
<div data-ski-lifts-chat="auto"></div>
```

## Manual Integration with Custom Options

For more control, you can manually initialize the widget with custom options:

```html
<script src="https://chat.ski-lifts.com/widget.js"></script>
<script>
  // Initialize with custom options
  window.SkiLiftsChat.init({
    position: 'bottom-right',    // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
    initiallyMinimized: true,    // Start minimized or expanded
    widgetUrl: 'https://chat.ski-lifts.com' // URL of the widget service
  });
</script>
```

## Controlling the Widget

You can control the widget programmatically:

```javascript
// Minimize the widget
window.SkiLiftsChat.minimize();

// Maximize the widget
window.SkiLiftsChat.maximize();

// Toggle between minimized and maximized
window.SkiLiftsChat.toggle();
```

## Widget Deployment

The chat widget is designed to be hosted as a standalone service. To deploy the widget:

1. Run the deployment script:
   ```
   bash scripts/deploy-widget.sh
   ```

2. The script will:
   - Package the widget loader script (`widget.js`)
   - Create a minimal iframe content
   - Bundle everything into a zip file
   - Optionally deploy to an S3 bucket (if configured)

3. Host the generated files on your server or CDN

## Implementation Details

The widget works by injecting an iframe into your page that loads the chat application. The iframe is isolated from the parent page, ensuring that styles and scripts don't interfere with each other.

Communication between the parent page and the widget uses the `postMessage` API for secure cross-origin messaging.

## Browser Compatibility

The chat widget is compatible with:
- Chrome 49+
- Firefox 52+
- Safari 10+
- Edge 16+
- Opera 36+

## Development

To develop or modify the widget:

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Make changes to the widget components
5. Test with the example page: `public/widget-example.html`

## License

Copyright © 2023 Ski-Lifts. All rights reserved. 