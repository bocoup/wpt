document.title = '%(title)s';

// Although the parent window can technically reference functions defined on
// the global scope in the child window, two circumstances prevent that
// approach:
//
// 1. Some tests activate cross-origin restrictions on the child window
// 2. Some Selenium/WebDriver implementations do not correctly serialize
//    objects that originate from a foreign domain:
//    https://github.com/web-platform-tests/results-collection/issues/563#issuecomment-435522838
window.addEventListener(
  "message",
  function(event) {
    window.win.postMessage(event.data, "*");
  },
  false
);
