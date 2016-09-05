'use strict';

module.exports = function(renderWidth, renderHeight) {
  const renderMousePos = {};

  renderMousePos.x = 0;
  renderMousePos.y = 0;

  window.addEventListener('mousemove', event => {
    const renderRatio = renderWidth / renderHeight;
    const screenRatio = window.innerWidth / window.innerHeight;

    if (screenRatio > renderRatio) {
      // Screen is wider which means there are bars on left and right
      const renderScreenWidth = renderRatio * window.innerHeight;
      const barWidth = 0.5 * (window.innerWidth - renderScreenWidth);
      renderMousePos.x = (event.clientX - barWidth) / renderScreenWidth * renderWidth;
      renderMousePos.y = event.clientY / window.innerHeight * renderHeight;
    } else {
      // Screen is taller which means there are bars on top and bottom
      const renderScreenHeight = window.innerWidth / renderRatio;
      const barHeight = 0.5 * (window.innerHeight - renderScreenHeight);
      renderMousePos.x = event.clientX / window.innerWidth * renderWidth;
      renderMousePos.y = (event.clientY - barHeight) / renderScreenHeight * renderHeight;
    }

    // Y coordinate needs flipping due to page direction vs cartesian direction
    renderMousePos.y = renderHeight - renderMousePos.y;
  });

  return renderMousePos;
};
