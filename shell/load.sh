#!/bin/bash


# Setting some constants available at load time
# and within all scripts and functions sourced here.
OS=$(uname)
ENVDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
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

if [ "${OS}" == "Darwin" -o "${OS}" == "Linux" -o "${OS}" == "MINGW32_NT-6.1" ]; then

  # Loading some functions
  source "${ENVDIR}/third/git-prompt.sh"
  source "${ENVDIR}/functions/base.sh"
  source "${ENVDIR}/functions/logs.sh"

  source "${ENVDIR}/functions/cmd.sh"
  source "${ENVDIR}/functions/killers.sh"
  source "${ENVDIR}/functions/proxy.sh"

  # Setting some aliases
  source "${ENVDIR}/aliases/base.sh"

  # Exporting some constants for future terminal use
  source "${ENVDIR}/exports/base.sh"

  # Improve history search with up and down keys.
  # Try typing ls
  # and then up and down arrows... joy!
  bind '"\e[A":history-search-backward'
  bind '"\e[B":history-search-forward'

  # Extend the max # of open files per terminal session
  if [ "${OS}" == "Darwin" ]; then
    ulimit -n 7168
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

  # Set proxy quietly
  setProxyAtLoadTime
  # Set the prompt
  setPrompt
  # And bid thee welcome
  displayWelcomeBanner

else
  echo "OS not supported/recognized... ($OS)"
fi


