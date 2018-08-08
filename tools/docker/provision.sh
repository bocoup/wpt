# This script is embedded in the docker image, and so the image must be updated when changes
# to the script are made. To do this, assuming you have docker installed:
# In tools/docker/ :
#   docker build .
#   docker ps # and look for the id of the image you just built
#   docker tag <image> <tag>
#   docker push <tag>
# Update the `image` specified in the project's .taskcluster.yml file


#!/bin/bash
set -ex

BROWSER=${1:-all}
REMOTE=${2:-https://github.com/web-platform-tests/wpt}
REF=${3:-master}
REVISION=${4}

mkdir ~/web-platform-tests
cd ~/web-platform-tests

git init

# Initially we just fetch 50 commits in order to save several minutes of
# fetching
git fetch ${REMOTE} ${REF} --quiet --depth=50

if [ -n "${REVISION}" ]; then
    if [[ ! `git rev-parse --verify --quiet ${REVISION}^{object}` ]]; then
        # But if for some reason the commit under test isn't in that range, we
        # give in and fetch everything
        git fetch --quiet ${REMOTE}
        git rev-parse --verify ${REVISION}^{object}
    fi

    git checkout ${REVISION}
else
    git checkout FETCH_HEAD
fi

sudo sh -c './wpt make-hosts-file >> /etc/hosts'

if [[ $BROWSER == "chrome"* ]] || [[ "$BROWSER" == all ]]
then
    # Install Chrome dev
    deb_archive=google-chrome-unstable_current_amd64.deb
    wget https://dl.google.com/linux/direct/$deb_archive

    sudo apt-get -qqy update && sudo gdebi -n $deb_archive
fi

sudo Xvfb $DISPLAY -screen 0 ${SCREEN_WIDTH}x${SCREEN_HEIGHT}x${SCREEN_DEPTH} &
