# testharness.js tutorial

Let's say you've discovered that WPT doesn't have any tests for how [the Fetch
API](https://fetch.spec.whatwg.org/) sets cookies specified by HTTP responses.
This tutorial will guide you through the process of writing and submitting a
test. Although it includes some very brief instructions on using git, you can
find more guidance in [the tutorial for git and
GitHub](../appendix/github-intro).

WPT's testharness.js is a framework designed to help people write tests for the
web platform's JavaScript APIs. [The testharness.js reference
page](testharness) describes the framework in the abstract, but for the
purposes of this guide, we'll take it for granted that testharness.js is the
best way to test the behavior of `fetch`.

```eval_rst
.. contents::
   :local:
```

## Setting up your workspace

To make sure you have the latest code, first type the following into a terminal
located in the root of the WPT git repository:

    $ git fetch git@github.com:web-platform-tests/wpt.git

Next, create a new branch named `fetch-cookie` from that revision:

    $ git checkout -b fetch-cookie FETCH_HEAD

The tests we're going to write will rely on special abilities of the wpt
server, so you'll also need to [configure your system to run
WPT](../running-tests/from-local-system) before you continue.

With that out of the way, you're ready to create your patch.

## Writing a subtest

<style>blockquote { font-style: italic; }</style>

> Goals:
>
> - demonstrate asynchronous testing with Promises
> - motivate non-trivial integration with WPT server
> - use a web technology likely to be familiar to web developers (both widely
>   used and widely supported)

The first thing we'll do is configure the server to respond to a certain request
by setting a cookie. Once that's done, we'll be able to make the request with
`fetch` and verify that it interpreted the response correctly.

We'll configure the server with an "asis" file. That's the WPT convention for
controlling the precise contents of an HTTP response. [You can read more about
it here](server-features), but for now, we'll save the following text into a
file named `set-cookie.asis` in the `fetch/api/basic/` directory of WPT:

```
HTTP/1.1 204 No Content
Set-Cookie: test1=t1
```

With this in place, any requests to `/fetch/api/basic/set-cookie.asis` will
receive an HTTP 204 response that sets the cookie named `test1`.

Now, we can write the test! Create a new file named `set-cookie.html` in the
same directory and insert the following text:

```html
<!DOCTYPE html>
<meta charset="utf-8">
<title>fetch: setting cookies</title>
<link rel="author" title="Sam Smith" href="mailto:sam@example.com">
<link rel="help" href="https://fetch.spec.whatwg.org/">
<script src="/resources/testharness.js"></script>
<script src="/resources/testharnessreport.js"></script>

<script>
promise_test(function() {
  return fetch('thing.asis')
    .then(function() {
        assert_equals(document.cookie, 'test1=t1');
      });
});
</script>
```

If you run the server according to the instructions in [the guide for local
configuration](../running-tests/from-local-system), you can access the test at
http://web-platform.test:8000/fetch/api/basic/set-cookie.html. You should see
something like this:

![](TODO screen shot of testharness.js reporting the test results)

## Refining the subtest

> Goals:
>
> - explain motivation for "clean up" logic and demonstrate usage

First, we should remove the cookie after the subtest is complete. This ensures
a consistent state for any additional subtests we may add and also for any
tests that follow. We'll use the `add_cleanup` method to ensure that the cookie
is deleted even if the test fails.

```diff
-promise_test(function() {
+promise_test(function(t) {
+  t.add_cleanup(function() {
+    document.cookie = 'test1=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
+  });
+
   return fetch('thing.asis')
     .then(function() {
         assert_equals(document.cookie, 'test1=t1');
       });
 });
```

Although we'd prefer it if there were no other cookies defined during our test,
we probably shouldn't take that for granted. We'll use slightly more
complicated logic to test for the presence of the expected cookie.


```diff
 promise_test(function(t) {
   t.add_cleanup(function() {
     document.cookie = 'test1=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
   });

   return fetch('thing.asis')
     .then(function() {
-        assert_equals(document.cookie, 'test1=t1');
+        assert_true(/(^|; )test1=t1($|;)/.test(document.cookie);
       });
 });
```

## Writing a second subtest

> Goals:
>
> - demonstrate how to verify promise rejection
> - demonstrate additional assertion functions
> - motivate explicit test naming

```js
promise_test(function(t) {
  t.add_cleanup(function() {
    document.cookie = 'test1=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  });

  var operation = fetch('thing.asis');

  window.stop();

  return operation
    .then(function() {
        assert_unreached('The promise for the aborted fetch operation should reject.');
      }, function() {
        assert_false(/(^|; )test1=t1($|;)/.test(document.cookie);
      });
}, 'no cookie is set for aborted fetch operations');
```

## Verifying our work

We're done writing the test, but we should make sure it fits in with the rest
of WPT before we submit it. This involves using some of the project's tools, so
this is the point you'll need to [configure your system to run
WPT](../running-tests/from-local-system).

[The lint tool](lint-tool) can detect some of the common mistakes people make
when contributing to WPT. To run it, open a command-line terminal, navigate to
the root of the WPT repository, and enter the following command:

    python ./wpt lint html/semantics/text-level-semantics/the-bdo-element

If this recognizes any of those common mistakes in the new files, it will tell
you where they are and how to fix them. If you do have changes to make, you can
run the command again to make sure you got them right.

Now, we'll run the test using the automated pixel-by-pixel comparison approach
mentioned earlier. This is important for reftests because the test and the
reference may differ in very subtle ways that are hard to catch with the naked
eye. That's not to say your test has to pass in all browsers (or even in *any*
browser). But if we expect the test to pass, then running it this way will help
us catch other kinds of mistakes.

The tools support running the tests in many different browsers. We'll use
Firefox this time:

    python ./wpt run firefox html/semantics/text-level-semantics/the-bdo-element/rtl.html

We expect this test to pass, so if it does, we're ready to submit it. If we
were testing a web platform feature that Firefox didn't support, we would
expect the test to fail instead.

There are a few problems to look out for in addition to passing/failing status.
The report will describe fewer tests than we expect if the isn't run at all.
That's usually a sign of a formatting mistake, so you'll want to make sure
you've used the right file names and metadata. Separately, the web browser
might crash. That's often a sign of a browser bug, so you should consider
reporting it to the browser's maintainers!

## Submitting the test

First, let's stage the new files for committing:

    $ git add html/semantics/text-level-semantics/the-bdo-element/rtl.html
    $ git add html/semantics/text-level-semantics/the-bdo-element/rtl-ref.html

We can make sure the commit has everything we want to submit (and nothing we
don't) by using `git diff`:

    $ git diff --staged

On most systems, you can use the arrow keys to navigate through the changes,
and you can press the `q` key when you're done reviewing.

Next, we'll create a commit with the staged changes:

    $ git commit -m '[html] Add test for the `<bdo>` element'

And now we can push the commit to our fork of WPT:

    $ git push origin reftest-for-bdo

The last step is to submit the test for review. We do this by creating a pull
request on GitHub. [The guide on git and GitHub](../appendix/github-intro) has
all the details on how to do that.
