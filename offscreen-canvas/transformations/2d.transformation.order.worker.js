// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.transformation.order
// Description:Transformations are applied in the right order
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

ctx.fillStyle = '#f00';
ctx.fillRect(0, 0, 100, 50);
ctx.scale(2, 1);
ctx.rotate(Math.PI / 2);
ctx.fillStyle = '#0f0';
ctx.fillRect(0, -50, 50, 50);
_assertPixel(offscreenCanvas, 75,25, 0,255,0,255, "75,25", "0,255,0,255");

return Promise.resolve();
}, "Transformations are applied in the right order");
done();
