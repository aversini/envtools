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

function hddPerf {
  echo
  echo "Testing Read/Write hard drive performance..."
  local PERF_FILE="envtools-tstperf"
  forceAdminAccess
  sudo purge
  local WRITE=$(dd if=/dev/zero bs=1024k of=${PERF_FILE} count=1024 2>&1 | grep sec | awk '{print $1 / 1024 / 1024 / $5, "MB/sec" }')
  sudo purge
  local READ=$(dd if=${PERF_FILE} bs=1024k of=/dev/null count=10242 2>&1 | grep sec | awk '{print $1 / 1024 / 1024 / $5, "MB/sec" }')
  rm -rf $PERF_FILE
  echo
  echo "Write : $WRITE"
  echo "Read  : $READ"
  echo
}
