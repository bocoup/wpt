// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.text.baseline.valid
// Description:
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

ctx.textBaseline = 'top';
_assertSame(ctx.textBaseline, 'top', "ctx.textBaseline", "'top'");

ctx.textBaseline = 'hanging';
_assertSame(ctx.textBaseline, 'hanging', "ctx.textBaseline", "'hanging'");

ctx.textBaseline = 'middle';
_assertSame(ctx.textBaseline, 'middle', "ctx.textBaseline", "'middle'");

ctx.textBaseline = 'alphabetic';
_assertSame(ctx.textBaseline, 'alphabetic', "ctx.textBaseline", "'alphabetic'");

ctx.textBaseline = 'ideographic';
_assertSame(ctx.textBaseline, 'ideographic', "ctx.textBaseline", "'ideographic'");

ctx.textBaseline = 'bottom';
_assertSame(ctx.textBaseline, 'bottom', "ctx.textBaseline", "'bottom'");

return Promise.resolve();
}, "");
done();
