from ..webdriver_server import ChromeDriverServer
from .base import WdspecExecutor, WebDriverProtocol

from .executorcdp import CDPProtocol

class ChromeDriverProtocol(CDPProtocol):
    server_cls = ChromeDriverServer


class ChromeDriverWdspecExecutor(WdspecExecutor):
    protocol_cls = ChromeDriverProtocol
