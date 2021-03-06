# Color definitions to be used in PROMPT_COMMAND
COLOR_RED="\[\e[0;31m\]"
COLOR_BLUE="\[\e[0;34m\]"
if isWindows; then
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
COLOR_B_WHITE="\[\e[1;97m\]"

COLOR_DEFAULT="\[\e[00m\]"


CMD_RED="tput setaf 1"
CMD_GREEN="tput setaf 2"
CMD_YELLOW="tput setaf 3"
CMD_BLUE="tput setaf 4"
CMD_MAGENTA="tput setaf 5"
CMD_CYAN="tput setaf 6"
CMD_LIGHT_BLUE="$CYAN"
CMD_BOLD="tput bold"
CMD_DEFAULT="tput sgr0"

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

# This is a function that just positions the cursor one row up
# and to the right.
# It then prints a message with specified color
# It is used for displaying colored status messages on the
# right side of the screen.
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
# This function echos a message and displays the status at
# the end of the line.
# It takes 2 arguments:
# ARG1: Message to display (less than 80 characters)
# ARG2: Status
#
# Status can be one of the following: EMERGENCY ALERT CRITICAL
# ERROR WARNING NOTICE INFO DEBUG OK FAILED FAILURE FAIL
# ABORT SUCCESS PASSED
#
function txtStatus {
  if shouldLog; then
    MESSAGE="$1"
    STATUS="$2"
    extractStatusAndColor "$STATUS"
    if isWindows; then
      txtColor "$GLOBAL_COLOR_NAME" "$MESSAGE  [$GLOBAL_STATUS_TEXT]" "nl"
    else
      $GLOBAL_COLOR_CMD
      echo "$MESSAGE"
      $CMD_DEFAULT
      raw_status "$GLOBAL_STATUS_TEXT" "$GLOBAL_COLOR_CMD"
    fi
  fi
}
