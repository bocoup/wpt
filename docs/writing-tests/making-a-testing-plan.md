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
2. demonstrate methods for figuring out which tests (if any) have already been
   written for WPT

## Understanding the "testing surface"

The specifications are instructions about how a feature should work. They're
critical for implementers to "build the right thing," but they are also
important for us test authors. We can use the same instructions to infer what
kinds of tests would be likely to detect mistakes. Here are a few common
patterns in specification text and the kind of tests they suggest.

**Branches** Just like traditional computer programs, specification algorithms
often behave differently based on the state of the system. And just like
programs, those differences are expressed with branching logic, usually using
the same familiar concepts of "if", "then", and "else."

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

**Caution: diving too deep** Algorithms are usually composed of many other
algorithms which themselves are defined in terms of still more algorithms. It
can be intimidating to consider exhaustively testing one of those "nested"
algorithms, especially when they are shared by many different APIs.

In general, you should start by writing only "surface tests" for the nested
algorithms. That means, only verify that they exhibit the basic behavior you
are expecting.

It's definitely important to test exhaustively, but it's just as important to
do so in a structured way. Reach out to the test suite's maintainers to learn
if and how they have already tested those algorithms. In many cases, it's
acceptable to test them just once (and maybe through a different API entirely),
and rely only on surface-level testing elsewhere. While it's always possible
for more tests to uncover new bugs, the chances are slim. The time we spend
writing tests is highly valuable, so we have to be efficient!

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

- Understanding the "testing surface" (what makes a test "interesting" or
  "helpful"?)
  - observability (some things cannot be tested)
  - intentional ambiguity (some things should not be tested)
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
  - cautions
    - don't dive too deep (it may not be appropriate to test all the boundary
      conditions of a complex internal algorithm if it's used in many other
      places)
    - breadth can be more trouble than it's worth (e.g. procedurally testing
      hundreds of number values)
- Assessing coverage
  - file names
  - file contents (GitHub.com search, or `grep` and regular expressions)
  - failures on wpt.fyi
