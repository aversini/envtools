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
  source $ENVDIR/load.sh
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

  export PROMPT_COMMAND='__git_ps1 "$PS1_BEFORE" "$PS1_AFTER" "$PS1_GITPRINTF"'
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
      local BEFORE="\[$COLOR_BLUE\]${STR_PS1}\[$COLOR_CYAN\]\W\[$COLOR_DEFAULT\]"
      local AFTER="\[$COLOR_CYAN\] \$ \[$COLOR_DEFAULT\]"
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
  if [ "$OS" == "Darwin" -o "$OS" == "Linux" ]; then
    if [ "$INIT_PARAM" == "reload" ]; then
      # initSessionVersion
      # getSessionVersion
      txtStatus "Reloading environment..." "SUCCESS"
    else
      # Display a simple help intro if user wants it
      envtools banner
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
# Get artifacts from Nexus
#
function getArtifacts {
  local SUCCESS=false
  local USAGE="Usage: getArtifacts <version>"
  local EXAMPLE="Example: getArtifacts 2.10.0rc1"
  echo
  if [ $# -eq 1 ]; then
    if [ -x /usr/local/bin/wget ]; then
      local VERSION=$1
      clear
      echo "About to download artifacts for  v$1"
      echo "Make sure you are connected to the intranet..."
      while true; do
        read -p "Continue? [y|n] " yn
        case $yn in
          [Yy]* )
            local ARTIFACTS_FOLDER="artifacts-$1"
            local NEXUS_URL="http://wnl-svr167.wellsfargo.com:8881"
            local WRIA2_PATH="nexus/service/local/repositories/releases/content/com/wellsfargo/wria2"
            mkdir $ARTIFACTS_FOLDER
            cd $ARTIFACTS_FOLDER
            wget --no-proxy --show-progress --quiet $NEXUS_URL/$WRIA2_PATH/wria2/$1/wria2-$1.pom
            wget --no-proxy --show-progress --quiet $NEXUS_URL/$WRIA2_PATH/wria2-components-gen/$1/wria2-components-gen-$1.jar
            wget --no-proxy --show-progress --quiet $NEXUS_URL/$WRIA2_PATH/wria2-components-gen/$1/wria2-components-gen-$1-sources.jar
            wget --no-proxy --show-progress --quiet $NEXUS_URL/$WRIA2_PATH/wria2-components-gen/$1/wria2-components-gen-$1.pom
            wget --no-proxy --show-progress --quiet $NEXUS_URL/$WRIA2_PATH/wria2-tldgenerator/$1/wria2-tldgenerator-$1.jar
            wget --no-proxy --show-progress --quiet $NEXUS_URL/$WRIA2_PATH/wria2-tldgenerator/$1/wria2-tldgenerator-$1-test-sources.jar
            wget --no-proxy --show-progress --quiet $NEXUS_URL/$WRIA2_PATH/wria2-tldgenerator/$1/wria2-tldgenerator-$1-sources.jar
            wget --no-proxy --show-progress --quiet $NEXUS_URL/$WRIA2_PATH/wria2-tldgenerator/$1/wria2-tldgenerator-$1.pom
            wget --no-proxy --show-progress --quiet $NEXUS_URL/$WRIA2_PATH/wria2-taglibrary/$1/wria2-taglibrary-$1.jar
            wget --no-proxy --show-progress --quiet $NEXUS_URL/$WRIA2_PATH/wria2-taglibrary/$1/wria2-taglibrary-$1-with-dependencies.jar
            wget --no-proxy --show-progress --quiet $NEXUS_URL/$WRIA2_PATH/wria2-taglibrary/$1/wria2-taglibrary-$1-test-sources.jar
            wget --no-proxy --show-progress --quiet $NEXUS_URL/$WRIA2_PATH/wria2-taglibrary/$1/wria2-taglibrary-$1-sources.jar
            wget --no-proxy --show-progress --quiet $NEXUS_URL/$WRIA2_PATH/wria2-taglibrary/$1/wria2-taglibrary-$1.pom
            wget --no-proxy --show-progress --quiet $NEXUS_URL/$WRIA2_PATH/wria2-taglibrary-all/$1/wria2-taglibrary-all-$1.jar
            wget --no-proxy --show-progress --quiet $NEXUS_URL/$WRIA2_PATH/wria2-taglibrary-all/$1/wria2-taglibrary-all-$1-with-dependencies.jar
            wget --no-proxy --show-progress --quiet $NEXUS_URL/$WRIA2_PATH/wria2-taglibrary-all/$1/wria2-taglibrary-all-$1.pom
            return;;
          [Nn]* ) echo "Bye!"; return;;
          * ) echo "Please answer yes or no.";;
        esac
      done
    else
      txtRed "Please install wget (brew install wget)" "nl"
    fi
  else
    txtRed "$USAGE" "nl"
    txtRed "$EXAMPLE" "nl"
  fi
  echo
}



#
# Loading specific Mac functions
#
if [ "${OS}" = "Darwin" ]; then
  source "${ENVDIR}/functions/mac.sh"
fi
