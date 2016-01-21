#
# This function executes a command provided as a parameter
# The function then displays if the command succeeded or not.
#
function cmd {
  COMMAND="$1"
  LOG_FILE="/tmp/cmd.log"

  txtDefault "Running: ${COMMAND:0:59}..." "nl"

  if [ "$2" == "log" ]; then
    CMD_RESULT="Logs are available there: $LOG_FILE"
    `$COMMAND >$LOG_FILE 2>&1`
  else
    CMD_RESULT=`$COMMAND 2>&1`
  fi
  ERROR="$?"

  if [ "$2" == "ignore" ]; then
    ERROR=0
  fi

  MSG="Command: ${COMMAND:0:59}..."

  if shouldLog; then
    tput cuu1
  fi

  if [ "$ERROR" == "0" ]; then
    if shouldLog; then
      txtStatus "$MSG" "SUCCESS"
      if [ "$GLOBAL_DEBUG" == true ]; then
        txtDefault "$CMD_RESULT" "nl"
      fi
    fi
    GLOBAL_CONTINUE=true
  else
    if shouldLog; then
      txtStatus "$MSG" "ERROR"
      txtDefault "$CMD_RESULT" "nl"
    fi
    GLOBAL_CONTINUE=false
  fi
}

function cmdl {
  cmd "$1" "log"
}

function cmdi {
  cmd "$1" "ignore"
}
