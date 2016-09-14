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
  local STATUS
  local STATUS_BEFORE
  local STATUS_AFTER
  local SINOPIA_RUN_SIGN=""
  local TYPE="$1"
  local STATUS_FILE

  if [ "$TYPE" == "proxy" ]; then
    STATUS_FILE=${RUNTIME_DIR}/proxy_status
  elif [ "$TYPE" == "sinopia" ]; then
    STATUS_FILE=${RUNTIME_DIR}/sinopia_status
  fi

  if [ "$OS" == "Darwin" -a "$TYPE" == "sinopia" ]; then
    if isSinopiaRunning; then
      SINOPIA_RUN_SIGN=" (running)"
    else
      SINOPIA_RUN_SIGN=" (stopped)"
    fi
  fi

  if [ -f $STATUS_FILE ]; then
    val=`cat ${STATUS_FILE}`
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
  printf -- "$STATUS_BEFORE$2$STATUS_AFTER$SINOPIA_RUN_SIGN" "$STATUS"
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
    STATUS=$(__print_status '$TYPE' '%s')
    echo "$BEFORE${LABEL}${STATUS}$AFTER"
  fi
}
function setPromptProxy {
  PROMPT_PROXY=`_setPrompt "proxy" "$@"`
}
function setPromptSinopia {
  PROMPT_SINOPIA=`_setPrompt "sinopia" "$@"`
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

  GIT_PS1_SHOWDIRTYSTATE=1

  if isValid "$1"; then
    G_COLOR="$1"
  fi
  PROMPT_GIT="$G_COLOR\$(__git_ps1 '(git:%s) ')$COLOR_DEFAULT"
}
function setPromptIndicator {
  local I_BEFORE=""
  local I_AFTER=""

  if isValid "$1"; then
    I_BEFORE="$1"
  fi
  if isValid "$2"; then
    I_AFTER="$2"
  fi
  PROMPT_INDICATOR="$I_BEFORE\$$I_AFTER"
}

function setEnvtoolsPromptConfigurationDefault {
  setPromptOFFSymbol "off"
  setPromptONSymbol "on"
  setPromptProxy "$COLOR_BLUE[" "]$COLOR_DEFAULT "
  setPromptLocation "$COLOR_CYAN" "$COLOR_DEFAULT "
  setPromptGitBranchStatusColor "$COLOR_GREEN"
  setPromptIndicator "$COLOR_CYAN" "$COLOR_DEFAULT "
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
  setPromptIndicator "$COLOR_CYAN" "$COLOR_DEFAULT "
}

function setEnvtoolsPrompt {
  export PS1="${PROMPT_PROXY}${PROMPT_SINOPIA}${PROMPT_LOCATION}${PROMPT_GIT}${PROMPT_INDICATOR}"
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
