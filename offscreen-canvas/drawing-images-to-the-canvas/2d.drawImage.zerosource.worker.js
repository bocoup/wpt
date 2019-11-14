// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.drawImage.zerosource
// Description:drawImage with zero-sized source rectangle throws INDEX_SIZE_ERR
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
    xhr.open("GET", '/images/green.png');
    xhr.responseType = 'blob';
    xhr.send();
    xhr.onload = function() {
        resolve(xhr.response);
    };
});
promise.then(function(response) {
    assert_throws("INDEX_SIZE_ERR", function() { ctx.drawImage(response, 10, 10, 0, 1, 0, 0, 100, 50); });
    assert_throws("INDEX_SIZE_ERR", function() { ctx.drawImage(response, 10, 10, 1, 0, 0, 0, 100, 50); });
    assert_throws("INDEX_SIZE_ERR", function() { ctx.drawImage(response, 10, 10, 0, 0, 0, 0, 100, 50); });
    _assertPixelApprox(offscreenCanvas, 50,25, 0,255,0,255, "50,25", "0,255,0,255", 2);
});

return Promise.resolve();
}, "drawImage with zero-sized source rectangle throws INDEX_SIZE_ERR");
done();
