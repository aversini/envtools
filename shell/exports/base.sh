export RUNTIME_DIR
export ENVDIR
if isValid "$ENVTOOLS_FULL"; then
  export ENVTOOLS_VERSION="$(cat "${ENVDIR}"/../version)"
else
  export ENVTOOLS_VERSION="$(cat "${ENVDIR}"/version)"
fi
export LANG=en_US.UTF-8
export EDITOR=vi
if [ "$INIT_PARAM" != "reload" ]; then
  export PATH=$PATH:/usr/sbin
fi

# Maven
if isValid "$ENVTOOLS_FULL"; then
  if [ -d "$RUNTIME_DIR/apache-maven-3.2.5" ]; then
    export M2_HOME="$RUNTIME_DIR/apache-maven-3.2.5"
    export M2=$M2_HOME/bin
    # only add $M2 to PATH if it's not there yet (reload?)
    if [[ $PATH != *"${M2}"* ]]; then
      export PATH=$M2:$PATH
    fi
  fi
  if [ -d "$RUNTIME_DIR/apache-maven-3.3.9" ]; then
    export M2_HOME="$RUNTIME_DIR/apache-maven-3.3.9"
    export M2=$M2_HOME/bin
    # only add $M2 to PATH if it's not there yet (reload?)
    if [[ $PATH != *"${M2}"* ]]; then
      export PATH=$M2:$PATH
    fi
  fi
fi

# extra tools provided by Envtools
if [ "$INIT_PARAM" != "reload" ]; then
  export PATH=$PATH:$RUNTIME_BIN_DIR:$HOME/npm/bin
fi

# if yarn is installed, add it to the PATH
if [ -d "$HOME/.yarn/bin" ]; then
  export PATH=$PATH:$HOME/.yarn/bin
fi

# Improve history search with up and down keys.
# Try typing ls
# and then up and down arrows... joy!
# (not binding when not interactive shell (scp for ex))
if [[ $- = *i* ]]; then
  if isBash; then
    bind '"\e[A":history-search-backward'
    bind '"\e[B":history-search-forward'
  elif isZsh; then
    autoload -U up-line-or-beginning-search
    autoload -U down-line-or-beginning-search
    zle -N up-line-or-beginning-search
    zle -N down-line-or-beginning-search
    zmodload zsh/terminfo
    bindkey "$terminfo[kcuu1]" up-line-or-beginning-search # Up
    bindkey "$terminfo[kcud1]" down-line-or-beginning-search # Down
  fi
fi

if isMac; then
  source "${ENVDIR}/exports/mac.sh"
fi

if isWindows; then
  source "${ENVDIR}/exports/windows.sh"
fi
