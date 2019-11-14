// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.path.stroke.unaffected
// Description:Stroking does not start a new path or subpath
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

ctx.fillStyle = '#f00';
ctx.fillRect(0, 0, 100, 50);
ctx.lineWidth = 50;
ctx.moveTo(-100, 25);
ctx.lineTo(-100, -100);
ctx.lineTo(200, -100);
ctx.lineTo(200, 25);
ctx.strokeStyle = '#f00';
ctx.stroke();
ctx.closePath();
ctx.strokeStyle = '#0f0';
ctx.stroke();
_assertPixel(offscreenCanvas, 50,25, 0,255,0,255, "50,25", "0,255,0,255");

return Promise.resolve();
}, "Stroking does not start a new path or subpath");
done();
