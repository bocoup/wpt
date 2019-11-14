// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.path.quadraticCurveTo.ensuresubpath.1
// Description:If there is no subpath, the first control point is added (and nothing is drawn up to it)
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

ctx.fillStyle = '#0f0';
ctx.fillRect(0, 0, 100, 50);
ctx.strokeStyle = '#f00';
ctx.lineWidth = 50;
ctx.beginPath();
ctx.quadraticCurveTo(100, 50, 200, 50);
ctx.stroke();
_assertPixel(offscreenCanvas, 50,25, 0,255,0,255, "50,25", "0,255,0,255");
_assertPixel(offscreenCanvas, 95,45, 0,255,0,255, "95,45", "0,255,0,255");

return Promise.resolve();
}, "If there is no subpath, the first control point is added (and nothing is drawn up to it)");
done();
