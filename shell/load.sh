#!/bin/bash

# If already loaded and it's not a manual reload, get
# out of here quietly...
if [ "$INIT_PARAM" != "reload" -a "$RUNTIME_DIR" != "" ]; then
  return
else
  # Setting some constants available at load time
  # and within all scripts and functions sourced here.
  ENVTOOLS_FULL=1
  OS=$(uname)
  if [ "$ENVTOOLS_ENVDIR" != "" ]; then
    ENVDIR=${ENVTOOLS_ENVDIR}
  else
    ENVDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
  fi
  RUNTIME_DIR="${HOME}/.envtools"
  CUSTOM_ENVDIR="${RUNTIME_DIR}/custom"
  TOOLSDIR="${ENVDIR}/../lib"
  OLD_PS1="${PS1}"
  # The proxy value should be saved
  # in the file "${RUNTIME_DIR}/proxy".
  # Let's read it at load time and save it.
  if [ -f "${RUNTIME_DIR}/proxy" ]; then
    PROXY=`cat "${RUNTIME_DIR}/proxy"`
  else
    PROXY=""
  fi

  # Overriding sudo for non-root users to carry the environemnt
  # over while sudoing.
  if [ $UID != 0 ]; then
    MYSUDO="sudo -E"
  else
     MYSUDO=""
  fi

  # Checking if we are in full mode, or simple bash only (no node support)
  # isValid function has not been loaded yet, so doing it manually...
  if ! [[ -z "$ENVTOOLS_LITE" ]]; then
    unset ENVTOOLS_FULL
  fi

  if [ "${OS}" == "Darwin" -o "${OS}" == "Linux" -o "${OS}" == "MINGW32_NT-6.1" -o "${OS}" == "MINGW64_NT-10.0" ]; then
    # Loading some functions
    source "${ENVDIR}/third/git-prompt.sh"
    source "${ENVDIR}/functions/prompt.sh"
    source "${ENVDIR}/functions/base.sh"
    source "${ENVDIR}/functions/logs.sh"

    source "${ENVDIR}/functions/cmd.sh"
    source "${ENVDIR}/functions/killers.sh"
    source "${ENVDIR}/functions/proxy.sh"

    # Setting some aliases
    source "${ENVDIR}/aliases/base.sh"

    # Exporting some constants for future terminal use
    source "${ENVDIR}/exports/base.sh"

    # Set proxy quietly
    setProxyAtLoadTime

    if isValid "$ENVTOOLS_FULL"; then
      # Set the envtools custom prompt if the user asked for it
      if [ -f "${RUNTIME_DIR}/envtools-prompt" ]; then
        CUSTOM_PROMPT_TYPE=`cat "${RUNTIME_DIR}/envtools-prompt"`
        if [ "$CUSTOM_PROMPT_TYPE" == "3" ]; then
          setEnvtoolsPromptConfigurationSinopiaAndNode
        elif [ "$CUSTOM_PROMPT_TYPE" == "2" ]; then
          setEnvtoolsPromptConfigurationSinopia
        else
          setEnvtoolsPromptConfigurationDefault
        fi
        PROMPT_COMMAND=setEnvtoolsPrompt
      fi
    else
      setEnvtoolsPromptConfigurationDefault
      setEnvtoolsLitePrompt
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

    # in case of Mac and default terminal app, to allow opening a new tab
    # in the same current folder, we need to trick the PROMPT_COMMAND a
    # little bit
    if [ "${OS}" == "Darwin" -a "${PROMPT_COMMAND}" != "" ]; then
      if type update_terminal_cwd > /dev/null 2>&1 ; then
        if ! [[ $PROMPT_COMMAND =~ (^|;)update_terminal_cwd($|;) ]] ; then
          export PROMPT_COMMAND="$PROMPT_COMMAND;update_terminal_cwd"
        fi
      fi
    fi

  else
    echo "OS not supported/recognized... ($OS)"
  fi
fi
