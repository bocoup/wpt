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
    - tests: :question:

TODO: reformat the following items to match the structure of the items above

- "navigate"
  - - condition:
    - effect: navigating to a response derives sandboxing flags from browsing context *and* resource; COOP is unconditionally set to "unsafe-none"
    - tests: :question:
  - - condition:
    - effect: navigating to a `javascript:` URL derives sandboxing flags from browsing context *and* request; COOP is set to match the active document
    - tests: :question:
- "process a navigate fetch"
  - - condition:
    - effect: blocks navigation of top-level browsing context from sandboxed context when coop is set (and `allow-popups-to-escape-sandbox` is not)
    - tests: :heavy_check_mark:
      - `coop-sandbox.https.html`
      - https://github.com/web-platform-tests/wpt/pull/24351
  - - condition:
    - effect: creates new browsing context groups for popups according to COOP
    - tests: :heavy_check_mark:
      - `iframe-popup-same-origin-allow-popups-to-same-origin-allow-popups.https.html`
      - `iframe-popup-same-origin-allow-popups-to-same-origin.https.html`
      - `iframe-popup-same-origin-allow-popups-to-unsafe-none.https.html`
      - `iframe-popup-same-origin-to-same-origin.https.html`
      - `iframe-popup-same-origin-to-unsafe-none.https.html`
      - `iframe-popup-unsafe-none-to-same-origin.https.html`
      - `iframe-popup-unsafe-none-to-unsafe-none.https.html`
      - `iframe-sandbox-popup.https.html`
  - - condition:
    - effect: forwards sandbox flags, incumbent origin, and active origin to redirect requests
    - tests: :question:
  - - condition:
    - effect: forwards a number of new variables to "process a navigate response"
    - tests: :question:
- "create and initialize a Document object"
  - - condition:
    - effect: creates a new browsing context when the new "browsingContextSwitchNeeded" is true
    - tests: :question:
  - - condition:
    - effect: sets the COOP of the navigation to match the COOP of the navigation
    - tests: :question:
- "page load processing model for HTML files"
  - - condition:
    - effect: forwards new parameters to "creating and initializing a Document object"
    - tests: :question:
- "page load processing model for XML files"
  - - condition:
    - effect: forwards new parameters to "creating and initializing a Document object"
    - tests: :question:
- "page load processing model for text files"
  - - condition:
    - effect: forwards new parameters to "creating and initializing a Document object"
    - tests: :question:
- "page load processing model for media"
  - - condition:
    - effect: forwards new parameters to "creating and initializing a Document object"
    - tests: :question:
- "page load processing model for content that uses plugins"
  - - condition:
    - effect: forwards new parameters to "creating and initializing a Document object"
    - tests: :question:
