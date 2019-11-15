// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.clearRect.negative
// Description:clearRect of negative sizes works
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

var t = async_test("clearRect of negative sizes works");
var t_pass = t.done.bind(t);
var t_fail = t.step_func(function(reason) {
    throw reason;
});
t.step(function() {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

ctx.fillStyle = '#f00';
ctx.fillRect(0, 0, 100, 50);
ctx.clearRect(0, 0, 50, 25);
ctx.clearRect(100, 0, -50, 25);
ctx.clearRect(0, 50, 50, -25);
ctx.clearRect(100, 50, -50, -25);
_assertPixel(offscreenCanvas, 25,12, 0,0,0,0, "25,12", "0,0,0,0");
_assertPixel(offscreenCanvas, 75,12, 0,0,0,0, "75,12", "0,0,0,0");
_assertPixel(offscreenCanvas, 25,37, 0,0,0,0, "25,37", "0,0,0,0");
_assertPixel(offscreenCanvas, 75,37, 0,0,0,0, "75,37", "0,0,0,0");
t.done();

});
done();
