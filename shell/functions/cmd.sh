#
# This function executes a command provided as a parameter
# The function then displays if the command succeeded or not.
# If the command is printing anything, it will be hidden,
# unless the command fails.
#
function cmd {
  local COMMAND
  local COMMAND_TEXT="$1"
  local LOG_FILE="/tmp/cmd.log"

  txtDefault "Running: ${COMMAND_TEXT:0:59}..." "nl"

  if [ "$2" = "log" ]; then
    CMD_RESULT="Logs are available there: $LOG_FILE"
    COMMAND="$1 >$LOG_FILE 2>&1"
    eval ${COMMAND}
  else
    COMMAND="$1 2>&1"
    CMD_RESULT=$(eval ${COMMAND})
  fi
  ERROR="$?"

  if [ "$2" = "ignore" ]; then
    ERROR=0
  fi

  local MSG="Command: ${COMMAND_TEXT:0:59}..."

  if shouldLog; then
    # move cursor one line up to override the 'running'
    # message with success or failure
    tput cuu1
  fi

  if [ "$ERROR" = "0" ]; then
    if shouldLog; then
      txtStatus "$MSG" "SUCCESS"
      if [ "$GLOBAL_DEBUG" = true ]; then
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
