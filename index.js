'use strict';

window.addEventListener('load', () => {
  navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();
    document.body.appendChild(video);
    video.style.position = 'absolute';
    video.style.left = '0px';
    video.style.top = '0px';
    video.style.width = '100vw';
    video.style.height = '100vh';
    video.style.objectFit = 'contain';
    document.body.style.height = '100vh';
    document.body.style.overflow = 'hidden';
  });
});
