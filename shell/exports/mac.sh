# Sublime
if [ -f "$HOME/Library/Application Support/Sublime Text 3/Packages" ]; then
  export SUBLIME_PKG="$HOME/Library/Application Support/Sublime Text 3/Packages"
fi

# Java
export JAVA_HOME="$(/usr/libexec/java_home)"

# Brew
export PATH=/usr/local/bin:$PATH
