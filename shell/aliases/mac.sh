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
# Not so quick way to rebuild the icon association in Finder (need
# to restart the laptop to take it into account)
alias fixIcons=fixFinderIconsAssociations
alias fixIcon=fixIcons

# Open file or current path in finder
alias f=openInFinder

# Diff helper for Araxis/Kaleidoscope
alias ksdiff='$TOOLSDIR/diff.js -k'
alias axdiff='$TOOLSDIR/diff.js -a'

# Shortcut to some default path
alias desk='cd $HOME/Desktop; tit "~/Desktop"'
alias down='cd $HOME/Downloads; tit "~/Downloads"'
alias dow='down'

# testing perf of the hard drive
alias hdd='hddPerf'
alias ssd=hdd

# wrapper for sinopia
if isInstalled "sinopia"; then
  alias sinopia='envtools sinopia'
else
  alias sinopia='echo "sinopia is not installed. install it with npm."'
fi

# kill the dock quickly
alias kdock='confirm "Restart the Dock?" "y" && killall Dock && echo "done!" || echo "Bye then..."'
alias kdoc=kdock
