# Extend the max # of open files per terminal session
ulimit -n 7168 >/dev/null 2>&1

# Sublime
if [ -f "$HOME/Library/Application Support/Sublime Text 3/Packages" ]; then
  export SUBLIME_PKG="$HOME/Library/Application Support/Sublime Text 3/Packages"
fi

# Java
if [ -f "/usr/libexec/java_home" ]; then
  export JAVA_HOME="$(/usr/libexec/java_home)"
fi

# Brew, node
export PATH=$PATH:/usr/local/bin

# Gems (sudo less)
if [ -f "/usr/local/bin/brew" ]; then
  export GEM_HOME="/usr/local/gems"
  export GEM_PATH="/usr/local/gems"
fi

# Araxis
export ARAXIS_CLI="${TOOLSDIR}/third/compare"
