function getHostname {
  echo "Hostname         : $(uname -n)"
}
function getOsName {
  echo "Operating System : $(uname -s)"
}
function getCpu {
  if isMac; then
    echo "Processor        : $(sysctl -n machdep.cpu.brand_string)"
  fi
  if isLinux; then
    echo "Processor        : $(cat /proc/cpuinfo  | grep "model name" | awk -F': ' '{print $2}' | sort -u)"
  fi
}
function getTotalMemory {
  local TOTAL_MEM
  if isMac; then
    TOTAL_MEM=$(( $(sysctl -n hw.memsize) / 1024 / 1024 / 1024 ))
    echo "Memory           : $TOTAL_MEM GB"
  fi
  if isLinux; then
    echo "Memory (total)   : $(cat /proc/meminfo  | grep MemTotal | awk -F':' '{print $2}' | tr -d '[:space:]')"
    echo "Memory (free)    : $(cat /proc/meminfo  | grep MemFree | awk -F':' '{print $2}' | tr -d '[:space:]')"
  fi
}
function getUptime {
  echo "Uptime           : $(uptime)"
}
function getDefaultNetwork {
  if isMac; then
    echo $(route -n get default | grep interface | awk '{print $2}')
  fi
  if isLinux; then
    echo $(route | grep default | awk '{print $8}')
  fi
}
function getLocalIpAddress {
  if isMac; then
    echo "Local IP address : $(ifconfig $(getDefaultNetwork) inet | grep inet | awk '{print $2}')"
  fi
  if isLinux; then
    if isInstalled "ip"; then
      echo "Local IP address : $(ip -f inet -h -o addr | grep -v ": lo" | awk '{print $4}')"
    fi
  fi
}
function getDiskSpace {
  if isMac; then
    echo "$(df -PlH)"
  fi
  if isLinux; then
    echo "$(df -Plh)"
  fi
}
function getNodeVersion {
  if isInstalled "node"; then
    echo "Node             : $(node -v)"
  fi
}
function getNpmVersion {
  if isInstalled "npm"; then
    echo "Npm              : $(npm -v)"
  fi
}
function getGitVersion {
  if isInstalled "git"; then
    echo "Git              : $(git --version)"
  fi
}
function getRubyVersion {
  if isInstalled "ruby"; then
    echo "Ruby             : $(ruby -v | awk '{print $2}')"
  fi
}
function getMavenData {
  if isInstalled "mvn"; then
    ENVLITE_MAVEN_DATA=$(mvn -v)
  fi
}
function getMavenVersion {
  if [ "$ENVLITE_MAVEN_DATA" != "" ]; then
    echo "Maven            : $(echo $ENVLITE_MAVEN_DATA | grep "Apache Maven" | awk '{print $3}')"
  fi
}
function getJavaVersion {
  if [ "$ENVLITE_MAVEN_DATA" != "" ]; then
    echo "Java             : $(echo $ENVLITE_MAVEN_DATA | awk -F 'Java version: ' '{print $2}' | awk '{print $1}')"
  fi
}
function getEnvtoolsLiteVersion {
  echo "Envtools Lite    : ${ENVTOOLS_VERSION}"
}
function getRootNpmLocation {
  if isInstalled "npm"; then
    echo "Npm root location: $(npm root -g)"
  fi
}
function getMavenLocation {
  if [ "$ENVLITE_MAVEN_DATA" != "" ]; then
    echo "Maven location   : $(echo $ENVLITE_MAVEN_DATA | awk -F 'Maven home: ' '{print $2}' | awk '{print $1}')"
  fi
}

function envtools_info {
  echo
  txtCyan "S Y S T E M" "nl"
  getOsName
  getHostname
  getCpu
  getTotalMemory
  echo
  txtCyan "E N V I R O N M E N T" "nl"
  getUptime
  getLocalIpAddress
  echo
  txtCyan "F I L E  S Y S T E M" "nl"
  getDiskSpace
  echo
  txtCyan "V E R S I O N S" "nl"
  getNodeVersion
  getNpmVersion
  getGitVersion
  getRubyVersion
  getMavenData
  getMavenVersion
  getJavaVersion
  getEnvtoolsLiteVersion
  echo
  txtCyan "L O C A T I O N S" "nl"
  getRootNpmLocation
  getMavenLocation
  echo
}
