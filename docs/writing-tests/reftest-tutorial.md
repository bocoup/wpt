# Writing a reftest

Let's say you've discovered that WPT doesn't have any tests for the CSS color
`fuchsia`. This tutorial will guide you through the process of writing and
submitting a test. It assumes that you've already [configured your system to
contribute to WPT](../running-tests/from-local-system). Although it includes
some very brief instructions on using git, you can find more guidance in [the
tutorial for git and GitHub](../appendix/github-intro).

WPT's reftests are great for testing web platform features that have some
visual effect. [The reftests reference page](reftests) describes them in the
abstract, but for the purposes of this guide, we'll take it for granted that
the reftest is the perfect way to test for CSS colors.

```eval_rst
.. contents::
   :local:
```

## Setting up your workspace

To make sure you have the latest code, first type the following into a terminal
located in the root of the WPT git repository:

    $ git fetch git@github.com:web-platform-tests/wpt.git

Next, create a new branch named `reftest-for-fuchsia` from that revision:

    $ git checkout -b reftest-for-fuchsia FETCH_HEAD

Now you're ready to create your patch.

## Writing the test file

First, we'll create a file that demonstrates the "feature under test." That is:
we'll write an HTML document that applies the `fuchsia` keyword to some text.

WPT has thousands of tests, so it can be daunting to decide where to put a new
one. Generally speaking, [test files should be placed in directories
corresponding to the specification text they are verifying](../introduction).
`fushsia` is defined in [CSS Color Module Level
4](https://drafts.csswg.org/css-color/), so we'll want to create our new test
in the directory `css/css-color/`. Create a file named `fuschia.html` and open
it in your text editor.

Here's one way to demonstrate the feature:

```html
<!DOCTYPE html>
<meta charset="utf-8">
<title>CSS Color: the "fuchsia" keyword</title>
<link rel="author" title="Sam Smith">
<link rel="help" href="https://www.w3.org/TR/css-color-3/#html4">
<meta name="assert" content="the keyword is interpreted as a valid color value">
<style>body { color: fuchsia; }</style>

<body>
  Test passes if this text is fuchsia.
</body>
```

That's pretty dense! Let's break it down:

- ```html
  <!DOCTYPE html>
  <meta charset="utf-8">
  ```

  We explicitly set the DOCTYPE and character set to be sure that browsers
  don't infer them to be something we aren't expecting. Note that we're
  omitting the `<html>` and `<head>` tags. That's a common practice in WPT,
  preferred because it helps make tests more concise.

- ```html
  <title>CSS Color: the "fuchsia" keyword</title>
  ```
  The document's title should succinctly describe the feature under test.

- ```html
  <link rel="author" title="Sam Smith">
  ```

  You should replace "Sam Smith" with your own name. This can help others learn
  who to contact with questions about this test. The git history will do the
  same thing, so you can leave this out if you prefer.

- ```html
  <link rel="help" href="https://www.w3.org/TR/css-color-3/#html4">
  ```

  [The CSS Working Group requires that all tests include a reference to the
  specification under test.](css-metadata) If you're writing a reftest for a
  feature outside of CSS, feel free to omit this metadata.

- ```html
  <meta name="assert" content="the keyword is interpreted as a valid color value">
  ```

  The "assert" metadata is a structured way for you to describe exactly what
  you want your reftest to verify. For a direct test like the one we're writing
  here, it might seem a liitle superfluous. It's much more helpful for more
  involved tests where reviewers might need some help understanding your
  intentions.

  This tag is optional, so you can skip it if you think it's unnecessary. We
  recommend using it for your first few tests since it may let reviewers give
  you more helpful feedback. As you get more familiar with WPT and the
  specifications, you'll get a sense for when and where it's better to leave it
  out.

- ```html
  <style>body { color: fuchsia; }</style>
  <body>
    Test passes if this text is fuchsia.
  </body>
  ```

  This is the real focus of the test. We're defining a CSS rule that uses the
  `fuchsia` keyword, and we're including some markup that matches the rule's
  selector. In other words: we're demonstrating the feature under test.

Since this page doesn't rely on any [special WPT server
features](server-features), we can view it by loading the HTML file directly.
There are a bunch of ways to do this; one is to navigate to the
`css/css-colors` directory in a file browser and drag the new `fuschia.html`
file into an open web browser window.

Sighted people can open that document and verify whether or not the stated
expectation is satisfied. If we were writing a [manual test](manual), we'd be
done. However, it's time consuming for a human to run tests, so we should
prefer making tests automatic whenever possible. Remember that we set out to
write a "reference test." Now it's time to write the reference file.

## Writing a "match" reference

The "match" reference file describes what the test file is supposed to look
like. Critically, it *must not* use the technology that we are testing. The
reference file is what allows the test to be run by a computer--the computer
can verify that the color of each pixel in the test document exactly matches
the color of the corresponding pixel in the reference document.

Make a new file in the same `css/css-color/` directory named
`fuchsia-ref.html`, and save the following markup into it:

```html
<!DOCTYPE html>
<meta charset="utf-8">
<title>fuchsia text reference</title>
<style>body { color: #ff00ff; }</style>

<body>
  Test passes if this text is fuchsia.
</body>
```

This is like a stripped-down version of the test file. In order to produce a
visual rendering which is the same as the expected rendering, it uses the
hexadecimal notation to specify the fuchsia color. That way, if the browser
doesn't support the `fuchsia` keyword, this file will still (hopefully) have
colored text.

This file is also completely functional without the WPT server, so you can open
it in a browser directly from your hard drive.

Currently, there's no way for a human operator or an automated script to know
that the two files we've created are supposed to match visually. We'll need to
add one more piece of metadata to the test file we created earlier. Open
`css/css-colors/fuchsia.html` in your text editor and add another `<link>` tag
as described by the following change summary:

```diff
 <!DOCTYPE html>
 <meta charset="utf-8">
 <title>CSS Color: the "fuchsia" keyword</title>
 <link rel="author" title="Sam Smith">
 <link rel="help" href="https://www.w3.org/TR/css-color-3/#html4">
+<link rel="match" href="fuchsia-ref.html">
 <style>body { color: fuchsia; }</style>

 <body>
   Test passes if this text is fuchsia.
 </body>
```

Now, anyone (human or computer) reviewing the test file will know where to find
the associated reference file.

## Writing a "mismatch" reference

With a test file and a reference file, we've completed both of the necessary
components of a WPT reftest. However, what we've created so far is susceptible
to "false positives." Put differently: browsers could pass this test without
actually doing what we expect. For example, a browser would produce identical
renderings for both of the new files if it always presented text in black. A
browser that did that definitely shouldn't pass our test.

Fortunately, WPT reftests offer another feature which lets us guard against
false positives: "mismatch" files. We can add a file that demonstrates what the
test should *not* look like, and that will help catch cases where the test and
the reference match for the wrong reason.

For our example, we can make a new document which intentionally sets the text
color to black. We'll save it in `css/css-colors/fuchsia-notref.html`:

```html
<!DOCTYPE html>
<meta charset="utf-8">
<title>fuchsia text mismatch</title>
<style>body { color: #000000; }</style>

<body>
  Test passes if this text is fuchsia.
</body>
```

The statement is a little confusing in this context since we actually expect
the text to be black. In order to catch those false positives, it's important
that we don't change anything except the aspect we're verifying.

Just like with the reference document, we'll need to add some metadata to the
test document so it's clear how this new file should be interpreted. Note that
we're using `rel="mismatch"` this time:

```diff
 <!DOCTYPE html>
 <meta charset="utf-8">
 <title>CSS Color: the "fuchsia" keyword</title>
 <link rel="author" title="Sam Smith">
 <link rel="help" href="https://www.w3.org/TR/css-color-3/#html4">
 <link rel="match" href="fuchsia-ref.html">
+<link rel="mismatch" href="fuchsia-notref.html">
 <style>body { color: fuchsia; }</style>

 <body>
   Test passes if this text is fuchsia.
 </body>
```

Now, if the test and the reference match for the wrong reason, the test will
still fail because the file we've said shouldn't match will actually render
identically.

There are many ways a test could fail, so there are many different "mismatch"
files we could create. It can be hard to know what kind of "mismatch" files
would be most likely to catch bugs. Just like with the `assert` metadata, this
is something you'll develop an understanding of as you learn more about the
specification you're testing. In the mean time, the people reviewing your tests
can give you advice.

## Verifying our work

- ~~run the WPT server and visit the test files manually~~
- run from the filesystem
- run in `wpt serve`

## Submitting the test

First, let's stage the new files for committing:

    $ git add css/css-color/fuchsia.html
    $ git add css/css-color/fuchsia-ref.html
    $ git add css/css-color/fuchsia-notref.html

We can make sure the commit has everything we want to submit (and nothing we
don't) using `git diff`:

    $ git diff --staged

On most systems, you can use the arrow keys to navigate through the changes,
and you can press the `q` key when you're done reviewing.

Next, we'll create a commit with the staged changes:

    $ git commit -m '[css-color] Add test for `fuschia` keyword'

And now we can push the commit to our fork of WPT:

    $ git push origin reftest-for-fuchsia

The last step is to submit the test for review. We do this by creating a pull
request on GitHub. [The guide on git and GitHub](../appendix/github-intro) has
all the details on how to do that.
