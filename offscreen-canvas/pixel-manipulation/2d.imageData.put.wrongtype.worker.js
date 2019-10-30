// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.imageData.put.wrongtype
// Description:putImageData() does not accept non-ImageData objects
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

var t = async_test("putImageData() does not accept non-ImageData objects");
t.step(function() {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

var imgdata = { width: 1, height: 1, data: [255, 0, 0, 255] };
assert_throws(new TypeError(), function() { ctx.putImageData(imgdata, 0, 0); });
assert_throws(new TypeError(), function() { ctx.putImageData("cheese", 0, 0); });
assert_throws(new TypeError(), function() { ctx.putImageData(42, 0, 0); });

t.done();

});
done();
