// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:2d.shadow.pattern.alpha
// Description:Shadows are drawn correctly for partially-transparent fill patterns
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

var promise = new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", '/images/transparent50.png');
    xhr.responseType = 'blob';
    xhr.send();
    xhr.onload = function() {
        resolve(xhr.response);
    };
});
return promise.then(function(response) {
    var pattern = ctx.createPattern(response, 'repeat');
    ctx.fillStyle = '#f00';
    ctx.fillRect(0, 0, 100, 50);
    ctx.shadowOffsetY = 50;
    ctx.shadowColor = '#00f';
    ctx.fillStyle = pattern;
    ctx.fillRect(0, -50, 100, 50);
});

return Promise.resolve();
}, "Shadows are drawn correctly for partially-transparent fill patterns");
done();
