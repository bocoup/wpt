// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.gradient.interpolate.zerosize.fill
// Description:
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

var t = async_test("");
var t_pass = t.done.bind(t);
var t_fail = t.step_func(function(reason) {
    throw reason;
});
t.step(function() {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

ctx.fillStyle = '#0f0';
ctx.fillRect(0, 0, 100, 50);
var g = ctx.createLinearGradient(50, 25, 50, 25); // zero-length line (undefined direction)
g.addColorStop(0, '#f00');
g.addColorStop(1, '#f00');
ctx.fillStyle = g;
ctx.rect(0, 0, 100, 50);
ctx.fill();
_assertPixel(offscreenCanvas, 40,20, 0,255,0,255, "40,20", "0,255,0,255");
t.done();

});
done();
