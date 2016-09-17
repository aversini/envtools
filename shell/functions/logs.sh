# GLOBAL DEFINITIONS
GLOBAL_LOG_VERBOSE=true
GLOBAL_ERROR_MSG=""
GLOBAL_CONTINUE=true

# Color definitions to be used in PROMPT_COMMAND
COLOR_RED="\[\e[0;31m\]"
COLOR_BLUE="\[\e[0;34m\]"
if [ "${OS}" == "MINGW32_NT-6.1" ]; then
  COLOR_BLUE="\[\e[0;36m\]"
fi
COLOR_GREEN="\[\e[0;32m\]"
COLOR_YELLOW="\[\e[0;33m\]"
COLOR_MAGENTA="\[\e[0;35m\]"
COLOR_CYAN="\[\e[0;36m\]"
COLOR_GRAY="\[\e[0;90m\]"

COLOR_B_RED="\[\e[1;31m\]"
COLOR_B_BLUE="\[\e[1;34m\]"
COLOR_B_GREEN="\[\e[1;32m\]"
COLOR_B_YELLOW="\[\e[1;33m\]"
COLOR_B_MAGENTA="\[\e[1;35m\]"
COLOR_B_CYAN="\[\e[1;36m\]"
COLOR_B_GRAY="\[\e[1;90m\]"

COLOR_DEFAULT="\[\e[00m\]"

# Color definitions to be used in anything else than
# prompt command
RAW_COLOR_RED="\e[0;31m"
RAW_COLOR_BLUE="\e[0;34m"
if [ "${OS}" == "MINGW32_NT-6.1" ]; then
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

RAW_COLOR_DEFAULT="\e[00m"


CMD_RED="tput setaf 1"
CMD_GREEN="tput setaf 2"
CMD_YELLOW="tput setaf 3"
CMD_BLUE="tput setaf 4"
CMD_MAGENTA="tput setaf 5"
CMD_CYAN="tput setaf 6"
CMD_LIGHT_BLUE="$CYAN"
CMD_BOLD="tput bold"
CMD_DEFAULT="tput sgr0"

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

function txtColor {
  if shouldLog; then
    printf "$1%s$RAW_COLOR_DEFAULT" "$2"
    if [ $# -eq 3 -a "$3" == "nl" ]; then
      echo
    fi
  fi
}

function showColors {
  local MSG="Lorem Ipsum Dolor Sit Amet"
  local array=( "RED" "BLUE" "GREEN" "YELLOW" "MAGENTA" "CYAN" "B_RED" "B_BLUE" "B_GREEN" "B_YELLOW" "B_MAGENTA" "B_CYAN")
  echo
  echo "Available colors codes for logs"
  for color in "${array[@]}"
  do
    local TMP="RAW_COLOR_$color"
    txtColor ${!TMP} "$MSG (color code: $color)" "nl"
  done
  echo
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

# This is a function that just positions the cursor one row up and to the right.
# It then prints a message with specified color
# It is used for displaying colored status messages on the right side of the screen.
#
# ARG1 = "status message (OK / FAIL)"
# ARG2 = The color in which the status is displayed.
#
function raw_status {
  local STATUS="$1"
  local COLOR="$2"
  local RES_COL=80

  function position_cursor () {
    TERM_COLS=`tput cols`
    if [ $TERM_COLS -lt 92 ]; then
      let RES_COL=`tput cols`-12
    fi
    tput cuf $RES_COL
    tput cuu1
  }

  position_cursor
  echo -n "["
  $CMD_DEFAULT
  $COLOR
  echo -n "$STATUS"
  $CMD_DEFAULT
  echo "]"
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
          GLOBAL_STATUS_TEXT=" NOTICE  "
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
          GLOBAL_STATUS_TEXT=" PASSED  "
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

#
# This function echos a message and displays the status at the end of the line.
# It takes 2 arguments:
# ARG1: Message to display (less than 80 characters)
# ARG2: Status
#
# Status can be one of the following: EMERGENCY ALERT CRITICAL ERROR WARNING NOTICE
# INFO DEBUG OK FAILED FAILURE FAIL ABORT SUCCESS PASSED
#
function txtStatus {
  if shouldLog; then
    MESSAGE="$1"
    STATUS="$2"
    extractStatusAndColor "$STATUS"
    if [ "$OS" == "MINGW32_NT-6.1" ]; then
      txtColor "$GLOBAL_COLOR_NAME" "$MESSAGE  [$GLOBAL_STATUS_TEXT]" "nl"
    else
      $GLOBAL_COLOR_CMD
      echo "$MESSAGE"
      $CMD_DEFAULT
      raw_status "$GLOBAL_STATUS_TEXT" "$GLOBAL_COLOR_CMD"
    fi
  fi
}

#
# This function displays the status at the end of the current line.
# It takes 1 arguments:
# ARG1: Status
#
# Status can be one of the following: EMERGENCY ALERT CRITICAL ERROR WARNING NOTICE
# INFO DEBUG OK FAILED FAILURE FAIL ABORT SUCCESS PASSED
#
function appendStatus {
  if shouldLog; then
    STATUS="$1"
    extractStatusAndColor "$STATUS"
    raw_status "$GLOBAL_STATUS_TEXT" "$GLOBAL_COLOR_CMD"
  fi
}

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
