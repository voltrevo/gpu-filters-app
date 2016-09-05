'use strict';

const GPU = require('./GPU.js');

const gpu = new GPU();

const RENDER_WIDTH = 1280;
const RENDER_HEIGHT = 720;

window.addEventListener('load', () => {
  document.body.style.fontFamily = 'sans-serif';

  // navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
  //   document.body.style.backgroundColor = '#000';
  //   document.body.style.height = '100vh';
  //   document.body.style.overflow = 'hidden';

  //   const video = document.createElement('video');
  //   video.srcObject = stream;
  //   video.play();
  //   document.body.appendChild(video);
  //   video.style.position = 'absolute';
  //   video.style.left = '0px';
  //   video.style.top = '0px';
  //   video.style.width = '100vw';
  //   video.style.height = '100vh';
  //   video.style.objectFit = 'contain';
  // });

  let draw;
  let time = Date.now();

  const animLoop = () => {
    const dt = Date.now() - time;
    time += dt;
    draw(dt);
    window.requestAnimationFrame(animLoop);
  };

  window.requestAnimationFrame(animLoop);

  const render = gpu.createKernel(function(mouseX, mouseY) {
    /* eslint-disable no-var */
    var red = 0;

    if (
      (this.thread.x - mouseX) * (this.thread.x - mouseX) +
      (this.thread.y - mouseY) * (this.thread.y - mouseY) <
      20 * 20
    ) {
      red = 1;
    }

    var green = this.thread.x / mouseX;
    green -= Math.floor(green);

    var blue = this.thread.y / mouseY;
    blue -= Math.floor(blue);

    this.color(red, green, blue, 1);
    /* eslint-enable no-var */
  }).dimensions([RENDER_WIDTH, RENDER_HEIGHT]).graphical(true);

  render(0, 0);

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

  let fps = 60;

  draw = (dt) => {
    const currFps = 1000 / dt;
    fps = 0.99 * fps + 0.01 * currFps;
    fpsDisplay.textContent = `FPS: ${fps.toFixed(1)}`;
    render(mouseX, mouseY);
  };
});
