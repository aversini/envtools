function killNorton {
  killProcess "symdaemon" "$1"
}

function killOutlook {
  killProcess "outlook" "$1"
}

function killLync {
  killProcess "lync" "$1"
}

function killProcess {
  local loop=0
  if [ "$2" != "" ]; then
    txtStatus "Will loop 60 times every ${2}s..." "WARNING"
    while true; do
      ((loop+=1))
      if [ $loop -gt 60 ]; then
        return
      fi
      PROCESSID=`net_psf "psf" "-i" "$1" | awk '{print $2}'`
      if [ "$PROCESSID" != "" ]
      then
        forceAdminAccess
        txtBlue "Killing process..." "nl"
        cmd "$MYSUDO kill -9 $PROCESSID"
      else
        txtStatus "No process matches $1..." "INFO"
      fi
      sleep $2s
    done
  else
    PROCESSID=`net_psf "psf" "-i" "$1" | awk '{print $2}'`
    if [ "$PROCESSID" != "" ]
    then
      forceAdminAccess
      txtBlue "Killing process..." "nl"
      cmd "$MYSUDO kill -9 $PROCESSID"
    else
      txtStatus "No process matches $1..." "INFO"
    fi
  fi
}

function startNorton {
  forceAdminAccess
  txtBlue "Starting norton..." "nl"
  cmd "$MYSUDO /Library/Application Support/Symantec/Daemon/SymDaemon.bundle/Contents/MacOS/SymDaemon &"
}

function killJamf {
  JAMFID=`net_psf "psf" "-i" "jamf" | awk '{print $2}'`
  if [ "$JAMFID" != "" ]
  then
    forceAdminAccess
    txtBlue "Killing jamf..." "nl"
    cmd "$MYSUDO kill $JAMFID"
  else
    txtStatus "Jamf is not running..." "NOTICE"
  fi
}
