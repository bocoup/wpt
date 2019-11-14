// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.fillRect.path
// Description:fillRect does not affect the current path
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

ctx.beginPath();
ctx.rect(0, 0, 100, 50);
ctx.fillStyle = '#f00';
ctx.fillRect(0, 0, 16, 16);
ctx.fillStyle = '#0f0';
ctx.fill();
_assertPixel(offscreenCanvas, 50,25, 0,255,0,255, "50,25", "0,255,0,255");

return Promise.resolve();
}, "fillRect does not affect the current path");
done();
