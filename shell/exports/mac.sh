# Extend the max # of open files per terminal session
ulimit -n 7168 >/dev/null 2>&1

# Sublime
if [ -f "$HOME/Library/Application Support/Sublime Text 3/Packages" ]; then
  export SUBLIME_PKG="$HOME/Library/Application Support/Sublime Text 3/Packages"
fi

# Java
if [ -f "/usr/libexec/java_home" ]; then
  if [ "$JAVA_HOME" = "" ]; then
    export JAVA_HOME="$(/usr/libexec/java_home 2>/dev/null)"
  fi
fi

# Brew, node
if [ "$INIT_PARAM" != "reload" ]; then
  export PATH=$PATH:/usr/local/bin
fi

# Gems (sudo less)
if [ -f "/usr/local/bin/brew" ]; then
  export GEM_HOME="/usr/local/gems"
  export GEM_PATH="/usr/local/gems"
fi

# Araxis
export ARAXIS_CLI="${ENVDIR}/third/compare"
