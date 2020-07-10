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
    - tests: :heavy_check_mark:
      - `cache-storage-reporting-dedicated-worker.https.html`
      - `cache-storage-reporting-document.https.html`
      - `cache-storage-reporting-service-worker.https.html`
      - `cache-storage-reporting-shared-worker.https.html`
      - `dedicated-worker-cache-storage.https.html`
      - `none-load-from-cache-storage.https.html`
      - `require-corp-load-from-cache-storage.https.html`
      - `service-worker-cache-storage.https.html`
- "Update" algorithm
  - - condition: Service Worker's script is served with COEP of `require-corp`
    - effect: worker's COEP becomes `require-corp` (verify using conditions described in this document's "Fetch" section)
    - tests: :heavy_check_mark:
      - `require-corp-sw-from-none.https.html`
      - `require-corp-sw-from-require-corp.https.html`
      - `require-corp-sw.https.html`

## HTML

This section is based on the changes introduced to HTML via [gh-5454: Introduce
COEP](https://github.com/whatwg/html/pull/5454).

- "create a new browsing context"
  - - condition: creator's COEP is `require-corp`
    - effect: new document's COEP becomes `require-corp` (verify using conditions described in this document's "Fetch" section)
    - tests: :question:
- "set up a window environment settings object"
  - - condition: window's associated document has a COEP of `require-corp`
    - effect: new environment settings object receives a COEP of `require-corp` (verify using conditions described in this document's "Fetch" section)
    - tests: :question:
- "process a navigate fetch"
  - - condition: destination fails a CORP check with the parent context
    - effect: network error
    - tests: :question:
- "process a navigate response"
  - - condition: COEP reporting is enabled by parent browsing context and parent browsing context's COEP is "require corp" and response's COEP is "unsafe-none"
    - effect: notifies reporting observers and sends  areport to the specified URL
    - tests: :question:
  - - condition: COEP "report only" reporting is enabled by parent browsing context and parent browsing context's "report only" COEP is "require corp" and response's COEP is "unsafe-none"
    - effect: notifies reporting observers and sends  areport to the specified "report only" URL
    - tests: :question:
  - - condition: parent browsing context's COEP is "require corp" and response's COEP is "unsafe-none"
    - effect: network error
    - tests: :question:
- "create and initialize a Document object"
  - - condition: response enables COEP
    - effect: new document's COEP becomes `require-corp` (this is implicitly verified by almost all other tests)
- "run a worker"
  - - condition: worker URL is a local scheme and owner's COEP is "require-corp"
    - effect: worker's COEP becomes "require-corp"
    - tests: :x:
  - - condition: worker URL is not a local scheme and response's COEP is "require-corp"
    - effect: worker's COEP becomes "require-corp"
    - tests: :question:
  - - condition: worker URL is not a local scheme and response's COEP is "unsafe-none" and owner's COEP is "require-corp"
    - effect: network error
    - tests: :question:
