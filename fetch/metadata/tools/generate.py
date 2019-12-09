#!/usr/bin/env python3

import os

from jinja2 import Template
import yaml

HERE = os.path.abspath(os.path.dirname(__file__))
OUT_DIR = os.path.normpath(os.path.join(HERE, '..', 'generated'))
TEMPLATES_DIR = os.path.join(HERE, 'templates')
CASES = os.path.join(HERE, 'cases', 'master.yml')

def find_templates(starting_directory):
    for directory, subdirectories, file_names in os.walk(starting_directory):
        for file_name in file_names:
            if file_name.startswith('.'):
                continue
            yield file_name, os.path.join(directory, file_name)

# template_name       | case_name  | test_name
# --------------------|------------|----------
# template.html       | case       | template-case.html
# template.html       | case.sub   | template-case.sub.html
# template.https.html | case       | template-case.https.html
# template.sub.html   | case.https | template-case.https.sub.html
def test_name(template_name, case_name):
    prefix, suffix = template_name.split('.', 1)
    return '{}-{}.{}'.format(prefix, case_name, suffix)

def main(templates_directory, cases_file, out_directory):
    for template_name, path in find_templates(templates_directory):
        with open(path, 'r') as handle:
            template = Template(handle.read(), variable_start_string='[%', variable_end_string='%]')

        with open(cases_file, 'r') as handle:
            cases = yaml.safe_load(handle.read())

            for case in cases:

                if template_name not in case['templates'] and case['templates'] != '*':
                    continue

                out_file_name = os.path.join(
                    out_directory, test_name(template_name, case['file_name_part'])
                )

                with open(out_file_name, 'w') as handle:
                    handle.write(template.render(**case))

if __name__ == '__main__':
    main(TEMPLATES_DIR, CASES, OUT_DIR)
