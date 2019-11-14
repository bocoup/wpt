// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.shadow.image.transparent.1
// Description:Shadows are not drawn for transparent images
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

ctx.fillStyle = '#0f0';
ctx.fillRect(0, 0, 100, 50);
ctx.shadowColor = '#f00';
ctx.shadowOffsetY = 50;
var promise = new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", '/images/transparent.png');
    xhr.responseType = 'blob';
    xhr.send();
    xhr.onload = function() {
        resolve(xhr.response);
    };
});
return promise.then(function(response) {
    ctx.drawImage(response, 0, -50);
    _assertPixel(offscreenCanvas, 50,25, 0,255,0,255, "50,25", "0,255,0,255");
});

return Promise.resolve();
}, "Shadows are not drawn for transparent images");
done();
