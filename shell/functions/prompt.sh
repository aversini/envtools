function setPromptOFFSymbol {
  if isValid "$1"; then
    PROMPT_OFF_SYMBOL="$1"
  fi
}
function setPromptONSymbol {
  if isValid "$1"; then
    PROMPT_ON_SYMBOL="$1"
  fi
}
function setPromptProxy {
  local P_STATUS=""
  local P_BEFORE=""
  local P_AFTER=""
  local P_LABEL="proxy: "

  if isValid "$1"; then
    P_BEFORE="$1"
  fi
  if isValid "$2"; then
    P_AFTER="$2"
  fi
  if isValid "$3"; then
    P_LABEL="$3"
  fi

  if [ "$PROXY_STATUS" == "ON" ]; then
    P_STATUS="${P_LABEL}${PROMPT_ON_SYMBOL}"
  elif [ "$PROXY_STATUS" == "OFF" ]; then
    P_STATUS="${P_LABEL}${PROMPT_OFF_SYMBOL}"
  else
    P_STATUS="${P_LABEL}N/A"
  fi

  PROMPT_PROXY="$P_BEFORE$P_STATUS$P_AFTER"
}
function setPromptSinopia {
  local S_STATUS=""
  local S_BEFORE=""
  local S_AFTER=""
  local S_LABEL="sinopia: "
  local SINOPIA_RUN_SIGN=""

  if isSinopiaRunning; then
    SINOPIA_RUN_SIGN="(running)"
  else
    SINOPIA_RUN_SIGN="(stopped)"
  fi

  if isValid "$1"; then
    S_BEFORE="$1"
  fi
  if isValid "$2"; then
    S_AFTER="$2"
  fi
  if isValid "$3"; then
    S_LABEL="$3"
  fi

  if [ "$SINOPIA_STATUS" == "ON" ]; then
    S_STATUS="${S_LABEL}${PROMPT_ON_SYMBOL} ${SINOPIA_RUN_SIGN}"
  elif [ "$SINOPIA_STATUS" == "OFF" ]; then
    S_STATUS="${S_LABEL}${PROMPT_OFF_SYMBOL} ${SINOPIA_RUN_SIGN}"
  else
    S_STATUS="${S_LABEL}N/A"
  fi

  PROMPT_SINOPIA="$S_BEFORE$S_STATUS$S_AFTER"
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
  setPromptOFFSymbol "$COLOR_RED✘$COLOR_DEFAULT"
  setPromptONSymbol "$COLOR_GREEN✔︎$COLOR_DEFAULT"
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
