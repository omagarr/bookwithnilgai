/**
 * Ski-Lifts Chat Embed - Inline Version
 * This file should be loaded directly from: https://ski-lifts.nilgai.travel/embed.js
 * 
 * Unlike the widget version, this creates an inline embeddable chat interface
 * that takes the full available space of its container element.
 */

(function() {
  // Define a unique global key to avoid conflicts
  const EMBED_LOADED_KEY = '__SKI_LIFTS_EMBED_LOADED';
  
  // Check if the embed has already been loaded
  if (window[EMBED_LOADED_KEY]) {
    console.warn('Ski-Lifts Chat Embed already loaded');
    return;
  }
  
  // Mark as loaded immediately to prevent race conditions
  window[EMBED_LOADED_KEY] = true;
  
  // Environment detection and configuration
  function getEnvironmentConfig() {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('localhost');
    
    if (isLocalhost) {
      return {
        embedUrl: 'http://localhost:3001/embed',
        apiUrl: 'http://localhost:3000'
      };
    } else if (hostname.includes('staging')) {
      // Staging environment
      return {
        embedUrl: 'https://stagingb2b.nilgai.travel/embed',
        apiUrl: 'https://stagingapib2b.nilgai.travel'
      };
    } else {
      // Production environment
      return {
        embedUrl: 'https://ski-lifts.nilgai.travel/embed',
        apiUrl: 'https://apib2b.nilgai.travel'
      };
    }
  }
  
  const envConfig = getEnvironmentConfig();
  
  // Create global embed object with all methods
  window.SkiLiftsEmbed = {
    // Configuration options
    config: {
      embedUrl: envConfig.embedUrl,
      apiUrl: envConfig.apiUrl,
      defaultHeight: '600px',
      defaultWidth: '100%',
      className: '',
      style: {}
    },
    
    // Internal state
    _initialized: false,
    _embeds: [],
    
    /**
     * Initialize an embed in a specific container
     * @param {string|HTMLElement} container - Container element or selector
     * @param {Object} options - Configuration options
     * @returns {HTMLIFrameElement} The created iframe element
     */
    init: function(container, options = {}) {
      // Get container element
      let containerEl;
      if (typeof container === 'string') {
        containerEl = document.querySelector(container);
      } else if (container instanceof HTMLElement) {
        containerEl = container;
      }
      
      if (!containerEl) {
        console.error('Ski-Lifts Embed: Container element not found', container);
        return null;
      }
      
      // Check if already initialized in this container
      if (containerEl.querySelector('.ski-lifts-embed-iframe')) {
        console.warn('Ski-Lifts Embed: Already initialized in this container');
        return containerEl.querySelector('.ski-lifts-embed-iframe');
      }
      
      // Merge options with defaults
      const config = { ...this.config, ...options };
      
      // Create iframe
      const iframe = this.createIframe(config);
      
      // Apply container styles
      this.applyContainerStyles(containerEl, config);
      
      // Add iframe to container
      containerEl.appendChild(iframe);
      
      // Track embed
      this._embeds.push({
        container: containerEl,
        iframe: iframe,
        config: config
      });
      
      // Mark as initialized
      if (!this._initialized) {
        this._initialized = true;
        this.setupMessageListener();
      }
      
      return iframe;
    },
    
    /**
     * Create iframe element with configuration
     * @param {Object} config - Configuration options
     * @returns {HTMLIFrameElement} The created iframe element
     */
    createIframe: function(config) {
      const iframe = document.createElement('iframe');
      iframe.className = 'ski-lifts-embed-iframe';
      iframe.src = config.embedUrl;
      
      // Add microphone permission for cross-origin access
      // The asterisk (*) allows microphone permission for all origins within the iframe
      iframe.setAttribute('allow', 'microphone *');
      
      // Set dimensions
      iframe.style.width = config.width || config.defaultWidth;
      iframe.style.height = config.height || config.defaultHeight;
      iframe.style.border = 'none';
      iframe.style.borderRadius = config.borderRadius || '8px';
      iframe.style.backgroundColor = 'white';
      
      // Add any custom styles
      if (config.style) {
        Object.assign(iframe.style, config.style);
      }
      
      // Add custom class if provided
      if (config.className) {
        iframe.className += ' ' + config.className;
      }
      
      return iframe;
    },
    
    /**
     * Apply styles to container element
     * @param {HTMLElement} container - Container element
     * @param {Object} config - Configuration options
     */
    applyContainerStyles: function(container, config) {
      // Only apply minimal styles to preserve container's existing layout
      if (!container.style.position || container.style.position === 'static') {
        container.style.position = 'relative';
      }
      
      // Ensure container has minimum dimensions if not set
      if (!container.style.minHeight && (!config.height || config.height === '100%')) {
        container.style.minHeight = config.defaultHeight;
      }
    },
    
    /**
     * Setup message listener for iframe communication
     */
    setupMessageListener: function() {
      window.addEventListener('message', (event) => {
        try {
          if (event.data && event.data.type) {
            switch (event.data.type) {
              case 'EMBED_READY':
                // Send configuration to embed
                this._embeds.forEach(embed => {
                  if (embed.iframe.contentWindow === event.source) {
                    embed.iframe.contentWindow.postMessage({
                      type: 'EMBED_CONFIG',
                      apiUrl: embed.config.apiUrl,
                      timestamp: Date.now()
                    }, '*');
                  }
                });
                break;
            }
          }
        } catch (err) {
          console.error('Error processing postMessage:', err);
        }
      });
    },
    
    /**
     * Initialize all elements with data-ski-lifts-embed attribute
     * This provides an alternative declarative way to initialize embeds
     */
    initAll: function() {
      const elements = document.querySelectorAll('[data-ski-lifts-embed]');
      elements.forEach(el => {
        const options = {};
        
        // Parse data attributes for configuration
        if (el.dataset.embedHeight) options.height = el.dataset.embedHeight;
        if (el.dataset.embedWidth) options.width = el.dataset.embedWidth;
        if (el.dataset.embedBorderRadius) options.borderRadius = el.dataset.embedBorderRadius;
        if (el.dataset.embedClass) options.className = el.dataset.embedClass;
        
        this.init(el, options);
      });
    },
    
    /**
     * Remove an embed from a container
     * @param {string|HTMLElement} container - Container element or selector
     */
    remove: function(container) {
      let containerEl;
      if (typeof container === 'string') {
        containerEl = document.querySelector(container);
      } else if (container instanceof HTMLElement) {
        containerEl = container;
      }
      
      if (!containerEl) return;
      
      // Find and remove embed
      const embedIndex = this._embeds.findIndex(e => e.container === containerEl);
      if (embedIndex !== -1) {
        const embed = this._embeds[embedIndex];
        embed.iframe.remove();
        this._embeds.splice(embedIndex, 1);
      }
    },
    
    /**
     * Remove all embeds
     */
    removeAll: function() {
      this._embeds.forEach(embed => {
        embed.iframe.remove();
      });
      this._embeds = [];
    }
  };
  
  // Auto-initialize declarative embeds when DOM is ready
  function autoInit() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        window.SkiLiftsEmbed.initAll();
      });
    } else {
      // DOM already loaded
      setTimeout(() => {
        window.SkiLiftsEmbed.initAll();
      }, 0);
    }
  }
  
  // Check for auto-init flag
  const script = document.currentScript;
  if (script && script.dataset.autoInit !== 'false') {
    autoInit();
  }
  
  // Expose a ready promise for programmatic usage
  window.SkiLiftsEmbed.ready = new Promise((resolve) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve);
    } else {
      resolve();
    }
  });
})();
