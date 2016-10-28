# ls and all its variant
alias l=ls
alias ll='ls -lo'
alias la='ls -lrtd .?*'
alias lt='ls -lt'
alias lrt='ls -lrt'
alias ld='ls -ld */'


# request confirmation before removing a file
alias rm='rm -i'

# dyslexia anyone?
alias maek='make'
alias grpe='grep'

# misc shortcuts
alias sudo='sudo -E'
alias sds='sudo su -'
alias tailf='tail -f'
alias ..='cd ..'
alias tit=setTerminalTitle
alias t=tit
alias diffd='diffDirectories'
alias c='clear'

# alias for setting/un-setting the proxies
alias pon='setProxies ON'
alias poff='setProxies OFF'
alias pq='displayProxyStatus && reloadEnvironment'

# alias for enabling/disabling sinopia
alias son='setSinopia ON'
alias soff='setSinopia OFF'
alias sq='displaySinopiaStatus && reloadEnvironment'

# killing norton, jamf, lync, etc.
alias knot=killNorton
alias kout=killOutlook
alias klync=killLync
alias kjamf=killJamf

# alias for ps / net grep
alias psf='net_psf psf'
alias net='net_psf net'

# shortcuts for node scripts
if isValid "$ENVTOOLS_FULL"; then
  alias vm='node $TOOLSDIR/vboxmanager.js'
  alias fgrs='node $TOOLSDIR/fgrs.js'
  alias ff='node $TOOLSDIR/ff.js'
  alias fd='node $TOOLSDIR/ff.js --type d $@'
  alias gith='node $TOOLSDIR/gith.js'
fi

# Open help file
if isValid "$ENVTOOLS_FULL"; then
  alias h='envtools help'
fi

if [ -f /usr/local/bin/vim -o -f /usr/bin/vim ]; then
  alias vi=vim
fi

# environment aliases to load/reload profile, check version
if isValid "$ENVTOOLS_FULL"; then
  alias v='echo; envtools -vb; echo'
fi
alias r='echo; echo "Reloading Envtools Environment..."; reloadEnvironment; echo'
alias reload='r'

# shortcuts for projects folder
if [ -d "${HOME}/projects" ]; then
  alias proj='cd $HOME/projects'
fi

# shortcuts for dev
alias ccc='compass clean && compass compile'

# sort environment aliases output
alias env='env | sort'


if [ "${OS}" = "Darwin" ]; then
  source "${ENVDIR}/aliases/mac.sh"
fi
if [ "${OS}" = "Linux" ]; then
  source "${ENVDIR}/aliases/linux.sh"
fi
