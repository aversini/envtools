#
# Rough attempt at parsing the sample profiling log
# file generated if ENVTOOLS_PROFILING_STARTUP wants
# set to true...
#
function parseProfilingLogs {
  while read tim ;do
    crt=$(echo $tim | awk -F'~~~' '{print $2}')
    cmd=$(echo $tim | awk -F'~~~' '{print $3}')
    diff=$((${crt}-10#0$last))
    printf "%s %s\n" "$diff" "$cmd"
    last=${crt}
  done < $HOME/sample-profiling.log
}

#
# Test if argument is a positive number
#
function isNumber {
  local re='^[0-9]+([.][0-9]+)?$'
  if ! [[ $1 =~ $re ]] ; then
    return 1
  else
    return 0
  fi
}

#
# Test for OS types
#
function isWindows {
  local LOCAL_OS=$OS
  if [ "$LOCAL_OS" = "" ]; then
    LOCAL_OS=$(uname)
  fi
  [[ "$LOCAL_OS" = "MINGW32_NT-6.1" || "$LOCAL_OS" = "MINGW64_NT-6.1" || "$LOCAL_OS" = "MINGW64_NT-10.0" ]]
}
function isMac {
  local LOCAL_OS=$OS
  if [ "$LOCAL_OS" = "" ]; then
    LOCAL_OS=$(uname)
  fi
  [[ "$LOCAL_OS" = "Darwin" ]]
}
function isLinux {
  local LOCAL_OS=$OS
  if [ "$LOCAL_OS" = "" ]; then
    LOCAL_OS=$(uname)
  fi
  [[ "$LOCAL_OS" = "Linux" ]]
}

#
# Test for shell types
#
function isBash {
  [[ "$SHELL" = *"bash"* ]]
}
function isZsh {
  [[ "$SHELL" = *"zsh"* ]]
}

#
# returns 0 if the user confirmed yes, 1 otherwise
# $1 optional prompt, default to "Continue? "
# $2 optional default, "yes" or "no" - no default
#
function confirm () {
  local default=""
  local prompt="Continue?"

  if isValid "$1"; then
    prompt=$1
  fi

  case "$2" in
    [nN][oO]|[nN])
      default="no"
      prompt="$prompt [yes|No] "
      ;;
    [yY][eE][sS]|[yY])
      default="yes"
      prompt="$prompt [Yes|no] "
      ;;
    *)
      prompt="$prompt [yes|no] "
      ;;
  esac

  while true; do
    if isZsh; then
      read resp\?"$prompt"
    else
      txtBoldWhite "$prompt"
      read resp
    fi

    case "$resp" in
      [nN][oO]|[nN])
        return 1
        ;;
      [yY][eE][sS]|[yY])
        return 0
        ;;
      "")
        # it's empty, user just pressed enter
        if [ "$default" = "no" ]; then
          return 1
        elif [ "$default" = "yes" ]; then
          return 0
        else
          txtRed "Yes or no?" "nl"
        fi
        ;;
      *)
        txtRed "Yes or no?" "nl"
    esac
  done
}

#
# returns true if a variable is defined (set) and value's length > 0
# returns false otherwise
#
function isValid {
  ! [[ -z "$1" ]]
}

#
# returns true if the argument is an existing program
# returns false otherwise
#
function isInstalled {
  type "$1" >/dev/null 2>&1 || { return 1; }
}

#
# returns 0 if the global variable GLOBAL_CONTINUE is true or unset
# return 1 otherwise.
# If a parameter is passed, it is used instead of GLOBAL_CONTINUE
#
function shouldContinue {
  local flag=$GLOBAL_CONTINUE

  if isValid "$1"; then
    if [ $1 = 0 ]; then
      flag=true
    else
      flag=false
    fi
  fi

  if isValid $flag; then
    if $flag = true; then
      return 0
    else
      return 1
    fi
  else
    return 0
  fi
}

#
# returns 0 if the global variable GLOBAL_LOG_VERBOSE is true or unset
# return 1 otherwise
#
function shouldLog {
  if isValid $GLOBAL_LOG_VERBOSE; then
    if $GLOBAL_LOG_VERBOSE = true; then
      return 0
    else
      return 1
    fi
  else
    return 0
  fi
}

#
# does nothing except asking for admin password
# use this before calling a bunch of sudo commands
#
function forceAdminAccess {
  if [ $UID != 0 ]; then
    sudo echo -n >/dev/null 2>&1
  fi
}

#
# returns 0 if the global variable SETTINGS_TYPE is true or unset
# return 1 otherwise
#
function isOffice {
  if isValid $SETTINGS_TYPE; then
    if [ "$SETTINGS_TYPE" = "office" ]; then
      return 0
    else
      return 1
    fi
  else
    return 0
  fi
}

#
# returns 0 if the current path is a git repository
# return 1 otherwise
#
function isGit {
  if [ -n "$(git symbolic-ref HEAD 2> /dev/null)" ]; then
    return 0
  else
    return 1
  fi
}

#
# returns 0 if the current path is a dirty git repo
# return 1 otherwise
#
function isDirtyGit {
  if ! isGit; then
    return 1
  else
    local DIRTY="$(git describe --dirty)"
    if [[ $DIRTY = *"dirty"* ]]; then
      return 0
    else
      return 1
    fi
  fi
}

#
# returns 0 if the current path is a svn repository
# return 1 otherwise
#
function isSvn {
  if [ -n "$(svn status 2> /dev/null)" ]; then
    return 0
  else
    return 1
  fi
}

#
# Reload the environment (no matter which one is loaded)
#
function reloadEnvironment {
  export PS1="$OLD_PS1"
  export INIT_PARAM="reload"
  if isBash; then
    unsetDefaultPrompt
  fi
  if [ "$NVM_DIR" != "" ]; then
    if [ -f $NVM_DIR/nvm.sh ]; then
      source "$NVM_DIR/nvm.sh"
    fi
  fi
  source "$ENVDIR/load.sh"
  unset INIT_PARAM
}

#
# returns true if the session is ssh'd
# returns false otherwise
#
function isSSH {
  if [ "$SSH_TTY" ]; then
    return 0
  else
    return 1
  fi
}

#
# returns true if the user is root
# returns false otherwise
#
function isRoot {
  if [ $UID != 0 ]; then
    return 1
  else
    return 0
  fi
}

function isSinopiaRunning {
  local SINOPIA_PID

  if isMac; then
    SINOPIA_PID=`ps aux | grep sinopia | grep -v grep`
  fi
  if isValid "$SINOPIA_PID"; then
    return 0
  else
    return 1
  fi
}

#
# Write text to terminal tab.
# Only works on Mac, but because it's used
# everywhere, the test for mac is here and
# the function does nothing on other OS.
#
function setTerminalTitle {
  if isMac; then
    CURRENT_DIR=`basename "$PWD"`
    if [ $# -gt 0 ]
    then
      local title="$@"
    else
      local title="$CURRENT_DIR"
    fi
    echo -n "]1; "${title}""
  fi
}

#
# Call this function to display a welcome banner
#
function displayWelcomeBanner {
  if isValid "$ENVTOOLS_FULL"; then
    if [ "$ATOM_TERMINAL" = "" ]; then
      if [ "$INIT_PARAM" != "reload" ]; then
        # Display a simple help intro if user wants it
        showBanner
        # Update the terminal tab title if needed
        setTerminalTitle
      fi
    fi
  fi
}

#
# Function to either grep current running processes or
# current open network connections.
# Usage:
# psf node -> will show all running processes with
# "node" in the command (arguments count too)
# net 22 -> will show all open TCP connections with 22
# in the listing. Useful to see all ssh opened connections.
#
function net_psf {
  local COMMAND=""
  local DESC2="Use -i to ignore case."

  if [ "$1" = "psf" ]; then
    if isMac; then
      COMMAND="ps aux"
    fi
    if isLinux; then
      COMMAND="ps -edf"
    fi
    if isWindows; then
      COMMAND="ps -eafW"
    fi
    local USAGE="Usage: psf [-i] <string>"
    local DESC1="Lists all running processes that match the filter <string>."
  else
    local COMMAND="netstat -anp tcp"
    local USAGE="Usage: net [-i] <string>"
    local DESC1="Lists all TCP connections that match the filter <string>."
  fi

  if [ "$#" = "2" ]; then
    eval ${COMMAND} | grep --color=auto $2
  elif [ "$#" = "3" -a "$2" = "-i" ]
  then
    eval ${COMMAND} | grep --color=auto -i $3
  else
    echo $USAGE
    echo $DESC1
    echo $DESC2
  fi
}

#
# Simple diff between directories
#
function diffDirectories {
  echo "1: $1"
  echo "2: $2"
  diff -b -q -r "$1" "$2" | grep -v "\.svn" | grep -v "\.git"
}

#
# Loading specific Mac functions
#
if isMac; then
  source "${ENVDIR}/functions/mac.sh"
fi

#
# Loading specific Lite functions
#
if isValid "$ENVTOOLS_LITE"; then
  source "${ENVDIR}/functions/lite.sh"
fi
