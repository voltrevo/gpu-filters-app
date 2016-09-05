'use strict';

const GPU = require('./GPU.js');

const colorSwapWithCircle = require('./colorSwapWithCircle.js');

const {
  RENDER_HEIGHT,
  RENDER_WIDTH,
  CAMERA_HEIGHT,
  CAMERA_WIDTH,
} = require('./constants.js');

const getCameraData = require('./getCameraData.js')();
const renderLoop = require('./renderLoop.js');

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

  render(0, 0, [0], CAMERA_WIDTH, CAMERA_HEIGHT);

  const canvas = render.getCanvas();
  canvas.style.position = 'absolute';
  canvas.style.left = '0px';
  canvas.style.top = '0px';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.objectFit = 'contain';
  document.body.appendChild(canvas);

  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', event => {
    const renderRatio = RENDER_WIDTH / RENDER_HEIGHT;
    const screenRatio = window.innerWidth / window.innerHeight;

    if (screenRatio > renderRatio) {
      // Screen is wider which means there are bars on left and right
      const renderScreenWidth = renderRatio * window.innerHeight;
      const barWidth = 0.5 * (window.innerWidth - renderScreenWidth);
      mouseX = (event.clientX - barWidth) / renderScreenWidth * RENDER_WIDTH;
      mouseY = event.clientY / window.innerHeight * RENDER_HEIGHT;
    } else {
      // Screen is taller which means there are bars on top and bottom
      const renderScreenHeight = window.innerWidth / renderRatio;
      const barHeight = 0.5 * (window.innerHeight - renderScreenHeight);
      mouseX = event.clientX / window.innerWidth * RENDER_WIDTH;
      mouseY = (event.clientY - barHeight) / renderScreenHeight * RENDER_HEIGHT;
    }

    // Y coordinate needs flipping due to page direction vs cartesian direction
    mouseY = RENDER_HEIGHT - mouseY;
  });

  const fpsDisplay = document.createElement('div');
  fpsDisplay.style.position = 'absolute';
  fpsDisplay.style.right = '10px';
  fpsDisplay.style.top = '10px';
  fpsDisplay.style.padding = '10px';
  fpsDisplay.style.borderRadius = '10px';
  fpsDisplay.style.backgroundColor = '#444';
  fpsDisplay.style.color = '#fff';

  document.body.appendChild(fpsDisplay);

  renderLoop((dt, fps) => {
    fpsDisplay.textContent = `FPS: ${fps.toFixed(1)}`;

    const cameraData = getCameraData();

    if (!cameraData) {
      return;
    }

    render(mouseX, mouseY, cameraData, CAMERA_WIDTH, CAMERA_HEIGHT);
  });
});
