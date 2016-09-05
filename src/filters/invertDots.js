'use strict';

module.exports = function(mouseX, mouseY, cameraData, cameraWidth, cameraHeight) {
  /* eslint-disable no-var */
  var cameraX = Math.floor(this.thread.x / this.dimensions.x * cameraWidth);
  var cameraY = Math.floor(this.thread.y / this.dimensions.y * cameraHeight);
  var cameraRed = cameraData[cameraY][4 * cameraX];
  var cameraGreen = cameraData[cameraY][4 * cameraX + 1];
  var cameraBlue = cameraData[cameraY][4 * cameraX + 2];

  var period = this.dimensions.y / 5;

  var effectSize = (
    Math.cos(
      3.1416 * (this.thread.x - mouseX) / period
    ) *
    Math.cos(
      3.1416 * (this.thread.y - mouseY) / period
    )
  );

  effectSize *= effectSize;

  if (effectSize > 0.5) {
    effectSize = 1;
  } else {
    effectSize = 0;
  }

  var altRed = 1 - cameraRed;
  var altGreen = 1 - cameraGreen;
  var altBlue = 1 - cameraBlue;

  this.color(
    effectSize * altRed + (1 - effectSize) * cameraRed,
    effectSize * altGreen + (1 - effectSize) * cameraGreen,
    effectSize * altBlue + (1 - effectSize) * cameraBlue,
    1
  );
};
