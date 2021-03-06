#
# $PROXY should have been set at load time from
# the file "${RUNTIME_DIR}/proxy".
# If it's set, we assume we know the proxy.
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
    export PROXY_STATUS="N/A"
  fi
}

function setProxyStatusOnFile {
  if isZsh; then
    setopt clobber
  fi
  if isValid "$1"; then
    export PROXY_STATUS="$1"
    echo $PROXY_STATUS > "${RUNTIME_DIR}/proxy_status"
  fi
}

function setProxies {
  local LOCAL_PROXY_STATUS=""
  local RELOAD=false
  local ACTION="$1"
  local TARGET="$2"

  if isProxyKnown; then
    if [ -f "${RUNTIME_DIR}/proxy_status" ]; then
      LOCAL_PROXY_STATUS=`cat "${RUNTIME_DIR}/proxy_status"`
    fi
    if [ "$ACTION" = "OFF" ]; then
      # User wants to turn proxy off
      # If proxy_status is set and is already OFF,
      # we just need to set the enviroment. Otherwise,
      # set the whole thing (env, npm, git, etc.)
      # and update the status on file.
      if [ "$TARGET" = "" ]; then
        setEnvProxy "$PROXY" "OFF"
        setProxyStatusOnFile "OFF"
      fi

      if [ "$TARGET" = "" ]; then
        if [ "$LOCAL_PROXY_STATUS" = "ON" ]; then
          setNpmProxy "$PROXY" "OFF"
          setGitProxy "$PROXY" "OFF"
          RELOAD=true
        fi
      elif [ "$TARGET" = "npm" ]; then
        setNpmProxy "$PROXY" "OFF"
      elif [ "$TARGET" = "git" ]; then
        setGitProxy "$PROXY" "OFF"
      fi

    elif [ "$ACTION" = "ON" ]; then
      # User wants to turn proxy on
      # If proxy_status is set and is already ON,
      # we just need to set the enviroment. Otherwise,
      # set the whole thing (env, npm, git, etc.)
      # and update the status on file.
      if [ "$TARGET" = "" ]; then
        setEnvProxy "$PROXY" "ON"
        setProxyStatusOnFile "ON"
      fi

      if [ "$TARGET" = "" ]; then
        if [ "$LOCAL_PROXY_STATUS" = "OFF" ]; then
          setNpmProxy "$PROXY" "ON"
          setGitProxy "$PROXY" "ON"
          RELOAD=true
        fi
      elif [ "$TARGET" = "npm" ]; then
        setNpmProxy "$PROXY" "ON"
      elif [ "$TARGET" = "git" ]; then
        setGitProxy "$PROXY" "ON"
      fi
    fi

    if [ $RELOAD = true ]; then
      reloadEnvironment
    fi
    if [ "$TARGET" = "" ]; then
      displayProxyStatus
      envtools notifier --title "Proxy status changed" --message "Proxies are $ACTION"
    else
      envtools notifier --title "Proxy status changed for $TARGET" --message "Proxies are $ACTION"
    fi
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
    if [ "$2" = "ON" ]; then
      export http_proxy="$1"
      export https_proxy="$1"
      export ALL_PROXY=$http_proxy
      export HTTP_PROXY=$http_proxy
      export HTTPS_PROXY=$http_proxy
      if [ "$no_proxy" = "" ]; then
        export no_proxy=localhost,127.0.0.1
      fi
      export NO_PROXY=$no_proxy
    elif [ "$2" = "OFF" ]; then
      unset http_proxy
      unset https_proxy
      unset ALL_PROXY
      unset HTTP_PROXY
      unset HTTPS_PROXY
    fi
  fi
}

function setNpmProxy {
  if isInstalled "npm"; then
    if isValid $1; then
      local SET_PROXY=true
      local PROXY_VALUE="${PROXY}"

      if [ "$2" = "ON" ] && [ $SET_PROXY = true ]; then
        confirm "Do you need a proxy to access the npm registry?" "no"
        case $? in
          0)
            cmd "npm config set proxy ${PROXY_VALUE}"
            cmd "npm config set https-proxy ${PROXY_VALUE}"
          ;;
        esac
      elif [ "$2" = "OFF" ] && [ $SET_PROXY = true ]; then
        cmd "npm config delete proxy"
        cmd "npm config delete https-proxy"
      fi
    fi
  fi
}

function setGitProxy {
  if isInstalled "git"; then
    if isValid $1; then
      if [ "$2" = "ON" ]; then
        cmd "git config --global http.proxy ${PROXY}"
        cmd "git config --global https.proxy ${PROXY}"
      elif [ "$2" = "OFF" ]; then
        cmd "git config --global --remove-section http" "ignore"
        cmd "git config --global --remove-section https" "ignore"
      fi
    fi
  fi
}

function setAtomProxy {
  if [ -x "/usr/local/bin/apm" -o -x "/usr/bin/apm" ]; then
    if [ "$2" = "ON" ]; then
      apm config set ssl-strict false
      apm config set http-proxy "${PROXY}"
      apm config set https-proxy "${PROXY}"
    elif [ "$2" = "OFF" ]; then
      apm config delete ssl-strict
      apm config delete http-proxy
      apm config delete https-proxy
    fi
  fi
}

function displayProxyStatus {
  local LOCAL_PROXY_STATUS=""
  if [ -f "${RUNTIME_DIR}/proxy_status" ]; then
    LOCAL_PROXY_STATUS=`cat "${RUNTIME_DIR}/proxy_status"`
  fi

  if isValid "$LOCAL_PROXY_STATUS"; then
    export PROXY_STATUS=$LOCAL_PROXY_STATUS
    setEnvProxy "${PROXY}" "${LOCAL_PROXY_STATUS}"
    echo
    txtStatus "Proxies are ${LOCAL_PROXY_STATUS} ($PROXY)" "NOTICE"
  else
    echo
    txtStatus "There is no proxy set" "NOTICE"
  fi

  echo
}
