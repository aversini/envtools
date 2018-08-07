#!/bin/sh

# Experimental: trying to figure out if running in Atom or not...
if [ "$ELECTRON_RUN_AS_NODE" != "" ] || [ "$TERM_PROGRAM" = "platformio-ide-terminal" ]; then
  ATOM_TERMINAL=1
fi

# If not Atom / VSCode, or already loaded and it's not a manual reload, get
# out of here quietly...
if [ "$INIT_PARAM" != "reload" ] && [ "$RUNTIME_DIR" != "" ]; then
  if [ "$ATOM_TERMINAL" = "" ] && [ "$VSCODE_CLI" = "" ]; then
    return
  fi
fi

# Let's do some profiling if needed
if [ "$ENVTOOLS_TIMING_STARTUP" = true ]; then
  ENVTOOLS_TIMING_START_TIME=$(/usr/bin/python -c "import time; print int(round(time.time() * 1000))")
elif [ "$ENVTOOLS_PROFILING_STARTUP" = true ]; then
  echo "Profiling Envtools startup scripts..."
  PS4='+ ~~~$(/usr/bin/python -c "import time; print int(round(time.time() * 1000))")~~~\t'
  exec 3>&2 2>$HOME/sample-profiling.log
  set -x
fi

if [[ "$SHELL" = *"bash"* ]]; then
  BASH_ENV=true
elif [[ "$SHELL" = *"zsh"* ]]; then
  ZSH_ENV=true
else
  echo "Unknown shell ($SHELL), no Envtools..."
  return
fi

# Setting some constants available at load time
# and within all scripts and functions sourced here.
ENVTOOLS_FULL=1
OS=$(uname)
if [ "$ENVTOOLS_ENVDIR" != "" ]; then
  ENVDIR=${ENVTOOLS_ENVDIR}
elif [ "$BASH_ENV" = "true" ]; then
  ENVDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
elif [ "$ZSH_ENV" = "true" ]; then
  ENVDIR="$( cd "$( dirname "${(%):-%x}" )" && pwd )"
fi

RUNTIME_DIR="${HOME}/.envtools"
RUNTIME_BIN_DIR="${HOME}/.envtools/bin"
CUSTOM_ENVDIR="${RUNTIME_DIR}/custom"
TOOLSDIR="${ENVDIR}/../dist"
OLD_PS1="${PS1}"
# The proxy value should be saved
# in the file "${RUNTIME_DIR}/proxy".
# Let's read it at load time and save it.
if [ -f "${RUNTIME_DIR}/proxy" ]; then
  PROXY=`cat "${RUNTIME_DIR}/proxy"`
else
  PROXY=""
fi

# Overriding sudo for non-root users to carry the environment
# over while sudoing.
if [ $UID != 0 ]; then
  MYSUDO="sudo -E"
else
   MYSUDO=""
fi

# Checking if we are in full mode or simple bash only (no node support)
# isValid function has not been loaded yet, so doing it manually...
if ! [[ -z "$ENVTOOLS_LITE" ]]; then
  unset ENVTOOLS_FULL
fi

# Load base functions no matter what
source "${ENVDIR}/functions/base.sh"

if isWindows || isLinux || isMac; then
  # Loading some functions
  if isInstalled "git"; then
    if isBash; then
      source "${ENVDIR}/third/git-prompt.sh"
      source "${ENVDIR}/third/git-completion.sh"
    fi
  fi
  if isBash; then
    source "${ENVDIR}/functions/prompt.sh"
  fi

  source "${ENVDIR}/functions/logs.sh"
  source "${ENVDIR}/functions/cmd.sh"
  source "${ENVDIR}/functions/killers.sh"
  source "${ENVDIR}/functions/proxy.sh"
  source "${ENVDIR}/functions/banner.sh"

  if isZsh; then
    source "${ENVDIR}/functions/zsh.sh"
  fi

  # Setting some aliases
  source "${ENVDIR}/aliases/base.sh"

  # Exporting some constants for future terminal use
  source "${ENVDIR}/exports/base.sh"

  # Set proxy quietly
  setProxyAtLoadTime

  if isValid "$ENVTOOLS_FULL"; then
    # Set the envtools custom prompt if the user asked for it,
    # but only for Bash
    if [ -f "${RUNTIME_DIR}/envtools-prompt" ]; then
      if isBash; then
        CUSTOM_PROMPT_TYPE=`cat "${RUNTIME_DIR}/envtools-prompt"`
        setEnvtoolsPromptConfiguration $CUSTOM_PROMPT_TYPE
        PROMPT_COMMAND=setEnvtoolsPrompt
      fi
    fi
  else
    if isBash; then
      setEnvtoolsPromptConfigurationDefault
      setEnvtoolsLitePrompt
    fi
  fi

  # Bid thee welcome
  displayWelcomeBanner

  # if resume auto file is found, restart envtools auto.
  if isValid "$ENVTOOLS_FULL"; then
    if [ -f "${RUNTIME_DIR}/resume_auto" ]; then
      envtools auto
    fi
  fi

  # Loading custom fuctions
  if [ -f "${RUNTIME_DIR}/custom/functions.sh" ]; then
    source "${RUNTIME_DIR}/custom/functions.sh"
  fi
  # Loading custom aliases
  if [ -f "${RUNTIME_DIR}/custom/aliases.sh" ]; then
    source "${RUNTIME_DIR}/custom/aliases.sh"
  fi
  # Loading custom exports
  if [ -f "${RUNTIME_DIR}/custom/exports.sh" ]; then
    source "${RUNTIME_DIR}/custom/exports.sh"
  fi

else
  echo "OS not supported/recognized... ($OS)"
fi

# End of profiling
if [[ "$ENVTOOLS_TIMING_STARTUP" = true ]]; then
  ENVTOOLS_TIMING_STOP_TIME=$(/usr/bin/python -c "import time; print int(round(time.time() * 1000))")
  ENVTOOLS_LOAD_TIME=$(($ENVTOOLS_TIMING_STOP_TIME - $ENVTOOLS_TIMING_START_TIME))
  echo "Load time: ${ENVTOOLS_LOAD_TIME}ms"
elif [[ "$ENVTOOLS_PROFILING_STARTUP" = true ]]; then
  set +x
  exec 2>&3 3>&-
fi
