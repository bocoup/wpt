// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.shadow.composite.2
// Description:Shadows are drawn using globalCompositeOperation
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

var t = async_test("Shadows are drawn using globalCompositeOperation");
t.step(function() {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

ctx.fillStyle = '#f00';
ctx.fillRect(0, 0, 100, 50);
ctx.globalCompositeOperation = 'xor';
ctx.shadowColor = '#f00';
ctx.shadowBlur = 1;
ctx.fillStyle = '#0f0';
ctx.fillRect(-10, -10, 120, 70);
_assertPixelApprox(offscreenCanvas, 50,25, 0,255,0,255, "50,25", "0,255,0,255", 2);

t.done();

});
done();
