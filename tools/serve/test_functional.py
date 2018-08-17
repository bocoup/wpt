import json
import os
import Queue
import tempfile
import threading

import pytest

from . import serve


class StubServerProc(serve.ServerProc):
    instances = None

    def __init__(self, *args, **kwargs):
        super(StubServerProc, self).__init__(*args, **kwargs)

        if StubServerProc.instances is not None:
            StubServerProc.instances.put(self)

serve.ServerProc = StubServerProc

@pytest.fixture()
def server_subprocesses():
    StubServerProc.instances = Queue.Queue()
    yield StubServerProc.instances
    StubServerProc.instances = None

@pytest.fixture()
def tempfile_name():
    name = tempfile.mkstemp()[1]
    yield name
    os.remove(name)


def test_subprocess_exit(server_subprocesses, tempfile_name):
    timeout = 10

    def target():
        # By default, the server initially creates a child to validate local
        # system configuration. That process is unrelated to the behavior under
        # test, but at the time of this writing, it uses the same constructor
        # that is also used to create the long-running processes which are
        # relevant to this functionality. Disable the check so that the
        # constructor is only used to create relevant processes.
        with open(tempfile_name, 'w') as handle:
            json.dump({"check_subdomains": False}, handle)

        serve.run(config_path=tempfile_name)

    thread = threading.Thread(target=target)

    thread.start()

    server_subprocesses.get(True, timeout)
    subprocess = server_subprocesses.get(True, timeout)
    subprocess.kill()

    thread.join(timeout)

    assert not thread.is_alive()
