// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.text.font.parse.system
// Description:System fonts must be computed to explicit values
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

ctx.font = 'message-box';
_assertDifferent(ctx.font, 'message-box', "ctx.font", "'message-box'");

return Promise.resolve();
}, "System fonts must be computed to explicit values");
done();
