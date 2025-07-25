(function() {
  // Create the embed script
  window.ChatbotEmbed = {
    init: function(chatbotId, options = {}) {
      const {
        position = 'bottom-right',
        theme = 'light',
        width = 350,
        height = 500
      } = options;

      // Create iframe
      const iframe = document.createElement('iframe');
      iframe.src = `${window.location.origin}/embed/${chatbotId}`;
      iframe.width = width;
      iframe.height = height;
      iframe.frameBorder = '0';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '8px';
      iframe.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';

      // Create container
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.zIndex = '9999';
      
      const positionStyles = {
        'bottom-right': { bottom: '20px', right: '20px' },
        'bottom-left': { bottom: '20px', left: '20px' },
        'top-right': { top: '20px', right: '20px' },
        'top-left': { top: '20px', left: '20px' }
      };

      Object.assign(container.style, positionStyles[position]);
      container.appendChild(iframe);

      // Add to page
      document.body.appendChild(container);

      return container;
    }
  };
})(); 