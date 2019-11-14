// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:context.casesensitive
// Description:Context name "2D" is unrecognised; matching is case sensitive
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

var offscreenCanvas2 = new OffscreenCanvas(100, 50);
assert_throws(new TypeError(), function() { offscreenCanvas2.getContext('2D'); });

return Promise.resolve();
}, "Context name \"2D\" is unrecognised; matching is case sensitive");
done();
