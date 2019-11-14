// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.state.saverestore.lineWidth
// Description:save()/restore() works for lineWidth
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

// Test that restore() undoes any modifications
var old = ctx.lineWidth;
ctx.save();
ctx.lineWidth = 0.5;
ctx.restore();
_assertSame(ctx.lineWidth, old, "ctx.lineWidth", "old");

// Also test that save() doesn't modify the values
ctx.lineWidth = 0.5;
old = ctx.lineWidth;
    // we're not interested in failures caused by get(set(x)) != x (e.g.
    // from rounding), so compare against 'old' instead of against 0.5
ctx.save();
_assertSame(ctx.lineWidth, old, "ctx.lineWidth", "old");
ctx.restore();

return Promise.resolve();
}, "save()/restore() works for lineWidth");
done();
