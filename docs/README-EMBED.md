# Ski-Lifts Chat Embed Documentation

A comprehensive guide for integrating the Ski-Lifts chat interface as an inline embedded element in your website.

## Overview

The Ski-Lifts Chat Embed is an inline version of our chat interface designed to be embedded directly into your page content. Unlike the floating widget version, the embed:

- **Integrates inline** with your page layout
- **Adapts to container size** automatically
- **Always expanded** (no minimize/maximize)
- **Supports multiple instances** on the same page
- **Fully customizable** dimensions and styling

## Quick Start

### Basic Integration

Add the chat embed to any page with just two lines of code:

```html
<div data-ski-lifts-embed style="height: 500px;"></div>
<script src="https://ski-lifts.nilgai.travel/embed.js"></script>
```

The chat interface will automatically initialize and fill the container.

### Programmatic Integration

For more control, initialize the embed with JavaScript:

```html
<div id="chat-container" style="height: 600px;"></div>
<script src="https://ski-lifts.nilgai.travel/embed.js"></script>
<script>
  SkiLiftsEmbed.init('#chat-container', {
    height: '100%',
    width: '100%',
    borderRadius: '12px'
  });
</script>
```

## Configuration Options

### Declarative Configuration (Data Attributes)

Configure the embed using HTML data attributes:

```html
<div 
  data-ski-lifts-embed
  data-embed-height="500px"
  data-embed-width="100%"
  data-embed-border-radius="16px"
  data-embed-class="custom-chat-class"
  style="min-height: 400px;"
></div>
```

Available data attributes:
- `data-embed-height` - Set the iframe height
- `data-embed-width` - Set the iframe width
- `data-embed-border-radius` - Set border radius
- `data-embed-class` - Add custom CSS classes

### Programmatic Configuration

Initialize with JavaScript options:

```javascript
SkiLiftsEmbed.init(container, {
  // Dimensions
  height: '600px',      // Any valid CSS height
  width: '100%',        // Any valid CSS width
  
  // Styling
  borderRadius: '12px', // Border radius
  className: 'my-chat', // Additional CSS classes
  style: {              // Custom inline styles
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    border: '2px solid #e0e0e0'
  },
  
  // URLs (auto-detected, but can be overridden)
  embedUrl: 'https://ski-lifts.nilgai.travel/embed',
  apiUrl: 'https://apib2b.nilgai.travel'
});
```

## API Reference

### Methods

#### `SkiLiftsEmbed.init(container, options)`

Initialize an embed in a specific container.

**Parameters:**
- `container` (String|HTMLElement) - CSS selector or DOM element
- `options` (Object) - Configuration options

**Returns:** HTMLIFrameElement - The created iframe

**Example:**
```javascript
const iframe = SkiLiftsEmbed.init('#chat-div', {
  height: '500px'
});
```

#### `SkiLiftsEmbed.initAll()`

Automatically initialize all elements with `data-ski-lifts-embed` attribute.

**Example:**
```javascript
// Initialize all embed containers on the page
SkiLiftsEmbed.initAll();
```

#### `SkiLiftsEmbed.remove(container)`

Remove an embed from a specific container.

**Parameters:**
- `container` (String|HTMLElement) - CSS selector or DOM element

**Example:**
```javascript
SkiLiftsEmbed.remove('#chat-div');
```

#### `SkiLiftsEmbed.removeAll()`

Remove all active embeds from the page.

**Example:**
```javascript
SkiLiftsEmbed.removeAll();
```

### Properties

#### `SkiLiftsEmbed.ready`

A Promise that resolves when the DOM is ready.

**Example:**
```javascript
SkiLiftsEmbed.ready.then(() => {
  // Safe to initialize embeds
  SkiLiftsEmbed.init('#my-container');
});
```

## Integration Examples

### Banner Integration

Perfect for hero sections or promotional banners:

```html
<section class="hero-banner">
  <div class="banner-content">
    <h1>Get Instant Support</h1>
    <div 
      data-ski-lifts-embed 
      style="height: 400px; max-width: 600px; margin: 0 auto;"
    ></div>
  </div>
</section>
```

### Sidebar Integration

Ideal for sidebars or help panels:

```html
<aside class="sidebar">
  <h3>Need Help?</h3>
  <div id="sidebar-chat" style="height: 500px;"></div>
</aside>

<script>
  SkiLiftsEmbed.init('#sidebar-chat', {
    height: '100%',
    borderRadius: '8px'
  });
</script>
```

### Modal Integration

Embed in a modal or popup:

```html
<div class="modal" id="chat-modal">
  <div class="modal-content">
    <h2>Chat with Us</h2>
    <div data-ski-lifts-embed style="height: 450px;"></div>
    <button onclick="closeModal()">Close</button>
  </div>
</div>
```

### Multiple Embeds

Have multiple chat instances on the same page:

```html
<!-- Support section -->
<section id="support">
  <div data-ski-lifts-embed style="height: 400px;"></div>
</section>

<!-- Contact section -->
<section id="contact">
  <div data-ski-lifts-embed style="height: 500px;"></div>
</section>

<script src="https://ski-lifts.nilgai.travel/embed.js"></script>
```

## Styling Guide

### Container Styling

The embed adapts to its container. Style the container as needed:

```css
.chat-container {
  width: 100%;
  max-width: 800px;
  height: 600px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
}
```

### Responsive Design

Make the embed responsive:

```css
.chat-wrapper {
  width: 100%;
  height: 500px;
  max-width: 100%;
}

@media (max-width: 768px) {
  .chat-wrapper {
    height: 400px;
  }
}

@media (max-width: 480px) {
  .chat-wrapper {
    height: 350px;
  }
}
```

### Custom Themes

Apply custom styling to match your brand:

```javascript
SkiLiftsEmbed.init('#branded-chat', {
  height: '550px',
  style: {
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    border: '3px solid #1b3a4b'
  }
});
```

## Use Cases

### When to Use Embed vs Widget

**Use the Embed when:**
- You want chat as a permanent page element
- You need multiple chat instances
- Chat is the primary focus of a section
- You want full control over placement and size
- Building dedicated support/contact pages

**Use the Widget when:**
- You want optional/on-demand support
- Preserving page real estate is important
- You need persistent chat across pages
- You want a floating, minimizable interface
- Adding support to existing pages without layout changes

## Comparison: Widget vs Embed

| Feature | Widget | Embed |
|---------|--------|-------|
| **Position** | Floating (fixed) | Inline (static/relative) |
| **Minimize/Maximize** | ✅ Yes | ❌ No (always expanded) |
| **Multiple Instances** | ❌ No (one per page) | ✅ Yes |
| **Space Usage** | Overlays content | Part of page layout |
| **User Activation** | Click to open | Always visible |
| **State Persistence** | Remembers state | No state to remember |
| **Best For** | General support | Dedicated sections |

## Using Both Together

You can use both the widget and embed on the same page without conflicts:

```html
<!-- Embed in contact section -->
<section id="contact">
  <h2>Contact Us</h2>
  <div data-ski-lifts-embed style="height: 500px;"></div>
</section>

<!-- Scripts -->
<script src="https://ski-lifts.nilgai.travel/embed.js"></script>
<script src="https://ski-lifts.nilgai.travel/widget.js"></script>
```

The widget will provide floating support while the embed serves as a dedicated contact interface.

## Advanced Configuration

### Environment-Specific Setup

For development/staging environments:

```javascript
// Override URLs for local development
if (window.location.hostname === 'localhost') {
  window.SkiLiftsEmbed.config.embedUrl = 'http://localhost:3001/embed';
  window.SkiLiftsEmbed.config.apiUrl = 'http://localhost:3000';
}

// Then initialize
SkiLiftsEmbed.init('#chat');
```

### Lazy Loading

Defer embed initialization for better performance:

```javascript
// Load embed only when user scrolls to it
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      SkiLiftsEmbed.init(entry.target);
      observer.unobserve(entry.target);
    }
  });
});

// Observe all embed containers
document.querySelectorAll('[data-ski-lifts-embed]').forEach(el => {
  observer.observe(el);
});
```

### Dynamic Initialization

Create embeds dynamically based on user actions:

```javascript
function openChatPanel() {
  const container = document.createElement('div');
  container.id = 'dynamic-chat';
  container.style.height = '500px';
  
  document.getElementById('chat-panel').appendChild(container);
  
  SkiLiftsEmbed.init(container, {
    height: '100%',
    borderRadius: '12px'
  });
}
```

## Browser Compatibility

The embed is compatible with:
- Chrome 49+
- Firefox 52+
- Safari 10+
- Edge 16+
- Opera 36+

## Troubleshooting

### Common Issues

**Embed not appearing:**
- Ensure the container has a defined height
- Check browser console for errors
- Verify script URL is correct
- Confirm container element exists before initialization

**Sizing issues:**
- Set explicit height on container
- Use `min-height` for flexible layouts
- Ensure parent elements don't have `overflow: hidden`

**Multiple embeds not working:**
- Each container needs a unique identifier
- Initialize each embed separately or use `initAll()`

### Debug Mode

Enable debug logs:

```javascript
// Before loading embed.js
window.DEBUG_EMBED = true;
```

## Security

The embed uses:
- Secure iframe sandboxing
- PostMessage for communication
- HTTPS-only in production
- Content Security Policy headers

## Performance

Tips for optimal performance:
- Lazy load embeds below the fold
- Use reasonable container sizes
- Limit number of embeds per page
- Consider using widget for secondary support

## Support

For issues or questions:
- Documentation: [https://ski-lifts.nilgai.travel/docs](https://ski-lifts.nilgai.travel/docs)
- Email: support@ski-lifts.com
- Examples: See `/public/examples/` directory

## License

Copyright © 2024 Ski-Lifts. All rights reserved.
