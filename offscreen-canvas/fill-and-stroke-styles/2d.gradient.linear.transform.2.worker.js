// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.gradient.linear.transform.2
// Description:Linear gradient coordinates are relative to the coordinate space at the time of filling
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

ctx.translate(100, 0);
var g = ctx.createLinearGradient(0, 0, 200, 0);
g.addColorStop(0, '#f00');
g.addColorStop(0.25, '#0f0');
g.addColorStop(0.75, '#0f0');
g.addColorStop(1, '#f00');
ctx.fillStyle = g;
ctx.translate(-150, 0);
ctx.fillRect(50, 0, 100, 50);
_assertPixel(offscreenCanvas, 25,25, 0,255,0,255, "25,25", "0,255,0,255");
_assertPixel(offscreenCanvas, 50,25, 0,255,0,255, "50,25", "0,255,0,255");
_assertPixel(offscreenCanvas, 75,25, 0,255,0,255, "75,25", "0,255,0,255");

return Promise.resolve();
}, "Linear gradient coordinates are relative to the coordinate space at the time of filling");
done();
