// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:initial.reset.clip
// Description:Resetting the canvas state resets the current clip region
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

offscreenCanvas.width = 100;
ctx.rect(0, 0, 1, 1);
ctx.clip();
offscreenCanvas.width = 100;
ctx.fillStyle = '#0f0';
ctx.fillRect(0, 0, 100, 50);
_assertPixel(offscreenCanvas, 20,20, 0,255,0,255, "20,20", "0,255,0,255");

return Promise.resolve();
}, "Resetting the canvas state resets the current clip region");
done();
