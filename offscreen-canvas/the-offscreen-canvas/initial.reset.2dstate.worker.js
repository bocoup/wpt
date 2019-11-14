// DO NOT EDIT! This test has been generated by tools/gentest.py.
// OffscreenCanvas test in a worker:initial.reset.2dstate
// Description:Resetting the canvas state resets 2D state variables
// Note:

importScripts("/resources/testharness.js");
importScripts("/2dcontext/resources/canvas-tests.js");

promise_test(function(t) {

var offscreenCanvas = new OffscreenCanvas(100, 50);
var ctx = offscreenCanvas.getContext('2d');

offscreenCanvas.width = 100;
var default_val;

default_val = ctx.strokeStyle;
ctx.strokeStyle = "#ff0000";
offscreenCanvas.width = 100;
_assertSame(ctx.strokeStyle, default_val, "ctx.strokeStyle", "default_val");

default_val = ctx.fillStyle;
ctx.fillStyle = "#ff0000";
offscreenCanvas.width = 100;
_assertSame(ctx.fillStyle, default_val, "ctx.fillStyle", "default_val");

default_val = ctx.globalAlpha;
ctx.globalAlpha = 0.5;
offscreenCanvas.width = 100;
_assertSame(ctx.globalAlpha, default_val, "ctx.globalAlpha", "default_val");

default_val = ctx.lineWidth;
ctx.lineWidth = 0.5;
offscreenCanvas.width = 100;
_assertSame(ctx.lineWidth, default_val, "ctx.lineWidth", "default_val");

default_val = ctx.lineCap;
ctx.lineCap = "round";
offscreenCanvas.width = 100;
_assertSame(ctx.lineCap, default_val, "ctx.lineCap", "default_val");

default_val = ctx.lineJoin;
ctx.lineJoin = "round";
offscreenCanvas.width = 100;
_assertSame(ctx.lineJoin, default_val, "ctx.lineJoin", "default_val");

default_val = ctx.miterLimit;
ctx.miterLimit = 0.5;
offscreenCanvas.width = 100;
_assertSame(ctx.miterLimit, default_val, "ctx.miterLimit", "default_val");

default_val = ctx.shadowOffsetX;
ctx.shadowOffsetX = 5;
offscreenCanvas.width = 100;
_assertSame(ctx.shadowOffsetX, default_val, "ctx.shadowOffsetX", "default_val");

default_val = ctx.shadowOffsetY;
ctx.shadowOffsetY = 5;
offscreenCanvas.width = 100;
_assertSame(ctx.shadowOffsetY, default_val, "ctx.shadowOffsetY", "default_val");

default_val = ctx.shadowBlur;
ctx.shadowBlur = 5;
offscreenCanvas.width = 100;
_assertSame(ctx.shadowBlur, default_val, "ctx.shadowBlur", "default_val");

default_val = ctx.shadowColor;
ctx.shadowColor = "#ff0000";
offscreenCanvas.width = 100;
_assertSame(ctx.shadowColor, default_val, "ctx.shadowColor", "default_val");

default_val = ctx.globalCompositeOperation;
ctx.globalCompositeOperation = "copy";
offscreenCanvas.width = 100;
_assertSame(ctx.globalCompositeOperation, default_val, "ctx.globalCompositeOperation", "default_val");

return Promise.resolve();
}, "Resetting the canvas state resets 2D state variables");
done();
