// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.composite.canvas.destination-over
// Description:
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');


var offscreenCanvas2 = new OffscreenCanvas(offscreenCanvas.width, offscreenCanvas.height);
var ctx2 = offscreenCanvas2.getContext('2d');
var promise = new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", '/images/yellow75.png');
    xhr.responseType = 'blob';
    xhr.send();
    xhr.onload = function() {
        resolve(xhr.response);
    };
});
return promise.then(function(response) {
    ctx2.drawImage(response, 0, 0);
    ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
    ctx.fillRect(0, 0, 100, 50);
    ctx.globalCompositeOperation = 'destination-over';
    ctx.drawImage(offscreenCanvas2, 0, 0);
    _assertPixelApprox(offscreenCanvas, 50,25, 109,255,146,223, "50,25", "109,255,146,223", 5);
});

return Promise.resolve();
}, "");
done();
