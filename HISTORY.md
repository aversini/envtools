
__0.0.151 / 2016-10-16__

- Adding `envtools lite`, a simple envtools-lite package generator ([c3efb31](https://github.com/aversini/envtools/commit/c3efb314c345008e40f9a1db6188f62fdd83d4e6))
- Remove binding when not interactive shell (scp for example) ([12a12ba](https://github.com/aversini/envtools/commit/12a12baef028e46b1ae100b6abaff0cf332e8e6e))
- Removing obsolete third party code ([4d9c12e](https://github.com/aversini/envtools/commit/4d9c12e1b41bcd745c51379d7d273cf4ad62b010))
- Adding the possibility to overwrite the DISTRO_NAME (for envtools-lite) ([f6601ba](https://github.com/aversini/envtools/commit/f6601bac4674f486ced6c9e34f57ef9c13ef6d51))

__0.0.150 / 2016-10-16__

- Missed one non-lite export ([e4dd560](https://github.com/aversini/envtools/commit/e4dd560ac4875eb04a8e25c63c0805ee06cbb64d))
- Limiting shell fuctions to lite vs non-lite envtools ([694ae30](https://github.com/aversini/envtools/commit/694ae30b8a79865ce18bc21bc47c2321849049f8))
- First pass at envtools-lite ([33ea0fe](https://github.com/aversini/envtools/commit/33ea0febfd73bcea78abd558e527511beeee6486))

__0.0.149 / 2016-10-15__

- Adding third type of custom prompt (proxy, git, sinopia, node and nvm!) ([7810a52](https://github.com/aversini/envtools/commit/7810a524d55874af809c7f541f3a87a4d73d713d))
- Updating `r` alias to reload nvm as well ([5ec8770](https://github.com/aversini/envtools/commit/5ec87706d4b798c06df550356ddd023a573124b7))
- Typo ([53e75d7](https://github.com/aversini/envtools/commit/53e75d7c71a09edfaf3c6428c073922fed69851b))

__0.0.148 / 2016-10-15__

- Fixing wrapper for sinopia if used with nvm ([98f4889](https://github.com/aversini/envtools/commit/98f48896d8e0273328a55728f8e5f8f4051a9e79))

__0.0.147 / 2016-10-15__

- Adding node and nvm as an extra option available on the prompt ([9854813](https://github.com/aversini/envtools/commit/98548136a9bd1d28cc0dad2b44f5ed254dbde548))
- Adding nvm installer to `extra` option ([a7846e1](https://github.com/aversini/envtools/commit/a7846e1a2fb7139cbbe25edd13141b7a924b4e2c))
- Better git prompt status ([a61741e](https://github.com/aversini/envtools/commit/a61741e23f6d1e7d0c200290d169e311922a74a7))
- Adding custom option to display node version in prompt ([1614627](https://github.com/aversini/envtools/commit/161462758813488675a71c07d8e539ffa1792e13))
- Adding `unsetDefaultPrompt` to allow better customization ([705b1d6](https://github.com/aversini/envtools/commit/705b1d6438df3c540523e7c683674ad059ae8930))
- Simplifying banner message ([46c55c3](https://github.com/aversini/envtools/commit/46c55c3d8cc13b16d99982bd82dea38f7f24a1f0))
- Reducing /usr/local/bin priority in PATH to help nvm ([c7ed1e7](https://github.com/aversini/envtools/commit/c7ed1e7bb992c8da91e092ed9034b343d15a0a23))
- Prevent double load (if init script is called more than once in same session) ([b01a7ab](https://github.com/aversini/envtools/commit/b01a7abef935067cd470386e95ea614bd122a3c7))

__0.0.146 / 2016-10-04__

- Fixing `ff` to ignore EACCESS files ([3ff133f](https://github.com/aversini/envtools/commit/3ff133f4640742d0d52f0beb3bd8fd40c4f16d68))
- Improved `frgs` by ignoring libraries (.so and .a files) ([aeeedd0](https://github.com/aversini/envtools/commit/aeeedd085892dd204255c1bc4fd365c73b11bcd2))
- Better envtools logo on help page ([9ffb17d](https://github.com/aversini/envtools/commit/9ffb17d062ad32a5f0bd2c40fc8c6ed7cc3c39eb))

__0.0.145 / 2016-09-30__

- Updating maven config for new nexus URL ([3a0898f](https://github.com/aversini/envtools/commit/3a0898f13a70fcf7052c5b09950adb09f37edf33))

__0.0.144 / 2016-09-25__

- Hiding sinopia http logs: ([1ff9853](https://github.com/aversini/envtools/commit/1ff98530356c21fc167a57c62337876662cb10ef))
  - no more crazy http logs for sinopia
  - just display a little spinner when there is activity
  

__0.0.143 / 2016-09-23__

- Convert `fgrs` to use the same arguments as `ff` ([68c10f2](https://github.com/aversini/envtools/commit/68c10f2d4ac9fc60a8c9820616c2decd81e49bd3))
  - pattern is now a full regex
  - the pattern flag (-p) is now required…
  
- Extra help for `ff` ([736d085](https://github.com/aversini/envtools/commit/736d085446c7190b4ae2e9fb1ddeabb59fa5d6d8))
- Limit `ff` regex match to filename insted of folder ([d5868cf](https://github.com/aversini/envtools/commit/d5868cf44f453504b14d64ff0deb6d1a237aa547))
- Freaking windows… blue is too blue.. ([58a4b39](https://github.com/aversini/envtools/commit/58a4b3916c927034ad40dc6e00fefb548e37b9b8))
- Optimized `ff` to allow pure regexp as a pattern search ([4cc7b3e](https://github.com/aversini/envtools/commit/4cc7b3e23c4cf8cd1dc1748f690bd8f9059ac817))
- Refactoring `ff` and `fgrs` for a more unified experience ([53cb9c4](https://github.com/aversini/envtools/commit/53cb9c4f69b40075f56c70ea352e59dcd1ecfc53))
- Oops - sorry for the "bash: notifier: command not found" when toggling proxies ([ccf824c](https://github.com/aversini/envtools/commit/ccf824c925bf3f3fd824a4c8bd9ba081520bbfc6))
- Sligth color fix for fgrs and Windows ([4566cf9](https://github.com/aversini/envtools/commit/4566cf9d0fbd52a23322bf24e2cc71a9cc4d10c1))

__0.0.142 / 2016-09-22__

- Upgrading ff to use the new “performance” module for stats ([ca62962](https://github.com/aversini/envtools/commit/ca629629aca387be870d20993b997265195150de))
- Using ‘performance’ module from utilities for fgrs stats ([1a564ec](https://github.com/aversini/envtools/commit/1a564ec9bf8c7df31b751827274c62805f7dba55))

__0.0.141 / 2016-09-21__

- Fixing “ff” size calculation ([1a0536f](https://github.com/aversini/envtools/commit/1a0536f4f616fb6a71cbd00abd6ee4bf7cfe2e0d))
- Fixing “ff” not interpreting file ownership correctly ([e993ed4](https://github.com/aversini/envtools/commit/e993ed413059f06bf411c509a96631a74ca1499d))
- fgrs update options (no more async - always on) ([7ec13a9](https://github.com/aversini/envtools/commit/7ec13a931b6ae8f875bd6ae5a65c3af2dbd43381))
- Refactoring `fgrs` ([9135c2f](https://github.com/aversini/envtools/commit/9135c2fb6667011d0251387655a9c5f3aa9ea4da))

__0.0.140 / 2016-09-20__

- Preparing support for envtools notifier ([726ce9a](https://github.com/aversini/envtools/commit/726ce9a4539f2dd11c56867b9e9f4dee1fc2308a))
- Updating alias help page with kdock ([bb5cb8c](https://github.com/aversini/envtools/commit/bb5cb8cd0de7a94d93bedb489ff288c414c812a5))
- Adding alias to kill the Dock quickly ([c898daf](https://github.com/aversini/envtools/commit/c898dafaa10ed654542e70e76fdb7c3107e5fa41))
- Better "confirm" bash function ([073d128](https://github.com/aversini/envtools/commit/073d128ed5eca10c54f85cceca4d71eb0ce51449))
- Better alias for env (sorted) ([27a7466](https://github.com/aversini/envtools/commit/27a74668d273241663c73159961f498de20e8752))
- Adding possibility to have custom prompt ending indicator ([697027c](https://github.com/aversini/envtools/commit/697027c22cc3fdbf6b0e0b910c96b447f7b74d16))
- Do not set JAVA_HOME if java is not installed ([528a84b](https://github.com/aversini/envtools/commit/528a84bf6aae7e09edbbb96851567505057048a9))
- Fixing common.js refactoring… ([cf1b4c2](https://github.com/aversini/envtools/commit/cf1b4c2ffbf6771a9ea6f61ebf0bcaa6e6355858))
- Refactoring common.js ([45fc2bf](https://github.com/aversini/envtools/commit/45fc2bfdc3371091d3cc4dc8df4a116b1bd471e1))

__0.0.139 / 2016-09-18__

- Adding sinopia wrapper to handle config ([cc0a887](https://github.com/aversini/envtools/commit/cc0a8879c4d1092c090947214426ad804c0a7ce5))
- Better Envtools logo on help page ([f212517](https://github.com/aversini/envtools/commit/f21251705ed4cab34c5e2961737ed15b2c5f4c07))
  - Support for retina/non-retina display
  
- typo ([c058d74](https://github.com/aversini/envtools/commit/c058d7404a570b32e42ede1347017c24afae2073))
- Better color output for "showColors" ([2b4a4bf](https://github.com/aversini/envtools/commit/2b4a4bfdc9787fc6660867f1a3e3782abe565593))

__0.0.138 / 2016-09-17__

- Optimized version checking and getting rid of "request" dependency! ([04a97cd](https://github.com/aversini/envtools/commit/04a97cd626364f44b0ef8c1a14f5d3cbe3455332))

__0.0.137 / 2016-09-16__

- Better banner when there is a new version available ([58fb073](https://github.com/aversini/envtools/commit/58fb07397a2e8c9d717d4bb5c91f638d568ccfbd))

__0.0.136 / 2016-09-16__

- Fix log status with no newline in windows ([ba3b0e3](https://github.com/aversini/envtools/commit/ba3b0e3fa6014840329244c03190df517afca18b))
- Removing extra screensaver options - not working all the time… ([3edcfa4](https://github.com/aversini/envtools/commit/3edcfa4cdd787b02ae0198a776d2239cf8093f83))

__0.0.135 / 2016-09-15__

- Adding extra screensavers to "envtools extra" ([6ed59f7](https://github.com/aversini/envtools/commit/6ed59f735873be3e017aefbca8828aeb6fee9890))
- Found a way to set the Terminal as default profile ([b1808c8](https://github.com/aversini/envtools/commit/b1808c8455552c86f09418adbacf205a02a9bba8))

__0.0.134 / 2016-09-15__

- Custom terminal theme mention in the help ([874c929](https://github.com/aversini/envtools/commit/874c92974f53b2339e030eb560a18fab383f210a))
- Fix: do not place the terminal theme on the desktop in case of success ([d6541b9](https://github.com/aversini/envtools/commit/d6541b93716fa7cc8616f0b552adfb66b51f6f64))
- Better dynamic proxy prompt ([1cb43af](https://github.com/aversini/envtools/commit/1cb43af534362275c9ab2f205fe70a6bdc4161fb))
  - If the proxy is set in another tab, it should be reflected in any other already opened tabs
  
- Adding custom terminal theme option to "entools extra" ([5ab5b3d](https://github.com/aversini/envtools/commit/5ab5b3d5eef439cc3513c7073ec4f0604339adff))

__0.0.133 / 2016-09-14__

- One more try to fix Windows prompt... ([382e121](https://github.com/aversini/envtools/commit/382e121eeb08df5ee803a49dfca6face1c610d3d))
- Fix for windows prompt: ([57b4ebe](https://github.com/aversini/envtools/commit/57b4ebe1df2f11cf251b64f60f16f0db45fd961f))
  - Not fully dynamic
  - Only refreshed if new terminal or with "r" alias
  - F* windows
  
- Trying to fix prompt issue with Windows ([c6fd92b](https://github.com/aversini/envtools/commit/c6fd92b3829d2c5454edfbdbc5e2916adff52414))
- Dynamic update of proxy/sinopia status ([ff0f1ad](https://github.com/aversini/envtools/commit/ff0f1adf9397a3f7352317f5ceb6a6c60a4ecee9))
  - Even if the status changes in another terminal, the prompt will now reflect the change automatically
  

__0.0.132 / 2016-09-13__

- Fix brew installation failure ([701ba00](https://github.com/aversini/envtools/commit/701ba007a875c162bdccac8667462880b336a067))
  - Change in decompress meant that “strip” after download is now a number instead of a boolean
  
- Fixing invalid brew detection as well as others due to a regression with cmd.run and its output ([2348481](https://github.com/aversini/envtools/commit/2348481efe7c18dd9ad8afde429dd0fb432279ff))

__0.0.131 / 2016-09-13__

- Check for sinopia status before publishing ([b7e4aed](https://github.com/aversini/envtools/commit/b7e4aed7feaa850eb1b7ee29f9f3c48e0d4f8f78))
- Minor CSS fix (history page) ([db562c7](https://github.com/aversini/envtools/commit/db562c7428f21b8d4e777a5c4bd52dbb68d05976))
- Better history generator ([f46d3dd](https://github.com/aversini/envtools/commit/f46d3dde4bec177d7f18e2bfba0872cc3df5231b))

__0.0.130 / 2016-09-06__

- Adding “fastlint” to core node packages ([9d693f8](https://github.com/aversini/envtools/commit/9d693f855d3fe804083e332e69829c1e28805f24))
- Remove ‘Merge’ commit messages from history ([e438c14](https://github.com/aversini/envtools/commit/e438c143aee2d5002a7ede94536af17731949b1f))
- Remove rimraf dep and update to latest inquirer dep ([2226ecd](https://github.com/aversini/envtools/commit/2226ecd4f110db16c35bed19860811669040a7e0))
- Remove git warning on push “simple” versus old “matching” ([c39ff58](https://github.com/aversini/envtools/commit/c39ff586852fc56e48ce35ba62dbcd9cbeaabb97))

__0.0.129 / 2016-09-06__

- Simplifying Envtools configuration (profile, prompt and banner) ([2eb7d5a](https://github.com/aversini/envtools/commit/2eb7d5aac3edad5977b26eb0649b3ec9210be5d7))

__0.0.128 / 2016-09-05__

- Do not display sinopia running state if not on Mac ([526b642](https://github.com/aversini/envtools/commit/526b642ee2f3348002003e4778d8dddb36f859dc))
- Fixing unicode prompt issue on non-mac ([60f2d4f](https://github.com/aversini/envtools/commit/60f2d4f67b2f659b6406b8be5da129a42f7506f5))
- Allowing to load 2 different custom prompt preset ([5b72b2a](https://github.com/aversini/envtools/commit/5b72b2a64c8a9bbce52cd410fa80f4ec5163cdd7))
- Fixing reloading env broken when no prompt are set ([7b90ed0](https://github.com/aversini/envtools/commit/7b90ed0d286f98d43951be91096809bbb425ab1b))
- Refactoring common ([8945362](https://github.com/aversini/envtools/commit/894536251ac74def8b66e9a1e42f5d41abd0f418))
- Oops, only load custom prompt if the user asked for it ([2d96b78](https://github.com/aversini/envtools/commit/2d96b78f67f1bc35f247d033df9981d1937be33f))

__0.0.127 / 2016-09-05__

- Fixing Sinopia running sign color ([36bdd0f](https://github.com/aversini/envtools/commit/36bdd0f3f16e32cc9510ef17c39e27e332e442b8))
- Updating customization help page a little bit ([c2e021e](https://github.com/aversini/envtools/commit/c2e021e5a131a40faab151e5f6a576a07d6fd54f))
- Typo ([fc37280](https://github.com/aversini/envtools/commit/fc3728028d5fd371e698cbb44f12b422a62918c2))
- Better PROMPT_COMMAND - ready for more customizations ([6bd628f](https://github.com/aversini/envtools/commit/6bd628f2b9e9ae8f12869a5a7d1258ff9fb1b5f1))
- Adding hidden query string option to help page for debug ([bf20b4f](https://github.com/aversini/envtools/commit/bf20b4fdae9fc317f31ce2c96c05ea86e3fc62d2))
- Fixing npm badge display in history page ([0ddf331](https://github.com/aversini/envtools/commit/0ddf331ecb7755caf8b1e3a26e9ac730fb929b13))

__0.0.126 / 2016-09-04__

- Enabling sinopia configuration (envtools extra) for Windows ([36023a6](https://github.com/aversini/envtools/commit/36023a6052964e4e54f48028099f862d620051be))

__0.0.125 / 2016-09-04__

- Hiding mac only help on non-mac browsers ([5a63e39](https://github.com/aversini/envtools/commit/5a63e39e9341a90cd1a209db4399321e43a34f9e))

__0.0.124 / 2016-09-03__

- Adding npm badge to help file ([4497fad](https://github.com/aversini/envtools/commit/4497fadfa83178a44bb73bf623aaac7aa7ddfe75))
- Removed markdown dependency on building aliases help page ([145c961](https://github.com/aversini/envtools/commit/145c9610a08f9bb0b21ad71de62dd0859a9769fc))

__0.0.123 / 2016-09-02__

- Adding a lot more about Sinopia and Node v6 ([4dd06c7](https://github.com/aversini/envtools/commit/4dd06c7f8cddc279b86d28b206207028ebb5607f))
- removing debug code ([448eeff](https://github.com/aversini/envtools/commit/448eeff83a7a18f62e52aa12948054861321b5d3))

__0.0.122 / 2016-09-02__

- Fixing prompt cutting of after a big amount of key strokes ([6412100](https://github.com/aversini/envtools/commit/64121005873dcc1de396b5d328330fe7031f0412))
- Adding short logs (feedback text) for each command ([f29ec7c](https://github.com/aversini/envtools/commit/f29ec7c450a4d025a9cec7c6203fa0133764ee7f))
- removing debug code ([448eeff](https://github.com/aversini/envtools/commit/448eeff83a7a18f62e52aa12948054861321b5d3))
- Removing phantomjs installation - not required anymore ([13bce4a](https://github.com/aversini/envtools/commit/13bce4a4014cd60528971eafecb2fc355b95eb01))

__0.0.121 / 2016-08-31__

- Fix for git boostrap when there is no config at all ([aca428b](https://github.com/aversini/envtools/commit/aca428b57878eab79eacabea7b23758cb91be5eb))

__0.0.120 / 2016-08-31__

- Better session reloading mechanism ([1d61d79](https://github.com/aversini/envtools/commit/1d61d798da076ed164a4fb8e614901911c267f24))
- Remove duplicate warning logs ([19c66e5](https://github.com/aversini/envtools/commit/19c66e5191d191ce8f6838b41c902bb8cb8abe70))
- Refactoring to simplify some tasks ([31b0779](https://github.com/aversini/envtools/commit/31b077931660bb5d0454b2766d45fef8335c0146))
  - Better logging
  - Better options
  
- Adding testing CLI to envtools ([b802fcf](https://github.com/aversini/envtools/commit/b802fcf1cbb655f222dabe5f9fbd52ae68c77f52))

__0.0.119 / 2016-08-26__

- Fix login prompt not remembering previous location ([b75f32f](https://github.com/aversini/envtools/commit/b75f32f33d6616389987e5736d7087934a717e74))
- Log error when homebrew installation of wget fails ([c4058d8](https://github.com/aversini/envtools/commit/c4058d8749a1129f13535b5d94d557f556e36750))
- Migrating to lodash and replacing mkdirp with ensureDir ([0988c6b](https://github.com/aversini/envtools/commit/0988c6b30ad5c3fbc47aa4018d7f058d7a56db15))

__0.0.118 / 2016-08-25__

- Optimizing sinopia (better external usage) ([9477d89](https://github.com/aversini/envtools/commit/9477d89590b8a897366afec73a49dc0a51153abd))
- Bump download dependency version ([48a7291](https://github.com/aversini/envtools/commit/48a72918a279eadde1e2cba7c0b3af0d744c6c00))
  - had to update the code to take new "download" promise API for homebrew and maven downloads.
  
- Bump dev dependencies ([ef0f325](https://github.com/aversini/envtools/commit/ef0f325a9dc06749ba7f38364e576d4bb1616e9e))
- No need to remove “progress” for npm (fixed perf at master) ([1535642](https://github.com/aversini/envtools/commit/153564297f510140534b442d252db88b26d7230c))
- Better README ([86577cf](https://github.com/aversini/envtools/commit/86577cfdc4ffce6bdad990ecf273a19cdd202ec3))
- Simplifying "envtools -h" since the web page is now supported ([7539a1b](https://github.com/aversini/envtools/commit/7539a1b9b68190ceb4212cebdf4b2a340a08da9f))

__0.0.117 / 2016-08-21__

- Refactoring help page (available for Windows too) ([67eca50](https://github.com/aversini/envtools/commit/67eca502968e69463e26d1bccf7e349dd2f7899a))

__0.0.116 / 2016-08-21__

- Refactoring maven settings installation ([83fd442](https://github.com/aversini/envtools/commit/83fd442b2e68c5fe7b4776cbdadf039a4ba4547a))
  - need a password to decrypt the settings.xml file
  - better logging
  

__0.0.115 / 2016-08-20__

- Removing git link from history since it’s a private repo ([cb911be](https://github.com/aversini/envtools/commit/cb911bef9715882001429d0302d4e3663fd670f3))
- Slight better wording for manual options ([0e919d8](https://github.com/aversini/envtools/commit/0e919d8df4215fa6297b10d7222fbcdf5b0b39c7))
- Slight refactor of “checkForApps” - better logging ([e0878e7](https://github.com/aversini/envtools/commit/e0878e77d22c2a62c3d468a50246047a34f17434))
- Slight refactor of load.sh ([aebe635](https://github.com/aversini/envtools/commit/aebe635720b0df4ee696ec4dcf8df1baa418f1b1))

__0.0.114 / 2016-08-17__

- Bumping maven version to 3.3.9 since it's now supported ([bd8a8c2](https://github.com/aversini/envtools/commit/bd8a8c26f606fa152f6fb2a9660bca7fc0649ff5))

__0.0.113 / 2016-08-07__

- Removing getArtifacts - not needed anymore ([b9433d0](https://github.com/aversini/envtools/commit/b9433d0d26cca3cbc9fcfc9e16cb960da2578762))
- Spelling! ([f2d138e](https://github.com/aversini/envtools/commit/f2d138ef52636bc82da922e36a3aaedf01963d67))

__0.0.112 / 2016-08-07__

- Adding example to customization tab ([82f8841](https://github.com/aversini/envtools/commit/82f8841655e27721750c671d59245dd28ad8d040))
- Fix lint issues in Gruntfile ([11bc047](https://github.com/aversini/envtools/commit/11bc047235df8478ea28c73041dd1fcbb7fc77d2))

__0.0.110 / 2016-08-06__

- Better wording for the command prompt option ([1d756cc](https://github.com/aversini/envtools/commit/1d756cc9284aa4695797109271dd79516d6f7bcd))
- eslint rules: adding es6 support ([3025253](https://github.com/aversini/envtools/commit/3025253f60515cb72ba78d8d656ddf96a48d7653))
- eslint rules: allowing template litterals ([9aad3d6](https://github.com/aversini/envtools/commit/9aad3d672039294788523c124c3e18d58835d082))

__0.0.108 / 2016-06-17__

- Updating gith because of an API change in fedtools-utilities ([f04c08a](https://github.com/aversini/envtools/commit/f04c08a9aa1c8a1564c5b3c56ccfb9703545b32d))

__0.0.107 / 2016-06-15__

- Small refactoring ([d89b187](https://github.com/aversini/envtools/commit/d89b187646bec4ace162a96da556945b21626a21))

__0.0.106 / 2016-06-14__

- In extra mode, allowing the user to choose which atom packages to install ([850d4c5](https://github.com/aversini/envtools/commit/850d4c58f43d288f2e93f3771ca02352e43e1640))
- In manual mode, allowing the user to choose which npm packages to install ([365ab88](https://github.com/aversini/envtools/commit/365ab88011383da04c174a6424d20f075d60de4e))

__0.0.105 / 2016-06-10__

- Better handling of npm installationg failure ([1fade8c](https://github.com/aversini/envtools/commit/1fade8ca7a313f8b6f45a6b9749c712630dabfa2))

__0.0.104 / 2016-06-10__

- Fixing homebrew installing - need to run update now ([0fd00fc](https://github.com/aversini/envtools/commit/0fd00fc5543c76166b58e48aec609967ffdb98e5))

__0.0.103 / 2016-06-10__

- Refactoring - extracting each individual plugin ([d79425d](https://github.com/aversini/envtools/commit/d79425de93fd7e543265988e620f989739aef723))

__0.0.102 / 2016-06-09__

- Special character is not working on windows ([4293b6e](https://github.com/aversini/envtools/commit/4293b6eb306137a407663a1f9ee3ea3433635787))

__0.0.101 / 2016-06-08__

- Do not check for ruby in auto mode on windows ([d4fe39d](https://github.com/aversini/envtools/commit/d4fe39dc2e8c65d7be2ea6d5e05f97ea9e0912df))
- Lowering ulimit for windows ([ec96680](https://github.com/aversini/envtools/commit/ec96680ccdba9d1230dd6f4859ffdc50793d3b1d))

__0.0.100 / 2016-06-08__

- Better welcome banner for non-mac ([4fc8e8a](https://github.com/aversini/envtools/commit/4fc8e8ab2219b5f77147ae9f48ccada740a74ccf))

__0.0.99 / 2016-06-08__

- Limiting 'h' for help on mac ([e839e0c](https://github.com/aversini/envtools/commit/e839e0cae73fe7d7062162f183ab8054ab56ab3b))

__0.0.98 / 2016-06-08__

- Adding alias for clear (c) ([93bfdb3](https://github.com/aversini/envtools/commit/93bfdb3c0e543a1ff17bc63698524b9daef45704))
- no sudo on windows - take 2 ([fc8e9f9](https://github.com/aversini/envtools/commit/fc8e9f9dfe2e4efaea5eae539a56b0aeb7b6bca9))

__0.0.97 / 2016-06-07__

- Removing stars in banner on Windows ([38ad271](https://github.com/aversini/envtools/commit/38ad271f5734336bfcae42484f4117c913fc7955))
- No sudo on windows ([3ba2e73](https://github.com/aversini/envtools/commit/3ba2e7312db8eec94a096cc6fbf0e3ce51f2e181))

__0.0.96 / 2016-06-06__

- Replacing "cp -f" with fs.copy ([ff5b6e6](https://github.com/aversini/envtools/commit/ff5b6e62452e5b6b79b73299d8a73fdd482f9041))
- First pass at trying to support windows ([631ef1d](https://github.com/aversini/envtools/commit/631ef1de58eae9d34dbe02df5488a1ce28e9dbb8))
- First pass at trying to support windows ([e4db46c](https://github.com/aversini/envtools/commit/e4db46cb6d5cee6e1cfd37c16248b364efdd6073))
- (internal) Adding sugar shell method "confirm" ([c83191b](https://github.com/aversini/envtools/commit/c83191be19179008f0251efc66d62eafe7a98787))

__0.0.95 / 2016-05-24__

- Adding gulp to needed npm packages ([76ca6f9](https://github.com/aversini/envtools/commit/76ca6f9948ebd88d63126e5edf0d680c300055f3))

__0.0.94 / 2016-05-19__

- Updating npm bootstrap to take sinopia into account (if already setup) ([ce502ae](https://github.com/aversini/envtools/commit/ce502ae743fc6cad9842d2f1cd636c0145abdab8))

__0.0.93 / 2016-05-13__

- Fix envtools message display in node v6+ ([71b3708](https://github.com/aversini/envtools/commit/71b37084583974b6b30694e332123aae0189850f))

__0.0.92 / 2016-05-05__

- Restricting phantomjs installation to 1.9.8 ([44d1d11](https://github.com/aversini/envtools/commit/44d1d11a1b3a296b3c6dc42b86259f5f2a4b8a6f))

__0.0.91 / 2016-05-01__

- Slightly better help (for sinopia shortcuts) ([4a8290e](https://github.com/aversini/envtools/commit/4a8290e0bca920c6badaa77393c34733bdb5caf7))
- Need to reload env when setting sinopia (on or off) ([3ec233f](https://github.com/aversini/envtools/commit/3ec233f5c76a0fa236ec65b7489cd7820cd721a9))
- Reload custom export when reloading prompt (for ex via pq or sq) ([a91dd18](https://github.com/aversini/envtools/commit/a91dd1852f97ee07c95daa80d617dcf75dd773dd))

__0.0.90 / 2016-04-30__

- Adding more sinopia goodies ([c82a474](https://github.com/aversini/envtools/commit/c82a4743ea65879be4ddbb6a4c6bca4da700bda0))
  Command lines shortcuts
  - "son" to force npm to use sinopia
  - "soff" to disable sinopia - npm will use either your proxy or direct internet connection
  - "sq" to check if npm is using sinopia
  
  You still need to start/restart sinopia manually though.
  

__0.0.89 / 2016-04-29__

- Removing gemnasium from README ([01c1f3b](https://github.com/aversini/envtools/commit/01c1f3b17eff56e29ecedb1e468b430e8a8b6339))

__0.0.88 / 2016-04-29__

- Tiny update to trigger a bump - failing to publish because of... sinopia :) ([40fe7fa](https://github.com/aversini/envtools/commit/40fe7fa1a7aa0d72f82b3c92052d8a1ee3e09d89))

__0.0.85 / 2016-04-29__

- Fix package dev dependencies ([eed240c](https://github.com/aversini/envtools/commit/eed240c400099d1cf1c2d8a322a82cc3ee6b7a78))
- Removing time-grunt ([a8640c2](https://github.com/aversini/envtools/commit/a8640c22c2552f1dd68549ebba1f5abdfe5d8a2f))
- Adding Sinopia to handle npm caching locally ([7e3ff5d](https://github.com/aversini/envtools/commit/7e3ff5dd765ce4cc0276ee9a4014c680f44870c0))
  - Install sinopia
  - Activate it
  - Enjoy better perfromance for npm v3 and node v6 behind a proxy
  
- update .jsbeautifyrc to add a new line at the end of files ([fbc4fb3](https://github.com/aversini/envtools/commit/fbc4fb38b73d985e4784189c5af6d78c3e2cdae6))
- Fix invalid fs-extra dep version ([9afea47](https://github.com/aversini/envtools/commit/9afea47e112a44c6985b08863e3d6b59c6f70ac2))
- Update to latest stable version of inquirer (migrating to promises) ([8ab92d0](https://github.com/aversini/envtools/commit/8ab92d0de988adb63350f76d1b6949e8f3c074f1))
- Adding license to package.json to prevent CLI warning ([960bf70](https://github.com/aversini/envtools/commit/960bf70dff486d62164d78011f4d3fecab3d3e1d))
- Updating to latest stable version of glob ([aa70ff3](https://github.com/aversini/envtools/commit/aa70ff3800edb15a316c4bbd65a3ca29564c3d71))
- Updating to latest stable version of fs-extra ([fa6bcd4](https://github.com/aversini/envtools/commit/fa6bcd4d475b43193cd409d313d17a23971b1f71))

__0.0.84 / 2016-04-27__

- Enabling by-passing a few steps in "envtools auto" ([82f4604](https://github.com/aversini/envtools/commit/82f4604b84e9208a85d6365a63f85b4d1329236f))
- Sorting Vms ([5a24412](https://github.com/aversini/envtools/commit/5a244128c0f5343b89560d15add188a330b6f541))

__0.0.83 / 2016-04-27__

- Linting via ESLint ([7d02e5a](https://github.com/aversini/envtools/commit/7d02e5a043de408396a21afadd9d5dcc942a77de))
- Adding unicorn as a required App for framework ([6683390](https://github.com/aversini/envtools/commit/668339099f6e3e87c2e6e237ec900484369c9db9))

__0.0.82 / 2016-04-26__

- Updating ESLintrc to latest from framework ([deedb96](https://github.com/aversini/envtools/commit/deedb96a823682125f85435806e3aec10a85ecc2))

__0.0.81 / 2016-04-25__

- Updating ESLintrc ([a21401e](https://github.com/aversini/envtools/commit/a21401ed16416c4dbef7ad4803bd0052e9d4bf69))

__0.0.80 / 2016-04-21__

- Try to limit grunt dependencies ([3c9f24f](https://github.com/aversini/envtools/commit/3c9f24f97c4a06917a4e4506f6d5b96360c73948))
- grunt-cli is enough, not need to install grunt as well ([6a6a928](https://github.com/aversini/envtools/commit/6a6a928902dd9a2c53a0e7dcccab0c484fab8be6))
- Adding chai to globals for ESLint ([d983aed](https://github.com/aversini/envtools/commit/d983aedb452aaeb84f576425d62a0953f1062b9a))

__0.0.79 / 2016-04-21__

- Removing reserved words ([be2f188](https://github.com/aversini/envtools/commit/be2f188c145de7fdd90a4a15e45db677eba3f63e))
- Revert "Removing fedtools installation from envtools" ([25493b7](https://github.com/aversini/envtools/commit/25493b795994d322b1d89839bf14cef5e46437ac))
  This reverts commit 6442c135dfda86c6e2c1f95535397d06cceeacbc.
  
- Removing grunt check ([b98e61a](https://github.com/aversini/envtools/commit/b98e61a50d3515245fbbcf23f77565548e201ec6))
- Moving version checking to public package ([39d5d9e](https://github.com/aversini/envtools/commit/39d5d9e3e3006dba2414b0c70edd2e2392fd2082))
- Removing submodule - not working.. ([1845139](https://github.com/aversini/envtools/commit/1845139986b6361c3dbef6568761cc21a1409e61))
- Not sure what I'm doing here.. ([1b936d7](https://github.com/aversini/envtools/commit/1b936d7ab9d89e835d33ea78215f9bb0fac4b7e4))
- Adding submodule "versions" ([0ba32bf](https://github.com/aversini/envtools/commit/0ba32bf23d82af4c87535e760d953ec9e7182d90))

__0.0.78 / 2016-04-15__

- Adding a few more Atom packages ([e864532](https://github.com/aversini/envtools/commit/e864532a77ea89314f199c735eb8fa8719904e00))

__0.0.77 / 2016-04-13__

- Removing fedtools installation from envtools ([6442c13](https://github.com/aversini/envtools/commit/6442c135dfda86c6e2c1f95535397d06cceeacbc))

__0.0.76 / 2016-04-11__

- Simplifying README ([a0e4ac3](https://github.com/aversini/envtools/commit/a0e4ac31766386031af149ae1318afe164d8e01f))
- Adding eslint and unicorn to default NPM packages ([69b9ceb](https://github.com/aversini/envtools/commit/69b9ceb5f740a926bbc3c1495353c69afa2b8cfe))
- Fix lint error ([37af907](https://github.com/aversini/envtools/commit/37af907d8b0cd02c57cae3e77759012eefb1d120))

__0.0.75 / 2016-02-17__

- Dump the resume_auto file only in auto mode! ([f47c249](https://github.com/aversini/envtools/commit/f47c249685df46e3be106a430e3e93f4c4007286))

__0.0.74 / 2016-02-12__

- Updating `la` alias to list only hidden files ([bfb3e83](https://github.com/aversini/envtools/commit/bfb3e8373370eb9aa541bdfa93d824b7b62885b9))
- Sligthly better help ([db4b433](https://github.com/aversini/envtools/commit/db4b433efdc65e89a897b6225eeae035c7961643))

__0.0.73 / 2016-02-11__

- Adding support for .bash_profile (on top of .profile) ([b84e968](https://github.com/aversini/envtools/commit/b84e96897c26fd67e07bd4e71e9a2602e627c3e2))
- Relaxing eslint rule for style of wrap-iife functions ([bae4e84](https://github.com/aversini/envtools/commit/bae4e843aef773000ec7375099160d7711b2456b))

__0.0.72 / 2016-02-08__

- Removing App Store fix since it does not work... ([1068ae1](https://github.com/aversini/envtools/commit/1068ae15399374a3971661e08a4c4d575429ba28))

__0.0.71 / 2016-02-05__

- Adding wget as the first real core package needed after brew ([0334bd1](https://github.com/aversini/envtools/commit/0334bd12ce08681b6c097546424277b2fef9d5be))

__0.0.70 / 2016-02-05__

- Add bash function `getArtifacts` to get nexus artifacts quickly ([2f0e9e2](https://github.com/aversini/envtools/commit/2f0e9e2acc8f3de067bf33b29ba2862aa60d1785))
- Removing Atom package atomatigit (not working very well) ([1f32f46](https://github.com/aversini/envtools/commit/1f32f460931667da84ee714617897ba61e1c4eb6))
- Adding project-manager to the list of Atom packages to be installed ([2914a1e](https://github.com/aversini/envtools/commit/2914a1efee5880ba0a6f176f2f4e2ef7e426690a))

__0.0.69 / 2016-02-04__

- Adding alias to fix icon association in Finder ([e13033b](https://github.com/aversini/envtools/commit/e13033b53db80988af6ef74438ad444a6d49ed29))
- Adding alias for testing HDD performance (hdd) ([327490e](https://github.com/aversini/envtools/commit/327490e68057657e90588f211ad667293a93ce04))

__0.0.68 / 2016-02-03__

- Oops, forgot vendor prefixes... who do I think I am.. ([bb5331a](https://github.com/aversini/envtools/commit/bb5331ab0200c7f673e1fac4e0bf10ec51ba58d1))

__0.0.67 / 2016-02-03__

- Even better logo via SVG ([ed42faf](https://github.com/aversini/envtools/commit/ed42fafe592ec43c452ecca6a72a8ce814ec9329))

__0.0.66 / 2016-02-03__

- Fixed header for the help page ([92cc77d](https://github.com/aversini/envtools/commit/92cc77d74cf47251d5b8e9d51f44b3fef26d0c36))
- Adding default .jsbeautifyrc file ([9a9f70f](https://github.com/aversini/envtools/commit/9a9f70fedd6379bac127cab8c6327b5a58f99a1e))

__0.0.65 / 2016-02-03__

- Ooops - fixing regression introduced by ESLint config - async.waterfall issue ([1aafe0a](https://github.com/aversini/envtools/commit/1aafe0af9a1404011e106ef7c4d3f98ad4ef6ea0))

__0.0.64 / 2016-02-03__

- Adding ESLint configuration to auto and manual ([5356b52](https://github.com/aversini/envtools/commit/5356b52a02161b193fa66e1230b29f5a3263a510))
- Trying to fix Atom package installation ([fde62ff](https://github.com/aversini/envtools/commit/fde62ff2e0667e7982231ed0195d45925d9b7fef))

__0.0.63 / 2016-02-02__

- Refactoring `gith` to access better tags info and removing useless sugar (git status really?!?) ([526d852](https://github.com/aversini/envtools/commit/526d852dae84a2b8441122e1df6f930327c8e5ee))

__0.0.62 / 2016-02-02__

- Adding 'new version available' to banner if there is one... ([acff94b](https://github.com/aversini/envtools/commit/acff94bb907dd53876aa9dafae896b53d3b6c079))

__0.0.61 / 2016-02-02__

- Adding isDirtyGit bash function to check if a local repo is clean ([e78bdc0](https://github.com/aversini/envtools/commit/e78bdc0a2fa53b8fb67579013f064dbc4c384089))

__0.0.60 / 2016-02-01__

- Fixing Araxis Merge ([fc2c302](https://github.com/aversini/envtools/commit/fc2c302da249968fd9a81a702cbb8eb14fdeaeef))

__0.0.59 / 2016-02-01__

- Reverting to Maven 3.2.5 (See PN-13533) ([72c4ffa](https://github.com/aversini/envtools/commit/72c4ffa6a100b652cf5b5288e8aba6e4dadc471c))

__0.0.58 / 2016-02-01__

- Removing heroku and status from gith ([38d9d82](https://github.com/aversini/envtools/commit/38d9d82a030e97dd0963e23c878f5c4f9dc69db2))
- Removing support for sublime proxy switch (was buggy) ([362e00d](https://github.com/aversini/envtools/commit/362e00de0af5de9a3074f70acf53929d66b993cf))
- Renaming options.bootstrap into options.auto for consistency ([2415f48](https://github.com/aversini/envtools/commit/2415f4844ad34b200a2971dba39bcb44d3b496d8))
- Adding 'svgo' to core npm packages and removing 'jshint' ([851801e](https://github.com/aversini/envtools/commit/851801e041bd49ded5b23acbd1ddeda4fa1d0811))

__0.0.57 / 2016-01-31__

- Resuming envtools auto after first time env/proxy setup ([a5c51a1](https://github.com/aversini/envtools/commit/a5c51a1871234557ec209113f1602a50b96b9bed))

__0.0.56 / 2016-01-31__

- Adding power charging sound ([9b4bf1b](https://github.com/aversini/envtools/commit/9b4bf1bbb5cb0e2fd2e12768ce614b8eafe41c59))
- Adding fix for Mac App Store ([d20fc7e](https://github.com/aversini/envtools/commit/d20fc7e30639453a091e2b5450729c04f98848bd))

__0.0.55 / 2016-01-31__

- Adding atomatigit to atom package list ([6079808](https://github.com/aversini/envtools/commit/6079808e253622d4401a61aa72f9920f3e2c6ee4))

__0.0.54 / 2016-01-31__

- Removing wrong notification ([d7a8974](https://github.com/aversini/envtools/commit/d7a8974c1dd2ad9bc7af1c134536db3974258ccb))

__0.0.53 / 2016-01-31__

- Missing file in the final npm package ([5ea41e2](https://github.com/aversini/envtools/commit/5ea41e2c1a3779a16d74febdbf2ca853844c2cc7))

__0.0.52 / 2016-01-31__

- Removing test from publish since there are no tests... so far.. ([75a90f1](https://github.com/aversini/envtools/commit/75a90f177a6fd99c8364ad0d4d6e737c9f795d1e))
- No need to artificially bump bash version since it's now part of "release" ([69a20f3](https://github.com/aversini/envtools/commit/69a20f3e901bb1fe30c8cacf06a955cb7bab2b1a))
- Removing old file ([9772a1d](https://github.com/aversini/envtools/commit/9772a1de3e3d8f5090f971648aca7c8e46caae0a))

__0.0.51 / 2016-01-31__

- Adding history to help file ([64ba2df](https://github.com/aversini/envtools/commit/64ba2df46102d9fc7ae4bd68defdb6e41479d10f))
- Better proxy fat finger filtering ([366d79b](https://github.com/aversini/envtools/commit/366d79b5cc3f60218144b1f3dea336847b40f0a9))
- Better error/message on proxy setting ([6f9d8fb](https://github.com/aversini/envtools/commit/6f9d8fb091f4ede5d33f2f8d0382fb0896c6fd83))

__0.0.50 / 2016-01-30__

- Better auto mode: do not ask for env or proxy if already set ([4114324](https://github.com/aversini/envtools/commit/4114324aa86d4fe5e489167eedf762445d44f8ac))

__0.0.49 / 2016-01-30__

- Better centralized messaging ([37a4777](https://github.com/aversini/envtools/commit/37a47779d482d715ad29e847db224b832a7edde4))
- Setting the proxy should not end the process ([e5e1472](https://github.com/aversini/envtools/commit/e5e14728a255636d7e221caa4e090f98bc769874))
- Setting fancy banner and prompt for auto mode ([8097d57](https://github.com/aversini/envtools/commit/8097d575979b5149da9389f6d088de4c6f0d30db))

__0.0.48 / 2016-01-30__

- Refactoring to handle auto/manual/extra requests more efficiently in the future ([d9dbdd0](https://github.com/aversini/envtools/commit/d9dbdd05c2612e739345ad0cc15922c6e43f667a))
- More Atom packages ([15bfb82](https://github.com/aversini/envtools/commit/15bfb8273f57e9331ab34947d8159c53c8439c57))
- Minifying help file ([cbd6d87](https://github.com/aversini/envtools/commit/cbd6d879e3d991d1fb8cac2c01261f2f7d2bf798))

__0.0.47 / 2016-01-29__

- Adding more essential Atom packages ([a8ec998](https://github.com/aversini/envtools/commit/a8ec9985469bafcc8576bec9568ab44844abc769))

__0.0.46 / 2016-01-29__

- Ooops, missing banner setup during auto ([4025bf5](https://github.com/aversini/envtools/commit/4025bf54ddbabdb5190eb5b306788ef1dbd44fa6))

__0.0.45 / 2016-01-29__

- Create runtime dir only if it doesnt exist (~/.envtools) ([6010694](https://github.com/aversini/envtools/commit/6010694a2527e9610790aa1637b1ffd3f32be694))
- Adding option to remove the welcome banner ([64d84c6](https://github.com/aversini/envtools/commit/64d84c67c64088dcf8f8fe71b8bd27661bc6e907))
- Adding http-proxy to Atom proxy helper ([1132fb1](https://github.com/aversini/envtools/commit/1132fb168aaa946c34f16092b907fe5528fb8d8d))
- Adding Atom packages ([c287f25](https://github.com/aversini/envtools/commit/c287f25d6b9b072cf6110741944729eed29e6c5f))
- Customization help - TBD ([fe01c6d](https://github.com/aversini/envtools/commit/fe01c6d2a7769e1abff4314a4ace5c72b6e7ef61))
- Adding Atom to the help intro ([deab837](https://github.com/aversini/envtools/commit/deab837222960a93f1b2c7e70db7c162f611968a))

__0.0.44 / 2016-01-28__

- Setting npm progess false by default (to speed up node v5+) ([94978c2](https://github.com/aversini/envtools/commit/94978c23fdeb440705e3dadcf29d79d4afb3df3c))
- Removing maven warning during bootstrap ([d40551e](https://github.com/aversini/envtools/commit/d40551e9b8b8750a111d2beef90ee0973289944f))

__0.0.43 / 2016-01-28__

- Adding envtools web ([ae83857](https://github.com/aversini/envtools/commit/ae838577e6dc91fa6318f0462ac08e11fdeb279f))

__0.0.42 / 2016-01-27__

- Adding small blurb about `fedtools extra` in the help file. ([ab824c5](https://github.com/aversini/envtools/commit/ab824c58c51b28e0cc3f019ca6f2b83aab7fba9a))
- Renamed help.md into aliases.md (cleaner...) ([74a0e05](https://github.com/aversini/envtools/commit/74a0e05f7905a9cb0e8090d6fd51dd8d210f6e8d))
- Updating git-ptompt to latest release ([41efaf5](https://github.com/aversini/envtools/commit/41efaf52e7f7f232aa06d169a918a750b8a9a4cf))
- Unused var ([b876b01](https://github.com/aversini/envtools/commit/b876b0126286e1ccdb71ba2944de0eb22583aed9))

__0.0.41 / 2016-01-27__

- Slighty better README/help ([1b8f06c](https://github.com/aversini/envtools/commit/1b8f06c4134112a0a2583243f0934d27158a17a4))
- Fixing "version" alias ([fe614b6](https://github.com/aversini/envtools/commit/fe614b691943cfa8fe8c3c116d628b936e5d8d6b))
- If boring is passed, do not ask for the changelog ([dad4341](https://github.com/aversini/envtools/commit/dad43415f44dce9f76151c15f76582bd956e6ca7))
- displayProxy should also reset the env if status is known ([81395a3](https://github.com/aversini/envtools/commit/81395a34dd8ba3498cbc6f78eb5909a3861d8d03))

__0.0.40 / 2016-01-26__

- Updating proxy setup for Atom ([359f266](https://github.com/aversini/envtools/commit/359f2668336b8c42010548c80a0e5a4dbc290cc2))
- Adding screensaver fix to extra options ([e446657](https://github.com/aversini/envtools/commit/e44665729fc63135bfed638c9de553d82feba1a8))
- Hidden option for extra ([268bad0](https://github.com/aversini/envtools/commit/268bad02ac3c1fd7fbf9858696a9083e84c1e561))
- Fixing backup dir to just day hour min ([a0a7ae5](https://github.com/aversini/envtools/commit/a0a7ae5e78fb44a747cb397c5441ffc0c2212138))

__0.0.39 / 2016-01-25__

- Fix check version process and display ([9765663](https://github.com/aversini/envtools/commit/97656631b1017da565981d7564544eb99f8c028f))

__0.0.38 / 2016-01-25__

- Display proxy should also update the prompt ([da22ebf](https://github.com/aversini/envtools/commit/da22ebff19874618c0b478b3ed7c14072ac5e316))

__0.0.37 / 2016-01-25__

- workaround mkdirp async issue ([65a065a](https://github.com/aversini/envtools/commit/65a065ae43d55cb1b9c03cb7804e7c24ad8d434b))

__0.0.36 / 2016-01-25__

- Fixing quicklook plugins - remove only the ones that are going to be installed ([84535d7](https://github.com/aversini/envtools/commit/84535d70f2e15b5ca7c24a9293d97952329493f8))
- Starting to add extra goodies (quicklook this time) ([ac3dce2](https://github.com/aversini/envtools/commit/ac3dce22f5f55d316c877abf37486f0aac76c963))

__0.0.35 / 2016-01-25__

- Help: adding warning about node and java ([36775dc](https://github.com/aversini/envtools/commit/36775dc223b12101863adc0641377669d258758d))

__0.0.34 / 2016-01-25__

- Better help ([25549c2](https://github.com/aversini/envtools/commit/25549c24bb1c2cb59c0ea8c9b065e0f9303cfe80))

__0.0.33 / 2016-01-24__

- Adding Envtools vesion to welcome banner ([9fdacf7](https://github.com/aversini/envtools/commit/9fdacf71859e4aad608a9b7a868566cc763fc494))
- Ignore error when setting proxy off and git config complains - it's ok ([133ee42](https://github.com/aversini/envtools/commit/133ee42d8b57b173f1d9c218b86518e023cb8cb5))
- Do not ask for Proxy confirmation if proxy is already set (in auto mode) ([b170a8e](https://github.com/aversini/envtools/commit/b170a8e074ff33d2df61419e768c55915fe8f1e4))

__0.0.32 / 2016-01-24__

- Wip on adding debug flag ([8d07061](https://github.com/aversini/envtools/commit/8d070615aa9201b41662f36864e5b046c1640171))
- Bypassing maven check if we just installed it before... ([3f39fb3](https://github.com/aversini/envtools/commit/3f39fb3d132b04c8b98c48288e326d1ad9da1527))
- Installing Compass should be silent in auto mode ([cd761e4](https://github.com/aversini/envtools/commit/cd761e41263eea06d6e1ea9f1eb920c7978ea3e9))
- Logging error message when failure to download maven ([b88ea39](https://github.com/aversini/envtools/commit/b88ea397fdc1efed33f40f97ca68f098dfbbffec))

__0.0.31 / 2016-01-24__

- Adding .hushlogin to prevent nasty welcome banner ([948e6f4](https://github.com/aversini/envtools/commit/948e6f48f9ff665083faefc66d6c9175122a2ae0))

__0.0.30 / 2016-01-24__

- Allow banner to be disabled ([34cbe81](https://github.com/aversini/envtools/commit/34cbe81e554503c40fecd588f609ed26aa3126c6))
- Still playing with the banner :) ([4edf307](https://github.com/aversini/envtools/commit/4edf307319c74f2303790d78f87483325a441a3e))

__0.0.29 / 2016-01-24__

- Playing with the welcome banner... ([7a5ba37](https://github.com/aversini/envtools/commit/7a5ba37e7ce5f8ba1fab54c5c9a7623daa1e1b10))

__0.0.28 / 2016-01-24__

- Display welcome banner via node ([6a77444](https://github.com/aversini/envtools/commit/6a77444842c520005c92ea023dffed63d76b0bf8))
- Better wording for ruby/compass installation ([1bdd467](https://github.com/aversini/envtools/commit/1bdd467973ee66e85d99d7a41779455326a2eecf))

__0.0.27 / 2016-01-24__

- Fixing async installation of ruby/compass ([6b1f9dd](https://github.com/aversini/envtools/commit/6b1f9dd6f0818c6f41f68a81955ea9747bf35455))

__0.0.26 / 2016-01-24__

- Better wording for restarting session needs ([c66d09c](https://github.com/aversini/envtools/commit/c66d09c3d4989b0dd86315a697801d7962a1e8a5))

__0.0.25 / 2016-01-24__

- Need to specifiy gem install dir (in case env is not setup yet) ([dbddc09](https://github.com/aversini/envtools/commit/dbddc09c79455fbe70448c224b65675ecfe6f90d))

__0.0.24 / 2016-01-24__

- Fixing brew installation (was not working since standard brew script is interactive) ([daf3735](https://github.com/aversini/envtools/commit/daf3735ed74813b717a8d9ba8745920c5f7bc7b6))
- Default to yellow command prompt when ssh'ing ([2c7c959](https://github.com/aversini/envtools/commit/2c7c959befd3ee7fb56f27fdd3bf337dd9b4c5be))

__0.0.23 / 2016-01-24__

- No async for array of commands.. ([4193dd2](https://github.com/aversini/envtools/commit/4193dd2cf1ce6f5d7903a62a10812a5e867c12ab))
- Adding shifter in core npm packages ([41b2b14](https://github.com/aversini/envtools/commit/41b2b14f5458d8847a2a9283c8129a58bdee4ac9))

__0.0.22 / 2016-01-23__

- Confirm Admin request for git only if not bootstrap mode ([53cfc4d](https://github.com/aversini/envtools/commit/53cfc4d5aaff318230a7d28ca5b69f71659d2aca))

__0.0.21 / 2016-01-23__

- Set gem path via brew only if brew is installed ([eea4fa4](https://github.com/aversini/envtools/commit/eea4fa429aaec4f4f9d4fe0d1500223b822aad0a))

__0.0.20 / 2016-01-23__

- If .profile doesnt exist, create it ([e19a797](https://github.com/aversini/envtools/commit/e19a7976fa4db1c6706f7d2320a8385ca2cc44f4))

__0.0.19 / 2016-01-23__

- Refactoring the prompt code to allow easier overridde ([91aa3ab](https://github.com/aversini/envtools/commit/91aa3abb39262a31f44ec91ae50b69b583e8bcc6))
- Moving custom functions/exports/aliases at the very end to make sure they can override anything ([3f9ce90](https://github.com/aversini/envtools/commit/3f9ce90da9204eff214e8e001a8f124a8ef2e82c))
- Better proxy set/unset with environment auto reload if needed ([75d0f0a](https://github.com/aversini/envtools/commit/75d0f0ae35c369232004deeea0f9080d6ad6c534))

__0.0.18 / 2016-01-23__

- Adding missing commit logs to npm package ([7fb60d3](https://github.com/aversini/envtools/commit/7fb60d393f838628f6c788f13fc7cbe932e26463))

__0.0.17 / 2016-01-23__

- Oops debug logs in prod.. ([026497b](https://github.com/aversini/envtools/commit/026497bf06659dc6a925de46a172f839d8ab15cc))

__0.0.16 / 2016-01-23__

- Oops missing rimraf dep ([8c4c6e1](https://github.com/aversini/envtools/commit/8c4c6e1c7df01476f8141feef5661b4e5fe04c53))

__0.0.15 / 2016-01-23__

- Oops, forgot to change the path to custom functions ([ff1b4aa](https://github.com/aversini/envtools/commit/ff1b4aa8809573b090dba51069115bcd0ac5a0b7))
- Adding enabling/disabling command prompt ([1b6977b](https://github.com/aversini/envtools/commit/1b6977baedf84eb8a566665575b80ced249875e2))
- ff ignores node_modules by default, but adding --rainbow to bypass ([6474c31](https://github.com/aversini/envtools/commit/6474c31a9388dce3f14f789799ecf3474226f614))
- Removing unused code ([e518eb0](https://github.com/aversini/envtools/commit/e518eb0de488cd4c9d6d8037b6e15841656adcb9))
- Fixing typos in help file ([f6e5c7f](https://github.com/aversini/envtools/commit/f6e5c7f4dfa2e08c83a3c1a40dbbd9987d38a884))

__0.0.14 / 2016-01-22__

- Adding fedtools step ([5ffb4b2](https://github.com/aversini/envtools/commit/5ffb4b24658655335e69ca80c60a1390ea253b6d))
- Adding usr local chown + m2 settings ([d46f34f](https://github.com/aversini/envtools/commit/d46f34f724b419c512c5346b72cd2d5cd60ad9b0))

__0.0.13 / 2016-01-21__

- Fixing async issue with mkdirp - too tired to investigate :/ ([c001564](https://github.com/aversini/envtools/commit/c001564e485783d0ef259b07463c18441c3a1d68))

__0.0.11 / 2016-01-21__

- Adding Maven installation ([07c382a](https://github.com/aversini/envtools/commit/07c382ad73c6d7f42118db865eeec01965f1fcfb))
- Adding aliases for desktop/download folders on mac ([8a7cab7](https://github.com/aversini/envtools/commit/8a7cab76b4e8c42563c2a67f3b2d00a7b9eeb854))
- Fixing invalid custom folder in help ([db0f69e](https://github.com/aversini/envtools/commit/db0f69e5a3e81245efbd57c3476945dc179f222a))
- Fixing display banner for linux (no help here) ([45ebf3d](https://github.com/aversini/envtools/commit/45ebf3de316221f4799ae8d0b50710979e7430f8))
- Adding missing ccc alias ([6f969c1](https://github.com/aversini/envtools/commit/6f969c111c9c20c7710d8610c2b23b603830d2c9))

__0.0.10 / 2016-01-21__

- Adding alias for help in mac ([bf8b742](https://github.com/aversini/envtools/commit/bf8b742fc0db661a0b78ba04ccb33073735886b4))
- Updating alias for Sublime ([a1538c5](https://github.com/aversini/envtools/commit/a1538c5a952e34e2112e570a74b2d7d2a253fbe9))
- Generating help.html ([a46a35d](https://github.com/aversini/envtools/commit/a46a35ded1d311b8d1df00efabf4ec96d045531d))
- Man pages: adding extra bit about customization ([cef6295](https://github.com/aversini/envtools/commit/cef629551c0f05e50e133fd6ea3bca367d6dc741))
- Better man pages ([35814d2](https://github.com/aversini/envtools/commit/35814d28fe3363ee883dd019bfdf01f3256f510d))

__0.0.9 / 2016-01-20__

- Fixing git bootstrap - forgot array of cmd would not be async... ([e9810f4](https://github.com/aversini/envtools/commit/e9810f446a17af8a4091427d99522ee3567f44f5))

__0.0.8 / 2016-01-20__

- Adding missing file at root level of npm package - not sure if this is going to work thouhg.. ([20bc08a](https://github.com/aversini/envtools/commit/20bc08a612f91e424e3316aa14120aeaca6b5193))
- Changing commands to 'auto' and 'manual' - makes more sense ([863cf0f](https://github.com/aversini/envtools/commit/863cf0f823a93a778993e2122d6ad26826644939))
- Better introduction + better verbiage on proxy ([3542e41](https://github.com/aversini/envtools/commit/3542e41bb6f1483e0192023b6b2826adf699fc9e))

__0.0.7 / 2016-01-20__

- Better handling of proxy setting (before and after) ([6c420f6](https://github.com/aversini/envtools/commit/6c420f6984216d1fe309d60af1578c4892fb7cb9))
- Do not ask for admin access in bootstrap mode ([5eeee4b](https://github.com/aversini/envtools/commit/5eeee4bc37d8dfe498d1656fb8205dc1f8a4e6e3))

__0.0.6 / 2016-01-20__

- Adding bash version file to grunt task ([abbcc3e](https://github.com/aversini/envtools/commit/abbcc3ebceb56708502ddbe8735bbebe9456679b))
- Fixing envtools logo... ([e9deb2f](https://github.com/aversini/envtools/commit/e9deb2f7d68dd476e0cd8a258463c175acfee2e7))

__0.0.5 / 2016-01-20__

- Fixing grunt tasks... ([8e64d3d](https://github.com/aversini/envtools/commit/8e64d3d3179104f8b89ca6237fe0723400d9567a))

__0.0.4 / 2016-01-20__

- Adding shell folder to npm distro ([54eef05](https://github.com/aversini/envtools/commit/54eef054b5383f04d211a28c778db1554720b474))

__0.0.3 / 2016-01-20__

- bad json bad! ([dc586fe](https://github.com/aversini/envtools/commit/dc586febd065c1c5b9712ed7fed312c834785973))
- posix package would not install on linux... ([0081be6](https://github.com/aversini/envtools/commit/0081be6ee1121c1a6b6416c0bc1a49e373d85ea0))

__0.0.0 / 2016-01-20__

- Adding empty test harness - for now ([03525a0](https://github.com/aversini/envtools/commit/03525a0e32687c5f95912821a6da1b5be44a748a))
- First commit after major refactor ([37d42a7](https://github.com/aversini/envtools/commit/37d42a73f4a46414ee005d228c07f6655c670dcf))
- update README ([be620b7](https://github.com/aversini/envtools/commit/be620b7fb5f1b1d2dbe78a3397cc4941ee662f63))
