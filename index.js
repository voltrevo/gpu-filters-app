'use strict';

const GPU = require('./GPU.js');

const gpu = new GPU();

window.addEventListener('load', () => {
  // navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
  //   document.body.style.backgroundColor = '#000';
  //   document.body.style.height = '100vh';
  //   document.body.style.overflow = 'hidden';

  //   const video = document.createElement('video');
  //   video.srcObject = stream;
  //   video.play();
  //   document.body.appendChild(video);
  //   video.style.position = 'absolute';
  //   video.style.left = '0px';
  //   video.style.top = '0px';
  //   video.style.width = '100vw';
  //   video.style.height = '100vh';
  //   video.style.objectFit = 'contain';
  // });

  const render = gpu.createKernel(function() {
    this.color(0, (this.thread.x % 256) / 255, (this.thread.y % 256) / 255, 1);
  }).dimensions([1280, 720]).graphical(true);

  render();

  const canvas = render.getCanvas();
  canvas.style.position = 'absolute';
  canvas.style.left = '0px';
  canvas.style.top = '0px';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.objectFit = 'contain';
  document.body.appendChild(canvas);
});
