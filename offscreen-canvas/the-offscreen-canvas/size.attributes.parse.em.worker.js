// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:size.attributes.parse.em
// Description:Parsing of non-negative integers
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

offscreenCanvas.width = '100em';
offscreenCanvas.height = '100em';
_assertSame(offscreenCanvas.width, 100, "offscreenCanvas.width", "100");
_assertSame(offscreenCanvas.height, 100, "offscreenCanvas.height", "100");

return Promise.resolve();
}, "Parsing of non-negative integers");
done();
