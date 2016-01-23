#
# $PROXY should have been set at load time from
# the file "${RUNTIME_DIR}/proxy".
# If it's set, we assume we the know the proxy.
#
function isProxyKnown {
  if isValid "$PROXY"; then
    return 0
  else
    return 1
  fi
}

#
# At load time, we just check the value of the proxy
# status file. We assume it was set in another
# session and the only thing we have to do is to set
# the environment. If it's not there, we set it to ON
# if there is a known proxy.
#
function setProxyAtLoadTime {
  local STATUS="ON"
  if [ -f "${RUNTIME_DIR}/proxy_status" ]; then
    LOCAL_STATUS=`cat "${RUNTIME_DIR}/proxy_status"`
  else
    # default is ON
    LOCAL_STATUS="ON"
  fi

  if isProxyKnown; then
    setEnvProxy "$PROXY" "$LOCAL_STATUS"
    setProxyStatusOnFile "$LOCAL_STATUS"
  else
    PROXY_STATUS="N/A"
  fi
}

function setProxyStatusOnFile {
  if isValid "$1"; then
    PROXY_STATUS="$1"
    echo $PROXY_STATUS > "${RUNTIME_DIR}/proxy_status"
  fi
}

function setProxies {
  local LOCAL_PROXY_STATUS=""
  local RELOAD=false

  if isProxyKnown; then
    if [ -f "${RUNTIME_DIR}/proxy_status" ]; then
      LOCAL_PROXY_STATUS=`cat "${RUNTIME_DIR}/proxy_status"`
    fi
    if [ "$1" == "OFF" ]; then
      # User wants to turn proxy off
      # If proxy_status is set and is already OFF,
      # we just need to set the enviroment. Otherwise,
      # set the whole thing (env, npm, git, etc.)
      # and update the status on file.
      setEnvProxy "$PROXY" "OFF"
      if [ "$LOCAL_PROXY_STATUS" == "ON" ]; then
        setNpmProxy "$PROXY" "OFF"
        setGitProxy "$PROXY" "OFF"
        setSublimeProxy "$PROXY" "OFF"
        RELOAD=true
      fi
      setProxyStatusOnFile "OFF"
    elif [ "$1" == "ON" ]; then
      # User wants to turn proxy on
      # If proxy_status is set and is already ON,
      # we just need to set the enviroment. Otherwise,
      # set the whole thing (env, npm, git, etc.)
      # and update the status on file.
      setEnvProxy "$PROXY" "ON"
      if [ "$LOCAL_PROXY_STATUS" == "OFF" ]; then
        setNpmProxy "$PROXY" "ON"
        setGitProxy "$PROXY" "ON"
        setSublimeProxy "$PROXY" "ON"
        RELOAD=true
      fi
      setProxyStatusOnFile "ON"
    fi
    if [ $RELOAD == true ]; then
      reloadEnvironment
    fi
    displayProxyStatus
  fi
}

#
# Setting proxy at the environment level only
# (as opposed to git, npm, etc.)
# $1 must exist and be the proxy string.
# $2 must exist and be ON or OFF.
#
function setEnvProxy {
  if isValid $1; then
    if [ "$2" == "ON" ]; then
      export http_proxy="$1"
      export https_proxy="$1"
      export ALL_PROXY=$http_proxy
      export HTTP_PROXY=$http_proxy
      export HTTPS_PROXY=$http_proxy
    elif [ "$2" == "OFF" ]; then
      unset http_proxy
      unset https_proxy
      unset ALL_PROXY
      unset HTTP_PROXY
      unset HTTPS_PROXY
    fi
  fi
}

function setNpmProxy {
  if isValid $1; then
    if [ "$2" == "ON" ]; then
      cmd "npm config set proxy ${PROXY}"
      cmd "npm config set https-proxy ${PROXY}"
    elif [ "$2" == "OFF" ]; then
      cmd "npm config delete proxy"
      cmd "npm config delete https-proxy"
    fi
  fi
}

function setGitProxy {
  if isValid $1; then
    if [ "$2" == "ON" ]; then
      cmd "git config --global http.proxy ${PROXY}"
      cmd "git config --global https.proxy ${PROXY}"
    elif [ "$2" == "OFF" ]; then
      cmd "git config --global --remove-section http"
      cmd "git config --global --remove-section https"
    fi
  fi
}

function setSublimeProxy {
  local PKG_FILE="${HOME}/Library/Application Support/Sublime Text 3/Packages/User/Package Control.sublime-settings"

  if isValid $1; then
    if [ -f "${PKG_FILE}" ]; then
      if [ "$2" == "ON" ]; then
        node "${TOOLSDIR}/third/json.js" -f "${PKG_FILE}" -I -q -e "this.http_proxy=\"$PROXY\""
        node "${TOOLSDIR}/third/json.js" -f "${PKG_FILE}" -I -q -e "this.https_proxy=\"$PROXY\""
      elif [ "$2" == "OFF" ]; then
        node "${TOOLSDIR}/third/json.js" -f "${PKG_FILE}" -I -q -e "this.http_proxy=\"\""
        node "${TOOLSDIR}/third/json.js" -f "${PKG_FILE}" -I -q -e "this.https_proxy=\"\""
      fi
    fi
  fi
}

function displayProxyStatus {
  local LOCAL_PROXY_STATUS=""

  if [ -f "${RUNTIME_DIR}/proxy_status" ]; then
    LOCAL_PROXY_STATUS=`cat "${RUNTIME_DIR}/proxy_status"`
  fi

  if isValid "$LOCAL_PROXY_STATUS"; then
    PROXY_STATUS=$LOCAL_PROXY_STATUS
    echo
    txtStatus "Proxies are ${LOCAL_PROXY_STATUS}" "NOTICE"
    echo
  else
    echo
    txtStatus "There is no proxy set" "NOTICE"
    echo
  fi
}
