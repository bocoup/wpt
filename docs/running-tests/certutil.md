# certutil

The WPT CLI cannot automatically install all dependencies

The `certutil` tool is required to run HTTPS tests with Firefox, but it cannot
be installed automatically by the WPT CLI. This guide documents how to install
it on the platforms supported by WPT.

On Debian/Ubuntu, execute the following command:

```
sudo apt install libnss3-tools
```

On macOS, execute the following command:

```
brew install nss
```

On other platforms:

1. Download the Firefox archive and `common.tests.tar.gz`
   archive for your platform from [Mozilla
   CI](https://archive.mozilla.org/pub/firefox/nightly/latest-mozilla-central/).
2. Extract `certutil[.exe]` from the tests.tar.gz package and
   `libnss3[.so|.dll|.dynlib]` and put the former on your path and the latter
   on your library path.
