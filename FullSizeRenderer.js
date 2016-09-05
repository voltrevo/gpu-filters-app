'use strict';

const once = require('lodash/once');

const GPU = require('./GPU.js');

const {
  RENDER_WIDTH,
  RENDER_HEIGHT,
} = require('./constants.js');

const gpu = new GPU();

module.exports = function(kernel) {
  const render = gpu
    .createKernel(kernel)
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

  return function(mouseX, mouseY, cameraData, cameraWidth, cameraHeight) {
    render(mouseX, mouseY, cameraData, cameraWidth, cameraHeight);
    setupCanvas();
  };
};
