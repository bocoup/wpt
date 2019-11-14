// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.path.arc.angle.3
// Description:arc() wraps angles mod 2pi when anticlockwise and end > start+2pi
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

ctx.fillStyle = '#0f0';
ctx.fillRect(0, 0, 100, 50);
ctx.fillStyle = '#f00';
ctx.beginPath();
ctx.moveTo(100, 0);
ctx.arc(100, 0, 150, (512+1/2)*Math.PI, (1024-1)*Math.PI, true);
ctx.fill();
_assertPixel(offscreenCanvas, 50,25, 0,255,0,255, "50,25", "0,255,0,255");

return Promise.resolve();
}, "arc() wraps angles mod 2pi when anticlockwise and end > start+2pi");
done();
