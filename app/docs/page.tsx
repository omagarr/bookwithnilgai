'use client';

export default function DocsPage() {
  const copyCode = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const codeBlock = button.parentElement?.querySelector('code');
    if (codeBlock) {
      const text = codeBlock.textContent || '';
      navigator.clipboard.writeText(text).then(() => {
        button.textContent = 'Copied!';
        setTimeout(() => {
          button.textContent = 'Copy';
        }, 2000);
      });
    }
  };

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '15px 0',
        zIndex: 1000
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <a href="/" style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#ffffff',
            textDecoration: 'none'
          }}>
            Ski-Lifts Chat
          </a>
          <div style={{ display: 'flex', gap: '30px' }}>
            <a href="#getting-started" style={{ color: '#cccccc', textDecoration: 'none' }}>Getting Started</a>
            <a href="#widget-installation" style={{ color: '#cccccc', textDecoration: 'none' }}>Widget</a>
            <a href="#embed-installation" style={{ color: '#cccccc', textDecoration: 'none' }}>Embed</a>
            <a href="#api-reference" style={{ color: '#cccccc', textDecoration: 'none' }}>API</a>
          </div>
        </div>
      </nav>

      {/* Main content with top margin for fixed nav */}
      <div style={{ marginTop: '80px' }}>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(27, 58, 75, 0.9) 0%, rgba(43, 74, 91, 0.8) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '60px 40px',
          marginBottom: '40px',
          borderRadius: '20px',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 700,
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Ski-Lifts Chat Integration
          </h1>
          
          <p style={{ 
            fontSize: '1.2rem', 
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Complete documentation for integrating our intelligent chat system into your website. Choose between a floating widget or an inline embed for seamless user experience.
          </p>
        </div>

        {/* Table of Contents */}
        <div style={{
          background: 'rgba(20, 20, 20, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '30px',
          marginBottom: '40px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
          <h2 style={{ marginBottom: '20px', color: '#ffffff', fontSize: '1.5rem' }}>
            📚 Table of Contents
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px'
          }}>
            {[
              { href: '#getting-started', text: '🚀 Getting Started' },
              { href: '#widget-installation', text: '💬 Widget (Floating)' },
              { href: '#embed-installation', text: '📋 Embed (Banner)' },
              { href: '#configuration', text: '⚙️ Configuration' },
              { href: '#api-reference', text: '📖 API Reference' },
              { href: '#troubleshooting', text: '🔧 Troubleshooting' },
              { href: '#enhanced-reliability', text: '🔧 Enhanced Reliability' }
            ].map((item, index) => (
              <a
                key={index}
                href={item.href}
                style={{
                  color: '#64ffda',
                  textDecoration: 'none',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  background: 'rgba(100, 255, 218, 0.1)',
                  border: '1px solid rgba(100, 255, 218, 0.2)',
                  transition: 'all 0.2s ease',
                  display: 'block'
                }}
              >
                {item.text}
              </a>
            ))}
          </div>
        </div>

        {/* Getting Started Section */}
        <section id="getting-started" style={{
          background: 'rgba(20, 20, 20, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '40px',
          marginBottom: '40px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          scrollMarginTop: '100px'
        }}>
          <h2 style={{
            color: '#ffffff',
            marginBottom: '20px',
            fontSize: '2rem',
            fontWeight: 600,
            borderBottom: '2px solid rgba(100, 255, 218, 0.3)',
            paddingBottom: '10px'
          }}>
            🚀 Getting Started
          </h2>
          <p style={{ color: '#cccccc', marginBottom: '16px', lineHeight: '1.7' }}>
            The Ski-Lifts Chat system offers two integration options: a <strong>floating widget</strong> that appears as a button in the corner of your page, or an <strong>inline embed</strong> that integrates directly into your page layout. Both provide the same powerful AI-driven booking experience with different presentation styles.
          </p>
          
          <h3 style={{ color: '#ffffff', margin: '30px 0 15px 0', fontSize: '1.3rem', fontWeight: 500 }}>
            Choose Your Integration Method
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{
              background: 'rgba(30, 30, 30, 0.6)',
              border: '1px solid rgba(100, 255, 218, 0.2)',
              padding: '25px',
              borderRadius: '12px'
            }}>
              <h4 style={{ color: '#64ffda', marginBottom: '15px', fontSize: '1.2rem' }}>💬 Widget (Floating)</h4>
              <p style={{ color: '#cccccc', marginBottom: '15px' }}>
                A floating chat button that appears in the corner of your page. Perfect for:
              </p>
              <ul style={{ color: '#cccccc', marginLeft: '20px' }}>
                <li>Optional support presence</li>
                <li>Minimizable interface</li>
                <li>Non-intrusive integration</li>
                <li>E-commerce sites</li>
              </ul>
            </div>
            
            <div style={{
              background: 'rgba(30, 30, 30, 0.6)',
              border: '1px solid rgba(100, 255, 218, 0.2)',
              padding: '25px',
              borderRadius: '12px'
            }}>
              <h4 style={{ color: '#64ffda', marginBottom: '15px', fontSize: '1.2rem' }}>📋 Embed (Banner/Inline)</h4>
              <p style={{ color: '#cccccc', marginBottom: '15px' }}>
                An inline chat interface that becomes part of your page. Ideal for:
              </p>
              <ul style={{ color: '#cccccc', marginLeft: '20px' }}>
                <li>Hero sections & banners</li>
                <li>Dedicated support pages</li>
                <li>Always visible interface</li>
                <li>Landing pages</li>
              </ul>
            </div>
          </div>

          <h3 style={{ color: '#ffffff', margin: '30px 0 15px 0', fontSize: '1.3rem', fontWeight: 500 }}>
            Key Features
          </h3>
          <ul style={{ color: '#cccccc', marginLeft: '20px', marginBottom: '16px' }}>
            <li style={{ marginBottom: '8px' }}><strong>AI-Powered Chat:</strong> Gemini AI handles natural conversations for ski transfer bookings</li>
            <li style={{ marginBottom: '8px' }}><strong>Real Transfer Options:</strong> Live pricing and availability from Ski-Lifts API with 5-7+ transfer types</li>
            <li style={{ marginBottom: '8px' }}><strong>Conversation Persistence:</strong> Chat history persists across browser sessions with MongoDB storage</li>
            <li style={{ marginBottom: '8px' }}><strong>Quote Management:</strong> Multiple quotes per conversation with booking URL deep links</li>
            <li style={{ marginBottom: '8px' }}><strong>Speech Recognition:</strong> Built-in voice input with browser-native speech recognition</li>
            <li style={{ marginBottom: '8px' }}><strong>Environment Detection:</strong> Automatically uses correct API endpoints for local vs production</li>
            <li style={{ marginBottom: '8px' }}><strong>Mobile Optimized:</strong> Responsive design with mobile-first approach and touch-friendly UI</li>
            <li style={{ marginBottom: '8px' }}><strong>Location Intelligence:</strong> Smart normalization of 386 airports and 3,648 ski resorts</li>
          </ul>

          <div style={{
            padding: '20px',
            borderRadius: '8px',
            margin: '20px 0',
            borderLeft: '4px solid #2196f3',
            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)',
            color: '#bbdefb'
          }}>
            <strong>💡 Quick Tip:</strong> The widget automatically adapts to your website&apos;s design and provides a seamless user experience across all devices.
          </div>
        </section>

        {/* Widget Installation Section */}
        <section id="widget-installation" style={{
          background: 'rgba(20, 20, 20, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '40px',
          marginBottom: '40px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          scrollMarginTop: '100px'
        }}>
          <h2 style={{
            color: '#ffffff',
            marginBottom: '20px',
            fontSize: '2rem',
            fontWeight: 600,
            borderBottom: '2px solid rgba(100, 255, 218, 0.3)',
            paddingBottom: '10px'
          }}>
            💬 Widget Installation (Floating)
          </h2>
          
          <h3 style={{ color: '#ffffff', margin: '30px 0 15px 0', fontSize: '1.3rem', fontWeight: 500 }}>
            Method 1: Auto-Initialization (Recommended)
          </h3>
          <p style={{ color: '#cccccc', marginBottom: '16px', lineHeight: '1.7' }}>
            The simplest way to add the floating chat widget to your website. The widget appears as a button in the corner and can be minimized/maximized:
          </p>
          
          <div style={{ position: 'relative' }}>
            <button
              onClick={copyCode}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(100, 255, 218, 0.2)',
                border: '1px solid rgba(100, 255, 218, 0.3)',
                color: '#64ffda',
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Copy
            </button>
            <pre style={{
              background: 'rgba(15, 15, 15, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '25px',
              borderRadius: '12px',
              overflow: 'auto',
              margin: '20px 0',
              boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)'
            }}>
              <code style={{
                color: '#e0e0e0',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace'
              }}>
{`<!-- Include the Ski-Lifts Chat Widget script -->
<script src="https://ski-lifts.nilgai.travel/widget.js"></script>

<!-- The widget will initialize automatically with default settings -->
<!-- No additional configuration needed! -->

<!-- Optional: Pre-configure the widget with custom options -->
<script>
  window.__CHAT_WIDGET_CONFIG = {
    position: 'bottom-right',       // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
    initiallyMinimized: true,       // Start minimized (true) or expanded (false)
    containerId: 'ski-lifts-chat-widget-container'  // Custom container ID (advanced)
  };
</script>`}
              </code>
            </pre>
          </div>

          <div style={{
            padding: '20px',
            borderRadius: '8px',
            margin: '20px 0',
            borderLeft: '4px solid #4caf50',
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
            color: '#c8e6c9'
          }}>
            <strong>✅ Ready to Use:</strong> The widget script is hosted at <code style={{
              backgroundColor: 'rgba(40, 40, 40, 0.8)',
              color: '#64ffda',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '0.9em',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>https://ski-lifts.nilgai.travel/widget.js</code> and is ready for production use. The widget automatically handles all backend communication.
          </div>
          
          <h3 style={{ color: '#ffffff', margin: '30px 0 15px 0', fontSize: '1.3rem', fontWeight: 500 }}>
            Method 2: Manual Initialization
          </h3>
          <p style={{ color: '#cccccc', marginBottom: '16px', lineHeight: '1.7' }}>
            For more control over initialization timing and configuration:
          </p>
          
          <div style={{ position: 'relative' }}>
            <button
              onClick={copyCode}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(100, 255, 218, 0.2)',
                border: '1px solid rgba(100, 255, 218, 0.3)',
                color: '#64ffda',
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Copy
            </button>
            <pre style={{
              background: 'rgba(15, 15, 15, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '25px',
              borderRadius: '12px',
              overflow: 'auto',
              margin: '20px 0',
              boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)'
            }}>
              <code style={{
                color: '#e0e0e0',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace'
              }}>
{`<!-- Include the chat widget script -->
<script src="https://ski-lifts.nilgai.travel/widget.js"></script>

<script>
  // Initialize when document is ready
  document.addEventListener('DOMContentLoaded', function() {
    // Custom configuration with all available options
    window.SkiLiftsChat.init({
      position: 'bottom-right',          // Widget position
      initiallyMinimized: true,          // Start state
      containerId: 'custom-widget-container'   // Custom container ID
    });
    
    // Available widget methods for programmatic control:
    // window.SkiLiftsChat.maximize();    // Show the chat interface
    // window.SkiLiftsChat.minimize();    // Hide to minimized button
    // window.SkiLiftsChat.toggle();      // Toggle between states
    // window.SkiLiftsChat.destroy();     // Remove widget completely
  });
</script>`}
              </code>
            </pre>
          </div>
        </section>

        {/* Embed Installation Section */}
        <section id="embed-installation" style={{
          background: 'rgba(20, 20, 20, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '40px',
          marginBottom: '40px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          scrollMarginTop: '100px'
        }}>
          <h2 style={{
            color: '#ffffff',
            marginBottom: '20px',
            fontSize: '2rem',
            fontWeight: 600,
            borderBottom: '2px solid rgba(100, 255, 218, 0.3)',
            paddingBottom: '10px'
          }}>
            📋 Embed Installation (Banner/Inline)
          </h2>
          
          <h3 style={{ color: '#ffffff', margin: '30px 0 15px 0', fontSize: '1.3rem', fontWeight: 500 }}>
            Method 1: Simple Iframe Embed
          </h3>
          <p style={{ color: '#cccccc', marginBottom: '16px', lineHeight: '1.7' }}>
            The easiest way to embed the chat interface inline within your page content. The embed is always expanded and takes the shape of its container:
          </p>
          
          <div style={{
            padding: '20px',
            borderRadius: '8px',
            margin: '20px 0',
            borderLeft: '4px solid #ff9800',
            background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%)',
            color: '#ffcc80'
          }}>
            <strong>🎙️ Important:</strong> The <code style={{
              backgroundColor: 'rgba(40, 40, 40, 0.8)',
              color: '#64ffda',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '0.9em',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>allow=&quot;microphone *&quot;</code> attribute is the only permission required. The asterisk (*) ensures microphone access works when embedding across different domains. Without this, users on external websites won&apos;t be able to use the voice input feature. No other permissions (camera, geolocation, etc.) are needed.
          </div>
          
          <div style={{ position: 'relative' }}>
            <button
              onClick={copyCode}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(100, 255, 218, 0.2)',
                border: '1px solid rgba(100, 255, 218, 0.3)',
                color: '#64ffda',
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Copy
            </button>
            <pre style={{
              background: 'rgba(15, 15, 15, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '25px',
              borderRadius: '12px',
              overflow: 'auto',
              margin: '20px 0',
              boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)'
            }}>
              <code style={{
                color: '#e0e0e0',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace'
              }}>
{`<!-- Simple iframe embed - place anywhere in your page -->
<iframe 
  src="https://ski-lifts.nilgai.travel/embed" 
  width="100%" 
  height="600px"
  style="border: none; border-radius: 12px;"
  allow="microphone *"
></iframe>

<!-- Or with a container for responsive sizing -->
<div style="width: 100%; height: 500px; border-radius: 12px; overflow: hidden;">
  <iframe 
    src="https://ski-lifts.nilgai.travel/embed" 
    width="100%" 
    height="100%"
    style="border: none;"
    allow="microphone *"
  ></iframe>
</div>`}
              </code>
            </pre>
          </div>

          <h3 style={{ color: '#ffffff', margin: '30px 0 15px 0', fontSize: '1.3rem', fontWeight: 500 }}>
            Method 2: JavaScript Embed (Advanced)
          </h3>
          <p style={{ color: '#cccccc', marginBottom: '16px', lineHeight: '1.7' }}>
            For more control and multiple embeds on the same page, use our JavaScript embed library:
          </p>
          
          <div style={{ position: 'relative' }}>
            <button
              onClick={copyCode}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(100, 255, 218, 0.2)',
                border: '1px solid rgba(100, 255, 218, 0.3)',
                color: '#64ffda',
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Copy
            </button>
            <pre style={{
              background: 'rgba(15, 15, 15, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '25px',
              borderRadius: '12px',
              overflow: 'auto',
              margin: '20px 0',
              boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)'
            }}>
              <code style={{
                color: '#e0e0e0',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace'
              }}>
{`<!-- Include the embed script -->
<script src="https://ski-lifts.nilgai.travel/embed.js"></script>

<!-- Method A: Auto-initialize with data attributes -->
<div data-ski-lifts-embed style="height: 500px;"></div>

<!-- Method B: Initialize programmatically -->
<div id="chat-container" style="height: 600px;"></div>
<script>
  SkiLiftsEmbed.init('#chat-container', {
    height: '100%',
    width: '100%',
    borderRadius: '12px'
  });
</script>

<!-- Multiple embeds on the same page -->
<div id="banner-chat" style="height: 400px;"></div>
<div id="support-chat" style="height: 600px;"></div>
<script>
  SkiLiftsEmbed.init('#banner-chat', { height: '100%' });
  SkiLiftsEmbed.init('#support-chat', { height: '100%' });
</script>`}
              </code>
            </pre>
          </div>

          <h3 style={{ color: '#ffffff', margin: '30px 0 15px 0', fontSize: '1.3rem', fontWeight: 500 }}>
            Common Use Cases
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px',
            marginBottom: '20px'
          }}>
            {[
              { title: 'Hero Banner', description: 'Full-width banner in hero section' },
              { title: 'Sidebar', description: 'Fixed height in sidebar panel' },
              { title: 'Modal', description: 'Inside popup modals' },
              { title: 'Contact Page', description: 'Primary contact interface' }
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: 'rgba(30, 30, 30, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '15px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}
              >
                <div style={{ color: '#64ffda', fontWeight: 600, marginBottom: '5px' }}>
                  {item.title}
                </div>
                <div style={{ color: '#cccccc', fontSize: '0.9rem' }}>
                  {item.description}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            padding: '20px',
            borderRadius: '8px',
            margin: '20px 0',
            borderLeft: '4px solid #2196f3',
            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)',
            color: '#bbdefb'
          }}>
            <strong>💡 Key Differences from Widget:</strong>
            <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
              <li>Always expanded (no minimize button)</li>
              <li>Takes full container dimensions</li>
              <li>Part of page layout (not floating)</li>
              <li>Can have multiple instances per page</li>
              <li>Ideal for prominent placement</li>
            </ul>
          </div>

          <h3 style={{ color: '#ffffff', margin: '30px 0 15px 0', fontSize: '1.3rem', fontWeight: 500 }}>
            Responsive Examples
          </h3>
          
          <div style={{ position: 'relative' }}>
            <button
              onClick={copyCode}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(100, 255, 218, 0.2)',
                border: '1px solid rgba(100, 255, 218, 0.3)',
                color: '#64ffda',
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Copy
            </button>
            <pre style={{
              background: 'rgba(15, 15, 15, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '25px',
              borderRadius: '12px',
              overflow: 'auto',
              margin: '20px 0',
              boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)'
            }}>
              <code style={{
                color: '#e0e0e0',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace'
              }}>
{`<!-- Full-width banner embed -->
<section class="hero-banner">
  <div style="width: 100%; max-width: 1200px; height: 500px; margin: 0 auto;">
    <iframe 
      src="https://ski-lifts.nilgai.travel/embed" 
      width="100%" 
      height="100%"
      style="border: none; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"
      allow="microphone *"
    ></iframe>
  </div>
</section>

<!-- Sidebar embed -->
<aside class="sidebar">
  <h3>Need Help Booking?</h3>
  <div style="height: 450px;">
    <iframe 
      src="https://ski-lifts.nilgai.travel/embed" 
      width="100%" 
      height="100%"
      style="border: 1px solid #e0e0e0; border-radius: 8px;"
      allow="microphone *"
    ></iframe>
  </div>
</aside>

<!-- Modal/Popup embed -->
<div class="modal-content">
  <iframe 
    src="https://ski-lifts.nilgai.travel/embed" 
    width="100%" 
    height="400px"
    style="border: none;"
    allow="microphone *"
  ></iframe>
</div>`}
              </code>
            </pre>
          </div>

          <div style={{
            padding: '20px',
            borderRadius: '8px',
            margin: '20px 0',
            borderLeft: '4px solid #4caf50',
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
            color: '#c8e6c9'
          }}>
            <strong>✅ Pro Tip:</strong> You can use both the widget and embed on the same page! The widget provides floating support while the embed serves as your primary booking interface.
          </div>
        </section>

        {/* Configuration Section */}
        <section id="configuration" style={{
          background: 'rgba(20, 20, 20, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '40px',
          marginBottom: '40px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          scrollMarginTop: '100px'
        }}>
          <h2 style={{
            color: '#ffffff',
            marginBottom: '20px',
            fontSize: '2rem',
            fontWeight: 600,
            borderBottom: '2px solid rgba(100, 255, 218, 0.3)',
            paddingBottom: '10px'
          }}>
            ⚙️ Configuration
          </h2>
          
          <h3 style={{ color: '#ffffff', margin: '30px 0 15px 0', fontSize: '1.3rem', fontWeight: 500 }}>
            Automatic Configuration
          </h3>
          <p style={{ color: '#cccccc', marginBottom: '16px', lineHeight: '1.7' }}>
            Both the widget and embed automatically handle all backend communication with our secure API endpoints. No additional setup required.
          </p>

          <h3 style={{ color: '#ffffff', margin: '30px 0 15px 0', fontSize: '1.3rem', fontWeight: 500 }}>
            Common Features (Widget & Embed)
          </h3>
          <ul style={{ color: '#cccccc', marginLeft: '20px', marginBottom: '16px' }}>
            <li style={{ marginBottom: '8px' }}><strong>Conversation Persistence:</strong> Chat history is saved and restored across sessions</li>
            <li style={{ marginBottom: '8px' }}><strong>Quote System:</strong> Multiple quotes per conversation with incremental numbering</li>
            <li style={{ marginBottom: '8px' }}><strong>Real-time Pricing:</strong> Live transfer options from Ski-Lifts API with actual pricing</li>
            <li style={{ marginBottom: '8px' }}><strong>Deep Link Booking:</strong> Direct booking URLs with pre-filled customer details</li>
            <li style={{ marginBottom: '8px' }}><strong>Speech Recognition:</strong> Voice input support in compatible browsers</li>
            <li style={{ marginBottom: '8px' }}><strong>Mobile Responsive:</strong> Optimized for mobile devices with touch-friendly controls</li>
          </ul>

          <h3 style={{ color: '#ffffff', margin: '30px 0 15px 0', fontSize: '1.3rem', fontWeight: 500 }}>
            Widget vs Embed Comparison
          </h3>
          
          <div style={{
            background: 'rgba(30, 30, 30, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '25px',
            borderRadius: '12px',
            margin: '20px 0'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ color: '#64ffda', padding: '10px', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Feature</th>
                  <th style={{ color: '#64ffda', padding: '10px', textAlign: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Widget</th>
                  <th style={{ color: '#64ffda', padding: '10px', textAlign: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Embed</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ color: '#cccccc', padding: '10px' }}>Position</td>
                  <td style={{ color: '#cccccc', padding: '10px', textAlign: 'center' }}>Floating (fixed)</td>
                  <td style={{ color: '#cccccc', padding: '10px', textAlign: 'center' }}>Inline (static)</td>
                </tr>
                <tr>
                  <td style={{ color: '#cccccc', padding: '10px' }}>Minimize/Maximize</td>
                  <td style={{ color: '#4caf50', padding: '10px', textAlign: 'center' }}>✓ Yes</td>
                  <td style={{ color: '#f44336', padding: '10px', textAlign: 'center' }}>✗ No</td>
                </tr>
                <tr>
                  <td style={{ color: '#cccccc', padding: '10px' }}>Multiple Instances</td>
                  <td style={{ color: '#f44336', padding: '10px', textAlign: 'center' }}>✗ One per page</td>
                  <td style={{ color: '#4caf50', padding: '10px', textAlign: 'center' }}>✓ Multiple</td>
                </tr>
                <tr>
                  <td style={{ color: '#cccccc', padding: '10px' }}>Space Usage</td>
                  <td style={{ color: '#cccccc', padding: '10px', textAlign: 'center' }}>Overlays content</td>
                  <td style={{ color: '#cccccc', padding: '10px', textAlign: 'center' }}>Part of layout</td>
                </tr>
                <tr>
                  <td style={{ color: '#cccccc', padding: '10px' }}>Best For</td>
                  <td style={{ color: '#cccccc', padding: '10px', textAlign: 'center' }}>Optional support</td>
                  <td style={{ color: '#cccccc', padding: '10px', textAlign: 'center' }}>Primary interface</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <h3 style={{ color: '#ffffff', margin: '30px 0 15px 0', fontSize: '1.3rem', fontWeight: 500 }}>
            Widget Positioning Options
          </h3>
          <p style={{ color: '#cccccc', marginBottom: '16px', lineHeight: '1.7' }}>
            The floating widget can be positioned in any corner of the screen:
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '20px'
          }}>
            {[
              { position: 'bottom-right', description: 'Default position' },
              { position: 'bottom-left', description: 'Bottom left corner' },
              { position: 'top-right', description: 'Top right corner' },
              { position: 'top-left', description: 'Top left corner' }
            ].map((item) => (
              <div
                key={item.position}
                style={{
                  background: 'rgba(30, 30, 30, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '15px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}
              >
                <div style={{ color: '#64ffda', fontWeight: 600, marginBottom: '5px' }}>
                  {item.position}
                </div>
                <div style={{ color: '#cccccc', fontSize: '0.9rem' }}>
                  {item.description}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            padding: '20px',
            borderRadius: '8px',
            margin: '20px 0',
            borderLeft: '4px solid #2196f3',
            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)',
            color: '#bbdefb'
          }}>
            <strong>💡 Pro Tip:</strong> The widget maintains its position preference across sessions using localStorage, so users see their preferred position even after returning to your site.
          </div>
        </section>

        {/* API Reference Section */}
        <section id="api-reference" style={{
          background: 'rgba(20, 20, 20, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '40px',
          marginBottom: '40px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          scrollMarginTop: '100px'
        }}>
          <h2 style={{
            color: '#ffffff',
            marginBottom: '20px',
            fontSize: '2rem',
            fontWeight: 600,
            borderBottom: '2px solid rgba(100, 255, 218, 0.3)',
            paddingBottom: '10px'
          }}>
            📖 API Reference
          </h2>
          <p style={{ color: '#cccccc', marginBottom: '16px', lineHeight: '1.7' }}>
            The widget exposes several methods for programmatic control.
          </p>

          <h3 style={{ color: '#ffffff', margin: '30px 0 15px 0', fontSize: '1.3rem', fontWeight: 500 }}>
            Core Methods
          </h3>
          
          <div style={{
            background: 'rgba(30, 30, 30, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '25px',
            borderRadius: '12px',
            margin: '20px 0'
          }}>
            <div style={{
              color: '#64ffda',
              fontWeight: 600,
              marginBottom: '15px',
              fontSize: '1.1rem'
            }}>
              SkiLiftsChat.init(options)
            </div>
            <p style={{ color: '#cccccc', marginBottom: '16px', lineHeight: '1.7' }}>
              Initializes the chat widget with the specified options.
            </p>
            <div style={{ position: 'relative' }}>
              <button
                onClick={copyCode}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(100, 255, 218, 0.2)',
                  border: '1px solid rgba(100, 255, 218, 0.3)',
                  color: '#64ffda',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Copy
              </button>
              <pre style={{
                background: 'rgba(15, 15, 15, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '25px',
                borderRadius: '12px',
                overflow: 'auto',
                margin: '20px 0'
              }}>
                <code style={{ color: '#e0e0e0', fontSize: '0.9rem', lineHeight: '1.6' }}>
{`window.SkiLiftsChat.init({
  position: 'bottom-right',      // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
  initiallyMinimized: true,      // Start minimized (true) or expanded (false)
  containerId: 'ski-lifts-chat-widget-container'   // Custom container ID
});

// The widget automatically handles all configuration and backend communication`}
                </code>
              </pre>
            </div>
          </div>

          <div style={{
            background: 'rgba(30, 30, 30, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '25px',
            borderRadius: '12px',
            margin: '20px 0'
          }}>
            <div style={{
              color: '#64ffda',
              fontWeight: 600,
              marginBottom: '15px',
              fontSize: '1.1rem'
            }}>
              SkiLiftsChat.maximize()
            </div>
            <p style={{ color: '#cccccc', marginBottom: '16px', lineHeight: '1.7' }}>
              Maximizes the chat widget, showing the full interface.
            </p>
            <div style={{ position: 'relative' }}>
              <button
                onClick={copyCode}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(100, 255, 218, 0.2)',
                  border: '1px solid rgba(100, 255, 218, 0.3)',
                  color: '#64ffda',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Copy
              </button>
              <pre style={{
                background: 'rgba(15, 15, 15, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '25px',
                borderRadius: '12px',
                overflow: 'auto',
                margin: '20px 0'
              }}>
                <code style={{ color: '#e0e0e0', fontSize: '0.9rem', lineHeight: '1.6' }}>
{`// Show the chat interface
window.SkiLiftsChat.maximize();`}
                </code>
              </pre>
            </div>
          </div>

          <div style={{
            background: 'rgba(30, 30, 30, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '25px',
            borderRadius: '12px',
            margin: '20px 0'
          }}>
            <div style={{
              color: '#64ffda',
              fontWeight: 600,
              marginBottom: '15px',
              fontSize: '1.1rem'
            }}>
              SkiLiftsChat.minimize()
            </div>
            <p style={{ color: '#cccccc', marginBottom: '16px', lineHeight: '1.7' }}>
              Minimizes the chat widget to just show the chat button.
            </p>
            <div style={{ position: 'relative' }}>
              <button
                onClick={copyCode}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(100, 255, 218, 0.2)',
                  border: '1px solid rgba(100, 255, 218, 0.3)',
                  color: '#64ffda',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Copy
              </button>
              <pre style={{
                background: 'rgba(15, 15, 15, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '25px',
                borderRadius: '12px',
                overflow: 'auto',
                margin: '20px 0'
              }}>
                <code style={{ color: '#e0e0e0', fontSize: '0.9rem', lineHeight: '1.6' }}>
{`// Hide the chat interface and show the chat button
window.SkiLiftsChat.minimize();`}
                </code>
              </pre>
            </div>
          </div>

          <div style={{
            background: 'rgba(30, 30, 30, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '25px',
            borderRadius: '12px',
            margin: '20px 0'
          }}>
            <div style={{
              color: '#64ffda',
              fontWeight: 600,
              marginBottom: '15px',
              fontSize: '1.1rem'
            }}>
              SkiLiftsChat.toggle()
            </div>
            <p style={{ color: '#cccccc', marginBottom: '16px', lineHeight: '1.7' }}>
              Toggles between maximized and minimized states.
            </p>
            <div style={{ position: 'relative' }}>
              <button
                onClick={copyCode}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(100, 255, 218, 0.2)',
                  border: '1px solid rgba(100, 255, 218, 0.3)',
                  color: '#64ffda',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Copy
              </button>
              <pre style={{
                background: 'rgba(15, 15, 15, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '25px',
                borderRadius: '12px',
                overflow: 'auto',
                margin: '20px 0'
              }}>
                <code style={{ color: '#e0e0e0', fontSize: '0.9rem', lineHeight: '1.6' }}>
{`// Toggle the chat widget state
window.SkiLiftsChat.toggle();`}
                </code>
              </pre>
            </div>
          </div>

          <div style={{
            background: 'rgba(30, 30, 30, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '25px',
            borderRadius: '12px',
            margin: '20px 0'
          }}>
            <div style={{
              color: '#64ffda',
              fontWeight: 600,
              marginBottom: '15px',
              fontSize: '1.1rem'
            }}>
              SkiLiftsChat.destroy()
            </div>
            <p style={{ color: '#cccccc', marginBottom: '16px', lineHeight: '1.7' }}>
              Removes the chat widget from the page and cleans up resources.
            </p>
            <div style={{ position: 'relative' }}>
              <button
                onClick={copyCode}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(100, 255, 218, 0.2)',
                  border: '1px solid rgba(100, 255, 218, 0.3)',
                  color: '#64ffda',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Copy
              </button>
              <pre style={{
                background: 'rgba(15, 15, 15, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '25px',
                borderRadius: '12px',
                overflow: 'auto',
                margin: '20px 0'
              }}>
                <code style={{ color: '#e0e0e0', fontSize: '0.9rem', lineHeight: '1.6' }}>
{`// Remove the chat widget completely
window.SkiLiftsChat.destroy();`}
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* Technical Capabilities Section */}
        <section id="enhanced-reliability" style={{
          background: 'rgba(20, 20, 20, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '40px',
          marginBottom: '40px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          scrollMarginTop: '100px'
        }}>
          <h2 style={{
            color: '#ffffff',
            marginBottom: '20px',
            fontSize: '2rem',
            fontWeight: 600,
            borderBottom: '2px solid rgba(100, 255, 218, 0.3)',
            paddingBottom: '10px'
          }}>
            🔧 Enhanced Reliability & Features
          </h2>
          
          <h3 style={{ color: '#ffffff', margin: '30px 0 15px 0', fontSize: '1.3rem', fontWeight: 500 }}>
            Backend Architecture
          </h3>
          <ul style={{ color: '#cccccc', marginLeft: '20px', marginBottom: '16px' }}>
            <li style={{ marginBottom: '8px' }}><strong>NestJS + MongoDB:</strong> Robust backend with TypeScript for type safety</li>
            <li style={{ marginBottom: '8px' }}><strong>Gemini AI Integration:</strong> Google&apos;s latest AI model for natural conversations</li>
            <li style={{ marginBottom: '8px' }}><strong>JWT Token Caching:</strong> 6-month token validity with automatic refresh</li>
            <li style={{ marginBottom: '8px' }}><strong>Location Database:</strong> 386 airports + 3,648 ski resorts with intelligent normalization</li>
            <li style={{ marginBottom: '8px' }}><strong>Quote System:</strong> Multiple quotes per conversation with full persistence</li>
          </ul>

          <h3 style={{ color: '#ffffff', margin: '30px 0 15px 0', fontSize: '1.3rem', fontWeight: 500 }}>
            Ski-Lifts API Integration
          </h3>
          <ul style={{ color: '#cccccc', marginLeft: '20px', marginBottom: '16px' }}>
            <li style={{ marginBottom: '8px' }}><strong>Real-time Pricing:</strong> Live transfer options with actual pricing (€191-€611)</li>
            <li style={{ marginBottom: '8px' }}><strong>Multiple Transfer Types:</strong> Private, Shared, Executive, Luxury, Coach, Eco options</li>
            <li style={{ marginBottom: '8px' }}><strong>Smart Booking URLs:</strong> Deep links with pre-filled customer details</li>
            <li style={{ marginBottom: '8px' }}><strong>Dynamic Options:</strong> 5-7+ transfer options from Ski-Lifts API</li>
          </ul>

          <h3 style={{ color: '#ffffff', margin: '30px 0 15px 0', fontSize: '1.3rem', fontWeight: 500 }}>
            Browser Compatibility
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '20px'
          }}>
            {[
              { browser: 'Chrome', version: '49+', compatibility: '95%' },
              { browser: 'Firefox', version: '52+', compatibility: '90%' },
              { browser: 'Safari', version: '10+', compatibility: '85%' },
              { browser: 'Edge', version: '16+', compatibility: '90%' }
            ].map((item) => (
              <div
                key={item.browser}
                style={{
                  background: 'rgba(30, 30, 30, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '15px',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}
              >
                <div style={{ color: '#64ffda', fontWeight: 600, marginBottom: '5px' }}>
                  {item.browser} {item.version}
                </div>
                <div style={{ color: '#cccccc', fontSize: '0.9rem' }}>
                  {item.compatibility} compatibility
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ color: '#ffffff', margin: '30px 0 15px 0', fontSize: '1.3rem', fontWeight: 500 }}>
            Performance & Security
          </h3>
          <ul style={{ color: '#cccccc', marginLeft: '20px', marginBottom: '16px' }}>
            <li style={{ marginBottom: '8px' }}><strong>Iframe Isolation:</strong> Complete style and script isolation from parent page</li>
            <li style={{ marginBottom: '8px' }}><strong>CORS Headers:</strong> Properly configured for cross-origin embedding</li>
            <li style={{ marginBottom: '8px' }}><strong>localStorage Persistence:</strong> Conversation and preference storage</li>
            <li style={{ marginBottom: '8px' }}><strong>Responsive Design:</strong> Mobile-first approach with touch optimization</li>
            <li style={{ marginBottom: '8px' }}><strong>Error Handling:</strong> Graceful fallbacks and retry mechanisms</li>
          </ul>

          <div style={{
            padding: '20px',
            borderRadius: '8px',
            margin: '20px 0',
            borderLeft: '4px solid #4caf50',
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
            color: '#c8e6c9'
          }}>
            <strong>✅ Production Ready:</strong> The widget is currently deployed on AWS Elastic Beanstalk with full monitoring, error handling, and 99.9% uptime. All features are tested and production-ready.
          </div>
        </section>

        {/* Troubleshooting Section */}
        <section id="troubleshooting" style={{
          background: 'rgba(20, 20, 20, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '40px',
          marginBottom: '40px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          scrollMarginTop: '100px'
        }}>
          <h2 style={{
            color: '#ffffff',
            marginBottom: '20px',
            fontSize: '2rem',
            fontWeight: 600,
            borderBottom: '2px solid rgba(100, 255, 218, 0.3)',
            paddingBottom: '10px'
          }}>
            🔧 Troubleshooting
          </h2>
          
          <h3 style={{ color: '#ffffff', margin: '30px 0 15px 0', fontSize: '1.3rem', fontWeight: 500 }}>
            Common Issues
          </h3>
          
          <div style={{
            padding: '20px',
            borderRadius: '8px',
            margin: '20px 0',
            borderLeft: '4px solid #ffc107',
            background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%)',
            color: '#fff3c4'
          }}>
            <strong>Widget not loading?</strong>
            <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
                              <li>Check that the script URL is correct: <code>https://ski-lifts.nilgai.travel/widget.js</code></li>
              <li>Verify there are no JavaScript errors in the browser console</li>
              <li>Ensure CORS is not blocking the widget iframe from loading</li>
              <li>Check that your website allows iframe embedding</li>
              <li>Check for Content Security Policy (CSP) restrictions</li>
              <li>Make sure you don&apos;t have browser extensions blocking the widget</li>
            </ul>
          </div>

          <div style={{
            padding: '20px',
            borderRadius: '8px',
            margin: '20px 0',
            borderLeft: '4px solid #4caf50',
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
            color: '#c8e6c9'
          }}>
            <strong>Debugging Tips:</strong> 
            <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
              <li>Open the browser&apos;s developer console to view debug logs</li>
              <li>The widget logs actions with the <code>[SkiLiftsChat]</code> prefix</li>
              <li>If you see <code>CORS errors</code>, check that the domain is properly configured for cross-origin access</li>
              <li>On mobile devices, try disabling content blockers if the widget isn&apos;t loading</li>
            </ul>
          </div>
        </section>

        {/* Enhanced Reliability Section */}
        <section id="enhanced-reliability" style={{
          background: 'rgba(20, 20, 20, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '40px',
          marginBottom: '40px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          scrollMarginTop: '100px'
        }}>
          <h2 style={{
            color: '#ffffff',
            marginBottom: '20px',
            fontSize: '2rem',
            fontWeight: 600,
            borderBottom: '2px solid rgba(100, 255, 218, 0.3)',
            paddingBottom: '10px'
          }}>
            🔧 Enhanced Reliability
          </h2>
          
          <h3 style={{ color: '#ffffff', margin: '30px 0 15px 0', fontSize: '1.3rem', fontWeight: 500 }}>
            Self-Recovery Capabilities
          </h3>
          
          <div style={{
            padding: '20px',
            borderRadius: '8px',
            margin: '20px 0',
            borderLeft: '4px solid #ffc107',
            background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%)',
            color: '#fff3c4'
          }}>
            <h4 style={{ color: '#ffffff', marginBottom: '10px', fontSize: '1.1rem', fontWeight: 600 }}>Automatic Monitoring</h4>
            <p>The widget periodically checks if all its components are functioning correctly and automatically fixes issues if detected.</p>
          </div>
          
          <div style={{
            padding: '20px',
            borderRadius: '8px',
            margin: '20px 0',
            borderLeft: '4px solid #ffc107',
            background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%)',
            color: '#fff3c4'
          }}>
            <h4 style={{ color: '#ffffff', marginBottom: '10px', fontSize: '1.1rem', fontWeight: 600 }}>Error Recovery</h4>
            <p>Comprehensive error handling with fallback mechanisms ensures the widget works even in challenging environments.</p>
          </div>
          
          <div style={{
            padding: '20px',
            borderRadius: '8px',
            margin: '20px 0',
            borderLeft: '4px solid #ffc107',
            background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%)',
            color: '#fff3c4'
          }}>
            <h4 style={{ color: '#ffffff', marginBottom: '10px', fontSize: '1.1rem', fontWeight: 600 }}>Element Restoration</h4>
            <p>If widget elements are accidentally removed from the DOM, they will be automatically restored without user intervention.</p>
          </div>
          
          <div style={{
            padding: '20px',
            borderRadius: '8px',
            margin: '20px 0',
            borderLeft: '4px solid #ffc107',
            background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%)',
            color: '#fff3c4'
          }}>
            <h4 style={{ color: '#ffffff', marginBottom: '10px', fontSize: '1.1rem', fontWeight: 600 }}>Initialization Protection</h4>
            <p>Prevents multiple initializations and ensures proper loading sequence even with timing or script loading issues.</p>
          </div>

          <h3 style={{ color: '#ffffff', margin: '30px 0 15px 0', fontSize: '1.3rem', fontWeight: 500 }}>
            Cross-Domain Communication
          </h3>
          
          <p style={{ color: '#cccccc', marginBottom: '16px', lineHeight: '1.7' }}>
            The widget has been enhanced to work seamlessly across different domains:
          </p>
          
          <ul style={{ color: '#cccccc', marginLeft: '20px', marginBottom: '16px' }}>
            <li>Secure <code style={{ backgroundColor: 'rgba(40, 40, 40, 0.8)', color: '#64ffda', padding: '3px 8px', borderRadius: '6px', fontSize: '0.9em', border: '1px solid rgba(255, 255, 255, 0.1)' }}>postMessage</code> communication between parent page and widget iframe</li>
            <li>Improved origin handling for cross-domain compatibility</li>
            <li>Comprehensive logging for troubleshooting communication issues</li>
            <li>Automatic reconnection if communication is interrupted</li>
          </ul>
          
          <div style={{
            padding: '20px',
            borderRadius: '8px',
            margin: '20px 0',
            borderLeft: '4px solid #ffc107',
            background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%)',
            color: '#fff3c4'
          }}>
            <h4 style={{ color: '#ffffff', marginBottom: '10px', fontSize: '1.1rem', fontWeight: 600 }}>Client Integration Benefits</h4>
            <p style={{ color: '#cccccc', marginBottom: '16px', lineHeight: '1.7' }}>These enhancements provide several benefits for clients embedding the widget:</p>
            <ul style={{ color: '#cccccc', marginLeft: '20px', marginBottom: '16px' }}>
              <li>More reliable operation across various website environments</li>
              <li>Reduced support issues due to self-healing capabilities</li>
              <li>Better user experience with fewer interruptions</li>
              <li>Simplified integration with just a single script tag</li>
              <li>Automatic adaptation to different hosting environments</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
} 