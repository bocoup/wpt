(function() {
    "use strict";

    function getInViewCenterPoint(rect) {
        var left = Math.max(0, rect.left);
        var right = Math.min(window.innerWidth, rect.right);
        var top = Math.max(0, rect.top);
        var bottom = Math.min(window.innerHeight, rect.bottom);

        var x = 0.5 * (left + right);
        var y = 0.5 * (top + bottom);

        return [x, y];
    }

    function getPointerInteractablePaintTree(element) {
        if (!window.document.contains(element)) {
            return [];
        }

        var rectangles = element.getClientRects();

        if (rectangles.length === 0) {
            return [];
        }

        var centerPoint = getInViewCenterPoint(rectangles[0]);

        if ("elementsFromPoint" in document) {
            return document.elementsFromPoint(centerPoint[0], centerPoint[1]);
        } else if ("msElementsFromPoint" in document) {
            var rv = document.msElementsFromPoint(centerPoint[0], centerPoint[1]);
            return Array.prototype.slice.call(rv ? rv : []);
        } else {
            throw new Error("document.elementsFromPoint unsupported");
        }
    }

    function inView(element) {
        var pointerInteractablePaintTree = getPointerInteractablePaintTree(element);
        return pointerInteractablePaintTree.indexOf(element) !== -1;
    }


    /**
     * @namespace
     */
    window.test_driver = {
        /**
         * Triggers a user-initiated click
         *
         * This matches the behaviour of the {@link
         * https://w3c.github.io/webdriver/webdriver-spec.html#element-click|WebDriver
         * Element Click command}.
         *
         * @param {Element} element - element to be clicked
         * @returns {Promise} fulfilled after click occurs, or rejected in
         *                    the cases the WebDriver command errors
         */
        click: function(element) {
            if (window.top !== window) {
                return Promise.reject(new Error("can only click in top-level window"));
            }

            if (!window.document.contains(element)) {
                return Promise.reject(new Error("element in different document or shadow tree"));
            }

            if (!inView(element)) {
                element.scrollIntoView({behavior: "instant",
                                        block: "end",
                                        inline: "nearest"});
            }

            var pointerInteractablePaintTree = getPointerInteractablePaintTree(element);
            if (pointerInteractablePaintTree.length === 0 ||
                !element.contains(pointerInteractablePaintTree[0])) {
                return Promise.reject(new Error("element click intercepted error"));
            }

            var rect = element.getClientRects()[0];
            var centerPoint = getInViewCenterPoint(rect);
            return window.test_driver_internal.click(element,
                                                     {x: centerPoint[0],
                                                      y: centerPoint[1]});
        },

        /**
         * Send keys to an element
         *
         * This matches the behaviour of the {@link
         * https://w3c.github.io/webdriver/webdriver-spec.html#element-send-keys|WebDriver
         * Send Keys command}.
         *
         * @param {Element} element - element to send keys to
         * @param {String} keys - keys to send to the element
         * @returns {Promise} fulfilled after keys are sent, or rejected in
         *                    the cases the WebDriver command errors
         */
        send_keys: function(element, keys) {
            if (window.top !== window) {
                return Promise.reject(new Error("can only send keys in top-level window"));
            }

            if (!window.document.contains(element)) {
                return Promise.reject(new Error("element in different document or shadow tree"));
            }

            if (!inView(element)) {
                element.scrollIntoView({behavior: "instant",
                                        block: "end",
                                        inline: "nearest"});
            }

            var pointerInteractablePaintTree = getPointerInteractablePaintTree(element);
            if (pointerInteractablePaintTree.length === 0 ||
                !element.contains(pointerInteractablePaintTree[0])) {
                return Promise.reject(new Error("element send_keys intercepted error"));
            }

            return window.test_driver_internal.send_keys(element, keys);
        },

        /**
         * Freeze the current page
         *
         * The freeze function transitions the page from the HIDDEN state to
         * the FROZEN state as described in {@link
         * https://github.com/WICG/page-lifecycle/blob/master/README.md|Lifecycle API
         * for Web Pages}
         *
         * @returns {Promise} fulfilled after the freeze request is sent, or rejected
         *                    in case the WebDriver command errors
         */
        freeze: function() {
            return window.test_driver_internal.freeze();
        }
    };

    /**
     * These media tracks will be continually updated with deterministic "noise" in
     * order to ensure UAs do not cease transmission in response to apparent
     * silence.
     *
     * > Many codecs and systems are capable of detecting "silence" and changing
     * > their behavior in this case by doing things such as not transmitting any
     * > media.
     *
     * Source: https://w3c.github.io/webrtc-pc/#offer-answer-options
     */
    var trackFactories = {
        // Share a single context between tests to avoid exceeding resource limits
        // without requiring explicit destruction.
        audioContext: null,

        audio: function() {
            var ctx = trackFactories.audioContext;

            if (!ctx) {
                ctx = trackFactories.audioContext = new AudioContext();
            }

            var oscillator = ctx.createOscillator();
            var dst = oscillator.connect(ctx.createMediaStreamDestination());
            oscillator.start();
            return dst.stream.getAudioTracks()[0];
        },

        video(dimensions) {
          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d");
          var stream = canvas.captureStream();
          var count = 0;

          canvas.height = dimensions && dimensions.height || 480;
          canvas.width = dimensions && dimensions.width || 640;
          setInterval(function() {
              ctx.fillStyle = "rgb(" + (count % 255) +", " +
                  (count * count % 255) + ", " + (count % 255) + ")";
              count += 1;

              ctx.fillRect(0, 0, width, height);
          }, 100);

          if (document.body) {
              document.body.appendChild(canvas);
          } else {
              document.addEventListener("DOMContentLoaded", function() {
                  document.body.appendChild(canvas);
              });
          }

          return stream.getVideoTracks()[0];
        }
    };

    window.test_driver_internal = {
        /**
         * Triggers a user-initiated click
         *
         * @param {Element} element - element to be clicked
         * @param {{x: number, y: number} coords - viewport coordinates to click at
         * @returns {Promise} fulfilled after click occurs or rejected if click fails
         */
        click: function(element, coords) {

            return Promise.reject(new Error("unimplemented"));
        },

        /**
         * Generate a MediaStream bearing the specified tracks.
         *
         * @param {object} [caps]
         * @param {boolean} [caps.audio] - flag indicating whether the generated stream
         *                                 should include an audio track
         * @param {boolean} [caps.video] - flag indicating whether the generated stream
         *                                 should include a video track
         */
        getNoiseStream: function(caps) {
          var tracks = [];

          if (caps && caps.audio) {
            tracks.push(trackFactories.audio());
          }

          if (caps && caps.video) {
            tracks.push(trackFactories.video());
          }

          return Promise.resolve(new MediaStream(tracks));
        },

        /**
         * Triggers a user-initiated click
         *
         * @param {Element} element - element to be clicked
         * @param {String} keys - keys to send to the element
         * @returns {Promise} fulfilled after keys are sent or rejected if click fails
         */
        send_keys: function(element, keys) {
            return Promise.reject(new Error("unimplemented"));
        },

        /**
         * Freeze the current page
         *
         * @returns {Promise} fulfilled after freeze request is sent, otherwise
         * it gets rejected
         */
        freeze: function() {
            return Promise.reject(new Error("unimplemented"));
        }
    };
})();
