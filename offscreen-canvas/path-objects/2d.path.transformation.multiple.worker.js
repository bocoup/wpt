// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.path.transformation.multiple
// Description:Transformations are applied while building paths, not when drawing
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

ctx.fillStyle = '#0f0';
ctx.fillRect(0, 0, 100, 50);
ctx.fillStyle = '#f00';
ctx.translate(-100, 0);
ctx.rect(0, 0, 100, 50);
ctx.fill();
ctx.translate(100, 0);
ctx.fill();
ctx.beginPath();
ctx.strokeStyle = '#f00';
ctx.lineWidth = 50;
ctx.translate(0, -50);
ctx.moveTo(0, 25);
ctx.lineTo(100, 25);
ctx.stroke();
ctx.translate(0, 50);
ctx.stroke();
_assertPixel(offscreenCanvas, 50,25, 0,255,0,255, "50,25", "0,255,0,255");

return Promise.resolve();
}, "Transformations are applied while building paths, not when drawing");
done();
