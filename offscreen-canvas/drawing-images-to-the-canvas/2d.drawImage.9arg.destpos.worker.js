// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.drawImage.9arg.destpos
// Description:
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

ctx.fillStyle = '#f00';
ctx.fillRect(0, 0, 100, 50);
var promise1 = new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", '/images/red.png');
    xhr.responseType = 'blob';
    xhr.send();
    xhr.onload = function() {
        resolve(xhr.response);
    };
});
var promise2 = new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", '/images/green.png');
    xhr.responseType = 'blob';
    xhr.send();
    xhr.onload = function() {
        resolve(xhr.response);
    };
});
Promise.all([promise1, promise2]).then(function(response1, response2) {
    ctx.drawImage(response2, 0, 0, 100, 50, 0, 0, 100, 50);
    ctx.drawImage(response1, 0, 0, 100, 50, -100, 0, 100, 50);
    ctx.drawImage(response1, 0, 0, 100, 50, 100, 0, 100, 50);
    ctx.drawImage(response1, 0, 0, 100, 50, 0, -50, 100, 50);
    ctx.drawImage(response1, 0, 0, 100, 50, 0, 50, 100, 50);
    _assertPixelApprox(offscreenCanvas, 0,0, 0,255,0,255, "0,0", "0,255,0,255", 2);
    _assertPixelApprox(offscreenCanvas, 99,0, 0,255,0,255, "99,0", "0,255,0,255", 2);
    _assertPixelApprox(offscreenCanvas, 0,49, 0,255,0,255, "0,49", "0,255,0,255", 2);
    _assertPixelApprox(offscreenCanvas, 99,49, 0,255,0,255, "99,49", "0,255,0,255", 2);
});

return Promise.resolve();
}, "");
done();
