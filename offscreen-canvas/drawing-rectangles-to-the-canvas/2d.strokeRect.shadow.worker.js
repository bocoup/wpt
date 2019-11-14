// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.strokeRect.shadow
// Description:strokeRect draws shadows
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

ctx.fillStyle = '#f00';
ctx.fillRect(0, 0, 100, 50);
ctx.fillStyle = '#f00';
ctx.shadowColor = '#0f0';
ctx.shadowBlur = 0;
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 50;
ctx.strokeStyle = '#f00';
ctx.lineWidth = 50;
ctx.strokeRect(0, -75, 100, 50);
_assertPixel(offscreenCanvas, 50,25, 0,255,0,255, "50,25", "0,255,0,255");

return Promise.resolve();
}, "strokeRect draws shadows");
done();
