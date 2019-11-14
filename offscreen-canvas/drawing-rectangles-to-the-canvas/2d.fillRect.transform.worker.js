// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.fillRect.transform
// Description:fillRect is affected by transforms
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

ctx.scale(10, 10);
ctx.translate(0, 5);
ctx.fillStyle = '#0f0';
ctx.fillRect(0, -5, 10, 5);
_assertPixel(offscreenCanvas, 50,25, 0,255,0,255, "50,25", "0,255,0,255");

return Promise.resolve();
}, "fillRect is affected by transforms");
done();
