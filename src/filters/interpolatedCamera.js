'use strict';

module.exports = function(mouseX, mouseY, cameraData, cameraWidth, cameraHeight) {
  /* eslint-disable no-var */
  var cameraX = this.thread.x / this.dimensions.x * cameraWidth;
  var cameraY = this.thread.y / this.dimensions.y * cameraHeight;

  var cameraX0 = Math.floor(cameraX);
  var cameraX1 = Math.ceil(cameraX);
  var cameraInterX = cameraX - cameraX0;

  var cameraY0 = Math.floor(cameraY);
  var cameraY1 = Math.ceil(cameraY);
  var cameraInterY = cameraY - cameraY0;

  function interp(v00, v01, v10, v11, interX, interY) {
    var bottom = (1 - interX) * v00 + interX * v01;
    var top = (1 - interX) * v10 + interX * v11;

    return (1 - interY) * bottom + interY * top;
  }

  var cameraRed = interp(
    cameraData[cameraY0][4 * cameraX0],
    cameraData[cameraY0][4 * cameraX1],
    cameraData[cameraY1][4 * cameraX0],
    cameraData[cameraY1][4 * cameraX1],
    cameraInterX,
    cameraInterY
  );

  var cameraGreen = interp(
    cameraData[cameraY0][4 * cameraX0 + 1],
    cameraData[cameraY0][4 * cameraX1 + 1],
    cameraData[cameraY1][4 * cameraX0 + 1],
    cameraData[cameraY1][4 * cameraX1 + 1],
    cameraInterX,
    cameraInterY
  );

  var cameraBlue = interp(
    cameraData[cameraY0][4 * cameraX0 + 2],
    cameraData[cameraY0][4 * cameraX1 + 2],
    cameraData[cameraY1][4 * cameraX0 + 2],
    cameraData[cameraY1][4 * cameraX1 + 2],
    cameraInterX,
    cameraInterY
  );

  this.color(cameraRed, cameraGreen, cameraBlue, 1);
  /* eslint-enable no-var */
};
