'use strict';

const {
  CAMERA_HEIGHT,
  CAMERA_WIDTH,
} = require('./constants.js');

const range = require('./range.js');

module.exports = function() {
  let getCameraData;

  const defineFn = () => {
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
              cameraData[CAMERA_HEIGHT - 1 - i][4 * (CAMERA_WIDTH - 1 - j) + k] = (
                raw.data[index + k] / 255
              );
            }
          }
        }

        return cameraData;
      };
    });
  };

  if (document.body) {
    defineFn();
  } else {
    window.addEventListener('load', defineFn);
  }

  return function() {
    if (!getCameraData) {
      return null;
    }

    return getCameraData();
  };
};
