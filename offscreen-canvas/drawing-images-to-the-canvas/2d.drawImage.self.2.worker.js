// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.drawImage.self.2
// Description:
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

ctx.fillStyle = '#0f0';
ctx.fillRect(0, 1, 100, 49);
ctx.fillStyle = '#f00';
ctx.fillRect(0, 0, 100, 1);
ctx.drawImage(offscreenCanvas, 0, 1);
ctx.fillStyle = '#0f0';
ctx.fillRect(0, 0, 100, 2);
_assertPixelApprox(offscreenCanvas, 0,0, 0,255,0,255, "0,0", "0,255,0,255", 2);
_assertPixelApprox(offscreenCanvas, 99,0, 0,255,0,255, "99,0", "0,255,0,255", 2);
_assertPixelApprox(offscreenCanvas, 0,49, 0,255,0,255, "0,49", "0,255,0,255", 2);
_assertPixelApprox(offscreenCanvas, 99,49, 0,255,0,255, "99,49", "0,255,0,255", 2);

return Promise.resolve();
}, "");
done();
