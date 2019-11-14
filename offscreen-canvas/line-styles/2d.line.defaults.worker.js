// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.line.defaults
// Description:
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

_assertSame(ctx.lineWidth, 1, "ctx.lineWidth", "1");
_assertSame(ctx.lineCap, 'butt', "ctx.lineCap", "'butt'");
_assertSame(ctx.lineJoin, 'miter', "ctx.lineJoin", "'miter'");
_assertSame(ctx.miterLimit, 10, "ctx.miterLimit", "10");

return Promise.resolve();
}, "");
done();
