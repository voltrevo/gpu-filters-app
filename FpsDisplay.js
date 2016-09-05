'use strict';

module.exports = function() {
  const fpsDisplay = document.createElement('div');
  fpsDisplay.style.position = 'absolute';
  fpsDisplay.style.right = '10px';
  fpsDisplay.style.top = '10px';
  fpsDisplay.style.padding = '10px';
  fpsDisplay.style.borderRadius = '10px';
  fpsDisplay.style.backgroundColor = '#444';
  fpsDisplay.style.color = '#fff';
  fpsDisplay.style.zIndex = '1';

  if (document.body) {
    document.body.appendChild(fpsDisplay);
  } else {
    window.addEventListener('load', () => {
      document.body.appendChild(fpsDisplay);
    });
  }

  return fpsDisplay;
};
