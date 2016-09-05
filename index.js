'use strict';

const once = require('lodash/once');

const GPU = require('./GPU.js');

const colorSwapWithCircle = require('./colorSwapWithCircle.js');

const {
  RENDER_HEIGHT,
  RENDER_WIDTH,
  CAMERA_HEIGHT,
  CAMERA_WIDTH,
} = require('./constants.js');

const fpsDisplay = require('./FpsDisplay')();
const getCameraData = require('./getCameraData.js')();
const renderLoop = require('./renderLoop.js');
const renderMousePos = require('./RenderMousePos.js')(RENDER_WIDTH, RENDER_HEIGHT);

const filters = {
  'Color Swap with Circle': colorSwapWithCircle,
};

const gpu = new GPU();

window.addEventListener('load', () => {
  document.body.style.fontFamily = 'sans-serif';
  document.body.style.height = '100vh';
  document.body.style.overflow = 'hidden';

  const render = gpu
    .createKernel(colorSwapWithCircle)
    .dimensions([RENDER_WIDTH, RENDER_HEIGHT])
    .graphical(true)
  ;

  const setupCanvas = once(() => {
    const canvas = render.getCanvas();
    canvas.style.position = 'absolute';
    canvas.style.left = '0px';
    canvas.style.top = '0px';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.objectFit = 'contain';
    document.body.appendChild(canvas);
  });

  renderLoop((dt, fps) => {
    fpsDisplay.textContent = `FPS: ${fps.toFixed(1)}`;

    const cameraData = getCameraData();

    if (!cameraData) {
      return;
    }

    render(renderMousePos.x, renderMousePos.y, cameraData, CAMERA_WIDTH, CAMERA_HEIGHT);
    setupCanvas();
  });
});
