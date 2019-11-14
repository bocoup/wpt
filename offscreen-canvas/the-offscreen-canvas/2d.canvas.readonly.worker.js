// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.canvas.readonly
// Description:canvas is readonly
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

var offscreenCanvas2 = new OffscreenCanvas(100, 50);
var d = ctx.canvas;
_assertDifferent(offscreenCanvas2, d, "offscreenCanvas2", "d");
ctx.canvas = offscreenCanvas2;
_assertSame(ctx.canvas, d, "ctx.canvas", "d");

return Promise.resolve();
}, "canvas is readonly");
done();
