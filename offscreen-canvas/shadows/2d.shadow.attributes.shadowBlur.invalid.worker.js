// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.shadow.attributes.shadowBlur.invalid
// Description:
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

ctx.shadowBlur = 1;
ctx.shadowBlur = -2;
_assertSame(ctx.shadowBlur, 1, "ctx.shadowBlur", "1");
ctx.shadowBlur = 1;
ctx.shadowBlur = Infinity;
_assertSame(ctx.shadowBlur, 1, "ctx.shadowBlur", "1");
ctx.shadowBlur = 1;
ctx.shadowBlur = -Infinity;
_assertSame(ctx.shadowBlur, 1, "ctx.shadowBlur", "1");
ctx.shadowBlur = 1;
ctx.shadowBlur = NaN;
_assertSame(ctx.shadowBlur, 1, "ctx.shadowBlur", "1");

return Promise.resolve();
}, "");
done();
