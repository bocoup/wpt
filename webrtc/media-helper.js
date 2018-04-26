function silence() {
  let ctx = new AudioContext(), oscillator = ctx.createOscillator();
  let dst = oscillator.connect(ctx.createMediaStreamDestination());
  oscillator.start();
  return Object.assign(dst.stream.getAudioTracks()[0], {enabled: false});
}

function black({width = 640, height = 480} = {}) {
  let canvas = Object.assign(document.createElement("canvas"), {width, height});
  canvas.getContext('2d').fillRect(0, 0, width, height);
  let stream = canvas.captureStream();
  return Object.assign(stream.getVideoTracks()[0], {enabled: false});
}

function getBlackSilence(caps) {
  var tracks = [];

  if (caps && caps.audio) {
    tracks.push(silence());
  }

  if (caps && caps.video) {
    tracks.push(black());
  }

  return Promise.resolve(new MediaStream(tracks));
}
