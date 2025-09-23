#!/usr/bin/env python3

import csv
import os
import sys
import yaml

def find():
    classified = set()

    for dirpath, dirnames, filenames in os.walk('.'):
        if 'WEB_FEATURES.yml' not in filenames:
            continue

        with open(os.path.join(dirpath, 'WEB_FEATURES.yml'), 'r') as handle:
            for entry in yaml.safe_load(handle)['features']:
                classified.add(entry['name'])

    return classified

def main(progress_filename):
    all_classified = find()
    classified = set()
    skipped = set()
    unclassified = set()

    with open(progress_filename, 'r') as progress_file:
        reader = csv.reader(progress_file)
        for row in reader:
            if row[2]:
                skipped.add(row[0])
            elif row[0] in all_classified:
                classified.add(row[0])
            else:
                unclassified.add(row[0])

    total = len(classified) + len(skipped) + len(unclassified)

    print(f'Classified: {len(classified)}')
    print(f'Skipped: {len(skipped)}')
    print(f'Unclassified: {len(unclassified)}')
    print(f'Total: {total}')

if __name__ == '__main__':
    main('./progress.csv')
