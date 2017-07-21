# Extend the max # of open files per terminal session
ulimit -n 3072 >/dev/null 2>&1

# Update terminal color scheme for better contrast
eval `dircolors ${ENVDIR}/third/win32-dircolors`

# Try to set JAVA_HOME if not set
if [[ ! -n "$JAVA_HOME" ]]; then
  # JAVA_HOME is no set
  type -p java >/dev/null 2>&1
  if [ "$?" = "0" ]; then
    # But java is in the path! Let's extract the version
    JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')
    if [ -d "/c/Program Files/Java/jre$JAVA_VERSION" ]; then
      # Folder exists, we ca set JAVA_HOME
      export JAVA_HOME="/c/Program Files/Java/jre$JAVA_VERSION"
    fi
  fi
fi
