# Sublime
if [ -f "$HOME/Library/Application Support/Sublime Text 3/Packages" ]; then
  export SUBLIME_PKG="$HOME/Library/Application Support/Sublime Text 3/Packages"
fi

# Java
if [ -f "/usr/libexec/java_home" ]; then
  export JAVA_HOME="$(/usr/libexec/java_home)"
fi

# Brew
export PATH=/usr/local/bin:$PATH

# Gems (sudo less)
if [ -f "/usr/local/bin/brew" ]; then
  export GEM_HOME="/usr/local/gems"
  export GEM_PATH="/usr/local/gems"
fi

# Araxis
export ARAXIS_CLI="${TOOLSDIR}/third/compare"
