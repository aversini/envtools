# in case of Mac and default terminal app, to allow opening a new tab
# in the same current folder, we need to trick the PROMPT_COMMAND a
# little bit
if isMac && [ "${PROMPT_COMMAND}" != "" ]; then
  if type update_terminal_cwd > /dev/null 2>&1 ; then
    if ! [[ $PROMPT_COMMAND =~ (^|;)update_terminal_cwd($|;) ]] ; then
      export PROMPT_COMMAND="$PROMPT_COMMAND;update_terminal_cwd"
    fi
  fi
fi
