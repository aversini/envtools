#
# returns true if a variable is defined (set) and value's length > 0
# returns false otherwise
#
function isValid {
  ! [[ -z "$1" ]]
}

#
# returns 0 if the global variable GLOBAL_CONTINUE is true or unset
# return 1 otherwise.
# If a parameter is passed, it is used instead of GLOBAL_CONTINUE
#
function shouldContinue {
  local flag=$GLOBAL_CONTINUE

  if isValid "$1"; then
    if [ $1 == 0 ]; then
      flag=true
    else
      flag=false
    fi
  fi

  if isValid $flag; then
    if $flag == true; then
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
    if $GLOBAL_LOG_VERBOSE == true; then
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
    if [ "$SETTINGS_TYPE" == "office" ]; then
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
  export INIT_PARAM="reload"
  source $ENVDIR/load.sh
  unset INIT_PARAM
}

#
# Set the global variable STR_PS1
#
function setExtraPS1 {
  if isValid "$1"; then
    STR_PS1=" $1"
  else
    STR_PS1=""
  fi
}

#
# Unset the global variable STR_PS1
#
function unsetExtraPS1 {
  STR_PS1=""
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

#
# Write text to terminal tab.
# Only works on Mac, but because it's used
# everywhere, the test for mac is here and
# the function does nothing on other OS.
#
function setTerminalTitle {
  if [ "$OS" == "Darwin" ]; then
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
# Setting prompt
#
function setPrompt {
  # Set the command prompt
  local EXTRA_STR=""

  if [ "$DISTRO_NAME" != "" ]; then
    local EXTRA_STR="($DISTRO_NAME)"
  fi
  if [ "$BRANCH_NAME" != "" ]; then
    local EXTRA_STR="$BRANCH_NAME"
  fi

  setExtraPS1 $EXTRA_STR

  # Example with git branch if any (master)
  # [proxy ON] STR:pwd (git:master) $
  if [ "$USER" == "root" ]; then
    # No matter what, display the name of the machine too
    export PS1='\['$COLOR_RED'\][\u@\h]${STR_PS1} \['$COLOR_CYAN'\]\W\['$COLOR_GREEN'\]$(__git_ps1 " (git:%s)") \['$COLOR_CYAN'\]\$ \['$COLOR_DEFAULT'\]'
  else
    # If Mac go for blue, otherwise switch to yellow
    if [ "$OS" == "Darwin" ]; then
      PROMPT_COLOR=$COLOR_BLUE
    else
      PROMPT_COLOR=$COLOR_YELLOW
    fi
    # Check if we are in an ssh session, if yes, display the name of the machine too
    if isSSH ; then
      export PS1='\['$PROMPT_COLOR'\][SSH session - Proxy ${PROXY_STATUS}]${STR_PS1} \['$COLOR_CYAN'\]\W\['$COLOR_GREEN'\]$(__git_ps1 " (git:%s)") \['$COLOR_CYAN'\]\$ \['$COLOR_DEFAULT'\]'
    else
      export PS1='\['$PROMPT_COLOR'\][Proxy: ${PROXY_STATUS}${STR_PS1}] \['$COLOR_CYAN'\]\W\['$COLOR_GREEN'\]$(__git_ps1 " (git:%s)") \['$COLOR_CYAN'\]\$ \['$COLOR_DEFAULT'\]'
    fi
  fi
}

#
# Call this function to display a welcome banner
#
function displayWelcomeBanner {
  if [ "$OS" == "Darwin" -o "$OS" == "Linux" ]; then
    if [ "$INIT_PARAM" == "reload" ]; then
      # initSessionVersion
      # getSessionVersion
      txtStatus "Reloading environment..." "SUCCESS"
    else
      # Display a simple help intro
      txtBlue "Environment successfully loaded." "nl"
      if [ "$OS" == "Darwin" ]; then
        txtBlue "Type "; txtRed "h"; txtBlue " for available shortcuts." "nl"
      fi
      echo
    fi
    # and update the terminal tab title if needed
    if [ "$INIT_PARAM" != "reload" ]; then
      setTerminalTitle
    fi
  fi
}

#
# Function to either grep current running processes or
# current open network connections.
# Usage:
# psf node -> will show all running processes with
# "node" in the command (arguments count too)
# net TCP -> will show all open connections with TCP
# in the listing. Useful to see all TCP/IP opened lines.
#
function net_psf {
  if [ "$1" == "psf" ]; then
    local COMMAND="ps aux"
    local USAGE="Usage: psf [-i] <string>"
    local DESC1="Lists all running processes that match the filter <string>."
    local DESC2="Use -i to ignore case."
  else
    local COMMAND="lsof -i"
    local USAGE="Usage: net [-i] <string>"
    local DESC1="Lists all connections that match the filter <string>."
    local DESC2="Use -i to ignore case."
  fi

  if [ "$#" == "2" ]; then
    $COMMAND | grep $2 | grep -v grep
  elif [ "$#" == "3" -a "$2" == "-i" ]
  then
    $COMMAND | grep -i $3 | grep -v grep
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
if [ "${OS}" = "Darwin" ]; then
  source "${ENVDIR}/functions/mac.sh"
fi
