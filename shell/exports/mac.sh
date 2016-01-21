# Sublime
if [ -f "$HOME/Library/Application Support/Sublime Text 3/Packages" ]; then
  export SUBLIME_PKG="$HOME/Library/Application Support/Sublime Text 3/Packages"
fi

# Java
export JAVA_HOME="$(/usr/libexec/java_home)"

# Maven
if [ -d "$HOME/Library/Maven/Home" ]; then
  export M2_HOME=$HOME/Library/Maven/Home
  export M2=$M2_HOME/bin
  export PATH=$M2:$PATH
fi

# Brew
export PATH=/usr/local/bin:$PATH
