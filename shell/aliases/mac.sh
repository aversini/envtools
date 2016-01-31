# Sublime
if [ -f "/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl" ]; then
  alias mate="/Applications/Sublime\ Text.app/Contents/SharedSupport/bin/subl"
  alias maten='mate -n'
fi

# Chrome
alias openc='open -a "Google Chrome"'

# Simple http server
alias web='envtools web'
alias wup=web # overriding the original npm wup which is too slow
alias http=web

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

# Open help file
alias h='open $ENVDIR/../envtools-help.html'

# Shortcut to some default path
alias desk='cd $HOME/Desktop; tit "~/Desktop"'
alias down='cd $HOME/Downloads; tit "~/Downloads"'
alias dow='down'
