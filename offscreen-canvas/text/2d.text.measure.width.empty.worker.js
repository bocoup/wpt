// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.text.measure.width.empty
// Description:The empty string has zero width for OffscreenCanvas
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

var f = new FontFace("CanvasTest", "/fonts/CanvasTest.ttf");
let fonts = (self.fonts ? self.fonts : document.fonts);
fonts.add(f);
return fonts.ready.then(() => {
    return new Promise(function(resolve) { step_timeout(resolve, 500); });
}).then(function() {
    ctx.font = '50px CanvasTest';
    _assertSame(ctx.measureText("").width, 0, "ctx.measureText(\"\").width", "0");
});

return Promise.resolve();
}, "The empty string has zero width for OffscreenCanvas");
done();
