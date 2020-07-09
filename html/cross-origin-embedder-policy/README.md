See `../cross-origin-opener-policy/README.md`.

# Testing plan

## Fetch

This section is based on the changes introduced to Fetch via [gh-1030:
Integrate CORP and COEP](https://github.com/whatwg/fetch/pull/1030).

The conditions and effects in this section are only indirectly observable. They
are verified when observed through other algorithms--see the following
sections.

- "cross-origin resource policy check"
  - - condition: COEP reporting is enabled and CORP is violated due to COEP value
    - effect: notifies reporting observers and sends a report to the specified URL
  - - condition: COEP "report only" reporting is enabled and CORP is violated due to COEP "report only" value
    - effect: notifies reporting observers and sends a report to the specified "report only" URL
- "cross-origin resource policy internal check"
  - - condition: `require-corp` and navigation request
    - effect: CORP is enforced
  - - condition: `require-corp` and CORP is unset
    - effect: CORP becomes `same-origin` (instead of `cross-origin`)
  - - condition: `require-corp` and CORP is invalid
    - effect: CORP becomes `same-origin` (instead of `cross-origin`)

## Service Worker

This section is based on the changes introduced to Service Worker via [gh-1516:
Introduce Cross-Origin Embedder
Policy](https://github.com/w3c/ServiceWorker/pull/1516).

- `matchAll`
  - - condition: at least one matched response is of type "opaque" and is blocked by CORP check
    - effect: promise is rejected
    - tests: :question:
- "Update" algorithm
  - - condition: Service Worker's script is served with COEP of `require-corp`
    - effect: worker's COEP becomes `require-corp` (verify using conditions described in this document's "Fetch" section)
    - tests: :question:

## HTML

This section is based on the changes introduced to HTML via [gh-5454: Introduce
COEP](https://github.com/whatwg/html/pull/5454).

:exclamation: This section is incomplete. :exclamation:

- "create a new browsing context"
  - - condition: creator's COEP is `require-corp`
    - effect: new document's COEP becomes `require-corp` (verify using conditions described in this document's "Fetch" section)
    - tests: :question:
- "set up a window environment settings object"
  - - condition: window's associated document has a COEP of `require-corp`
    - effect: new environment settings object receives a COEP of `require-corp` (verify using conditions described in this document's "Fetch" section)
    - tests: :question:

:exclamation: This section is incomplete. :exclamation:
