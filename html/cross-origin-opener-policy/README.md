This directory as well as `../cross-origin-embedder-policy/` contains tests for `Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy`. Some light background reading:

* [COOP and COEP explained](https://docs.google.com/document/d/1zDlfvfTJ_9e8Jdc8ehuV4zMEu9ySMCiTGMS9y0GU92k/edit)
* [COOP processing model](https://gist.github.com/annevk/6f2dd8c79c77123f39797f6bdac43f3e) (also defines interaction with COEP)
* [COEP processing model](https://mikewest.github.io/corpp/)
* [Open COOP issues](https://github.com/whatwg/html/labels/topic%3A%20cross-origin-opener-policy)
* [Open COEP issues](https://github.com/whatwg/html/labels/topic%3A%20cross-origin-embedder-policy)

Notes:

* Top-level navigation to a `data:` URL does not work in Chrome and Firefox and is therefore not tested. (This should probably be standardized.)

# Testing plan

## HTML

This section is based on the changes introduced to HTML via [gh-5334: Add
cross-origin opener policy](https://github.com/whatwg/html/pull/5334).

- "create a new browsing context"
  - - condition: browsing context has a creator and creator is same-origin with its top-level browsing context
    - effect: browsing context inherits COOP from creator
    - tests: :question:
- "rules for choosing a browsing context"
  - - condition: COOP is enabled in parent and parent is cross-origin with new browsing context
    - effect: "name" is ignored and "noopener" is set
    - tests: `popup-same-origin-with-cross-origin.https.html`
- "navigate"
  - - condition: resource is a response
    - effect: sandboxing flags from browsing context *and* resource; COOP is unconditionally set to "unsafe-none"
    - tests: `coop-sandbox.https.html`
  - - condition: resource is a `javascript:` URL
    - effect: sandboxing flags from browsing context *and* request; COOP is set to match the active document
    - tests: [gh-25189: [html] Add tests for COOP with javascript: URLs](https://github.com/web-platform-tests/wpt/pull/25189)
- "process a navigate fetch"
  - - condition: browsing context is top-level, sandboxing flags are set, and the COOP of any response in a redirect chain is "unsafe-none"
    - effect: navigation blocked
    - tests: :heavy_check_mark:
      - `coop-sandbox.https.html`
      - https://github.com/web-platform-tests/wpt/pull/24351
  - - condition: any response in a redirect chain warrents a new browsing context according to COOP
    - effect: a new browsing context group is created
    - tests: :heavy_check_mark:
      - `iframe-popup-same-origin-allow-popups-to-same-origin-allow-popups.https.html`
      - `iframe-popup-same-origin-allow-popups-to-same-origin.https.html`
      - `iframe-popup-same-origin-allow-popups-to-unsafe-none.https.html`
      - `iframe-popup-same-origin-to-same-origin.https.html`
      - `iframe-popup-same-origin-to-unsafe-none.https.html`
      - `iframe-popup-unsafe-none-to-same-origin.https.html`
      - `iframe-popup-unsafe-none-to-unsafe-none.https.html`
      - `iframe-sandbox-popup.https.html`
  - - condition: response is a `data:` URL
    - effect: forwards sandbox flags, incumbent origin, and active origin
    - tests: :question:
- "create and initialize a Document object"
  - - condition: "browsingContextSwitchNeeded" is true
    - effect: creates a new browsing context
    - tests: (observable only through "page load processing model" algorithms)
  - - condition: navigation's COOP is "same-origin"
    - effect: new document's COOP is set to "same-origin"
    - tests: (observable only through "page load processing model" algorithms)
  - - condition: navigation's COOP is "same-origin-allow-popups"
    - effect: new document's COOP is set to "same-origin-allow-popups"
    - tests: (observable only through "page load processing model" algorithms)
- "page load processing model for HTML files"
  - - (validate all expectations for "create and initialize a Document object" algorithm)
    - tests: :construction: (@jugglinmike)
- "page load processing model for XML files"
  - - (validate all expectations for "create and initialize a Document object" algorithm)
    - tests: :construction: (@jugglinmike)
- "page load processing model for text files"
  - - (validate all expectations for "create and initialize a Document object" algorithm)
    - tests: :construction: (@jugglinmike)
- "page load processing model for media"
  - - (validate all expectations for "create and initialize a Document object" algorithm)
    - tests: :construction: (@jugglinmike)
- "page load processing model for content that uses plugins"
  - - (validate all expectations for "create and initialize a Document object" algorithm)
    - tests: :construction: (@jugglinmike)
