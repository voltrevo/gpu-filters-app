'use strict';

const colorSwapWithCircle = require('./colorSwapWithCircle.js');

const {
  RENDER_HEIGHT,
  RENDER_WIDTH,
  CAMERA_HEIGHT,
  CAMERA_WIDTH,
} = require('./constants.js');

const FilterSelector = require('./FilterSelector.js');
const fpsDisplay = require('./FpsDisplay')();
const FullSizeRenderer = require('./FullSizeRenderer');
const getCameraData = require('./getCameraData.js')();
const renderLoop = require('./renderLoop.js');
const renderMousePos = require('./RenderMousePos.js')(RENDER_WIDTH, RENDER_HEIGHT);

const filters = {
  'Color Swap with Circle': colorSwapWithCircle,
};

const renderers = {};

window.addEventListener('load', () => {
  document.body.style.fontFamily = 'sans-serif';
  document.body.style.height = '100vh';
  document.body.style.overflow = 'hidden';

  let currRenderer = null;
  let currRenderLoop = null;

  FilterSelector(Object.keys(filters), filterName => {
    if (currRenderer) {
      currRenderer.stop();
      currRenderLoop.stop();
    }

    const filter = filters[filterName];
    const renderer = renderers[filterName] || FullSizeRenderer(filter);
    renderers[filterName] = renderer;
    currRenderer = renderer;

    currRenderLoop = renderLoop((dt, fps) => {
      fpsDisplay.textContent = `FPS: ${fps.toFixed(1)}`;

      const cameraData = getCameraData();

      if (!cameraData) {
        return;
      }

      renderer.render(renderMousePos.x, renderMousePos.y, cameraData, CAMERA_WIDTH, CAMERA_HEIGHT);
    });
  });
});
