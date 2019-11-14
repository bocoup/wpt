// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.text.draw.fill.maxWidth.small
// Description:fillText handles maxWidth correctly
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

ctx.fillStyle = '#0f0';
ctx.fillRect(0, 0, 100, 50);
ctx.fillStyle = '#f00';
ctx.font = '35px Arial, sans-serif';
ctx.fillText('fail fail fail fail fail', -100, 35, 90);
_assertGreen(ctx, 100, 50);

return Promise.resolve();
}, "fillText handles maxWidth correctly");
done();
