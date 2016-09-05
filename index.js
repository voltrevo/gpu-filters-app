'use strict';

const colorSwapWithCircle = require('./colorSwapWithCircle.js');

const {
  RENDER_HEIGHT,
  RENDER_WIDTH,
  CAMERA_HEIGHT,
  CAMERA_WIDTH,
} = require('./constants.js');

const fpsDisplay = require('./FpsDisplay')();
const FullSizeRenderer = require('./FullSizeRenderer');
const getCameraData = require('./getCameraData.js')();
const renderLoop = require('./renderLoop.js');
const renderMousePos = require('./RenderMousePos.js')(RENDER_WIDTH, RENDER_HEIGHT);

const filters = {
  'Color Swap with Circle': colorSwapWithCircle,
};

window.addEventListener('load', () => {
  document.body.style.fontFamily = 'sans-serif';
  document.body.style.height = '100vh';
  document.body.style.overflow = 'hidden';

  const render = FullSizeRenderer(colorSwapWithCircle);

  renderLoop((dt, fps) => {
    fpsDisplay.textContent = `FPS: ${fps.toFixed(1)}`;

    const cameraData = getCameraData();

    if (!cameraData) {
      return;
    }

    render(renderMousePos.x, renderMousePos.y, cameraData, CAMERA_WIDTH, CAMERA_HEIGHT);
  });
});
