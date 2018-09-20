---
layout: page
title: Running Tests
---

The tests are designed to be run from your local computer. The test
environment requires [Python 2.7+](http://www.python.org/downloads) (but not Python 3.x).

On Windows, be sure to add the Python directory (`c:\python2x`, by default) to
your `%Path%` [Environment Variable](http://www.computerhope.com/issues/ch000549.htm),
and read the [Windows Notes](#windows-notes) section below.

To get the tests running, you need to set up the test domains in your
[`hosts` file](http://en.wikipedia.org/wiki/Hosts_%28file%29%23Location_in_the_file_system).

The necessary content can be generated with `./wpt make-hosts-file`; on
Windows, you will need to preceed the prior command with `python` or
the path to the Python binary (`python wpt make-hosts-file`).

For example, on most UNIX-like systems, you can setup the hosts file with:

```bash
./wpt make-hosts-file | sudo tee -a /etc/hosts
```

And on Windows (this must be run in a PowerShell session with Administrator privileges):

```bash
python wpt make-hosts-file | Out-File %SystemRoot%\System32\drivers\etc\hosts -Encoding ascii -Append
```

If you are behind a proxy, you also need to make sure the domains above are
excluded from your proxy lookups.

The test environment can then be started using

    ./wpt serve

This will start HTTP servers on two ports and a websockets server on
one port. By default the web servers start on ports 8000 and 8443 and the other
ports are randomly-chosen free ports. Tests must be loaded from the
*first* HTTP server in the output. To change the ports,
create a `config.json` file in the wpt root directory, and add
port definitions of your choice e.g.:

```
{
  "ports": {
    "http": [1234, "auto"],
    "https":[5678]
  }
}
```

After your `hosts` file is configured, the servers will be locally accessible at:

http://web-platform.test:8000/<br>
https://web-platform.test:8443/ *

\**See [Trusting Root CA](https://github.com/web-platform-tests/wpt/blob/master/README.md#trusting-root-ca)*

## Running tests automatically

Several options exist to support running large groups of tests or running tests
frequently. These are documented in [Running Tests in Automation][automation].

### Windows Notes

Generally Windows Subsystem for Linux will provide the smoothest user
experience for running web-platform-tests on Windows.

The standard Windows shell requires that all `wpt` commands are prefixed
by the Python binary i.e. assuming `python` is on your path the server is
started using:

`python wpt serve`

[automation]: {{ site.baseurl }}{% link _running-tests/automation.md %}
