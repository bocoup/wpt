Chrome
======

When running Chrome, there are some useful command line arguments.

You can inform ``wpt`` of the release channel of Chrome using ``--channel``.
However, ``wpt`` currently does not support installing Chrome or finding the
Chrome binary of a specific channel, so you would also need to specify the path
to the Chrome binary with ``--binary``. For example, to run Chrome Dev on Linux:

.. code-block:: bash

    ./wpt run --channel dev --binary `which google-chrome-unstable` chrome

Note: when the channel is "dev", ``wpt`` will *automatically* enable all
experimental web platform features [#runtime-enabled-features]_
(chrome://flags/#enable-experimental-web-platform-features) by passing
``--enable-experimental-web-platform-features`` to Chrome.

If you want to enable a specific runtime enabled feature [#runtime-enabled-features]_, use
``--binary-arg`` to specify the flag(s) that you want to pass to Chrome:

.. code-block:: bash

    ./wpt run --binary-arg=--enable-blink-features=AsyncClipboard chrome clipboard-apis/

.. rubric:: Footnotes

.. [#runtime-enabled-features] https://www.chromium.org/blink/runtime-enabled-features
