import os
import socket
import ssl
import urllib2
cert_file_name = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    '..', '..', 'tools', 'certs', 'cacert.pem'
)

class Tests(object):
    @staticmethod
    def http(config):
        ports = config['ports']['http']

        if len(ports) < 1:
            return False

        for port in ports:
            base_url = 'http://%s:%s' % (config['domains'][''], port)

            try:
                urllib2.urlopen(base_url)
            except IOError as e:
                print e
                return False

        return True

    @staticmethod
    def https(config):
        ports = config['ports']['https']

        if len(ports) < 1:
            return False

        context = ssl.create_default_context()
        context.load_verify_locations(cafile = cert_file_name)

        for port in ports:
            base_url = 'https://%s:%s' % (config['domains'][''], port)

            try:
                urllib2.urlopen(base_url, context=context)
            except IOError as e:
                print e
                return False

        return True

    @staticmethod
    def ws(config):
        ports = config['ports']['ws']

        if len(ports) < 1:
            return False

        for port in ports:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            result = sock.connect_ex((config['domains'][''], port))
            if result != 0:
                return False

        return True

    @staticmethod
    def wss(config):
        ports = config['ports']['wss']

        if len(ports) < 1:
            return False

        for port in ports:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            result = sock.connect_ex((config['domains'][''], port))
            if result != 0:
                return False

        return True

def main(request, response):
    name = request.GET['name']

    result = getattr(Tests, name)(request.server.config)

    if result:
        return '''
            .tests li.test-{name} {{ background-color: #33ff33; }}
            .tests li.test-{name} span {{ display: none; }}
            '''.format(name=name)
    else:
        return '''
            .tests li.test-{name} {{ background-color: #ff0000; }}
            '''.format(name=name)
