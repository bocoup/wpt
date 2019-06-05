var callback = arguments[arguments.length - 1];

function root_wait() {
  if (!root.classList.contains("reftest-wait")) {
    observer.disconnect();

    if (Document.prototype.hasOwnProperty("fonts")) {
      document.fonts.ready.then(ready_for_screenshot);
    } else {
      // This might take the screenshot too early, depending on whether the
      // load event is blocked on fonts being loaded. See:
      // https://github.com/w3c/csswg-drafts/issues/1088
      ready_for_screenshot();
    }
  }
}

function ready_for_screenshot() {
  // As of 2017-04-05, the Chromium web browser exhibits a rendering bug
  // (https://bugs.chromium.org/p/chromium/issues/detail?id=708757) that
  // produces instability during screen capture. The following use of
  // `requestAnimationFrame` is intended as a short-term workaround, though
  // it is not guaranteed to resolve the issue.
  //
  // For further detail, see:
  // https://github.com/jugglinmike/chrome-screenshot-race/issues/1

  requestAnimationFrame(function() {
    requestAnimationFrame(function() {


function a(node) {
  var next = a;
  if (getComputedStyle(node).display === 'flex') {
    next = b;
  }
  for (const child of node.children) {
    if (next(child)) {
	  return true;
	}
  }

  return false;
}
function b(node) {
  var next = b;
  if (getComputedStyle(node).display !== 'flex') {
    next = c;
  }
  for (const child of node.children) {
	if (next(child)) {
	  return true;
	}
  }

  return false;
}

function c(node) {
  var next = c;
  if (getComputedStyle(node).display !== 'flex') {
    next = d;
  }
  for (const child of node.children) {
	if (next(child)) {
	  return true;
	}
  }

  return false;
}
function d(node) {
  if (getComputedStyle(node).display === 'flex') {
	return true;
  }
  for (const child of node.children) {
	if (c(child)) {
	  return true;
	}
  }
  return false;
}
function hasComplexFlex() {
  if (typeof document === 'undefined') {
    return false;
  }
  return a(document.body);
}
if (hasComplexFlex()) {
    var xhr = new XMLHttpRequest();
    xhr.open(
        'GET',
        '/encrypted-media/log.py?name=x',
        false
    );
    xhr.send(null);
}




      callback();
    });
  });
}

var root = document.documentElement;
var observer = new MutationObserver(root_wait);

observer.observe(root, {attributes: true});

if (document.readyState != "complete") {
    addEventListener('load', root_wait);
} else {
    root_wait();
}
