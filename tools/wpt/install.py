import argparse
import browser
import sys

def get_parser():
    parser = argparse.ArgumentParser()
    parser.add_argument('browser', choices=['firefox', 'chrome'],
                        help='name of web browser product')
    parser.add_argument('component', choices=['browser', 'webdriver'],
                        help='name of component')
    parser.add_argument('-d', '--destination',
                        help='filesystem directory to place the component')
    parser.add_argument('-v', '--version',
                        help='desired software release; only supported for ' +
                             '`webdriver` component; if unspecified, the ' +
                             'latest version will be installed')
    return parser


def run(venv, **kwargs):
    browser = kwargs["browser"]
    component = kwargs["component"]
    destination = kwargs["destination"]
    version = kwargs["version"]

    if destination is None:
        if venv:
            if component == "browser":
                destination = venv.path
            else:
                destination = venv.bin_path
        else:
            raise argparse.ArgumentError(None,
                                         "No --destination argument, and no default for the environment")

    if version is not None and component != "webdriver":
        raise argparse.ArgumentError(None,
                                     "--version may only be used with webdriver component")

    install(browser, component, destination, version)


def install(name, component, destination, version):
    browser_instance = getattr(browser, name.title())()
    sys.stdout.write('Now installing %s %s...\n' % (name, component))

    if component == "webdriver":
        browser_instance.install_webdriver(dest=destination,
                                           version=version)
    else:
        browser_instance.install(dest=destination)
