# Making a Testing Plan

When contributing to a project as large and open-ended as WPT, it's easy to get
lost in the details. Starting with an informal testing strategy helps you
anticipate how much work will be involved, and it helps you stay focused once
you begin.

Many people come to WPT with a general testing goal in mind:

- specification authors often want to test for new spec text
- browser maintainers often want to test new features or fixes to existing
  features
- web developers often want to test discrepancies between browsers on their web
  applications

But if you don't have any particular goal, we can still help you get started.
Check out [the issues labeled with `type:missing-coverage` on
GitHub.com](https://github.com/web-platform-tests/wpt/labels/type%3Amissing-coverage).
Leave a comment if you'd like to get started with one, and don't hesitate to
ask clarifying questions!

This guide will:

1. show you how to use the specifications to learn what kinds of tests will be
   most helpful
2. help you develop a sense for what *doesn't* need to be tested
3. demonstrate methods for figuring out which tests (if any) have already been
   written for WPT

## Understanding the "testing surface"

The specifications are instructions about how a feature should work. They're
critical for implementers to "build the right thing," but they are also
important for us test authors. We can use the same instructions to infer what
kinds of tests would be likely to detect mistakes. Here are a few common
patterns in specification text and the kind of tests they suggest.

### Input sources

Algorithms may accept input from many sources. Modifying the input is the only
way we can influence the browser's behavior and verify that it matches the
specifications. That's why it's helpful to be able to recognize all the
different sources of input.

For JavaScript APIs, the most explicit form of input is the function parameter.
For functions that are [JavaScript
methods](https://developer.mozilla.org/en-US/docs/Glossary/Method), then the
behavior may also depend on the state of the "[context
object](https://dom.spec.whatwg.org/#context-object)" (e.g. the value of `foo`
when invoking a method like `foo.method()`).

The state of the browser may also influence algorithm behavior. Examples
include the current document, the dimensions of the viewport, and the entries
in the browsing history.

*Example* This is the first step of the `Notification` constructor from [the
Notifications standard](https://notifications.spec.whatwg.org/#constructors):

> The Notification(title, options) constructor, when invoked, must run these steps:
>
> 1. If the current global object is a ServiceWorkerGlobalScope object, then
>    throw a TypeError exception.
>
> [...]

A thorough test suite for this constructor will include tests for the behavior
of many different values of the *title* parameter and the *options* parameter.
The type of "the current global object" is also a form of input, the test suite
should also include tests which execute with different global objects.

### Branches

Just like traditional computer programs, specification algorithms often behave
differently based on the state of the system. And just like programs, those
differences are expressed with branching logic, usually using the same familiar
concepts of "if", "then", and "else."

When an algorithm branches based on some condition, that's an indication of an
interesting behavior that might be missed. You should write at least one test
that verifies the behavior when the branch is taken and at least one more test
that verifies the behavior when the branch is *not* taken.

*Example* The following algorithm from [the HTML
standard](https://html.spec.whatwg.org/) describes how the
`localStorage.getItem` method works:

> The `getItem`(*key*) method must return the current value associated with the
> given *key*. If the given *key* does not exist in the list associated with
> the object then this method must return null.

This algorithm exhibits different behavior depending on whether or not an item
exists at the provided key. In specification language, we'd say "it branches on
the presence of the key." To test this thoroughly, we would write two tests.
One test would verify that `null` is returned when there is no item at the
provided key (that's the "branch taken" path). The other test would verify that
an item we previously stored was correctly retrieved when we called the method
with its name (that's the "branch not taken" path).

### Sequence

Even without branching, the interplay between sequential algorithm steps can
suggest interesting test cases. If two steps have observable side-effects, then
it can be useful to verify they happen in the correct order.

Most of the time, step sequence is implicit in the nature of the
algorithm--each step operates on the result of the step that precedes it, so
verifying the end result implicitly verifies the sequence of the steps. But
sometimes, the order of two steps isn't particularly relevant to the result of
the overall algorithm. This makes it easier for implementations to diverge.

The most common example may be input validation. Many algorithms for JavaScript
APIs begin by verifying that the input (function parameters, global state,
etc.) meets some criteria. This may involve many independent checks. The
precise order of the checks may not influence result of the overall algorithm,
but the order is well-defined and observable, so it's important to verify.

*Example* The following algorithm from [the DOM
specification](https://dom.spec.whatwg.org) describes how the
`createCDATASection` method works:

> The `createCDATASection`(*data*) method, when invoked, must run these steps:
>
> 1. If [context object](https://dom.spec.whatwg.org/#context-object) is an
>    [HTML document](https://dom.spec.whatwg.org/#html-document), then
>    [throw](https://heycam.github.io/webidl/#dfn-throw) a
>    "[`NotSupportedError`](https://heycam.github.io/webidl/#notsupportederror)"
>    [DOMException](https://heycam.github.io/webidl/#idl-DOMException).
> 2. If *data* contains the string "`]]>`", then
>    [throw](https://heycam.github.io/webidl/#dfn-throw) an
>    "[`InvalidCharacterError`](https://heycam.github.io/webidl/#invalidcharactererror)"
>    [DOMException](https://heycam.github.io/webidl/#idl-DOMException).
> 3. Return a new [CDATASection](https://dom.spec.whatwg.org/#cdatasection)
>    [node](https://dom.spec.whatwg.org/#boundary-point-node) with its
>    [data](https://dom.spec.whatwg.org/#concept-cd-data) set to *data* and
>    [node document](https://dom.spec.whatwg.org/#concept-node-document) set to
>    the [context object](https://dom.spec.whatwg.org/#context-object).

This algorithm begins by ensuring that the context object isn't an HTML
document. Then, it verifies that the first argument doesn't include a certain
sequence of characters. Implementations that verify those things in the
opposite order would achieve a similar result (i.e. they'd reject invalid
input), but that slight difference could cause interoperability bugs on the
web.

If we prepare input that violates *both* steps, then we can verify that they're
taken in the correct order. We can call `createCDATASection` on an HTML
document and pass the string "`]]>`"; that should produce a
`NotSupportedError`. If it produces a `InvalidCharacterError` instead, we'll
know that the implementation has incorrectly placed the second step before the
first.

## Exercising Restraint

When writing conformance tests, choosing what *not* to test is sometimes just
as hard as finding what needs testing.

### Skip ambiguity

Specifications occasionally allow browsers some discretion in how they
implement certain features. These are described using [RFC
2119](https://tools.ietf.org/html/rfc2119) terms like "MAY" and "OPTIONAL".
Even though each browser will likely maintain its own tests for the behavior it
chooses to implement, it's important that shared conformance test suites like
WPT do not include tests for any particular behavior. If the specification
doesn't require something, then neither should the tests!

*Example* The following algorithm from [the DOM
standard](https://dom.spec.whatwg.org/) powers
[`document.getElementsByTagName`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByTagName):

> The list of elements with qualified name *qualifiedName* for a
> [node](https://dom.spec.whatwg.org/#boundary-point-node) *root* is the
> [HTMLCollection](https://dom.spec.whatwg.org/#htmlcollection) returned by the
> following algorithm:
>
> 1. If *qualifiedName* is "`*`" (U+002A), return a
>    [HTMLCollection](https://dom.spec.whatwg.org/#htmlcollection) rooted at
>    *root*, whose filter matches only
>    [descendant](https://dom.spec.whatwg.org/#concept-tree-descendant)
>    [elements](https://dom.spec.whatwg.org/#concept-element).
> 2. Otherwise, if *root*'s [node
>    document](https://dom.spec.whatwg.org/#concept-node-document) is an [HTML
>    document](https://dom.spec.whatwg.org/#html-document), return a
>    [HTMLCollection](https://dom.spec.whatwg.org/#htmlcollection) rooted at
>    *root*, whose filter matches the following
>    [descendant](https://dom.spec.whatwg.org/#concept-tree-descendant)
>    [elements](https://dom.spec.whatwg.org/#concept-element).
>    - Whose
>      [namespace](https://dom.spec.whatwg.org/#concept-element-namespace) is
>      the [HTML namespace](https://infra.spec.whatwg.org/#html-namespace) and
>      whose [qualified
>      name](https://dom.spec.whatwg.org/#concept-element-qualified-name) is
>      *qualifiedName*, in [ASCII
>      lowercase](https://infra.spec.whatwg.org/#ascii-lowercase).
>    - Whose
>      [namespace](https://dom.spec.whatwg.org/#concept-element-namespace) is
>      *not* the [HTML
>      namespace](https://infra.spec.whatwg.org/#html-namespace) and whose
>      [qualified
>      name](https://dom.spec.whatwg.org/#concept-element-qualified-name) is
>      *qualifiedName*.
> 3. Otherwise, return a
>    [HTMLCollection](https://dom.spec.whatwg.org/#htmlcollection) rooted at
>    *root*, whose filter matches
>    [descendant](https://dom.spec.whatwg.org/#concept-tree-descendant)
>    [elements](https://dom.spec.whatwg.org/#concept-element).
>    whose [qualified
>    name](https://dom.spec.whatwg.org/#concept-element-qualified-name) is
>    *qualifiedName*.
>
> When invoked with the same argument, and as long as *root*'s [node
> document](https://dom.spec.whatwg.org/#concept-node-document)'s
> [type](https://dom.spec.whatwg.org/#concept-document-type) has not changed,
> the same [HTMLCollection](https://dom.spec.whatwg.org/#htmlcollection) object
> may be returned as returned by an earlier call.

The final statement uses the word "may," so even though it modifies the
behavior of the algorithm, it is not appropriate to verify it in a conformance
test.

It's important to read these sections carefully, though, because the
distinction between "mandatory" behavior and "optional" behavior can be quite
nuanced. In this case, the behavior is not allowed if the document's type has
changed. That makes for a valid conformance test, one that verifies browsers
never return the same result when the document's type changes.

### Don't dive too deep

Algorithms are usually composed of many other algorithms which themselves are
defined in terms of still more algorithms. It can be intimidating to consider
exhaustively testing one of those "nested" algorithms, especially when they are
shared by many different APIs.

In general, you should start by writing only "surface tests" for the nested
algorithms. That means, only verify that they exhibit the basic behavior you
are expecting.

It's definitely important to test exhaustively, but it's just as important to
do so in a structured way. Reach out to the test suite's maintainers to learn
if and how they have already tested those algorithms. In many cases, it's
acceptable to test them in just one place (and maybe through a different API
entirely), and rely only on surface-level testing everywhere else. While it's
always possible for more tests to uncover new bugs, the chances may be slim.
The time we spend writing tests is highly valuable, so we have to be efficient!

*Example* The following algorithm from [the DOM
standard](https://dom.spec.whatwg.org/) powers
[`document.querySelector`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector):

> To **scope-match a selectors string** *selectors* against a *node*, run these
> steps:
>
> 1. Let *s* be the result of [parse a
>    selector](https://drafts.csswg.org/selectors-4/#parse-a-selector)
>    *selectors*.
>    [[SELECTORS4]](https://dom.spec.whatwg.org/#biblio-selectors4)
> 2. If *s* is failure, then
>    [throw](https://heycam.github.io/webidl/#dfn-throw) a
>    "[`SyntaxError`](https://heycam.github.io/webidl/#syntaxerror)"
>    [DOMException](https://heycam.github.io/webidl/#idl-DOMException).
> 3. Return the result of [match a selector against a
>    tree](https://drafts.csswg.org/selectors-4/#match-a-selector-against-a-tree)
>    with *s* and *node*'s
>    [root](https://dom.spec.whatwg.org/#concept-tree-root) using [scoping
>    root](https://drafts.csswg.org/selectors-4/#scoping-root) *node*.
>    [[SELECTORS4]](https://dom.spec.whatwg.org/#biblio-selectors4).

As described earlier in this guide, we'd definitely want to test the branch
regarding the parsing failure. But there are many ways a string might fail to
parse--should we verify them all in the tests for `document.querySelector`? And
what about `document.querySelectorAll`--should we test them all there, too?

The answers depend on the current state of the test suite: whether or not tests
for selector parsing exist and where they are located. That's why it's best to
confer with the people who are maintaining the tests.

### Avoid excessive breadth

Many algorithms operate on input that takes the form of a scalar value. When
the set of values is finite, it can be tempting to test them all exhaustively.
When the set is very large, test authors can reduce repetition by defining
tests programmatically in loops.

Using advanced control flow techniques to dynamically generate tests has a
number of drawbacks. It makes the test suite more difficult to understand since
readers have to mentally "unwind" the iteration to determine what is actually
being verified. It also increases the risk of bugs in the tests. These bugs may
not be obvious--they may not cause failures, and they may exercise fewer cases
than intended.

Generally speaking, such exhaustive approaches are unlikely to catch more bugs
than a handful of carefully-chosen test cases. So although the risks of dynamic
test generation may be tolerable in some specific cases, it's usually best to
select the most interesting edge cases and move on.

*Example* We can see this consideration in the very first step of the
`Response` constructor from [the Fetch
standard](https://fetch.spec.whatwg.org/)

> The `Response`(*body*, *init*) constructor, when invoked, must run these
> steps:
>
> 1. If *init*["`status`"] is not in the range `200` to `599`, inclusive, then
>    [throw](https://heycam.github.io/webidl/#dfn-throw) a `RangeError`.
>
> [...]

This function accepts exactly 400 values for the "status." With WPT's
testharness.js, it's easy to dynamically create one test for each value. Unless
we have reason to believe that a browser may exhibit drastically different
behavior for any of those values (e.g. correctly accepting `546` but
incorrectly rejecting `547`), then the complexity of testing those cases
probably isn't warranted.

Instead, focus on writing declarative tests for specific values which are novel
in the context of the algorithm. For ranges like in this example, testing the
boundaries is a good idea. `200` and `599` should not produce an error while
`199` and `600` should produce an error. Feel free to use what you know about
the feature to choose additional values. In this case, HTTP response status
codes are classified by the "hundred" order of magnitude, so we might also want
to test a "3xx" value and a "4xx" value.

## Assessing coverage

It's very likely that WPT already has some tests for the feature (or at least
the specification) that you're interesting in testing. In that case, you'll
have to study what's already been done before starting to write new tests.
Understanding the design of existing tests will let you avoid duplicating
effort, and it will also help you integrate your work more logically.

Even if the feature you're testing does *not* have any tests, you should still
keep these guidelines in mind. Sooner or later, someone else will want to
extend your work, so you should give them a good starting point!

### File names

[This page on the design of WPT](../test-suite-design) goes into detail about
how files are generally laid out in the repository.

---

If the feature you're testing does *not* have any tests, then you won't have to
study existing coverage. In some ways, this makes contributing easier (even
though it also means there are more tests to write). The


Instead, you'll be responsible for organizing your contribution so that future
contributors can

Organization is crucial for the long-term health of the project,

---

- Understanding the "testing surface" (what makes a test "interesting" or
  "helpful"?)
  - observability (some things cannot be tested)
  - branches (defined in algorithm structure and also in the prose itself--e.g.
    "if present, do X, otherwise do Y")
  - sequence (verify that steps occur in the specified order, particularly when
    the order isn't relevant for the overall algorithm, e.g. input validation)
  - input values
    - sources
      - formal parameters
      - global state (e.g. the document, the window, etc.)
        https://notifications.spec.whatwg.org/#constructors
    - types
      - scalars - "middle ground" case, "edge cases", "unspecified" case (where
        applicable), and any other values you might think of based on your
        knowledge of implementations (e.g. the current width of the viewport)
- Exercising restraint
  - intentional ambiguity (some things should not be tested)
  - don't dive too deep (it may not be appropriate to test all the boundary
    conditions of a complex internal algorithm if it's used in many other
    places)
  - breadth can be more trouble than it's worth (e.g. procedurally testing
    hundreds of number values)
- Assessing coverage
  - file names
  - file contents (GitHub.com search, or `grep` and regular expressions)
  - failures on wpt.fyi
