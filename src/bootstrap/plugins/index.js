module.exports = {
  configureEnvtools: require('./envtools'),
  setAutoCheck: require('./autocheck'),
  fixUsrLocal: require('./usrlocal'),
  bootstrapProxy: require('./proxy'),
  bootstrapGitConfiguration: require('./git'),
  bootstrapNodeAndNpm: require('./node'),
  bootstrapHomebrew: require('./homebrew'),
  bootstrapRuby: require('./ruby'),
  bootstrapMaven: require('./maven'),
  installQuickLookPlugins: require('./quicklook'),
  fixScreensaver: require('./screensaver').fix,
  installScreensaver: require('./screensaver').install,
  bootstrapAtom: require('./atom'),
  terminalProfile: require('./terminalProfile'),
  installNVM: require('./nvm'),
  installYarn: require('./yarn')
};
