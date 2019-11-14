// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.path.arc.twopie.2
// Description:arc() draws a full circle when end = start + 2pi-e and clockwise
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

ctx.fillStyle = '#f00';
ctx.fillRect(0, 0, 100, 50);
ctx.strokeStyle = '#0f0';
ctx.lineWidth = 100;
ctx.beginPath();
ctx.arc(50, 25, 50, 0, 2*Math.PI - 1e-4, false);
ctx.stroke();
_assertPixel(offscreenCanvas, 50,20, 0,255,0,255, "50,20", "0,255,0,255");

return Promise.resolve();
}, "arc() draws a full circle when end = start + 2pi-e and clockwise");
done();
