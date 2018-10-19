import subprocess

from .base import (CallbackHandler,
                   RefTestExecutor,
                   RefTestImplementation,
                   TestharnessExecutor,
                   extra_timeout,
                   strip_server)
from .protocol import (BaseProtocolPart,
                       TestharnessProtocolPart,
                       Protocol,
                       SelectorProtocolPart,
                       ClickProtocolPart,
                       SendKeysProtocolPart,
                       ActionSequenceProtocolPart,
                       TestDriverProtocolPart)
from ..testrunner import Stop

class CDPProtocol(Protocol):
    def __init__(self, executor, browser, capabilities, *args, **kwargs):
        super(CDPProtocol, self).__init__(executor, browser)
        self.capabilities = capabilities
        self.browser_process = None
        with open('mike.txt', 'a+') as handle:
            handle.write('%s\n%s\n%s\n%s\n%s\n' % (
                executor, browser, capabilities, args, kwargs
            ))

    def connect(self):
        """Connect to browser via Chrome Debugger Protocol."""
        self.logger.debug("Connecting to WebDriver on URL: %s" % self.url)
        self.browser_process = subprocess.Popen(
            [
                self.binary_path,
                '--user-data-dir=%s' % profile_dir,
                '--remote-debugging-port=%s' % port,
                'about:blank'
            ],
            stderr=open(os.devnull, 'w')
        )
    def setup(self):
        self.logger.debug('well now')

    def teardown(self):
        self.browser_process.kill()

    def is_alive(self):
        '''Determine if the browser is running'''
        self.browser_process.poll()
        return self.browser_process.returncode == None


class CDPTestharnessExecutor(TestharnessExecutor):
    pass

class CDPRefTestExecutor(RefTestExecutor):
    def do_test(self, test):
        with open('mike.txt', 'a+') as handle:
            handle.write('do_test, at least\n')
