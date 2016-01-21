export ENVTOOLS_VERSION="$(cat ${ENVDIR}/../version)"
export LANG=C
export EDITOR=vi
export PATH=$PATH:/usr/sbin

if [ "${OS}" = "Darwin" ]; then
  source "${ENVDIR}/exports/mac.sh"
fi
