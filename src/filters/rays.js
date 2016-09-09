'use strict';

module.exports = function(mouseX, mouseY, cameraData, cameraWidth, cameraHeight) {
  /* eslint-disable no-var, yoda, no-lonely-if */
  var cameraX = Math.floor(this.thread.x / this.dimensions.x * cameraWidth);
  var cameraY = Math.floor(this.thread.y / this.dimensions.y * cameraHeight);
  var cameraRed = cameraData[cameraY][4 * cameraX];
  var cameraGreen = cameraData[cameraY][4 * cameraX + 1];
  var cameraBlue = cameraData[cameraY][4 * cameraX + 2];

  var m = mouseY / mouseX;
  var b = 0;

  var xDir = 1;
  var yDir = 1;

  // var direction = 0; // up-right

  var intensity = 0;
  var rayIntensity = 1;

  for (var i = 0; i !== 30; i++) {
    var num = m * this.thread.x - this.thread.y + b;
    var distSq = (num * num) / (m * m + 1);

    intensity += rayIntensity * Math.exp(-distSq / (30 * 30));
    intensity = Math.min(intensity, 1);

    rayIntensity *= 0.9;

    var R = this.dimensions.x;

    if (yDir === 1) {
      var T = this.dimensions.y;
      var topX = (T - b) / m;

      if (0 < topX && topX < R) {
        b = 2 * T - b;
        yDir = -1;
      } else {
        if (xDir === 1) {
          b = 2 * m * R + b;
          xDir = -1;
        } else {
          xDir = 1;
        }
      }
    } else {
      var bottomX = -b / m;

      if (0 < bottomX && bottomX < R) {
        yDir = 1;
        b = -b;
      } else {
        if (xDir === 1) {
          b = 2 * m * R + b;
          xDir = -1;
        } else {
          xDir = 1;
        }
      }
    }

    m *= -1;
  }

  function invert(x, c) {
    return x + c - 2 * x * c;
  }

  this.color(
    invert(intensity, cameraRed),
    invert(intensity, cameraGreen),
    invert(intensity, cameraBlue),
    1
  );
  /* eslint-enable no-var, yoda, no-lonely-if */
};
