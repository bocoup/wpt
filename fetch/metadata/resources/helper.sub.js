function test_eventual_property(title, name, expected, thenable) {
  promise_test(() => {
    return thenable
      .then((object) => {
        if (expected === null) {
          assert_not_own_property(object, name);
        } else {
          assert_own_property(expected, 'value');
          assert_equals(object[name], expected.value);
        }
      });
  }, title + ' - ' + name);
}

function chain(...domains) {
  const redir = '/fetch/api/resources/redirect.py?location=';
  const hostInfo = get_host_info();

  return function(path) {
    let full = hostInfo[domains.pop()] + path;
    for (const domain of domains.reverse()) {
      full = hostInfo[domain] + redir + encodeURIComponent(full);
    }
    return full;
  }
}

let series = (() => {
  let latest;

  return (operation) => {
    const next = (latest || Promise.resolve()).then(operation);
    latest = next.catch(() => {});
    return next;
  };
})();
