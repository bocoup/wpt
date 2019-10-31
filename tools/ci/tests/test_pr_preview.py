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
        path = self.path.split('?')[0]
        request_body = None

        if 'Content-Length' in self.headers:
            request_body = self.rfile.read(
                int(self.headers['Content-Length'])
            ).decode('utf-8')

            if self.headers.get('Content-Type') == 'application/json':
                request_body = json.loads(request_body)

        for request, response in self.server.expected_traffic:
            if request[0] != self.command:
                continue
            if request[1] != path:
                continue
            body_matches = True
            for key in request[2]:
                body_matches &= request[2][key] == request_body.get(key)
            if not body_matches:
                continue
            break
        else:
            request = (self.command, path, request_body)
            response = (400, {})

        self.server.actual_traffic.append((request, response))
        self.send_response(response[0])
        self.end_headers()
        self.wfile.write(json.dumps(response[1]).encode('utf-8'))

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
    def __init__(self, address, expected_traffic):
        super(MockServer, self).__init__(address, MockHandler)
        self.expected_traffic = expected_traffic
        self.actual_traffic = []


def assert_success(returncode):
    assert returncode == 0


def assert_fail(returncode):
    assert returncode != 0


class Requests(object):
    get_rate = ('GET', '/rate_limit', {})
    search = ('GET', '/search/issues', {})
    ref_create_open = (
        'POST', '/repos/test-org/test-repo/git/refs', {'ref':'refs/prs-open/23'}
    )
    ref_create_trusted = (
        'POST',
        '/repos/test-org/test-repo/git/refs',
        {'ref':'refs/prs-trusted-for-preview/23'}
    )
    ref_update_open = (
        'PATCH', '/repos/test-org/test-repo/git/refs/prs-open/23', {}
    )
    ref_update_trusted = (
        'PATCH', '/repos/test-org/test-repo/git/refs/prs-trusted-for-preview/23', {}
    )
    deployment_get = ('GET', '/repos/test-org/test-repo/deployments', {})
    deployment_create = ('POST', '/repos/test-org/test-repo/deployments', {})


class Responses(object):
    no_limit = (200, {
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
    })


def synchronize(expected_traffic, refs={}):
    env = {
        'GITHUB_TOKEN': 'c0ffee'
    }
    env.update(os.environ)
    server = MockServer((test_host, 0), expected_traffic)
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

    return child.returncode, server.actual_traffic, remote_refs



def test_synchronize_zero_results():
    expected_traffic = [
        (Requests.get_rate, Responses.no_limit),
        (Requests.search, (
            200,
            {
                'items': [],
                'incomplete_results': False
            }
        ))
    ]

    returncode, actual_traffic, remote_refs = synchronize(expected_traffic)

    assert_success(returncode)
    assert sorted(expected_traffic) == sorted(actual_traffic)

def test_synchronize_fail_search_throttled():
    expected_traffic = [
        (Requests.get_rate, (
            200,
            {
                'resources': {
                    'search': {
                        'remaining': 1,
                        'limit': 10
                    }
                }
            }
        ))
    ]

    returncode, actual_traffic, remote_refs = synchronize(expected_traffic)

    assert_fail(returncode)
    assert sorted(expected_traffic) == sorted(actual_traffic)

def test_synchronize_fail_incomplete_results():
    expected_traffic = [
        (Requests.get_rate, Responses.no_limit),
        (Requests.search, (
            200,
            {
                'items': [],
                'incomplete_results': True
            }
        ))
    ]

    returncode, actual_traffic, remove_refs = synchronize(expected_traffic)

    assert_fail(returncode)
    assert sorted(expected_traffic) == sorted(actual_traffic)

def test_synchronize_ignore_closed():
    expected_traffic = [
        (Requests.get_rate, Responses.no_limit),
        (Requests.search, (
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
        ))
    ]

    returncode, actual_traffic, remote_refs = synchronize(expected_traffic)

    assert_success(returncode)
    assert sorted(expected_traffic) == sorted(actual_traffic)

def test_synchronize_sync_collaborator():
    expected_traffic = [
        (Requests.get_rate, Responses.no_limit),
        (Requests.get_rate, Responses.no_limit),
        (Requests.get_rate, Responses.no_limit),
        (Requests.get_rate, Responses.no_limit),
        (Requests.get_rate, Responses.no_limit),
        (Requests.search, (
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
        )),
        (Requests.ref_create_open, (200, {})),
        (Requests.ref_create_trusted, (200, {})),
        (Requests.deployment_get, (200, {})),
        (Requests.deployment_create, (200, {}))
    ]

    returncode, actual_traffic, remote_refs = synchronize(expected_traffic)

    assert_success(returncode)
    assert sorted(expected_traffic) == sorted(actual_traffic)

def test_synchronize_ignore_collaborator_bot():
    expected_traffic = [
        (Requests.get_rate, Responses.no_limit),
        (Requests.search, (
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
        ))
    ]

    returncode, actual_traffic, remote_refs = synchronize(expected_traffic)

    assert_success(returncode)
    assert sorted(expected_traffic) == sorted(actual_traffic)

def test_synchronize_ignore_untrusted_contributor():
    expected_traffic = [
        (Requests.get_rate, Responses.no_limit),
        (Requests.search, (
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
        ))
    ]

    returncode, actual_traffic, remote_refs = synchronize(expected_traffic)

    assert_success(returncode)
    assert sorted(expected_traffic) == sorted(actual_traffic)

def test_synchronize_sync_trusted_contributor():
    expected_traffic = [
        (Requests.get_rate, Responses.no_limit),
        (Requests.get_rate, Responses.no_limit),
        (Requests.get_rate, Responses.no_limit),
        (Requests.get_rate, Responses.no_limit),
        (Requests.get_rate, Responses.no_limit),
        (Requests.search, (
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
        )),
        (Requests.ref_create_open, (200, {})),
        (Requests.ref_create_trusted, (200, {})),
        (Requests.deployment_get, (200, [])),
        (Requests.deployment_create, (200, {}))
    ]

    returncode, actual_traffic, remote_refs = synchronize(expected_traffic)

    assert_success(returncode)
    assert sorted(expected_traffic) == sorted(actual_traffic)

def test_synchronize_update_collaborator():
    expected_traffic = [
        (Requests.get_rate, Responses.no_limit),
        (Requests.get_rate, Responses.no_limit),
        (Requests.get_rate, Responses.no_limit),
        (Requests.get_rate, Responses.no_limit),
        (Requests.get_rate, Responses.no_limit),
        (Requests.search, (200,
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
        )),
        (Requests.deployment_get, (200, [])),
        (Requests.ref_update_open, (200, {})),
        (Requests.ref_update_trusted, (200, {})),
        (Requests.deployment_create, (200, {}))
    ]
    refs = {
        'refs/pull/23/head': 'HEAD',
        'refs/prs-open/23': 'HEAD~',
        'refs/prs-trusted-for-preview/23': 'HEAD~'
    }

    returncode, actual_traffic, remote_refs = synchronize(expected_traffic, refs)

    assert_success(returncode)
    assert sorted(expected_traffic) == sorted(actual_traffic)

def test_synchronize_delete_collaborator():
    expected_traffic = [
        (Requests.get_rate, Responses.no_limit),
        (Requests.search, (200,
            {
                'items': [
                    {
                        'number': 23,
                        'labels': [],
                        'closed_at': '2019-10-30',
                        'user': {'login': 'grace'},
                        'author_association': 'COLLABORATOR'
                    }
                ],
                'incomplete_results': False
            }
        ))
    ]
    refs = {
        'refs/pull/23/head': 'HEAD',
        'refs/prs-open/23': 'HEAD~',
        'refs/prs-trusted-for-preview/23': 'HEAD~'
    }

    returncode, actual_traffic, remote_refs = synchronize(expected_traffic, refs)

    assert_success(returncode)
    assert sorted(expected_traffic) == sorted(actual_traffic)
    assert remote_refs.keys() == ['refs/pull/23/head']
