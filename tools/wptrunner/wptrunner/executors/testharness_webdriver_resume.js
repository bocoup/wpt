var callback = arguments[arguments.length - 1];
window.opener.testdriver_callback = function(results) {
  callback(JSON.parse(JSON.stringify(results)));
};
window.opener.process_next_event();
