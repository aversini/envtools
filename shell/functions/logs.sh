# GLOBAL DEFINITIONS
GLOBAL_LOG_VERBOSE=true
GLOBAL_ERROR_MSG=""
GLOBAL_CONTINUE=true

# Color definitions to be used in anything else than
# prompt command
RAW_COLOR_RED="\e[0;31m"
RAW_COLOR_BLUE="\e[0;34m"
if isWindows; then
  RAW_COLOR_BLUE="\e[0;36m"
fi
RAW_COLOR_GREEN="\e[0;32m"
RAW_COLOR_YELLOW="\e[0;33m"
RAW_COLOR_MAGENTA="\e[0;35m"
RAW_COLOR_CYAN="\e[0;36m"
RAW_COLOR_GRAY="\e[0;90m"

RAW_COLOR_B_RED="\e[1;31m"
RAW_COLOR_B_BLUE="\e[1;34m"
RAW_COLOR_B_GREEN="\e[1;32m"
RAW_COLOR_B_YELLOW="\e[1;33m"
RAW_COLOR_B_MAGENTA="\e[1;35m"
RAW_COLOR_B_CYAN="\e[1;36m"
RAW_COLOR_B_GRAY="\e[1;90m"
RAW_COLOR_B_WHITE="\e[1;97m"

RAW_COLOR_DEFAULT="\e[00m"

# functions to change prompt text color
function txtRed {
  txtColor "$RAW_COLOR_RED" "$@"
}
function txtBlue {
  txtColor "$RAW_COLOR_BLUE" "$@"
}
function txtGreen {
  txtColor "$RAW_COLOR_GREEN" "$@"
}
function txtYellow {
  txtColor "$RAW_COLOR_YELLOW" "$@"
}
function txtMagenta {
  txtColor "$RAW_COLOR_MAGENTA" "$@"
}
function txtCyan {
  txtColor "$RAW_COLOR_CYAN" "$@"
}
function txtDefault {
  txtColor "$RAW_COLOR_DEFAULT" "$@"
}

function txtBoldRed {
  txtColor "$RAW_COLOR_B_RED" "$@"
}
function txtBoldBlue {
  txtColor "$RAW_COLOR_B_BLUE" "$@"
}
function txtBoldGreen {
  txtColor "$RAW_COLOR_B_GREEN" "$@"
}
function txtBoldYellow {
  txtColor "$RAW_COLOR_B_YELLOW" "$@"
}
function txtBoldMagenta {
  txtColor "$RAW_COLOR_B_MAGENTA" "$@"
}
function txtBoldCyan {
  txtColor "$RAW_COLOR_B_CYAN" "$@"
}
function txtBoldWhite {
  txtColor "$RAW_COLOR_B_WHITE" "$@"
}

function txtColor {
  if shouldLog; then
    printf "$1%s$RAW_COLOR_DEFAULT" "$2"
    if [ $# -eq 3 ] && [ "$3" = "nl" ]; then
      echo
    fi
  fi
}

#
# This function sets the globals $GLOBAL_COLOR_CMD and $GLOBAL_STATUS_TEXT based
# on the status passed as an argument.
# Status can be one of the following: EMERGENCY ALERT CRITICAL ERROR WARNING NOTICE
# INFO DEBUG OK FAILED FAILURE FAIL ABORT SUCCESS PASSED
#
extractStatusAndColor () {
  STATUS="$1"
  case $STATUS in
  FATAL )
          GLOBAL_STATUS_TEXT="  FATAL  "
          GLOBAL_COLOR_CMD="$CMD_RED"
          GLOBAL_COLOR_NAME="$RAW_COLOR_RED"
          ;;
  ALERT )
          GLOBAL_STATUS_TEXT="  ALERT  "
          GLOBAL_COLOR_CMD="$CMD_RED"
          GLOBAL_COLOR_NAME="$RAW_COLOR_RED"
          ;;
  ERROR | ABORT | EMERGENCY | CRITICAL | FAILURE | FAILED | FAIL )
          GLOBAL_STATUS_TEXT="  ERROR  "
          GLOBAL_COLOR_CMD="$CMD_RED"
          GLOBAL_COLOR_NAME="$RAW_COLOR_RED"
          ;;
  WARNING )
          GLOBAL_STATUS_TEXT=" WARNING "
          GLOBAL_COLOR_CMD="$CMD_YELLOW"
          GLOBAL_COLOR_NAME="$RAW_COLOR_YELLOW"
          ;;
  NOTICE )
          GLOBAL_STATUS_TEXT="  NOTICE "
          GLOBAL_COLOR_CMD="$CMD_YELLOW"
          GLOBAL_COLOR_NAME="$RAW_COLOR_YELLOW"
          ;;
  INFO )
          GLOBAL_STATUS_TEXT="  INFO   "
          GLOBAL_COLOR_CMD="$CMD_BLUE"
          GLOBAL_COLOR_NAME="$RAW_COLOR_BLUE"
          ;;
  DEBUG )
          GLOBAL_STATUS_TEXT="  DEBUG  "
          GLOBAL_COLOR_CMD="$CMD_DEFAULT"
          GLOBAL_COLOR_NAME="$RAW_COLOR_DEFAULT"
          ;;
  OK  )
          GLOBAL_STATUS_TEXT="   OK    "
          GLOBAL_COLOR_CMD="$CMD_GREEN"
          GLOBAL_COLOR_NAME="$RAW_COLOR_GREEN"
          ;;
  PASSED )
          GLOBAL_STATUS_TEXT="  PASSED "
          GLOBAL_COLOR_CMD="$CMD_GREEN"
          GLOBAL_COLOR_NAME="$RAW_COLOR_GREEN"
          ;;
  SUCCESS )
          GLOBAL_STATUS_TEXT=" SUCCESS "
          GLOBAL_COLOR_CMD="$CMD_GREEN"
          GLOBAL_COLOR_NAME="$RAW_COLOR_GREEN"
          ;;
  *)
          GLOBAL_STATUS_TEXT="UNDEFINED"
          GLOBAL_COLOR_CMD="$CMD_YELLOW"
          GLOBAL_COLOR_NAME="$RAW_COLOR_YELLOW"
  esac
}

if isBash; then
  source "${ENVDIR}/functions/logs_bash.sh"
elif isZsh; then
  source "${ENVDIR}/functions/logs_zsh.sh"
fi

function txtWarning {
  txtDefault "" "nl"
  txtStatus "$1" "WARNING"
  txtDefault "" "nl"
}
function txtError {
  txtDefault "" "nl"
  txtStatus "$1" "ERROR"
  txtDefault "" "nl"
}

function abortMessage {
  local MSG="An unexpected error occured... unable to go further!"

  if isValid $GLOBAL_ERROR_MSG; then
    MSG=$GLOBAL_ERROR_MSG
    GLOBAL_ERROR_MSG=""
  fi

  if isValid $1; then
    MSG=$1
  fi

  if shouldLog; then
    txtStatus "$MSG" "FATAL"
  fi
  GLOBAL_CONTINUE=false
}
