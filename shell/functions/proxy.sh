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
  export SINOPIA_STATUS="N/A"
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

  if [ -f "${RUNTIME_DIR}/sinopia_status" ]; then
    local LOCAL_SINOPIA_STATUS=`cat "${RUNTIME_DIR}/sinopia_status"`
    if [ "$LOCAL_SINOPIA_STATUS" == "ON" -o "$LOCAL_SINOPIA_STATUS" == "OFF" ]; then
      export SINOPIA_STATUS="$LOCAL_SINOPIA_STATUS"
    fi
  fi
}

function setProxyStatusOnFile {
  if isValid "$1"; then
    export PROXY_STATUS="$1"
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
        setAtomProxy "$PROXY" "OFF"
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
        setAtomProxy "$PROXY" "ON"
        RELOAD=true
      fi
      setProxyStatusOnFile "ON"
    fi
    if [ $RELOAD == true ]; then
      reloadEnvironment
    fi
    displayProxyStatus
    `envtools notifier --title 'Proxy Status Changed' --message "Proxies are $1"`
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
      if [ "$no_proxy" == "" ]; then
        export no_proxy=localhost,127.0.0.1
      fi
      export NO_PROXY=$no_proxy
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
  if isInstalled "npm"; then
    if isValid $1; then
      local SET_PROXY=true
      local PROXY_VALUE="${PROXY}"
      export SINOPIA_STATUS="N/A"

      # Need to check if Sinopia is ON or OFF.
      # If ON, it is the proxy for NPM, which means we need to
      # remove the actual proxy entries in .npmrc
      if [ -f "${RUNTIME_DIR}/sinopia_status" ]; then
        local LOCAL_SINOPIA_STATUS=`cat "${RUNTIME_DIR}/sinopia_status"`
        if [ "$LOCAL_SINOPIA_STATUS" == "ON" ]; then
          SET_PROXY=false
          export SINOPIA_STATUS="ON"
          cmd "npm config delete proxy"
          cmd "npm config delete https-proxy"
        fi
        if [ "$LOCAL_SINOPIA_STATUS" == "OFF" ]; then
          export SINOPIA_STATUS="OFF"
        fi
      fi

      if [ "$2" == "ON" -a $SET_PROXY == true ]; then
        confirm "Do you need a proxy to access the npm registry?"
        case $? in
          0)
            cmd "npm config set proxy ${PROXY_VALUE}"
            cmd "npm config set https-proxy ${PROXY_VALUE}"
          ;;
        esac
      elif [ "$2" == "OFF" -a $SET_PROXY == true ]; then
        cmd "npm config delete proxy"
        cmd "npm config delete https-proxy"
      fi
n
    fi
  fi
}

function setGitProxy {
  if isInstalled "git"; then
    if isValid $1; then
      if [ "$2" == "ON" ]; then
        cmd "git config --global http.proxy ${PROXY}"
        cmd "git config --global https.proxy ${PROXY}"
      elif [ "$2" == "OFF" ]; then
        cmd "git config --global --remove-section http" "ignore"
        cmd "git config --global --remove-section https" "ignore"
      fi
    fi
  fi
}

function setAtomProxy {
  if [ -x "/usr/local/bin/apm" -o -x "/usr/bin/apm" ]; then
    if [ "$2" == "ON" ]; then
      apm config set ssl-strict false
      apm config set http-proxy "${PROXY}"
      apm config set https-proxy "${PROXY}"
    elif [ "$2" == "OFF" ]; then
      apm config delete ssl-strict
      apm config delete http-proxy
      apm config delete https-proxy
    fi
  fi
}

function setSinopia {
  if isInstalled "npm"; then
    if [ "$1" == "ON" ]; then
      echo "ON" > "${RUNTIME_DIR}/sinopia_status"
      PROXY_VALUE="http://localhost:4873/"
      export SINOPIA_STATUS="ON"
      cmd "npm config delete proxy"
      cmd "npm config delete https-proxy"
      cmd "npm config set registry ${PROXY_VALUE}"
      reloadEnvironment
    elif [ "$1" == "OFF" ]; then
      cmd "npm config set registry http://registry.npmjs.org/"
      echo "OFF" > "${RUNTIME_DIR}/sinopia_status"
      export SINOPIA_STATUS="OFF"
      # Here is depends if proxy is ON or OFF...
      # If it's ON, we need to reset the npm proxy to the actual
      # proxy value, if it's OFF we just need to remove it.
      if [ "${PROXY_STATUS}" == "OFF" -o "${PROXY_STATUS}" == "N/A" ]; then
        cmd "npm config delete proxy"
        cmd "npm config delete https-proxy"
      else
        cmd "npm config set proxy ${PROXY}"
        cmd "npm config set https-proxy ${PROXY}"
      fi
      reloadEnvironment
    fi
    `envtools notifier --title 'Sinopia Proxy Status Changed' --message "Sinopia Proxy is $1"`
  fi
}

function displayProxyStatus {
  local LOCAL_PROXY_STATUS=""
  local LOCAL_SINOPIA_STATUS=""
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

  displaySinopiaStatus "quiet"
  echo
}

function displaySinopiaStatus {
  if [ -f "${RUNTIME_DIR}/sinopia_status" ]; then
    LOCAL_SINOPIA_STATUS=`cat "${RUNTIME_DIR}/sinopia_status"`
  fi
  if isValid "$LOCAL_SINOPIA_STATUS"; then
    if [ "$LOCAL_SINOPIA_STATUS" == "ON" ]; then
      if [ "$1" != "quiet" ]; then
        echo
      fi
      txtStatus "NPM requests are proxied through Sinopia" "NOTICE"
      if [ "$1" != "quiet" ]; then
        echo
      fi
    else
      if [ "$1" != "quiet" ]; then
        echo
        txtStatus "NPM is NOT using Sinopia" "NOTICE"
        echo
      fi
    fi
  fi
}
