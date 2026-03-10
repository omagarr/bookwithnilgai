/**
 * Ski-Lifts Chat Widget - Standalone Version
 * This file should be loaded directly from: https://ski-lifts.nilgai.travel/widget.js
 */

(function() {
  // Define a unique global key to avoid conflicts
  const WIDGET_LOADED_KEY = '__SKI_LIFTS_WIDGET_LOADED';
  
  // Check if the widget has already been loaded
  if (window[WIDGET_LOADED_KEY]) {
    return;
  }
  
  // Also check if SkiLiftsChat already exists
  if (window.SkiLiftsChat && window.SkiLiftsChat._initialized) {
    return;
  }
  
  // Mark as loaded immediately to prevent race conditions
  window[WIDGET_LOADED_KEY] = true;
  
  // Environment detection and configuration
  function getEnvironmentConfig() {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('localhost');
    
    if (isLocalhost) {
      return {
        widgetUrl: 'http://localhost:3001',
        apiUrl: 'http://localhost:3000'
      };
    } else if (hostname.includes('staging')) {
      // Staging environment
      return {
        widgetUrl: 'https://stagingb2b.nilgai.travel',
        apiUrl: 'https://stagingapib2b.nilgai.travel'
      };
    } else {
      // Production environment
      return {
        widgetUrl: 'https://ski-lifts.nilgai.travel',
        apiUrl: 'https://apib2b.nilgai.travel'
      };
    }
  }
  
  // Mobile detection utility
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
  }
  
  // Get responsive dimensions
  function getResponsiveDimensions() {
    const isMobile = isMobileDevice();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    if (isMobile) {
      return {
        width: Math.min(viewportWidth - 11, 360), // 5.5px margin on each side (reduced by half)
        height: Math.min(viewportHeight - 35, 600), // 17.5px margin top/bottom (reduced by half)
        isMobile: true
      };
    } else {
      return {
        width: 400,
        height: 600,
        isMobile: false
      };
    }
  }
  
  const envConfig = getEnvironmentConfig();
  
  // Create global widget object with all methods
  window.SkiLiftsChat = {
    // Configuration options with environment-aware defaults
    config: {
      position: 'bottom-right',
      initiallyMinimized: true,
      widgetUrl: envConfig.widgetUrl,
      apiUrl: envConfig.apiUrl,
      containerId: 'ski-lifts-chat-widget-container'
    },
    
    // Internal state
    _initialized: false,
    _minimized: true,
    _minimizedButton: null,
    _iframe: null,
    _textBubble: null,
    
    // State persistence methods
    _getStorageKey: function() {
      return 'skiLiftsWidget_minimized_' + window.location.hostname;
    },
    
    _saveState: function() {
      try {
        localStorage.setItem(this._getStorageKey(), JSON.stringify(this._minimized));
      } catch (e) {
        // localStorage might be disabled, fail silently
        console.warn('Failed to save widget state:', e);
      }
    },
    
    _loadState: function() {
      try {
        const saved = localStorage.getItem(this._getStorageKey());
        if (saved !== null) {
          return JSON.parse(saved);
        }
      } catch (e) {
        // localStorage might be disabled or corrupted, fail silently
        console.warn('Failed to load widget state:', e);
      }
      return this.config.initiallyMinimized;
    },
    
    init: function(customConfig = {}) {
      if (this._initialized) {
        return this;
      }
      
      // Apply any custom config
      this.config = { ...this.config, ...customConfig };
      
      // Restore saved state or use default
      this._minimized = this._loadState();
      
      // Set up message listener
      this._setupMessageListener();
      
      // Load the widget
      this.loadWidget();
      
      // Mark as initialized
      this._initialized = true;
      
      return this;
    },
    
    loadWidget: function() {
      if (!document.body) {
        setTimeout(() => this.loadWidget(), 50);
        return;
      }
      
      // Create container if it doesn't exist
      let container = document.getElementById(this.config.containerId);
      if (!container) {
        container = document.createElement('div');
        container.id = this.config.containerId;
        container.style.position = 'fixed';
        container.style.zIndex = '9999';
        
        // Apply responsive positioning
        this._applyContainerPositioning(container, this._minimized);
        
        document.body.appendChild(container);
      }
      
      if (this._minimized) {
        this._createMinimizedButton();
      } else {
        this._createChatInterface();
      }
    },
    
    _applyContainerPositioning: function(container, isMinimized = false) {
      const isMobile = isMobileDevice();
      
      // Always use configured position, no special centering on mobile
      container.style.transform = 'none';
      
      if (isMobile && !isMinimized) {
        // On mobile, make the expanded chat fill the safe area with small margins to maintain widget feeling
        container.style.top = '0.75rem';
        container.style.bottom = '0.75rem';
        container.style.left = '0.75rem';
        container.style.right = '0.75rem';
        container.style.width = 'auto';
        container.style.height = 'auto';
        container.style.maxWidth = 'none';
        container.style.maxHeight = 'none';
      } else {
        // Use configured position for desktop OR minimized button
        switch (this.config.position) {
          case 'bottom-right':
            container.style.bottom = '1.5rem';
            container.style.right = '1.5rem';
            container.style.top = 'auto';
            container.style.left = 'auto';
            container.style.width = 'auto';
            container.style.height = 'auto';
            break;
          case 'bottom-left':
            container.style.bottom = '1.5rem';
            container.style.left = '1.5rem';
            container.style.top = 'auto';
            container.style.right = 'auto';
            container.style.width = 'auto';
            container.style.height = 'auto';
            break;
          case 'top-right':
            container.style.top = '1.5rem';
            container.style.right = '1.5rem';
            container.style.bottom = 'auto';
            container.style.left = 'auto';
            container.style.width = 'auto';
            container.style.height = 'auto';
            break;
          case 'top-left':
            container.style.top = '1.5rem';
            container.style.left = '1.5rem';
            container.style.bottom = 'auto';
            container.style.right = 'auto';
            container.style.width = 'auto';
            container.style.height = 'auto';
            break;
        }
      }
    },
    
    _createMinimizedButton: function() {
      const container = document.getElementById(this.config.containerId);
      if (!container) {
        console.error('Container not found when creating button');
        return;
      }
      
      // Reapply positioning for the current screen size
      this._applyContainerPositioning(container, true);
      
      container.innerHTML = '';
      
      const isMobile = isMobileDevice();
      
      const buttonContainer = document.createElement('div');
      buttonContainer.style.display = 'flex';
      buttonContainer.style.alignItems = 'center';
      buttonContainer.style.gap = '12px';
      buttonContainer.style.flexDirection = 'row';
      
      const textBubble = document.createElement('div');
      textBubble.style.background = '#002850';
      textBubble.style.padding = isMobile ? '8px 12px' : '12px 20px';
      textBubble.style.borderRadius = '24px';
      textBubble.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.1)';
      textBubble.style.whiteSpace = 'nowrap';
      textBubble.style.textAlign = 'center';
      textBubble.innerText = 'AI Assistant';
      textBubble.style.color = '#66b3d6';
      textBubble.style.fontSize = isMobile ? '12px' : '14px';
      textBubble.style.cursor = 'pointer';
      textBubble.style.flexShrink = '0';
      
      const chatButton = document.createElement('button');
      const buttonSize = isMobile ? '48px' : '56px';
      chatButton.style.width = buttonSize;
      chatButton.style.height = buttonSize;
      chatButton.style.borderRadius = '50%';
      chatButton.style.background = '#1b3a4b';
      chatButton.style.border = '2px solid #002850';
      chatButton.style.cursor = 'pointer';
      chatButton.style.padding = '0';
      chatButton.style.overflow = 'hidden';
      chatButton.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 40, 80, 0.15)';
      chatButton.style.transition = 'background-color 0.2s';
      
      // Create image element for Claire
      const claireImage = document.createElement('img');
      claireImage.src = this.config.widgetUrl + '/Claire - Grey BG.png';
      claireImage.style.width = '100%';
      claireImage.style.height = '100%';
      claireImage.style.objectFit = 'cover';
      claireImage.style.display = 'block';
      claireImage.alt = 'AI Assistant';
      
      chatButton.appendChild(claireImage);
      
      chatButton.onmouseover = function() {
        this.style.backgroundColor = '#2b4a5b';
      };
      chatButton.onmouseout = function() {
        this.style.backgroundColor = '#1b3a4b';
      };
      
      chatButton.onclick = () => {
        this.maximize();
      };
      
      textBubble.onclick = () => {
        this.maximize();
      };
      
      buttonContainer.appendChild(textBubble);
      buttonContainer.appendChild(chatButton);
      container.appendChild(buttonContainer);
      
      this._minimizedButton = buttonContainer;
      this._textBubble = textBubble;
    },
    
    _createChatInterface: function() {
      const container = document.getElementById(this.config.containerId);
      if (!container) {
        console.error('Container not found when creating chat interface');
        return;
      }
      
      // Reapply positioning for the current screen size
      this._applyContainerPositioning(container, false);
      
      container.innerHTML = '';
      
      // Get responsive dimensions
      const dimensions = getResponsiveDimensions();
      
      // Set API URL as a URL parameter to pass it to the iframe
      let iframeSrc = this.config.widgetUrl;
      if (iframeSrc.includes('?')) {
        iframeSrc += '&embed=true&apiUrl=' + encodeURIComponent(this.config.apiUrl);
      } else {
        iframeSrc += '/?embed=true&apiUrl=' + encodeURIComponent(this.config.apiUrl);
      }
      
      const iframe = document.createElement('iframe');
      iframe.id = 'ski-lifts-chat-iframe';
      iframe.src = iframeSrc;
      
      // Add microphone permission for cross-origin access
      // The asterisk (*) allows microphone permission for all origins within the iframe
      iframe.setAttribute('allow', 'microphone *');
      
      // Add lazy loading and performance optimizations for iframe
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('importance', 'low');
      iframe.setAttribute('decoding', 'async');
      
      // Set iframe dimensions based on mobile or desktop
      if (dimensions.isMobile) {
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.borderRadius = '16px';
      } else {
        iframe.style.width = dimensions.width + 'px';
        iframe.style.height = dimensions.height + 'px';
        iframe.style.borderRadius = '16px';
      }
      
      iframe.style.border = 'none';
      iframe.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
      iframe.style.backgroundColor = 'white';
      iframe.style.maxWidth = '100vw';
      iframe.style.maxHeight = '100vh';
      
      container.appendChild(iframe);
      this._iframe = iframe;
    },
    
    _clearContainer: function() {
      const container = document.getElementById(this.config.containerId);
      if (container) {
        container.innerHTML = '';
      }
    },
    
    _setupMessageListener: function() {
      window.addEventListener('message', (event) => {
        try {
          if (event.data && event.data.type) {
            switch (event.data.type) {
              case 'CHAT_CLOSE':
              case 'WIDGET_CLOSE':
              case 'WIDGET_STATE_CHANGE':
                this.minimize();
                break;
              case 'CHAT_READY':
                break;
            }
          }
        } catch (err) {
          console.error("Error processing postMessage:", err);
        }
      });
    },
    
    minimize: function() {
      this._minimized = true;
      this._saveState();
      this._createMinimizedButton();
    },
    
    maximize: function() {
      this._minimized = false;
      this._saveState();
      this._createChatInterface();
    },
    
    toggle: function() {
      if (this._minimized) {
        this.maximize();
      } else {
        this.minimize();
      }
    },
    
    // Add method to handle window resize with debouncing
    _handleResize: function() {
      // Clear any existing timeout to debounce resize events
      if (this._resizeTimeout) {
        clearTimeout(this._resizeTimeout);
      }
      
      // Debounce resize events to prevent excessive updates
      this._resizeTimeout = setTimeout(() => {
        this._performResize();
      }, 150);
    },
    
    _performResize: function() {
      // Get current dimensions
      const currentDimensions = getResponsiveDimensions();
      
      // Store last known dimensions to compare
      if (!this._lastDimensions) {
        this._lastDimensions = currentDimensions;
      }
      
      // Only update if dimensions changed significantly (more than 20px difference)
      const dimensionsChanged = 
        Math.abs(currentDimensions.width - this._lastDimensions.width) > 20 ||
        Math.abs(currentDimensions.height - this._lastDimensions.height) > 20 ||
        currentDimensions.isMobile !== this._lastDimensions.isMobile;
      
      if (!dimensionsChanged) {
        return; // Skip unnecessary updates
      }
      
      // Update stored dimensions
      this._lastDimensions = currentDimensions;
      
      // Update positioning and sizing only when needed
      if (this._minimized) {
        this._updateMinimizedButton();
      } else {
        this._updateChatInterface();
      }
    },
    
    _updateMinimizedButton: function() {
      const container = document.getElementById(this.config.containerId);
      if (!container) return;
      
      // Just update positioning without recreating the entire button
      this._applyContainerPositioning(container, true);
    },
    
    _updateChatInterface: function() {
      const container = document.getElementById(this.config.containerId);
      const iframe = this._iframe;
      
      if (!container || !iframe) {
        // If elements don't exist, fall back to recreation
        this._createChatInterface();
        return;
      }
      
      // Update positioning and dimensions without recreating iframe
      this._applyContainerPositioning(container, false);
      
      const dimensions = getResponsiveDimensions();
      
      // Set iframe dimensions based on mobile or desktop
      if (dimensions.isMobile) {
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.borderRadius = '16px';
      } else {
        iframe.style.width = dimensions.width + 'px';
        iframe.style.height = dimensions.height + 'px';
        iframe.style.borderRadius = '16px';
      }
    },
    
    destroy: function() {
      this._clearContainer();
      // Remove resize listener if it exists
      if (this._resizeHandler) {
        window.removeEventListener('resize', this._resizeHandler);
      }
      // Remove orientation listener if it exists
      if (this._orientationHandler) {
        window.removeEventListener('orientationchange', this._orientationHandler);
      }
      // Clear any pending resize timeout
      if (this._resizeTimeout) {
        clearTimeout(this._resizeTimeout);
        this._resizeTimeout = null;
      }
    }
  };

  // Apply any custom config if provided
  if (window.__CHAT_WIDGET_CONFIG) {
    window.SkiLiftsChat.config = { ...window.SkiLiftsChat.config, ...window.__CHAT_WIDGET_CONFIG };
  }
  
  // Lazy initialization with performance optimizations
  function initializeWidget() {
    try {
      if (!window.SkiLiftsChat) {
        console.error('SkiLiftsChat object not found!');
        return false;
      }
      
      if (window.SkiLiftsChat._initialized) {
        return true;
      }
      
      window.SkiLiftsChat.init();
      
      // Add resize listener to handle orientation changes and window resizing
      window.SkiLiftsChat._resizeHandler = function() {
        window.SkiLiftsChat._handleResize();
      };
      
      // Add orientation change handler with initialization delay
      window.SkiLiftsChat._orientationHandler = function() {
        // Ignore orientation changes during initial load (first 1000ms)
        if (Date.now() - window.SkiLiftsChat._initTime < 1000) {
          return;
        }
        window.SkiLiftsChat._handleResize();
      };
      
      // Track initialization time
      window.SkiLiftsChat._initTime = Date.now();
      
      window.addEventListener('resize', window.SkiLiftsChat._resizeHandler);
      window.addEventListener('orientationchange', window.SkiLiftsChat._orientationHandler);
      
      return true;
      
    } catch (error) {
      console.error('Error during widget initialization:', error);
      return false;
    }
  }
  
  // Balanced initialization - good SEO without hurting UX
  function balancedInitialization() {
    // Use requestIdleCallback for non-blocking initialization, with short timeout
    const idleCallback = window.requestIdleCallback || function(cb) { setTimeout(cb, 1); };
    
    idleCallback(function() {
      initializeWidget();
    }, { timeout: 500 }); // Max 500ms wait for idle
  }
  
  // Initialize after DOM is interactive but before full page load
  function initializeAfterDOMReady() {
    if (document.readyState === 'complete') {
      // Page already fully loaded, show immediately
      balancedInitialization();
    } else if (document.readyState === 'interactive') {
      // DOM ready, CSS loaded, but images may still be loading - perfect timing!
      setTimeout(balancedInitialization, 100);
    } else {
      // Wait for DOM to be interactive (much faster than 'load' event)
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(balancedInitialization, 200);
      });
    }
  }
  
  // Much simpler and faster loading strategy
  function createBalancedLoader() {
    // Check if we should initialize immediately
    if (document.readyState !== 'loading') {
      initializeAfterDOMReady();
      return;
    }
    
    // Otherwise wait for DOM ready
    document.addEventListener('DOMContentLoaded', initializeAfterDOMReady);
    
    // Fallback timer - much shorter for better UX
    setTimeout(function() {
      if (!window.SkiLiftsChat._initialized) {
        balancedInitialization();
      }
    }, 1500); // Reduced from 3000ms to 1500ms
  }
  
  // Start the balanced loading process
  createBalancedLoader();
})(); 