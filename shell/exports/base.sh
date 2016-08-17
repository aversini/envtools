export RUNTIME_DIR
export ENVTOOLS_VERSION="$(cat "${ENVDIR}"/../version)"
export LANG=C
export EDITOR=vi
export PATH=$PATH:/usr/sbin

# Maven
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

if [ "${OS}" = "Darwin" ]; then
  source "${ENVDIR}/exports/mac.sh"
fi
