#!/bin/bash

./wpt manifest-download

browser_specific_args=''

if [ $1 == 'firefox' ]; then
  browser_specific_args='--install-browser --reftest-internal'
fi

./wpt run \
  $@ \
  $browser_specific_args \
  --log-tbpl=../artifacts/log_tbpl.log \
  --log-tbpl-level=info \
  --log-wptreport=../artifacts/wpt_report.json \
  --log-mach=- \
  -y \
  --no-pause \
  --no-restart-on-unexpected \
  --install-fonts \
  --no-fail-on-unexpected

gzip ../artifacts/wpt_report.json
