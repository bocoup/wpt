// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.drawImage.nowrap
// Description:Stretched images do not get pixels wrapping around the edges
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
    xhr.open("GET", '/images/redtransparent.png');
    xhr.responseType = 'blob';
    xhr.send();
    xhr.onload = function() {
        resolve(xhr.response);
    };
});
return promise.then(function(response) {
    ctx.drawImage(response, -1950, 0, 2000, 50);
    _assertPixelApprox(offscreenCanvas, 45,25, 0,255,0,255, "45,25", "0,255,0,255", 2);
    _assertPixelApprox(offscreenCanvas, 50,25, 0,255,0,255, "50,25", "0,255,0,255", 2);
    _assertPixelApprox(offscreenCanvas, 55,25, 0,255,0,255, "55,25", "0,255,0,255", 2);
});

return Promise.resolve();
}, "Stretched images do not get pixels wrapping around the edges");
done();
