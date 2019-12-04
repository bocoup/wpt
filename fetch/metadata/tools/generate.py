#!/usr/bin/env python3

import os
import yaml

HERE = os.path.abspath(os.path.dirname(__file__))
OUT_DIR = os.path.normpath(os.path.join(HERE, '..', 'generated'))
TEMPLATES_DIR = os.path.join(HERE, 'templates')
CASES_DIR = os.path.join(HERE, 'cases')

def find_templates(starting_directory):
    for directory, subdirectories, file_names in os.walk(starting_directory):
        for file_name in file_names:
            if file_name.startswith('.'):
                continue
            yield file_name, os.path.join(directory, file_name)

def expand(template, case):
    if 'subtests' not in case:
        return template % case
    return 'this will be difficult'

def main(templates_directory, cases_directory, out_directory):
    for name, path in find_templates(templates_directory):
        with open(path, 'r') as handle:
            template = handle.read()

        case_path = path.replace(templates_directory, cases_directory) + '.yml'

        with open(case_path, 'r') as handle:
            cases = yaml.safe_load(handle.read())

            for case_name in cases:
                out_file_name = os.path.join(
                    out_directory, '{}.{}'.format(case_name, name)
                )

                with open(out_file_name, 'w') as handle:
                    handle.write(expand(template, cases[case_name]))

if __name__ == '__main__':
    main(TEMPLATES_DIR, CASES_DIR, OUT_DIR)
