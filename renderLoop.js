'use strict';

module.exports = function(render) {
  let time = Date.now();

  let fps = 0;

  const loop = () => {
    const dt = Date.now() - time;
    time += dt;

    const decay = Math.exp(-dt / 1000);
    const currFps = 1000 / dt;
    fps = decay * fps + (1 - decay) * currFps;

    render(dt, fps);

    window.requestAnimationFrame(loop);
  };

  window.requestAnimationFrame(loop);

  return {
    stop: () => window.cancelAnimationFrame(loop),
  };
};
