// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.shadow.offset.negativeY
// Description:Shadows can be offset with negative y
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

ctx.fillStyle = '#f00';
ctx.fillRect(0, 0, 100, 50);
ctx.fillStyle = '#0f0';
ctx.shadowColor = '#0f0';
ctx.shadowOffsetY = -25;
ctx.fillRect(0, 25, 100, 25);
_assertPixel(offscreenCanvas, 50,12, 0,255,0,255, "50,12", "0,255,0,255");
_assertPixel(offscreenCanvas, 50,37, 0,255,0,255, "50,37", "0,255,0,255");

return Promise.resolve();
}, "Shadows can be offset with negative y");
done();
