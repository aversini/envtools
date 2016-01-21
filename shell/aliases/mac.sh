# Sublime
if [ -f "/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl" ]; then
  alias mate="/Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl"
  alias maten='mate -n'
fi

# Chrome
alias openc='open -a "Google Chrome"'

# Simple http server
alias web='python -m SimpleHTTPServer 8080'
alias wup=web # overriding the original npm wup which is too slow

# Trying to reproduce the Linux top
alias top='top -s1 -o cpu -R -F'

# Quick way to rebuild the Launch Services database and get rid
# of duplicates in the Open With submenu.
alias fixopenwith=fixFinderOpenWith
alias fix=fixopenwith

# Open file or current path in finder
alias f=openInFinder

# Diff helper for Araxis/Kaleidoscope
alias ksdiff='$TOOLSDIR/diff.js -k'
alias axdiff='$TOOLSDIR/diff.js -a'
