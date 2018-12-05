'use strict';

promise_test(async testCase => {
  await cookieStore.set('cookie-name', 'cookie-value');
  testCase.add_cleanup(() => cookieStore.delete('cookie-name'));
  await cookieStore.delete('cookie-name');
  const cookie = await cookieStore.get();
  assert_equals(cookie, null);
}, 'cookieStore.get returns null for a cookie deleted by cookieStore.delete');
