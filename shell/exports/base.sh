export RUNTIME_DIR
if isValid "$ENVTOOLS_FULL"; then
  export ENVTOOLS_VERSION="$(cat "${ENVDIR}"/../version)"
fi
export LANG=en_US.UTF-8
export EDITOR=vi
export PATH=$PATH:/usr/sbin

# Maven
if isValid "$ENVTOOLS_FULL"; then
  if [ -d "$RUNTIME_DIR/apache-maven-3.2.5" ]; then
    export M2_HOME="$RUNTIME_DIR/apache-maven-3.2.5"
    export M2=$M2_HOME/bin
    export PATH=$M2:$PATH
  fi
  if [ -d "$RUNTIME_DIR/apache-maven-3.3.9" ]; then
    export M2_HOME="$RUNTIME_DIR/apache-maven-3.3.9"
    export M2=$M2_HOME/bin
    export PATH=$M2:$PATH
  fi
fi

# extra tools provided by Envtools
export PATH=$PATH:$RUNTIME_BIN_DIR

if isMac; then
  source "${ENVDIR}/exports/mac.sh"
fi

# Improve history search with up and down keys.
# Try typing ls
# and then up and down arrows... joy!
# (not binding when not interactive shell (scp for ex))
if [[ $- == *i* ]]; then
  bind '"\e[A":history-search-backward'
  bind '"\e[B":history-search-forward'
fi

# Extend the max # of open files per terminal session
if isMac; then
  ulimit -n 7168 >/dev/null 2>&1
fi
if isWindows; then
  ulimit -n 3072 >/dev/null 2>&1
fi
