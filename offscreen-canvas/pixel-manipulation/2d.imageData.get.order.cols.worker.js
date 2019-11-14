// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.imageData.get.order.cols
// Description:getImageData() returns leftmost columns first
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, 100, 50);
ctx.fillStyle = '#000';
ctx.fillRect(0, 0, 2, 50);
var imgdata = ctx.getImageData(0, 0, 10, 10);
_assertSame(imgdata.data[0], 0, "imgdata.data[\""+(0)+"\"]", "0");
_assertSame(imgdata.data[Math.round(imgdata.width/2*4)], 255, "imgdata.data[Math.round(imgdata.width/2*4)]", "255");
_assertSame(imgdata.data[Math.round((imgdata.height/2)*imgdata.width*4)], 0, "imgdata.data[Math.round((imgdata.height/2)*imgdata.width*4)]", "0");

return Promise.resolve();
}, "getImageData() returns leftmost columns first");
done();
