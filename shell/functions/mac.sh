function fixFinderOpenWith {
  cmd "/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -kill -r -domain local -domain system -domain user"
  cmd "killall Finder"
  echo
  txtYellow "Finder menu 'Open With' should be clean!" "nl"
  txtYellow "You may need to restart TotalFinder manually..." "nl"
}

function openInFinder {
  if isValid $1; then
    open -a Finder "$1"
  else
    open -a Finder
  fi
}
