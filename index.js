'use strict';

const GPU = require('./GPU.js');

const gpu = new GPU();

const RENDER_WIDTH = 1280;
const RENDER_HEIGHT = 720;

const CAMERA_WIDTH = 160;
const CAMERA_HEIGHT = 90;

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
    videoCanvas.width = CAMERA_WIDTH;
    videoCanvas.height = CAMERA_HEIGHT;
    const videoCtx = videoCanvas.getContext('2d');

    const cameraData = range(CAMERA_HEIGHT).map(() => range(4 * CAMERA_WIDTH));

    getCameraData = () => {
      videoCtx.drawImage(video, 0, 0, CAMERA_WIDTH, CAMERA_HEIGHT);
      const raw = videoCtx.getImageData(0, 0, CAMERA_WIDTH, CAMERA_HEIGHT);

      for (let i = 0; i !== CAMERA_HEIGHT; i++) {
        for (let j = 0; j !== CAMERA_WIDTH; j++) {
          const index = 4 * (i * CAMERA_WIDTH + j);
          for (let k = 0; k !== 4; k++) {
            cameraData[CAMERA_HEIGHT - 1 - i][4 * j + k] = raw.data[index + k] / 255;
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

  const render = gpu.createKernel(function(mouseX, mouseY, cameraData, cameraWidth, cameraHeight) {
    /* eslint-disable no-var */
    var cameraX = Math.floor(this.thread.x / this.dimensions.x * cameraWidth);
    var cameraY = Math.floor(this.thread.y / this.dimensions.y * cameraHeight);
    var cameraRed = cameraData[cameraY][4 * cameraX];
    var cameraGreen = cameraData[cameraY][4 * cameraX + 1];
    var cameraBlue = cameraData[cameraY][4 * cameraX + 2];

    // A circle of this radius is the largest one that would fit inside the render
    var standardRadius = 0.5 * this.dimensions.y;

    var radius = 0.3 * standardRadius;

    if (
      (this.thread.x - mouseX) * (this.thread.x - mouseX) +
      (this.thread.y - mouseY) * (this.thread.y - mouseY) <
      radius * radius
    ) {
      this.color(cameraRed, cameraGreen, cameraBlue, 1);
    } else {
      this.color(cameraGreen, cameraRed, 1 - cameraBlue, 1);
    }

    // var green = 3.1416 * this.thread.x / mouseX;
    // green = Math.cos(green) * Math.cos(green);

    // var blue = 3.1416 * this.thread.y / mouseY;
    // blue = Math.cos(blue) * Math.cos(blue);

    // this.color(cameraGreen, cameraRed, 1 - cameraBlue, 1);
    /* eslint-enable no-var */
  }).dimensions([RENDER_WIDTH, RENDER_HEIGHT]).graphical(true);

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

  let fps = 60;

  draw = (dt) => {
    const decay = Math.exp(-dt / 1000);
    const currFps = 1000 / dt;
    fps = decay * fps + (1 - decay) * currFps;
    fpsDisplay.textContent = `FPS: ${fps.toFixed(1)}`;

    if (!getCameraData) {
      return;
    }

    render(mouseX, mouseY, getCameraData(), CAMERA_WIDTH, CAMERA_HEIGHT);
  };
});
