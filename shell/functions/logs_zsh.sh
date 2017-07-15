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
      local LOCAL_STATUS_TEXT="[$GLOBAL_STATUS_TEXT]"
      RIGHTWIDTH=$(($COLUMNS-${#MESSAGE}))
      print $GLOBAL_COLOR_NAME$MESSAGE${(l:$RIGHTWIDTH:: :)LOCAL_STATUS_TEXT}$RAW_COLOR_DEFAULT
    fi
  fi
}
