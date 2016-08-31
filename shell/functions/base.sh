#
# returns true if the user confirmed yes
#
function confirm () {
  # call with a prompt string or use a default
  read -r -p "${1:-Continue? [Y/n]} " response
  case $response in
    [nN][oO]|[nN])
      false
      ;;
    [yY][eE][sS]|[yY]|"")
      true
      ;;
    *)
      echo "Please answer yes or no"
      return -1;;
  esac
}

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
# returns 0 if the current path is a dirty git repo
# return 1 otherwise
#
function isDirtyGit {
  if ! isGit; then
    return 1
  else
    local DIRTY="$(git describe --dirty)"
    if [[ $DIRTY == *"dirty"* ]]; then
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
  unsetExtraPS1
  export PS1="$OLD_PS1"
  export INIT_PARAM="reload"
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
# Set the global variable STR_PS1
#
function setExtraPS1 {
  if isValid "$1"; then
    STR_PS1="$1"
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
# Set the command prompt.
# Takes 3 parameters:
# arg1: what should appear before git branch status.
# arg2: what should appear after the git branch status.
# arg3: an optional printf string for the git branch format.
#
function setCommandPromptWithGit {
  if isValid "$1"; then
    PS1_BEFORE="$1"
  fi
  if isValid "$2"; then
    PS1_AFTER="$2"
  fi
  if isValid "$3"; then
    PS1_GITPRINTF="$3"
  else
    PS1_GITPRINTF=" \[$COLOR_GREEN\](git:%s)\[$COLOR_DEFAULT\]"
  fi

  PROMPT_COMMAND='__git_ps1 "$PS1_BEFORE" "$PS1_AFTER" "$PS1_GITPRINTF"'
  if [ $(uname) = "Darwin" ]; then
    if type update_terminal_cwd > /dev/null 2>&1 ; then
      if ! [[ $PROMPT_COMMAND =~ (^|;)update_terminal_cwd($|;) ]] ; then
        export PROMPT_COMMAND="$PROMPT_COMMAND;update_terminal_cwd"
      fi
    fi
  fi
}


#
# Setting Envtools custom prompt
#
function setEnvtoolsPrompt {
  # Only set a custom prompt if the user asked for it
  if [ -f "${RUNTIME_DIR}/envtools-prompt" ]; then
    # Example with git branch if any (master)
    # [proxy ON] short pwd (git:master) $
    if [ "$USER" == "root" ]; then
      # No matter what, display the name of the machine too
      unsetExtraPS1
      export PS1='\['$COLOR_RED'\][\u@\h]${STR_PS1} \['$COLOR_CYAN'\]\W\['$COLOR_GREEN'\]$(__git_ps1 " (git:%s)") \['$COLOR_CYAN'\]\$ \['$COLOR_DEFAULT'\]'
    else
      # Check if we are in an ssh session, if yes,
      # indicate it, and change the color to yellow.
      if isSSH ; then
        setExtraPS1 "\[$COLOR_YELLOW\][ssh - proxy: $(echo $PROXY_STATUS | tr '[:upper:]' '[:lower:]')] "
      else
        setExtraPS1 "[proxy: $(echo $PROXY_STATUS | tr '[:upper:]' '[:lower:]')] "
      fi
      local BEFORE="$COLOR_BLUE${STR_PS1}$COLOR_CYAN\W$COLOR_DEFAULT"
      local AFTER="$COLOR_CYAN \$$COLOR_DEFAULT "
      setCommandPromptWithGit "$BEFORE" "$AFTER"
    fi
  else
    unsetExtraPS1
    unset PROMPT_COMMAND
  fi
}

#
# Call this function to display a welcome banner
#
function displayWelcomeBanner {
  if [ "$INIT_PARAM" != "reload" ]; then
    # Display a simple help intro if user wants it
    envtools banner
    # Update the terminal tab title if needed
    setTerminalTitle
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
