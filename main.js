(() => {
  /**
   * Define
   */
  const containerId = 'gcp-custom-html-message-container';

  const containerStyles = `
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    pointer-events: none;
  `;

  const msgBoxStyles = `
    font-size: 88px;
    font-weight: bold;
    opacity: 0.3;
    pointer-events: none;
  `;

  /**
   * Environment color
   */
  const development = {
    color: 'blue',
  };

  const staging = {
    color: 'orange',
  };

  const production = {
    color: 'red',
  };

  const msgBox = {
    generate: (project) => {
      const container = document.createElement('div');
      container.id = containerId;
      container.style = containerStyles;

      const msgBox = document.createElement('div');
      
      if (/^(dev|development)+?/.test(project)) {
        msgBox.style = msgBoxStyles + ' color: ' + development.color;
        msgBox.innerHTML = 'DEVELOPMENT';
      } else if (/^(stg|staging)+?/.test(project)) {
        msgBox.style = msgBoxStyles + ' color: ' + staging.color;
        msgBox.innerHTML = 'STAGING';
      } else if (/^(prod|production)+?/.test(project)) {
        msgBox.style = msgBoxStyles + ' color: ' + production.color;
        msgBox.innerHTML = 'PRODUCTION';
      } else {
        msgBox.style = msgBoxStyles + development.color;
        msgBox.innerHTML = 'UNKNOWN ENVIRONMENT';
      }

      container.appendChild(msgBox)

      document.body.appendChild(container);
    },
    remove: () => {
      document.querySelector(`#${containerId}`).remove();
    },
  }

  const analyzeProject = (url) => {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('project') || '';
  };

  /**
   * Process
   */
  let currentUrl;

  window.addEventListener('load', () => {
    currentUrl = document.location.href;

    msgBox.generate(analyzeProject(document.location.href));

    const URLobserver = new MutationObserver(() => {
      if (currentUrl === document.location.href) return;

      msgBox.remove();

      msgBox.generate(analyzeProject(document.location.href));

      currentUrl = document.location.href;
    });

    URLobserver.observe(document, { childList: true, subtree: true });
  });
})();
