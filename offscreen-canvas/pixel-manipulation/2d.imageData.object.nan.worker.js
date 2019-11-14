// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.imageData.object.nan
// Description:ImageData.data converts NaN to 0
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

var imgdata = ctx.getImageData(0, 0, 10, 10);
imgdata.data[0] = 100;
imgdata.data[0] = NaN;
_assertSame(imgdata.data[0], 0, "imgdata.data[\""+(0)+"\"]", "0");
imgdata.data[0] = 100;
imgdata.data[0] = "cheese";
_assertSame(imgdata.data[0], 0, "imgdata.data[\""+(0)+"\"]", "0");

return Promise.resolve();
}, "ImageData.data converts NaN to 0");
done();
