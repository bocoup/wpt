try:
    from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
except ImportError:
    # Python 3 case
    from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import os
import re
import shutil
import subprocess
import tempfile
import threading

subject = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), '..', 'pr_preview.py'
)
test_host = 'localhost'


class MockHandler(BaseHTTPRequestHandler, object):
    def do_all(self):
        request_query = None
        request_body = None

        if 'Content-Length' in self.headers:
            request_body = self.rfile.read(
                int(self.headers['Content-Length'])
            ).decode('utf-8')

            if self.headers.get('Content-Type') == 'application/json':
                request_body = json.loads(request_body)

        path_parts = self.path.split('?')
        path = path_parts[0]
        if len(path_parts) > 1:
            request_query = path_parts[1]
        request = (self.command, path, request_query, request_body)

        self.server.requests.append(request)
        status_code, body = self.server.responses.get(request[:2], (400, '{}'))
        self.send_response(status_code)
        self.end_headers()
        self.wfile.write(json.dumps(body).encode('utf-8'))

    def do_DELETE(self):
        return self.do_all()

    def do_GET(self):
        return self.do_all()

    def do_PATCH(self):
        return self.do_all()

    def do_POST(self):
        return self.do_all()


class MockServer(HTTPServer, object):
    '''HTTP server that responds to all requests with status code 200 and body
    '{}' unless an alternative status code and body are specified for the given
    method and path in the `responses` parameter.'''
    def __init__(self, address, responses=None):
        super(MockServer, self).__init__(address, MockHandler)
        self.responses = responses or {}
        self.requests = []


def assert_success(returncode):
    assert returncode == 0


def assert_fail(returncode):
    assert returncode != 0


def synchronize(responses=None, refs={}):
    env = {
        'GITHUB_TOKEN': 'c0ffee'
    }
    env.update(os.environ)
    server = MockServer((test_host, 0), responses)
    test_port = server.server_address[1]
    threading.Thread(target=lambda: server.serve_forever()).start()
    local_repo = tempfile.mkdtemp()
    remote_repo = tempfile.mkdtemp()
    remote_refs = {}

    subprocess.check_call(['git', 'init'], cwd=local_repo)
    subprocess.check_call(['git', 'init'], cwd=remote_repo)
    subprocess.check_call(
        ['git', 'config', 'user.name', 'example'],
        cwd=remote_repo
    )
    subprocess.check_call(
        ['git', 'config', 'user.email', 'example@example.com'],
        cwd=remote_repo
    )
    subprocess.check_call(
        ['git', 'commit', '--allow-empty', '-m', 'first'],
        cwd=remote_repo
    )
    subprocess.check_call(
        ['git', 'commit', '--allow-empty', '-m', 'second'],
        cwd=remote_repo
    )
    subprocess.check_call(
        ['git', 'remote', 'add', 'origin', remote_repo], cwd=local_repo
    )

    for name, value in refs.items():
        subprocess.check_call(
            ['git', 'update-ref', name, value],
            cwd=remote_repo
        )

    try:
        child = subprocess.Popen(
            [
                'python',
                subject,
                '--host',
                'http://{}:{}'.format(test_host, test_port),
                '--github-project',
                'test-org/test-repo',
                'synchronize',
                '--window',
                '3000'
            ],
            cwd=local_repo,
            env=env
        )

        child.communicate()
        lines = subprocess.check_output(
            ['git', 'ls-remote', 'origin'], cwd=local_repo
        )
        for line in lines.strip().split('\n'):
            revision, ref = line.split()

            if not ref or ref in ('HEAD', 'refs/heads/master'):
                continue

            remote_refs[ref] = revision
    finally:
        shutil.rmtree(local_repo)
        shutil.rmtree(remote_repo)
        server.shutdown()

    return child.returncode, server.requests, remote_refs


class Endpoints(object):
    rate_limit = '/rate_limit'
    search = '/search/issues'
    git_refs = '/repos/test-org/test-repo/git/refs'
    git_ref = '/repos/test-org/test-repo/git/refs/%s'
    deployments = '/repos/test-org/test-repo/deployments'


def _find_match(requests, verb, endpoint, query, body):
    matches = []
    for request in requests:
        if request[0] != verb:
            continue
        if request[1] != endpoint:
            continue
        if query and not re.compile(query).search(request[2]):
            continue
        if body:
            all_keys_match = True

            for key in body:
                all_keys_match &= body[key] == request[3].get(key)

            if not all_keys_match:
                continue

        matches.append(request)

    return matches

def assert_match(requests, verb, endpoint, query=None, body=None):
    matches = _find_match(requests, verb, endpoint, query, body)

    if not matches:
        raise AssertionError(
            'No matching {} request to {} found'.format(verb, endpoint)
        )

def assert_no_match(requests, verb, endpoint, query=None, body=None):
    matches = _find_match(requests, verb, endpoint, query, body)

    if matches:
        raise AssertionError(
            'Expected to find zero matches, but a match was found'
        )


no_limit = {
    'resources': {
        'search': {
            'remaining': 100,
            'limit': 100
        },
        'core': {
            'remaining': 100,
            'limit': 100
        }
    }
}


def test_synchronize_zero_results():
    responses = {
        ('GET', Endpoints.rate_limit): (200, no_limit),
        ('GET', Endpoints.search): (
            200,
            {
                'items': [],
                'incomplete_results': False
            }
        )
    }

    returncode, requests, remote_refs = synchronize(responses)

    assert_success(returncode)
    assert_match(requests, 'GET', Endpoints.rate_limit)
    assert_match(requests, 'GET', Endpoints.search, query=r'repo:test-org/test-repo')

def test_synchronize_fail_search_throttled():
    responses = {
        ('GET', Endpoints.rate_limit): (
            200,
            {
                'resources': {
                    'search': {
                        'remaining': 1,
                        'limit': 10
                    }
                }
            }
        )
    }

    returncode, requests, remote_refs = synchronize(responses)

    assert_fail(returncode)
    assert_match(requests, 'GET', Endpoints.rate_limit)
    assert_no_match(requests, 'GET', Endpoints.search)

def test_synchronize_fail_incomplete_results():
    responses = {
        ('GET', Endpoints.rate_limit): (200, no_limit),
        ('GET', Endpoints.search): (
            200,
            {
                'items': [],
                'incomplete_results': True
            }
        )
    }

    returncode, requests, remove_refs = synchronize(responses)

    assert_fail(returncode)
    assert_match(requests, 'GET', Endpoints.rate_limit)
    assert_match(requests, 'GET', Endpoints.search)

def test_synchronize_ignore_closed():
    responses = {
        ('GET', Endpoints.rate_limit): (200, no_limit),
        ('GET', Endpoints.search): (
            200,
            {
                'items': [
                    {
                        'number': 23,
                        'labels': [],
                        'closed_at': '2019-10-28',
                        'user': {'login': 'grace'},
                        'author_association': 'COLLABORATOR'
                    }
                ],
                'incomplete_results': False
            }
        )
    }

    returncode, requests, remote_refs = synchronize(responses)

    assert_success(returncode)
    assert_match(requests, 'GET', Endpoints.rate_limit)
    assert_match(requests, 'GET', Endpoints.search)

def test_synchronize_sync_collaborator():
    responses = {
        ('GET', Endpoints.rate_limit): (200, no_limit),
        ('GET', Endpoints.search): (
            200,
            {
                'items': [
                    {
                        'number': 23,
                        'labels': [],
                        'closed_at': None,
                        'user': {'login': 'grace'},
                        'author_association': 'COLLABORATOR'
                    }
                ],
                'incomplete_results': False
            }
        ),
        ('POST', Endpoints.git_refs): (200, {}),
        ('GET', Endpoints.deployments): (200, {}),
        ('POST', Endpoints.deployments): (200, {})
    }

    returncode, requests, remote_refs = synchronize(responses)

    assert_success(returncode)
    assert_match(requests, 'GET', Endpoints.rate_limit)
    assert_match(requests, 'GET', Endpoints.search)
    assert_match(requests, 'POST', Endpoints.git_refs)
    assert_match(requests, 'GET', Endpoints.deployments)
    assert_match(requests, 'POST', Endpoints.deployments)

def test_synchronize_ignore_collaborator_bot():
    responses = {
        ('GET', Endpoints.rate_limit): (200, no_limit),
        ('GET', Endpoints.search): (
            200,
            {
                'items': [
                    {
                        'number': 23,
                        'labels': [],
                        'closed_at': None,
                        'user': {'login': 'chromium-wpt-export-bot'},
                        'author_association': 'COLLABORATOR'
                    }
                ],
                'incomplete_results': False
            }
        ),
        ('GET', Endpoints.deployments): (200, {})
    }

    returncode, requests, remote_refs = synchronize(responses)

    assert_success(returncode)
    assert_match(requests, 'GET', Endpoints.rate_limit)
    assert_match(requests, 'GET', Endpoints.search)
    assert_no_match(requests, 'POST', Endpoints.git_refs)
    assert_no_match(requests, 'POST', Endpoints.deployments)

def test_synchronize_ignore_untrusted_contributor():
    responses = {
        ('GET', Endpoints.rate_limit): (200, no_limit),
        ('GET', Endpoints.search): (
            200,
            {
                'items': [
                    {
                        'number': 23,
                        'labels': [],
                        'closed_at': None,
                        'user': {'login': 'grace'},
                        'author_association': 'CONTRIBUTOR'
                    }
                ],
                'incomplete_results': False
            }
        ),
        ('GET', Endpoints.deployments): (200, [])
    }

    returncode, requests, remote_refs = synchronize(responses)

    assert_success(returncode)
    assert_match(requests, 'GET', Endpoints.rate_limit)
    assert_match(requests, 'GET', Endpoints.search)
    assert_no_match(requests, 'POST', Endpoints.git_refs)
    assert_no_match(requests, 'POST', Endpoints.deployments)

def test_synchronize_sync_trusted_contributor():
    responses = {
        ('GET', Endpoints.rate_limit): (200, no_limit),
        ('GET', Endpoints.search): (
            200,
            {
                'items': [
                    {
                        'number': 23,
                        'labels': [{'name': 'safelisted-for-preview'}],
                        'closed_at': None,
                        'user': {'login': 'Hexcles'},
                        'author_association': 'CONTRIBUTOR'
                    }
                ],
                'incomplete_results': False
            }
        ),
        ('POST', Endpoints.git_refs): (200, {}),
        ('GET', Endpoints.deployments): (200, []),
        ('POST', Endpoints.deployments): (200, {})
    }

    returncode, requests, remote_refs = synchronize(responses)

    assert_success(returncode)
    assert_match(requests, 'GET', Endpoints.rate_limit)
    assert_match(requests, 'GET', Endpoints.search)
    assert_match(
        requests, 'POST', Endpoints.git_refs, body={'ref':'refs/prs-open/23'}
    )
    assert_match(
        requests, 'POST', Endpoints.git_refs, body={'ref':'refs/prs-trusted-for-preview/23'}
    )
    assert_match(requests, 'GET', Endpoints.deployments)
    assert_match(requests, 'POST', Endpoints.deployments)

def test_synchronize_update_collaborator():
    responses = {
        ('GET', Endpoints.rate_limit): (200, no_limit),
        ('GET', Endpoints.search): (
            200,
            {
                'items': [
                    {
                        'number': 23,
                        'labels': [],
                        'closed_at': None,
                        'user': {'login': 'grace'},
                        'author_association': 'COLLABORATOR'
                    }
                ],
                'incomplete_results': False
            }
        ),
        ('GET', Endpoints.deployments): (200, [{}]),
        ('PATCH', Endpoints.git_ref % 'prs-trusted-for-preview/23'): (200, {}),
        ('PATCH', Endpoints.git_ref % 'prs-open/23'): (200, {})
    }
    refs = {
        'refs/pull/23/head': 'HEAD',
        'refs/prs-open/23': 'HEAD~',
        'refs/prs-trusted-for-preview/23': 'HEAD~'
    }

    returncode, requests, remote_refs = synchronize(responses, refs)

    assert_success(returncode)
    assert_match(requests, 'PATCH', Endpoints.git_ref % 'prs-trusted-for-preview/23')
    assert_match(requests, 'PATCH', Endpoints.git_ref % 'prs-open/23')
