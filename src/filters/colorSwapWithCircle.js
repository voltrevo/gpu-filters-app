'use strict';

module.exports = function(mouseX, mouseY, cameraData, cameraWidth, cameraHeight) {
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
};
