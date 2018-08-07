# Fixing zsh scp completion
function _ssh_hosts () {
  if [[ -r "$HOME/.ssh/config" ]]; then
	  local IFS="   " key host
	  while read key host; do
		  if [[ "$key" == (#i)host ]]; then
			  _wanted hosts expl host \
				  compadd -M 'm:{a-zA-Z}={A-Za-z} r:|.=* r:|=*' "$@" "$host"
		  fi
	  done < "$HOME/.ssh/config"
  fi
}
