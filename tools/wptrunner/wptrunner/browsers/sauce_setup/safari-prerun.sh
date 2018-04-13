#!/bin/bash

set -x

defaults write com.apple.Safari com.apple.Safari.ContentPageGroupIdentifier.WebKit2JavaScriptCanOpenWindowsAutomatically -bool true

# Download and install the Ahem font
# - https://wiki.saucelabs.com/display/DOCS/Downloading+Files+to+a+Sauce+Labs+Virtual+Machine+Prior+to+Testing
# - https://apple.stackexchange.com/questions/240381/installing-fonts-from-terminal-instead-of-font-book
#curl -o /Library/Fonts/Ahem.ttf 'https://raw.githubusercontent.com/w3c/web-platform-tests/master/fonts/Ahem.ttf'
curl -o Ahem.ttf 'https://raw.githubusercontent.com/w3c/web-platform-tests/master/fonts/Ahem.ttf'
echo Curl result: $?
ls -lah .

bash -c '
set -x

whoami
pwd
groups
ls /Users
which sudo
ls -lah ~
touch /Users/vagrant/tmp
ls -lah /Users/vagrant/tmp
ls -lah ~/Library/Fonts

echo "162.222.75.243 www.google.com" >> /etc/hosts
cat /etc/hosts

ls -lah .
mv Ahem.ttf /Library/Fonts/
mkdir -p ~/Library/Fonts
cp Ahem.ttf ~/Library/Fonts/
ls -lah /Users/Shared
mkdir -p /Users/Shared/Library/Fonts
cp Ahem.ttf /Users/Shared/Library/Fonts/
ls -lah /Users/Shared
' 2>&1
