#!/bin/bash

set -x

defaults write com.apple.Safari com.apple.Safari.ContentPageGroupIdentifier.WebKit2JavaScriptCanOpenWindowsAutomatically -bool true

# Download and install the Ahem font
# - https://wiki.saucelabs.com/display/DOCS/Downloading+Files+to+a+Sauce+Labs+Virtual+Machine+Prior+to+Testing
# - https://apple.stackexchange.com/questions/240381/installing-fonts-from-terminal-instead-of-font-book
#curl -o /Library/Fonts/Ahem.ttf 'https://raw.githubusercontent.com/w3c/web-platform-tests/master/fonts/Ahem.ttf'

bash -c '
set -x

curl -o Ahem.ttf "https://raw.githubusercontent.com/w3c/web-platform-tests/master/fonts/Ahem.ttf"

mkdir -p ~/Library/Fonts
mv Ahem.ttf ~/Library/Fonts/
ls -lah ~/Library/Fonts/
' 2>&1
