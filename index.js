'use strict';

const GPU = require('./GPU.js');

const gpu = new GPU();

const RENDER_WIDTH = 160;
const RENDER_HEIGHT = 90;

const range = (n) => (new Array(n)).fill(0).map((x, i) => i);

window.addEventListener('load', () => {
  document.body.style.fontFamily = 'sans-serif';
  document.body.style.height = '100vh';
  document.body.style.overflow = 'hidden';

  let getCameraData;

  navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();

    const videoCanvas = document.createElement('canvas');
    videoCanvas.width = RENDER_WIDTH;
    videoCanvas.height = RENDER_HEIGHT;
    const videoCtx = videoCanvas.getContext('2d');

    const cameraData = range(RENDER_HEIGHT).map(() => range(4 * RENDER_WIDTH));

    getCameraData = () => {
      videoCtx.drawImage(video, 0, 0, RENDER_WIDTH, RENDER_HEIGHT);
      const raw = videoCtx.getImageData(0, 0, RENDER_WIDTH, RENDER_HEIGHT);

      for (let i = 0; i !== RENDER_HEIGHT; i++) {
        for (let j = 0; j !== RENDER_WIDTH; j++) {
          const index = 4 * (i * RENDER_WIDTH + j);
          for (let k = 0; k !== 4; k++) {
            cameraData[RENDER_HEIGHT - 1 - i][4 * j + k] = raw.data[index + k] / 255;
          }
        }
      }

      return cameraData;
    };
  });

  let draw;
  let time = Date.now();

  const animLoop = () => {
    const dt = Date.now() - time;
    time += dt;
    draw(dt);
    window.requestAnimationFrame(animLoop);
  };

  window.requestAnimationFrame(animLoop);

  const render = gpu.createKernel(function(mouseX, mouseY, cameraData) {
    /* eslint-disable no-var */
    var red = 0;

    if (
      (this.thread.x - mouseX) * (this.thread.x - mouseX) +
      (this.thread.y - mouseY) * (this.thread.y - mouseY) <
      20 * 20
    ) {
      red = 1;
    }

    var index = 4 * (this.dimensions.x * this.thread.y + this.thread.x);

    red = cameraData[index];

    var green = 3.1416 * this.thread.x / mouseX;
    green = Math.cos(green) * Math.cos(green);

    var blue = 3.1416 * this.thread.y / mouseY;
    blue = Math.cos(blue) * Math.cos(blue);

    this.color(red, green, blue, 1);
    /* eslint-enable no-var */
  }).dimensions([RENDER_WIDTH, RENDER_HEIGHT]).graphical(true);

  render(0, 0, [0]);

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
    const decay = Math.exp(-dt / 1000);
    const currFps = 1000 / dt;
    fps = decay * fps + (1 - decay) * currFps;
    fpsDisplay.textContent = `FPS: ${fps.toFixed(1)}`;

    if (!getCameraData) {
      return;
    }

    render(mouseX, mouseY, getCameraData());
  };
});
