// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.pattern.paint.repeaty.coord1
// Description:
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

ctx.fillStyle = '#0f0';
ctx.fillRect(0, 0, 100, 50);
var promise = new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", '/images/red-16x16.png');
    xhr.responseType = 'blob';
    xhr.send();
    xhr.onload = function() {
        resolve(xhr.response);
    };
});
return promise.then(function(response) {
    var pattern = ctx.createPattern(response, 'repeat-y');
    ctx.fillStyle = pattern;
    ctx.translate(48, 0);
    ctx.fillRect(-48, 0, 100, 50);
    ctx.fillStyle = '#0f0';
    ctx.fillRect(0, 0, 16, 50);
    _assertPixel(offscreenCanvas, 1,1, 0,255,0,255, "1,1", "0,255,0,255");
    _assertPixel(offscreenCanvas, 50,1, 0,255,0,255, "50,1", "0,255,0,255");
    _assertPixel(offscreenCanvas, 98,1, 0,255,0,255, "98,1", "0,255,0,255");
    _assertPixel(offscreenCanvas, 1,48, 0,255,0,255, "1,48", "0,255,0,255");
    _assertPixel(offscreenCanvas, 50,48, 0,255,0,255, "50,48", "0,255,0,255");
    _assertPixel(offscreenCanvas, 98,48, 0,255,0,255, "98,48", "0,255,0,255");
});

return Promise.resolve();
}, "");
done();
