'use strict';

module.exports = function(mouseX, mouseY, cameraData, cameraWidth, cameraHeight) {
  /* eslint-disable no-var */
  var x = this.thread.x;
  var y = this.thread.y;

  var radius = this.dimensions.y / 5;

  var dist = (x - mouseX) * (x - mouseX) + (y - mouseY) * (y - mouseY);
  var distortion = Math.exp(-dist / (radius * radius));

  var distortX = distortion * mouseX + (1 - distortion) * x;
  var distortY = distortion * mouseY + (1 - distortion) * y;

  var cameraX = Math.floor(distortX / this.dimensions.x * cameraWidth);
  var cameraY = Math.floor(distortY / this.dimensions.y * cameraHeight);
  var cameraRed = cameraData[cameraY][4 * cameraX];
  var cameraGreen = cameraData[cameraY][4 * cameraX + 1];
  var cameraBlue = cameraData[cameraY][4 * cameraX + 2];

  var altRed = cameraGreen;
  var altGreen = cameraRed;
  var altBlue = 1 - cameraBlue;

  this.color(
    distortion * altRed + (1 - distortion) * cameraRed,
    distortion * altGreen + (1 - distortion) * cameraGreen,
    distortion * altBlue + (1 - distortion) * cameraBlue
  );
  /* eslint-enable no-var */
};
