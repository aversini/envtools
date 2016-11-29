
function showBanner {
  local MAX_STRING="Environment loaded, type h for help"
  local MAX_SIZE=${#MAX_STRING}

  if [ -f "${RUNTIME_DIR}/envtools-banner" ]; then
    txtCyan "┌─────────────────────────────────────┐" "nl"

    txtCyan "│"
    if isMac; then
      txtDefault "       ★ Welcome to Envtools ★       "
    else
      txtDefault "         Welcome to Envtools         "
    fi
    txtCyan "│" "nl"

    txtCyan "│"
    txtDefault " Environment loaded, type "
    txtRed "h"
    txtDefault " for help "
    txtCyan "│" "nl"

    if [ "$ENVTOOLS_VERSION" != "" ]; then
      local VERSION_STRING="v${ENVTOOLS_VERSION}"
      local VERSION_SIZE=${#VERSION_STRING}
      local PADDING=$(($MAX_SIZE - $VERSION_SIZE))

      txtCyan "│                                     │" "nl"
      txtCyan "│"
      printf %${PADDING}s |tr " " " "
      txtDefault " $VERSION_STRING "
      txtCyan "│" "nl"
    else
      txtCyan "│                                     │" "nl"
    fi

    txtCyan "└─────────────────────────────────────┘" "nl"
  fi
}
