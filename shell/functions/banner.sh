
function showBanner {
  local MAX_STRING="Environment loaded, type h for help"
  local MAX_SIZE=${#MAX_STRING}

  if [ -f "${RUNTIME_DIR}/envtools-banner" ]; then
    txtYellow "┌─────────────────────────────────────┐" "nl"

    txtYellow "│"
    if isMac; then
      txtDefault "       ★ Welcome to Envtools ★       "
    else
      txtDefault "         Welcome to Envtools         "
    fi
    txtYellow "│" "nl"

    txtYellow "│"
    txtDefault " Environment loaded, type "
    txtRed "h"
    txtDefault " for help "
    txtYellow "│" "nl"

    if [ "$ENVTOOLS_VERSION" != "" ]; then
      local VERSION_STRING="v${ENVTOOLS_VERSION}"
      local VERSION_SIZE=${#VERSION_STRING}
      local PADDING=$(($MAX_SIZE - $VERSION_SIZE))

      txtYellow "│                                     │" "nl"
      txtYellow "│"
      printf %${PADDING}s |tr " " " "
      txtDefault " $VERSION_STRING "
      txtYellow "│" "nl"
    else
      txtYellow "│                                     │" "nl"
    fi

    txtYellow "└─────────────────────────────────────┘" "nl"
  fi
}
