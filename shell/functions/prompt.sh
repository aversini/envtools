function unsetDefaultPrompt {
  unset PROMPT_OFF_SYMBOL
  unset PROMPT_OFF_SYMBOL_BEFORE
  unset PROMPT_OFF_SYMBOL_AFTER

  unset PROMPT_ON_SYMBOL
  unset PROMPT_ON_SYMBOL_BEFORE
  unset PROMPT_ON_SYMBOL_AFTER

  unset PROMPT_PROXY
  unset PROMPT_SINOPIA
  unset PROMPT_NODE

  unset PROMPT_LOCATION
  unset PROMPT_GIT
  unset PROMPT_INDICATOR

  unset PS1
  unset PROMPT_COMMAND
}

function setPromptOFFSymbol {
  if isValid "$1"; then
    PROMPT_OFF_SYMBOL="$1"
  fi
  if isValid "$2"; then
    PROMPT_OFF_SYMBOL_BEFORE="$2"
  else
    unset PROMPT_OFF_SYMBOL_BEFORE
  fi
  if isValid "$3"; then
    PROMPT_OFF_SYMBOL_AFTER="$3"
  else
    unset PROMPT_OFF_SYMBOL_AFTER
  fi
}
function setPromptONSymbol {
  if isValid "$1"; then
    PROMPT_ON_SYMBOL="$1"
  fi
  if isValid "$2"; then
    PROMPT_ON_SYMBOL_BEFORE="$2"
  else
    unset PROMPT_ON_SYMBOL_BEFORE
  fi
  if isValid "$3"; then
    PROMPT_ON_SYMBOL_AFTER="$3"
  else
    unset PROMPT_ON_SYMBOL_AFTER
  fi
}
__print_status () {
  local exit=$?
  local val="N/A"
  local currentVal
  local STATUS
  local STATUS_BEFORE
  local STATUS_AFTER
  local SINOPIA_RUN_SIGN=""
  local TYPE="$1"
  local STATUS_FILE
  local NODE_VERSION
  local NODE_LABEL=""
  local NVM_CURRENT

  if [ "$TYPE" == "proxy" -a "$PROXY" ]; then
    STATUS_FILE=${RUNTIME_DIR}/proxy_status
    currentVal=$PROXY_STATUS
    if [ -f $STATUS_FILE ]; then
      val=`cat ${STATUS_FILE}`
      # Need to check if val and currentVal are the same.
      # currentVal is the environment state but val is
      # the file state. We can be in a situation where the
      # status has been toggled in another tab: the file and
      # the environment are changed in tab1, but only the file
      # reflect that change in tab2. Tab2 still has the old
      # environment. In that case, we need to force a change.
      if [ "$val" == "ON" -o "$val" == "OFF" ]; then
        if [ "$val" != "$currentVal" ]; then
          setEnvProxy "$PROXY" "$val"
        fi
      fi
    fi
  elif [ "$TYPE" == "sinopia" ]; then
    STATUS_FILE=${RUNTIME_DIR}/sinopia_status
    if [ -f $STATUS_FILE ]; then
      val=`cat ${STATUS_FILE}`
    fi
  elif [ "$TYPE" == "node" ]; then
    if isInstalled "node"; then
      val="ON"
      NODE_VERSION=`node -v`
      NODE_LABEL=" ($NODE_VERSION, system)"
      if [ "$OS" == "Darwin" -a "$NVM_DIR" != "" ]; then
        if [ -d $NVM_DIR ]; then
          NVM_CURRENT=`nvm current`
          if [ "$NVM_CURRENT" == "system" ]; then
            NODE_LABEL=" ($NODE_VERSION, system via nvm)"
          else
            NODE_LABEL=" ($NODE_VERSION, nvm)"
          fi
        fi
      fi
    fi
  fi

  if [ "$OS" == "Darwin" -a "$TYPE" == "sinopia" ]; then
    if isSinopiaRunning; then
      SINOPIA_RUN_SIGN=" (running)"
    else
      SINOPIA_RUN_SIGN=" (stopped)"
    fi
  fi

  if [ "$val" == "ON" ]; then
    STATUS="${PROMPT_ON_SYMBOL}"
    STATUS_BEFORE="${PROMPT_ON_SYMBOL_BEFORE}"
    STATUS_AFTER="${PROMPT_ON_SYMBOL_AFTER}"
  elif [ "$val" == "OFF" ]; then
    STATUS="${PROMPT_OFF_SYMBOL}"
    STATUS_BEFORE="${PROMPT_OFF_SYMBOL_BEFORE}"
    STATUS_AFTER="${PROMPT_OFF_SYMBOL_AFTER}"
  else
    STATUS="N/A"
  fi

  printf -- "$STATUS_BEFORE$2$STATUS_AFTER$SINOPIA_RUN_SIGN$NODE_LABEL" "$STATUS"
  return $exit
}
function _setPrompt {
  local BEFORE=""
  local AFTER=""
  local LABEL=""
  local STATUS
  local TYPE

  if isValid "$1"; then
    TYPE="$1"
    LABEL="$1: "
  fi
  if isValid "$2"; then
    BEFORE="$2"
  fi
  if isValid "$3"; then
    AFTER="$3"
  fi
  if isValid "$4"; then
    LABEL="$4"
  fi

  if [ "$OS" == "Darwin" ]; then
    echo "$BEFORE${LABEL}\$(__print_status '$TYPE' '%s')$AFTER"
  else
    STATUS=$(__print_status "${TYPE}" '%s')
    echo "$BEFORE${LABEL}${STATUS}$AFTER"
  fi
}
function setPromptProxy {
  PROMPT_PROXY=`_setPrompt "proxy" "$@"`
}
function setPromptSinopia {
  PROMPT_SINOPIA=`_setPrompt "sinopia" "$@"`
}
function setPromptNode {
  PROMPT_NODE=`_setPrompt "node" "$@"`
}
function setPromptLocation {
  local L_BEFORE=""
  local L_AFTER=""
  local L_LOCALTION="\W"

  if isValid "$1"; then
    L_BEFORE="$1"
  fi
  if isValid "$2"; then
    L_AFTER="$2"
  fi
  if isValid "$3"; then
    L_LOCALTION="$3"
  fi

  PROMPT_LOCATION="$L_BEFORE$L_LOCALTION$L_AFTER"
}
function setPromptGitBranchStatusColor {
  local GIT_STATUS=""
  local G_COLOR=""

  # By setting GIT_PS1_SHOWDIRTYSTATE to a nonempty value,
  # unstaged (*) and staged (+) changes will be shown next to the branch name.
  GIT_PS1_SHOWDIRTYSTATE=1

  # If you would like to see the difference between HEAD and its upstream,
  # set GIT_PS1_SHOWUPSTREAM="auto".  A "<" indicates you are behind, ">"
  # indicates you are ahead, "<>" indicates you have diverged and "="
  # indicates that there is no difference. You can further control
  # behaviour by setting GIT_PS1_SHOWUPSTREAM to a space-separated list
  # of values:
  #
  #     verbose       show number of commits ahead/behind (+/-) upstream
  #     name          if verbose, then also show the upstream abbrev name
  #     legacy        don't use the '--count' option available in recent
  #                   versions of git-rev-list
  #     git           always compare HEAD to @{upstream}
  #     svn           always compare HEAD to your SVN upstream
  GIT_PS1_SHOWUPSTREAM="verbose git"

  # If you would like __git_ps1 to do nothing in the case when the current
  # directory is set up to be ignored by git, then set
  # GIT_PS1_HIDE_IF_PWD_IGNORED to a nonempty value.
  GIT_PS1_HIDE_IF_PWD_IGNORED=1

  if isValid "$1"; then
    G_COLOR="$1"
  fi
  PROMPT_GIT="$G_COLOR\$(__git_ps1 '(git:%s) ')$COLOR_DEFAULT"
}
function setPromptIndicator {
  local I_BEFORE=""
  local I_AFTER=""
  local I_LABEL="\$"

  if isValid "$1"; then
    I_BEFORE="$1"
  fi
  if isValid "$2"; then
    I_AFTER="$2"
  fi
  if isValid "$3"; then
    I_LABEL="$3"
  fi
  PROMPT_INDICATOR="$I_BEFORE$I_LABEL$I_AFTER"
}

function setEnvtoolsPromptConfigurationDefault {
  setPromptOFFSymbol "off"
  setPromptONSymbol "on"
  setPromptProxy "$COLOR_BLUE[" "]$COLOR_DEFAULT "
  setPromptLocation "$COLOR_CYAN" "$COLOR_DEFAULT "
  setPromptGitBranchStatusColor "$COLOR_GREEN"
  setPromptIndicator "$COLOR_CYAN" "$COLOR_DEFAULT " "\$"
}

function setEnvtoolsPromptConfigurationSinopia {
  if [ "${OS}" == "Darwin" ]; then
    setPromptOFFSymbol "✘" "$RAW_COLOR_RED" "$RAW_COLOR_BLUE"
    setPromptONSymbol "✔︎" "$RAW_COLOR_GREEN" "$RAW_COLOR_BLUE"
  else
    setPromptOFFSymbol "off"
    setPromptONSymbol "on"
  fi
  setPromptProxy "$COLOR_BLUE" "$COLOR_DEFAULT\n"    "proxy   : "
  setPromptSinopia "$COLOR_BLUE" "$COLOR_DEFAULT\n"  "sinopia : "
  setPromptLocation "$COLOR_CYAN" "$COLOR_DEFAULT " "\w"
  setPromptGitBranchStatusColor "$COLOR_GREEN"
  setPromptIndicator "$COLOR_CYAN" "$COLOR_DEFAULT " "\$"
}

function setEnvtoolsPromptConfigurationSinopiaAndNode {
  if [ "${OS}" == "Darwin" ]; then
    setPromptOFFSymbol "✘" "$RAW_COLOR_RED" "$RAW_COLOR_BLUE"
    setPromptONSymbol "✔︎" "$RAW_COLOR_GREEN" "$RAW_COLOR_BLUE"
  else
    setPromptOFFSymbol "off"
    setPromptONSymbol "on"
  fi
  setPromptProxy "$COLOR_BLUE" "$COLOR_DEFAULT\n"    "proxy   : "
  setPromptSinopia "$COLOR_BLUE" "$COLOR_DEFAULT\n"  "sinopia : "
  setPromptNode "$COLOR_BLUE" "$COLOR_DEFAULT\n"    "node    : "
  setPromptLocation "$COLOR_CYAN" "$COLOR_DEFAULT " "\w"
  setPromptGitBranchStatusColor "$COLOR_GREEN"
  setPromptIndicator "$COLOR_CYAN" "$COLOR_DEFAULT " "\$"
}


function setEnvtoolsPrompt {
  export PS1="${PROMPT_PROXY}${PROMPT_SINOPIA}${PROMPT_NODE}${PROMPT_LOCATION}${PROMPT_GIT}${PROMPT_INDICATOR}"
}


# Obsolete function, kept around for backward compatibility.
# Takes 3 parameters:
# arg1: what should appear before git branch status.
# arg2: what should appear after the git branch status.
function setCommandPromptWithGit {
  local GIT_STATUS="$COLOR_GREEN\$(__git_ps1 '(git:%s) ')$COLOR_DEFAULT"

  if isValid "$1"; then
    PS1_BEFORE="$1"
  fi
  if isValid "$2"; then
    PS1_AFTER="$2"
  fi

  unset PROMPT_COMMAND
  export PS1="$PS1_BEFORE$GIT_STATUS$PS1_AFTER"
}
