#!/usr/bin/env python3

import os

import jinja2
import yaml

HERE = os.path.abspath(os.path.dirname(__file__))
OUT_DIR = os.path.normpath(os.path.join(HERE, '..', 'generated'))
TEMPLATES_DIR = os.path.join(HERE, 'templates')
CASES = os.path.join(HERE, 'cases', 'master.yml')
PROJECT_ROOT = os.path.join(HERE, '..', '..', '..')

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

def cross(a, b):
    for a_object in a:
        for b_object in b:
            merged = {}
            merged.update(a_object)
            merged.update(b_object)

            if 'origins' not in merged:
                merged['origins'] = []

            yield merged

def make_provenance(project_root, cases, template):
    return '\n'.join([
        'This test was procedurally generated. Please do not modify it directly.',
        'Sources:',
        '- {}'.format(os.path.relpath(cases, project_root)),
        '- {}'.format(os.path.relpath(template, project_root))
    ])

def collection_filter(obj, title):
    if not obj:
        return 'no {}'.format(title)

    members = []
    for name, value in obj.items():
        members.append('{}={}'.format(name, value))

    return '{}: {}'.format(title, ', '.join(members))

def pad_filter(value, side, padding):
    if not value:
        return ''
    if side == 'start':
        return padding + value

    return value + padding

def main(project_root, templates_directory, cases_file, out_directory):
    environment = jinja2.Environment(
        variable_start_string='[%',
        variable_end_string='%]'
    )
    environment.filters['collection'] = collection_filter
    environment.filters['pad'] = pad_filter
    templates = {}
    subtests = {}
    for template_name, path in find_templates(templates_directory):
        subtests[template_name] = []
        with open(path, 'r') as handle:
            templates[template_name] = environment.from_string(handle.read())

    with open(cases_file, 'r') as handle:
        cases = yaml.safe_load(handle.read())

    for case in cases:
        unused_templates = set(templates) - set(case['each_subtest'])

        # This warning is intended to help authors avoid mistakenly omitting
        # templates. It can be silenced by extending the`each_subtest`
        # dictionary with an empty list for templates which are intentionally
        # unused.
        if unused_templates:
            print(
                'Warning: case does not reference the following templates:'
            )
            print('\n'.join('- {}'.format(name) for name in unused_templates))

        for template_name, concise_subtests in case['each_subtest'].items():
            subtests[template_name].extend(
                [subtest for subtest in cross(
                    case.get('all_subtests', [{}]), concise_subtests
                )]
            )

    for template_name, template in templates.items():
        provenance = make_provenance(
            project_root,
            cases_file,
            os.path.join(templates_directory, template_name)
        )
        out_file_name = os.path.join(
            out_directory,
            template_name
        )

        with open(out_file_name, 'w') as handle:
            handle.write(templates[template_name].render(
                subtests=subtests[template_name],
                provenance=provenance
            ))

if __name__ == '__main__':
    main(PROJECT_ROOT, TEMPLATES_DIR, CASES, OUT_DIR)
