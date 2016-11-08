# Extend the max # of open files per terminal session
ulimit -n 3072 >/dev/null 2>&1

# Update terminal color scheme for better contrast
eval `dircolors ${ENVDIR}/third/win32-dircolors`
