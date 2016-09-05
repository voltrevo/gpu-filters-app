'use strict';

module.exports = function(mouseX, mouseY, cameraData, cameraWidth, cameraHeight) {
  /* eslint-disable no-var */
  var cameraX = Math.floor(this.thread.x / this.dimensions.x * cameraWidth);
  var cameraY = Math.floor(this.thread.y / this.dimensions.y * cameraHeight);
  var cameraRed = cameraData[cameraY][4 * cameraX];
  var cameraGreen = cameraData[cameraY][4 * cameraX + 1];
  var cameraBlue = cameraData[cameraY][4 * cameraX + 2];

  this.color(cameraRed, cameraGreen, cameraBlue, 1);
  /* eslint-enable no-var */
};
