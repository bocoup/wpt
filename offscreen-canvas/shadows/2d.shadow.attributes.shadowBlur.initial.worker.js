// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.shadow.attributes.shadowBlur.initial
// Description:
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

_assertSame(ctx.shadowBlur, 0, "ctx.shadowBlur", "0");

return Promise.resolve();
}, "");
done();
