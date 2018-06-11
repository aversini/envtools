
__2.0.11 / 2018-06-10__

- fix yarn installation ([cb02d7c](https://github.com/aversini/envtools/commit/cb02d7c70e40ec10619f6ba9c897c626a3bd6838))
- simplifying Yarn installation ([5b34476](https://github.com/aversini/envtools/commit/5b34476e5b811d4cb44b19c08ecf22e65459d865))
- removing a few Atom packages ([61198ec](https://github.com/aversini/envtools/commit/61198ec496b12af59bef579967dd462d83407acf))

__2.0.10 / 2018-05-29__

- fix: invalid Atom installer ([6ba2602](https://github.com/aversini/envtools/commit/6ba2602397678e9a88ed30e960f5e720cfaaf057))

__2.0.9 / 2018-05-25__

- update to latest Yarn (1.7.0) ([938078f](https://github.com/aversini/envtools/commit/938078f7198787fffe815495c8d4b40feabc4877))

__2.0.6 / 2018-05-07__

- feat: adding `envtools md2html` ([e6253a3](https://github.com/aversini/envtools/commit/e6253a365b58306eb41b195c0988530dde5db7b8))
- chore: update to latest Yarn (1.6.0) ([79e4c48](https://github.com/aversini/envtools/commit/79e4c48616d7c185b48d7110579ebebd971fed15))
- chore: updating Yarn to 1.5.1 ([79ddc9c](https://github.com/aversini/envtools/commit/79ddc9caa9cc1fe9796d97484e74ef015068a992))

__2.0.5 / 2018-02-22__

- chore: commiting built assets ([5adebaa](https://github.com/aversini/envtools/commit/5adebaa1e3d68442ee36b3e5fc30950c5911cd0f))
- fix: registry was not retreived correctly ([c1b8882](https://github.com/aversini/envtools/commit/c1b888264d6865b8ac2566dbda9f6c2803e87c86))
  - problem with execa promise and callback wrapper
  

__2.0.4 / 2018-02-21__

- fix: ignoring backup error if file does not exist ([fe63370](https://github.com/aversini/envtools/commit/fe63370aba2625412fc157645bbf98273c7e27a1))
- fix: replace Atom package react with language-babel ([4593ad6](https://github.com/aversini/envtools/commit/4593ad63e11e2b3b6ca0b9b255f28d5c98a2c3ab))
- fix: allowing VisualCode terminal to load Envtools ([fc224ab](https://github.com/aversini/envtools/commit/fc224ab8058e05e92a738e05f41e09fe102d0f8c))

__2.0.3 / 2018-01-25__

- fix: only display scope registry if it exists ([ff0b835](https://github.com/aversini/envtools/commit/ff0b83508a669e153579957855cb286d265686cd))

__2.0.2 / 2018-01-24__

- feat: adding scoped registry if any ([b950c72](https://github.com/aversini/envtools/commit/b950c7299f673c1ae179cfde877a8edfb8423e37))

__2.0.1 / 2018-01-21__

- refactor: moving test files for utilities under utilities ([13367a9](https://github.com/aversini/envtools/commit/13367a90f29844b86692cbfdb215fe0a77b7dc1d))
- chore: adding test + coverage for backup utility ([c75af8f](https://github.com/aversini/envtools/commit/c75af8f8d7091ca7106782cbea6d737017bd2c39))
- fix: typo in README ([b70cfde](https://github.com/aversini/envtools/commit/b70cfdedaf8ff1d1c5f05efcde76836231694d97))
- fix: installation of nvm over an existing one ([decfe58](https://github.com/aversini/envtools/commit/decfe581d4c9e11ab396047f39c7aeb3884997d1))
- refactor: minor update to remove lodash dep for getTemporaryDir ([ef72ad6](https://github.com/aversini/envtools/commit/ef72ad649ff4fab6c93a9aaef2dfdb2cca134efc))
- chore: full build ([a61392e](https://github.com/aversini/envtools/commit/a61392e9d157189ace3694aff7b5b034d7f2896e))
- docs: warning on deprecating node v4 in envtools v1 ([14f4097](https://github.com/aversini/envtools/commit/14f4097b38e66109dc0846e2e0c5fdce32901d52))
- chore: moving lint from travis to pretest ([455e6e1](https://github.com/aversini/envtools/commit/455e6e1ca1d3707c24412282c36b86024e8d2e2f))
- refactor: better cryptography + separation of concerns ([b14a43e](https://github.com/aversini/envtools/commit/b14a43e98e4eb727d2bdb02e601ac46f3662b76a))
  - utlities is only dealing with encrypting
  - handling files is not moved to the CLI
  - BREAKING: using better encryption with initialization vector, which means anything encrypted with envtools v1 will not be compatible with envtools v2.
  
- refactor: better prompts + password type ([f668283](https://github.com/aversini/envtools/commit/f66828326649c86c5af76d96bc6cf83531e27b13))
- refactor: moving prompts from common to utilities ([826f389](https://github.com/aversini/envtools/commit/826f389f22136cb3ac32452ce5b093120dd1a924))
- test: adding test+coverage for temporaryDir ([bf468df](https://github.com/aversini/envtools/commit/bf468df413f52b90b6d33b4198a4d2029bf8f9c1))
- chore: it worked, Travis will fail on tests or lint ([9605f19](https://github.com/aversini/envtools/commit/9605f19833a34db19898be5f40acf58bd5aa1f91))
- chore: trying to break lint on Travis ([61fbdf3](https://github.com/aversini/envtools/commit/61fbdf3c998365857c9a3577f28acd3c354c0e90))
- chore: trying to lint + test on Travis ([c0f3cfa](https://github.com/aversini/envtools/commit/c0f3cfa6fe1303fd2d2d37a7fd133b27c7c28889))
- feat: first pass at using Jest for tests ([2a54aad](https://github.com/aversini/envtools/commit/2a54aadbf447229ee1972b33a882be537e1cf358))
- chore: removing duplicate file (due to folder move) ([bb57ca8](https://github.com/aversini/envtools/commit/bb57ca85e61db809b11a0fff8ec08bc27b009175))
- refactor: moving backup.js to utilities folder ([2a045b3](https://github.com/aversini/envtools/commit/2a045b3627480addead248a576ac1f2e13379735))
- feat: upgrading nvm to latest (0.33.8) ([379ebca](https://github.com/aversini/envtools/commit/379ebcaffe6c137846ad4d8f6157c3b9af36093f))
- chore: trying to replace fedtool-utilities with own utilities ([b39d99a](https://github.com/aversini/envtools/commit/b39d99a9e3964bb0874ebc84f71af1616f038d61))
- refactor: move methods around + more async ([fd67dec](https://github.com/aversini/envtools/commit/fd67dec413cd2548f36a1dca51f34e344b458526))
- refactor: getInternalIp using async/await ([96f33ae](https://github.com/aversini/envtools/commit/96f33ae7e45c84dbaee345338a5ebe9d58b0c01c))
- chore: running prettier on all files ([06f8fef](https://github.com/aversini/envtools/commit/06f8feff7ae4344b4e3e106442a7a3df4b27b329))
- fix: extracting registry info from proxy in `envtools info` ([d833f6a](https://github.com/aversini/envtools/commit/d833f6a55fff7b19a88aaba47769b2eeda169c4b))
- fix: registry info should be a blue box (not yellow) ([db8da44](https://github.com/aversini/envtools/commit/db8da442d1c543b652789931786021c855406697))
- fix: build error because semver is not used anymore ([375505a](https://github.com/aversini/envtools/commit/375505abcf3ff289f324b779f013a5c4c5c269e3))
- chore: adding build script ([c47c5fd](https://github.com/aversini/envtools/commit/c47c5fd1e08ae33abcfbc0d839999f12806079fd))
- fix: moving compare (araxis) from src to shell ([2068ce6](https://github.com/aversini/envtools/commit/2068ce60cbc7e1c685961888a8848ffff455b93a))
- fix: moving third/json.js to shell/third since it for terminal ([a05f989](https://github.com/aversini/envtools/commit/a05f989d9ec9058d4f765f27f57eee0bc8d4c0b8))
- Update README.md ([727332c](https://github.com/aversini/envtools/commit/727332c4ceec9b7371796662a0a5e669ab3daafc))
- chore: removing support for sinopia ([13fbe67](https://github.com/aversini/envtools/commit/13fbe671a3a5f73cea48b59616c9f4a49c7ef9da))
- fix: removing ‘powerchime’ since it’s now default in Sierra ([59d47e6](https://github.com/aversini/envtools/commit/59d47e6e25d729d07a40da461130a32b0e0bd6a4))
- fix: re-enabling extra screen saver option in ‘extra’ ([f74bb58](https://github.com/aversini/envtools/commit/f74bb58388bf5433b3867210f8966adebd9186a7))
- fix: activating fuzzy profile was broken ([b2f387a](https://github.com/aversini/envtools/commit/b2f387a476e354f3040daae2d0d89f8b03ce68d2))
- feat: adding small alias for fast npmrc profile switch ([7e66b9a](https://github.com/aversini/envtools/commit/7e66b9a2dde0ffca1d686c76e0bdc0d0da95d033))
  Use `envtools registry` with a parameter:
  `envtools registry some-profile` and it will switch to that profile instead of showing the whole thing.
  
- docs: adding prefix [git] when asking q for git ([be5d7d4](https://github.com/aversini/envtools/commit/be5d7d46ac5824a95a774b21db7d1b798ffb0b10))
- chore: remove `watch` dep and use babel own watch ([8dbc045](https://github.com/aversini/envtools/commit/8dbc045dc6aefe3726d90a647b6d3853091dca1b))
- chore: trying `execa` instead of `fedtools-commands` ([07e64f3](https://github.com/aversini/envtools/commit/07e64f3c0f811849755d26517fe14b771923abaa))
- chore: bump inquirer to latest (breaking node v4) ([d9ed1fc](https://github.com/aversini/envtools/commit/d9ed1fc1a296953f20fa9aeed9b41f15262e67f7))
- chore: move source files from `lib` to `src` ([e6dd475](https://github.com/aversini/envtools/commit/e6dd475f9dbd6f0d97bb07c18f27fa8e677373f7))
- chore: adding watch (`yarn dev`) to build if files change ([9b95665](https://github.com/aversini/envtools/commit/9b95665bcb06246b3eb49400e9ede65eee01bcab))
- chore: fine tuning babel to target node >= 6 ([bd5ef94](https://github.com/aversini/envtools/commit/bd5ef94d8d2c747bea0ea981b5a0b0f7174c5fde))
- chore: adding build badge ([2a5375f](https://github.com/aversini/envtools/commit/2a5375fba8a64f1ad8c688729569457cecb50ff8))
- chore: adding travis configuration ([54ca919](https://github.com/aversini/envtools/commit/54ca9191f598bc505ab141d4fb4b9754905adda5))
- chore: bump version to 2 ([55890f2](https://github.com/aversini/envtools/commit/55890f2c3691b414f82ff46ea1d4268ce2f6db8d))
  breaking changes: not compatible with node < 6
  
- fix: manual lint fix ([cde47f5](https://github.com/aversini/envtools/commit/cde47f5f74e74d75103231082d895fe3efb80009))
- chore: let prettier do its thing ([51fab3c](https://github.com/aversini/envtools/commit/51fab3cf80e32392fc35c39e1c5e189342a82cde))
- chore: adding lint and prettier to scripts ([e6921dc](https://github.com/aversini/envtools/commit/e6921dc532b89e9a78b45a17597926f1e380151a))
- chore: using eslint config (versini sauce) ([2a993ed](https://github.com/aversini/envtools/commit/2a993edb0342d7171db1b7487df26611ebbd3fe0))
- feat: migrating to ES6 ([eed12f7](https://github.com/aversini/envtools/commit/eed12f712022b2b8b4f5b7d5059377f6cfed2115))
  - using babel compilation
  - raised support to only node 6 and higher
  
- doc: small typo ([634a6a1](https://github.com/aversini/envtools/commit/634a6a18c0486f4939f17706717a9f6b85803d53))

__1.0.59 / 2018-01-12__

- feat: adding fuzzy search to npm profile switch ([f4e7dc0](https://github.com/aversini/envtools/commit/f4e7dc078dd986a92106c09d7c54f23d9df3fd9c))
- chore: adding fuse.js to dependencies ([c2ffe91](https://github.com/aversini/envtools/commit/c2ffe917f876cee5fc803f60f577d0679256ade5))
- refactor: minor refactor for registry ([13ffa65](https://github.com/aversini/envtools/commit/13ffa65ccddea223ae3d2c23b64ce37e49077253))
  This is to get prepared to handle switching to fuzzy profiles
  
- Update README.md ([c513a24](https://github.com/aversini/envtools/commit/c513a242c085ff9fb56d2e48498fbb7d1825f90c))
- Update README.md ([802daed](https://github.com/aversini/envtools/commit/802daedb519b1e57b20ef02d8ada41644d9c038f))
- Update README.md ([3b45960](https://github.com/aversini/envtools/commit/3b4596048b8f529bae945c29f1889dba32474049))
- Update README.md ([87de72a](https://github.com/aversini/envtools/commit/87de72a091014000069e30aa32bf05cbd8538a92))
- Update README.md ([3eb3026](https://github.com/aversini/envtools/commit/3eb3026dbad5726e3157c84b3b38f57a5eb865a5))
- Update README.md ([c7fca24](https://github.com/aversini/envtools/commit/c7fca24a46a0773962f83c916eaff9c7f43784c3))
- Update README.md ([f611b20](https://github.com/aversini/envtools/commit/f611b208a18fc5ed77185498f9d65a1cfc0f0653))
- chore: moving badges down ([c0aa1cd](https://github.com/aversini/envtools/commit/c0aa1cd56a6e29f38f87ba02f2802a489e9614d8))
- chore: adding badges to README ([29afc66](https://github.com/aversini/envtools/commit/29afc66e798f7f0c930215a4fc053c0e041d09b8))
- chore: updating license date ([dbd4698](https://github.com/aversini/envtools/commit/dbd469856695c3e2c3b6a8c259bc82b10f1146b9))

__1.0.58 / 2018-01-09__

- fix: do not update npm/yarn registry in auto/manual anymore ([3af0bb1](https://github.com/aversini/envtools/commit/3af0bb1d5e5f6a2457393fb86b83bc194430242c))

__1.0.57 / 2018-01-06__

- feat: adding the option to create a profile if none exists ([6dbeb21](https://github.com/aversini/envtools/commit/6dbeb21d8e91b349b313e45dc5ce9022056531e2))

__1.0.56 / 2018-01-06__

- feat: adding npmrc profile management to ‘envtools registry’ ([61d7fe3](https://github.com/aversini/envtools/commit/61d7fe380e37c566e0f2f1263dd2aedab8c2c5ec))
  You can save the current npm/yarn configuration in a “profile” and re-activate any saved profiles on demand. Handy when having to switch from one public or local registry all the time.
  

__1.0.54 / 2018-01-01__

- Revert "chore: updating inquirer to latest and drop support for node < 6" ([0ec824e](https://github.com/aversini/envtools/commit/0ec824e46cc4ff9efcf27ba59e4347c7e384524d))
  This reverts commit f98be464b696d88ecef7e6099e05042cef2b5792.
  
- chore: updating inquirer to latest and drop support for node < 6 ([f98be46](https://github.com/aversini/envtools/commit/f98be464b696d88ecef7e6099e05042cef2b5792))
- fix: corrupted lock file ([1015727](https://github.com/aversini/envtools/commit/10157274deaf5a77ed83718789542a1023916576))
- refactor: taking advantage of async sub modules ([b9b786a](https://github.com/aversini/envtools/commit/b9b786acda9c953d858181965bef835dd039b2b9))
- chore: bump async to latest ([443af54](https://github.com/aversini/envtools/commit/443af5439a9d9005d370491edac2a2a9d5352d37))
- chore: upgrade to latest fs-extra ([885f660](https://github.com/aversini/envtools/commit/885f6605a5b3fd56bec77fa5665de3797ad3631e))
- fix: am / pm not displayed correctly on 'info' ([f4f4e7d](https://github.com/aversini/envtools/commit/f4f4e7d1ab54b897f25155d94d64313180be7818))
- chore: fix lint allignemnt error ([36eba64](https://github.com/aversini/envtools/commit/36eba6408ea78f767651aa55805e9f05b5021a6d))
- chore: update moment to latest (fix security issue) ([44536f4](https://github.com/aversini/envtools/commit/44536f4b443caa3639b2ac66383b4352e9f52f46))

__1.0.53 / 2017-11-14__

- fix: replacing shifter with serve ([2ef8a81](https://github.com/aversini/envtools/commit/2ef8a8167d3f913e6313bf588acc8865ad795977))
- fix: adding nvm option for linux ([c8a8313](https://github.com/aversini/envtools/commit/c8a8313f99b858c92ca66ef70fd59035ea076fed))
- fix: resetting prefix when using nvm ([9dd35a5](https://github.com/aversini/envtools/commit/9dd35a5a3728a5a75bd019ddf60ec587efdc5c73))

__1.0.52 / 2017-11-07__

- Update Yarn to 1.3.2 ([284559d](https://github.com/aversini/envtools/commit/284559dd8ecf0133bd24ada02a8c7f9c525efb5c))

__1.0.51 / 2017-10-26__

- Update Yarn to 1.2.1 ([ec69539](https://github.com/aversini/envtools/commit/ec695396e311f1e77eb458c810f90c7edef3fc58))

__1.0.50 / 2017-09-07__

- chore: updating to latest Yarn (1.0.1) ([2c02d27](https://github.com/aversini/envtools/commit/2c02d27c898b6f2361e9f621ccda945f5ec5d35e))
- chore: bump dev dependencies ([099a395](https://github.com/aversini/envtools/commit/099a39595be855c4237032494f624b8bea480e74))
- chore: bump semver dependencies ([49152c2](https://github.com/aversini/envtools/commit/49152c29f5012c2d6dd87ec0c93d7d2085cd4481))
- chore: bump moment and node-notifier dependencies ([d864e88](https://github.com/aversini/envtools/commit/d864e881f9e0fbb6a492e3857e7933920a999731))
- chore: bump macos-release dependencies ([b797cb0](https://github.com/aversini/envtools/commit/b797cb0b880920ec9ff4f4f34420f69ffa4ce6b8))
- chore: bump inquirer dependencies ([0470e27](https://github.com/aversini/envtools/commit/0470e279f5d344d697821ac1f4e9223f938a153f))
- chore: bump glob dependencies ([0e1e062](https://github.com/aversini/envtools/commit/0e1e0620897d8399c8e0c88c5f3673181e930c6c))
- chore: bump fs-extra dependencies ([24e6f3f](https://github.com/aversini/envtools/commit/24e6f3fbc1054d252b12aba9c5b3b0a2b1a1ff44))
- chore: bump download dependencies ([3ade1e5](https://github.com/aversini/envtools/commit/3ade1e529d7094802a33ca332b5701f02c4fc4fb))
- chore: bump decompress dependencies ([6c72ae2](https://github.com/aversini/envtools/commit/6c72ae2558bc42c9110cdad05172ef8bbd46e310))
- chore: bump async dependencies ([af10734](https://github.com/aversini/envtools/commit/af1073487f8a22c11be850b4e8c22510904a4c56))

__1.0.49 / 2017-07-23__

- Fix psf/netsf command in Zsh/Bash ([7243ba2](https://github.com/aversini/envtools/commit/7243ba2723b01aaf4f54d5d12bd32161d2a04e80))
- adding global yarn bin folder to PATH if it exists ([7c5465b](https://github.com/aversini/envtools/commit/7c5465b750b39e7042764f179db48ee929bcad48))
- Fix all conditionals to be POSIX compliant ([15a9bc3](https://github.com/aversini/envtools/commit/15a9bc31211ac073a67f9db44e775e4d9e663501))
- adding support for up/down history search in Zsh ([afbcd49](https://github.com/aversini/envtools/commit/afbcd491404d794bc1ec5d5a0229c2c7cfc854fc))
- Set prompt (even lite) on Bash only ([2ae8d8a](https://github.com/aversini/envtools/commit/2ae8d8a2ce9d73959543b13a26dc028b69058534))
- Fix clobber warning if Zsh ([3844f90](https://github.com/aversini/envtools/commit/3844f90f64bcc51a12a635671e44b22330985162))
- adding support for loading Envtools with Zsh ([70b0614](https://github.com/aversini/envtools/commit/70b0614939303a760110ee08652ebbcdb3d87d23))
- `confirm` should not echo anything besides questions ([fe7f67e](https://github.com/aversini/envtools/commit/fe7f67e30130b5d475a21018879387a2fa1eb33e))
- Updating default to "no" for proxy+registry ([5dcb333](https://github.com/aversini/envtools/commit/5dcb33366582afaa3c2444cf350b5ee63bec7bdd))
- removing auto-submit for `confirm` in Bash ([3e5b92d](https://github.com/aversini/envtools/commit/3e5b92d91e97d4b478e6501002f206104024825d))
- removing debug statement ([6a7532b](https://github.com/aversini/envtools/commit/6a7532b977c171303c684b2516748463f79f8d30))
- Fixing `confirm` for Zsh ([ff6b567](https://github.com/aversini/envtools/commit/ff6b567e9b41218815301ad95c826ad294458fcc))
- First pass at trying to support Zsh ([a4ba64f](https://github.com/aversini/envtools/commit/a4ba64fc5e887d72ad17c0ef7462f4eea352a7e3))

__1.0.48 / 2017-07-12__

- chore: allowing win7 64 bits ([57b1e40](https://github.com/aversini/envtools/commit/57b1e40cc608715b02458df45327c5d6824c0520))

__1.0.47 / 2017-07-08__

- chore: update dependencies ([0c33eaa](https://github.com/aversini/envtools/commit/0c33eaa9e74141fb8c32b69c78d5cdb4064f38bd))
- chore: updating to the latest Yarn (v0.27.5) ([6ae846c](https://github.com/aversini/envtools/commit/6ae846c81e03bb576966245d73762b98dedd92a9))
- chore: remove jsBeautify config (prefer local prettier + eslint) ([4c201e1](https://github.com/aversini/envtools/commit/4c201e15b9b6e841d6857448d670dba20d041484))
- chore: removing ESLint installation (prefer local) ([88a2e60](https://github.com/aversini/envtools/commit/88a2e60ae452248b9bf7d3f5a0bb6352d267fa5c))
- adding postcss language support for Atom ([6272d8e](https://github.com/aversini/envtools/commit/6272d8e0ab1cc3e25023f854c31d4975646d1317))

__1.0.46 / 2017-06-24__

- oops, not sure when this lil guy sneaked in! ([182afef](https://github.com/aversini/envtools/commit/182afefb97f6a8549ab87d04b247ec2066c54609))
- chore: better phrasing ([3ab22a9](https://github.com/aversini/envtools/commit/3ab22a902641851d1d7b5baf5912973c5fdb86ed))
- feat: adding support to set a custom registry via `reg` alias ([cb2f5eb](https://github.com/aversini/envtools/commit/cb2f5eb73bdd5e4c46f78aac7d19e935c0392b50))
- re-formating registry information ([6d08167](https://github.com/aversini/envtools/commit/6d0816723fc4aed554da90ba9f156c961a9f4b50))
- first pass at showing registry info ([4235fca](https://github.com/aversini/envtools/commit/4235fcaf5328fa0461d9a668916f90beb11967b8))

__1.0.45 / 2017-06-12__

- fix: do not override no_proxy if it's already set ([a8ebccc](https://github.com/aversini/envtools/commit/a8ebccce232fc4c65c4de3e3cc68b9d2b5a02eef))

__1.0.44 / 2017-06-11__

- adding npm and yarn registry data to `envtools info` ([9c54755](https://github.com/aversini/envtools/commit/9c547553da7484b9099611a795ea44ea8bc38aea))
- fix: even with CUSTOM_NPM_REGISTRY_PROXY=off, do not prevent removing proxies ([83c1281](https://github.com/aversini/envtools/commit/83c1281656dae6b30ca391cc56326c715dc28bae))

__1.0.43 / 2017-06-11__

- Atom: replacing pane-manager with layout-control ([3f0eb8c](https://github.com/aversini/envtools/commit/3f0eb8cdcbfb396fc32d09f14691eb8bc097f0dc))
- bumping nvm from 0.32.0 to [0.33.2](https://github.com/creationix/nvm/releases/tag/v0.33.2) ([e904056](https://github.com/aversini/envtools/commit/e90405606df4bd1a008338385eaecab394ce5444))

__1.0.40 / 2017-06-11__

- Adding support for setting a "special" npm registry via env ([207f6ec](https://github.com/aversini/envtools/commit/207f6ec80ff57e742f16ba07edbb5b2bedb9af45))
  - set CUSTOM_NPM_REGISTRY and it will be taken into account for both npm and yarn instead of the standard registries
  - set CUSTOM_NPM_REGISTRY_PROXY to off to prevent npm proxies from being set (in .npmrc), but still supporting proxies at the env and git level.
  
- Adding a few Atom packages (simple-panes, svg, prettier) ([19c47d2](https://github.com/aversini/envtools/commit/19c47d28dcebf9be1f8b2d130a8cdaacb0f3f5bb))

__1.0.39 / 2017-05-28__

- Bumping yarn to 0.25.3 ([815a94e](https://github.com/aversini/envtools/commit/815a94e9af174db481865934339057a477931a05))

__1.0.38 / 2017-05-20__

- Updating to latest yarn (0.25.2) ([5cbefab](https://github.com/aversini/envtools/commit/5cbefab11958625cdd3656291873256395c2f182))
- Adding minimap-linter to default atom packages ([9f82c69](https://github.com/aversini/envtools/commit/9f82c692775860d677f1025e8a642070720a3008))

__1.0.37 / 2017-04-28__

- Reverting to yarn 0.22.0 since 0.23.2 is breaking ([3a656c8](https://github.com/aversini/envtools/commit/3a656c8fd76a45a16494ba55085624e4ef5f3f77))
  - in 0.23.2 local install is broken
  - it’s fixed but not published yet: https://github.com/yarnpkg/yarn/commit/d54fff37dcf633db850f178a967e7df8120ae065
  
- Adding an extra option to install specifically install Yarn ([2d883f0](https://github.com/aversini/envtools/commit/2d883f02badc40508a05a6d6bfb100bed25ff5a5))
- Bump yarn to 0.22.0 ([e390849](https://github.com/aversini/envtools/commit/e390849fd92451185c7b255d1ba5977725907ff2))

__1.0.36 / 2017-03-22__

- Oops, fix detection for yarn ([609f3f8](https://github.com/aversini/envtools/commit/609f3f8dae48fa185002052c682325be44640552))

__1.0.35 / 2017-03-21__

- Not trying to install yarn on Windows… ([ef01f7d](https://github.com/aversini/envtools/commit/ef01f7d41da6e0c67a617a46e99924bb964a248f))
- Installing yarn automatically if not there ([c0f1610](https://github.com/aversini/envtools/commit/c0f16101872984c23c6511462a9b00e9d268c257))
- moving git alias “l” to mac only ([a7295ee](https://github.com/aversini/envtools/commit/a7295ee0c921a29941deaccffcf277c9cc0e74ef))

__1.0.34 / 2017-03-19__

- Updating atom linter package dependencies ([38b3f79](https://github.com/aversini/envtools/commit/38b3f79440987950d827ad081adf51532a362b05))
- Hacky way to detect terminal while in Atom... ([68c7475](https://github.com/aversini/envtools/commit/68c7475738a82421af751830ad6ca2bcaedaf592))

__1.0.33 / 2017-02-19__

- Fixing `fgrs` to allow number as a pattern to search ([e7f4c76](https://github.com/aversini/envtools/commit/e7f4c76dcf888a1ad9537511cfdf3fd465eeba70))

__1.0.32 / 2017-02-19__

- Relaxing eslint complexity rule ([bed770b](https://github.com/aversini/envtools/commit/bed770b13e2fccaf39abf5e71a4bf9d907d4365a))
- Replacing fedtools-notifier with node-notifier ([b29b53e](https://github.com/aversini/envtools/commit/b29b53ef5720caf3ba7ffbd477c403d024db8fb0))

__1.0.31 / 2017-02-14__

- Better phrasing between yarn and npm choice ([22f8663](https://github.com/aversini/envtools/commit/22f86634777e5d641e1a233baab89ed69c56f837))
- Before installing npm packages, set yarn configuration ([7afd541](https://github.com/aversini/envtools/commit/7afd541e7b1ff68bbfdffdc1fb6761a0f97382b0))

__1.0.30 / 2017-02-14__

- Better way to handle dependencies for node packages ([5c874b3](https://github.com/aversini/envtools/commit/5c874b36d370d49562d77e9bd9cb832a5da0d3d0))
- Adding split-diff to the list of nice atom plugins ([5eb6cb2](https://github.com/aversini/envtools/commit/5eb6cb2f66ad2c37c5579e809bb7d3cdd6270fb6))

__1.0.29 / 2017-02-09__

- Updating `envtools info` to include yarn ([aa43a47](https://github.com/aversini/envtools/commit/aa43a47dc8e5120bbfce8896e2f4150425450655))
- Updating warning about node v6 and proxy with yarn ([279757b](https://github.com/aversini/envtools/commit/279757be0f77fa11c847c72bf723dafd0c81a527))
- Using yarn instead of npm if it's installed ([b9dc644](https://github.com/aversini/envtools/commit/b9dc6444120f6f6b165dbf672952f64c1598638b))
  To disable this behavior even if yarn is installed, add the following to your $HOME/.fedtoolsrc file (json format, beware of commas):
  "yarnvsnpm": "npm"
  
- Adding yarn.lock ([d083872](https://github.com/aversini/envtools/commit/d0838723bd0358e1e39ecafc08e0591a7f74c377))
- Adding extra type of prompt (proxy, git and node) ([b01cfec](https://github.com/aversini/envtools/commit/b01cfec48059c1b3ebbfec9c24424bc8747db2cc))
- Better phrasing for github username ([4faa798](https://github.com/aversini/envtools/commit/4faa7987a167da0d1c9387c239f27989bea089f9))
- Bumping dependencies ([e4afd18](https://github.com/aversini/envtools/commit/e4afd18b66b5cd111bbe8c1d20263644fca81a92))

__1.0.28 / 2017-01-13__

- Better Atom packages installation procedure ([38fc724](https://github.com/aversini/envtools/commit/38fc7244285041e44d9724ad83e0969a599337b0))
- Adding/updating git aliases: ([4852a7a](https://github.com/aversini/envtools/commit/4852a7a1cfb1550bd93b4b65f4403e5d97256b36))
  `git st` has been improved to should a simpler `git status`
  `git l` is a new alias to show a better formatted `git log`
  
- Removing webpack from list of core node packages ([525cf90](https://github.com/aversini/envtools/commit/525cf90377bab8385775c8820c31174c8224e9e6))
  Rationale:  better to use webpack locally to each projects
  

__1.0.27 / 2017-01-08__

- adding terminal plugin to atom plugins list ([4c95928](https://github.com/aversini/envtools/commit/4c9592894184168a86e3e07f03970003ed59d2ba))
- Adding support for terminal within Atom ([dbacd5f](https://github.com/aversini/envtools/commit/dbacd5fa1326bf0b78c8b67e4347e7ec2db357ab))

__1.0.26 / 2017-01-07__

- Using new log API to center message ([c5a7679](https://github.com/aversini/envtools/commit/c5a76798e9948288308bfed9e58db4a6bc452ac4))
- Warning user if trying to run `auto` again ([b27cb4a](https://github.com/aversini/envtools/commit/b27cb4a5d81d2d47096cd15f1dffe22a5c4b85a6))
- Adding linter to project ([a7901ba](https://github.com/aversini/envtools/commit/a7901baf9adc52774bef7b7e2427890d622d86ec))

__1.0.25 / 2016-12-31__

- typo ([5e5edcf](https://github.com/aversini/envtools/commit/5e5edcfce205ffed412b0da3e74fc17987ef3ddc))
- ESLint: removing config installation in auto mode ([d86d86e](https://github.com/aversini/envtools/commit/d86d86e9a96c82af91f9b8b09e4e627c77195a03))
- ESLint: Better phrasing ([9df278c](https://github.com/aversini/envtools/commit/9df278c630cbb98554099f430abdbc7909e1bc7c))
- ESLint: tweaking react rules a bit ([76f3e3b](https://github.com/aversini/envtools/commit/76f3e3b1600d28ead55e040275f428840ee019a7))
- Adding atom react plugin ([2e405f4](https://github.com/aversini/envtools/commit/2e405f41f06e137c5090d90e2dc4f79fb95de0fd))
- ESLint: updating ES6 for module and adding React support ([963f6c3](https://github.com/aversini/envtools/commit/963f6c37052c02f48b0089096401522c94505d10))
- Adding extra ESLint plugins if ESLint is required ([8f8117a](https://github.com/aversini/envtools/commit/8f8117ae7a732834edcc17e9fa532e58e67beddb))

__1.0.24 / 2016-12-20__

- Changing help location ([652c6e5](https://github.com/aversini/envtools/commit/652c6e5100da93b6d3f0b3e55b6e6f73120cfea5))

__1.0.23 / 2016-12-06__

- Moving proxy before sudo-less for `envtools auto` ([27dedcb](https://github.com/aversini/envtools/commit/27dedcb225b564e62181712239642a102cc788ef))

__1.0.22 / 2016-12-06__

- First pass at removing help ([8771aa4](https://github.com/aversini/envtools/commit/8771aa423d156a325eb295bfe42e5c1f55d41553))
- [help] updating footer to link to github ([8d2c31b](https://github.com/aversini/envtools/commit/8d2c31ba34b8de73e0cc9eeefbb6c1144623c5ea))

__1.0.21 / 2016-12-03__

- [help] better quality pulsing dot while waiting on safari ([1116bbf](https://github.com/aversini/envtools/commit/1116bbf4b22239a9429ebf967e2cb2da9eb3bdd0))

__1.0.20 / 2016-12-02__

- Adding logo to README + License ([c7a91af](https://github.com/aversini/envtools/commit/c7a91af9ebc4d852528a0e754f78acfb84e109cd))
- Adding logo for README ([60e9161](https://github.com/aversini/envtools/commit/60e9161245674dc20323960a84091c4874be3408))
- Removing maven settings from repo ([7644a54](https://github.com/aversini/envtools/commit/7644a5453e2bbd29de675e7fb63615e62721cb9c))

__1.0.19 / 2016-12-02__

- [faq] adding ellipsis to long code line ([05df7b7](https://github.com/aversini/envtools/commit/05df7b78a93ae8951645ba215e4784b76d41aaa3))
- [help] adding a little animation on loading for slow connections ([cc7ef00](https://github.com/aversini/envtools/commit/cc7ef00230af18e163442b39de5dbbb22a405d10))
- Using full jQuery instead of slim ([483ef5c](https://github.com/aversini/envtools/commit/483ef5caa37df6c06eb07dc2cabb3a145af3c93a))
- [lite] ignore `df` access denied messages ([be90c62](https://github.com/aversini/envtools/commit/be90c621ed25dfe253c88f69a288f1d688a5fbec))
- Fixing bash return (-1 is not a valid error on some distro) ([0e3dbae](https://github.com/aversini/envtools/commit/0e3dbaef026b60fcebc59eeb76cf79785c6a2f47))

__1.0.18 / 2016-12-01__

- [help] reducing logo real-estate on lower breakpoints ([2e99afc](https://github.com/aversini/envtools/commit/2e99afca584693784f28b869b101a181cb3d3ca0))
- [help] adding proxy to the `envtools info` section ([dba477b](https://github.com/aversini/envtools/commit/dba477b890469da039a14cfd81166b8e57d4716d))

__1.0.17 / 2016-11-30__

- [info] adding detailed proxy info to `envtools info` ([f364044](https://github.com/aversini/envtools/commit/f36404400b36b98abdea3267cb83e88d578d8513))
- [new] adding a simple SMTP server `envtools smtp` ([471ca8d](https://github.com/aversini/envtools/commit/471ca8de167891e705366e4e5c0a78f42d8d5b56))
- [fix] do not re-append paths to $PATH on soft reload ([6237ebb](https://github.com/aversini/envtools/commit/6237ebbc4d39820b8dbbe32c43d155f48f406d1b))
- [help] moving image responsiveness to higher breakpoint ([eb02f60](https://github.com/aversini/envtools/commit/eb02f60dab6737fa40b44ddebda87cbd73c0cfaa))

__1.0.16 / 2016-11-29__

- Refactoring yellow/cyan output ([777c6f4](https://github.com/aversini/envtools/commit/777c6f4e4dbef482a2109596c0d439ab56955603))
- [help] responsive all the way to 320 ([25790f0](https://github.com/aversini/envtools/commit/25790f049b51334345b37e81a626e4ecb28a9cfd))
- Change default box color from yellow to cyan ([4f94084](https://github.com/aversini/envtools/commit/4f940847143459d8530d38859efc8a4b24f75962))

__1.0.15 / 2016-11-29__

- Updating custom terminal colors to match iTerm more closely ([c412c4f](https://github.com/aversini/envtools/commit/c412c4f5d76b619259f625077ae6fd1cbcb9e9bf))
- Fixing version up-to-date message appearing unexpected ([1856df5](https://github.com/aversini/envtools/commit/1856df5a6a3e7b36ab0e08f44d075952e8975197))

__1.0.14 / 2016-11-28__

- Better blue for the logo (matches the <headers>) ([f16d260](https://github.com/aversini/envtools/commit/f16d260aea8f3141d06ff4e769c2acabfd9ff901))

__1.0.13 / 2016-11-28__

- [faq] adding entry about git status in the prompt ([8bbe2c8](https://github.com/aversini/envtools/commit/8bbe2c8c1521fdc8de4a602d14178ac57610bdb2))

__1.0.12 / 2016-11-28__

- Flatter logo ([fc3e967](https://github.com/aversini/envtools/commit/fc3e967666426965714d57c3ae0f5c6454b131e1))

__1.0.11 / 2016-11-27__

- updating logo ([42208be](https://github.com/aversini/envtools/commit/42208bee0a50f738827dfb33818d32ac178a022e))

__1.0.10 / 2016-11-27__

- [eslint] more precise rule for 'one-var' (var/let/const) ([4b4993a](https://github.com/aversini/envtools/commit/4b4993a1e0cd1c089f73dbcdd0f97cd13679989e))
- Getting rid of commander dependency ([baa4442](https://github.com/aversini/envtools/commit/baa4442ef54121600559456b74515cdbf726f521))
- [sudo] adding correct branding (envtools vs fedtools) ([5bb1717](https://github.com/aversini/envtools/commit/5bb1717b39194a96c30f8d5238cd66db66feb269))
- Fix scenario when version has not been checked yet ([58bc7a6](https://github.com/aversini/envtools/commit/58bc7a651c46a8ac2db40421ad834e4c94c82a2c))

__1.0.9 / 2016-11-25__

- [fix] custom prompt was not set anymore when in auto mode ([f640676](https://github.com/aversini/envtools/commit/f6406765731397c2e21a10190c75c9fc82bdd95a))

__1.0.8 / 2016-11-25__

- No need to be cheap on the actual words ([7a67c20](https://github.com/aversini/envtools/commit/7a67c20fbdd31e8af97acb92e74ed603dbb2993f))
- Displaying update information after simple call (no commands or help) ([288d497](https://github.com/aversini/envtools/commit/288d497e1a5d66770e59a429cfd5c41dd5e14d2b))
- Add update information - if any - after manual/extra/auto ([602aafc](https://github.com/aversini/envtools/commit/602aafcbca4324ee7844e67b96840bc768092082))
- Removing node banner and adding `envtools update` ([dbf3444](https://github.com/aversini/envtools/commit/dbf3444c1c3461db03ff4331e03ebb0cc36ab75a))
- Moving banner from node to bash (perf gain 750ms load time) ([e7f6a9d](https://github.com/aversini/envtools/commit/e7f6a9d456182be345ea763c4c0160b48dd52c4d))
- [debug] adding timing and/or profiling options ([a81399d](https://github.com/aversini/envtools/commit/a81399debb57e9cc6fd518509a22abfa0a9f6fbc))
- [debug] adding some internal profiling options ([a7d7513](https://github.com/aversini/envtools/commit/a7d7513785f9201ad1cf9d7ecb43349da84b0400))
- [fix] do not show error if java is not installed on mac ([8534d7b](https://github.com/aversini/envtools/commit/8534d7b94728daf92ce4993ed5216da7be39e2b7))

__1.0.7 / 2016-11-23__

- [fix] sometimes prompt type could be lost ([908f628](https://github.com/aversini/envtools/commit/908f628a16bd0bac843f5be293d0a0173d9910b0))
- Adding option to check for update in `auto` mode ([7e757c4](https://github.com/aversini/envtools/commit/7e757c4421f5ca8f41379dfaf4494af413fd6605))
- Adding hidden `--force` option to `envtools info` to force refresh ([00f280b](https://github.com/aversini/envtools/commit/00f280b286deec6fe17fa9c0c9b1b17fd68e66c2))
- [git] moving diff tool option to mac only ([91ec864](https://github.com/aversini/envtools/commit/91ec8640bc0a1abf55b240780faaa6fd8abdc6e4))
- [help] more a11y recommendations (better links) ([9287957](https://github.com/aversini/envtools/commit/9287957dc0d3a49cbe5acd3402ea0ad3bd46823b))
- [help] a11y remediation ([6f18742](https://github.com/aversini/envtools/commit/6f18742e72e501c9d5e65e3b12b3a4debf9d4e80))
- [faq] more subtle icon search ([6833889](https://github.com/aversini/envtools/commit/6833889d6a93276d3d0d6513adfc30ffa2fb2438))
- [faq] removing lunr stemmer to increase search results scoring ([f11851e](https://github.com/aversini/envtools/commit/f11851e28084ae11a2ea4d735cdd22ab0cc6c0a5))
- [help] refactoring help generation ([4ad6f9d](https://github.com/aversini/envtools/commit/4ad6f9d4245268fb4e7c4c7004bc5a6f68d96898))
- [faq] adding search icon in search field ([03a411f](https://github.com/aversini/envtools/commit/03a411f299f18e72ea893a500eb71860a569b3ef))

__1.0.6 / 2016-11-22__

- add comment about try/catch for info ([ccad9f4](https://github.com/aversini/envtools/commit/ccad9f4f7be9081cb891d2297d8334f7cf1ebfa7))
- [info] refactoring to speed up results a little ([1e8621e](https://github.com/aversini/envtools/commit/1e8621e8814fe5a5de9c43c68d33c1a044bc0f01))
- Adding `isLinux` to common API ([c52f597](https://github.com/aversini/envtools/commit/c52f5978939012ca417062e575b2694c88be1f46))
- Adding envtools info to envtools lite ([67e4755](https://github.com/aversini/envtools/commit/67e4755d0f93d66d99a1ed781575fbbb8deb20c2))
- [info] refactoring local ip gathering ([3edca5c](https://github.com/aversini/envtools/commit/3edca5c334fbece5caabc2d331032a57a94455d5))
- [info] fixing local ip detection ([a56e639](https://github.com/aversini/envtools/commit/a56e639d936206df7caff1948ef139a78a8eb191))
- Adding stric-ssl=false option to both npm and apm ([96b399c](https://github.com/aversini/envtools/commit/96b399c7d11ecbb043367fb8260e6a6e89a8ec79))
- [info] adding clue about next update ([029769c](https://github.com/aversini/envtools/commit/029769c27b1afc4027af998a8ea78a8a75d8b7f2))

__1.0.5 / 2016-11-21__

- [info] forcing cache expiration if user asked for publicIp ([92573be](https://github.com/aversini/envtools/commit/92573be4243cc66f8050a61d1275a138ee8a2d3e))

__1.0.4 / 2016-11-21__

- [info] adding flags for all data points, publicIp OFF by default ([0a7e3f6](https://github.com/aversini/envtools/commit/0a7e3f690cedb8734e0fdaa4eb045eef79c7c0bb))
- adding `info` to envtools help ([2d566ce](https://github.com/aversini/envtools/commit/2d566cef479a9a0d7102773ac5c683c0bb1e92b9))
- [info] better filesystem info ([95ccc64](https://github.com/aversini/envtools/commit/95ccc64f00630b709af8bae12aff5ef0c2bd8317))

__1.0.3 / 2016-11-20__

- [help] updating info screenshot ([1d7a0ed](https://github.com/aversini/envtools/commit/1d7a0eddc0d98ec79c562334a25533df87b20b7e))
- [info] adding OS name + version (for mac) ([aca3991](https://github.com/aversini/envtools/commit/aca39910d638c4b3cded434e5831fe56093b57bc))
- [info] adding load average ([4cbdb36](https://github.com/aversini/envtools/commit/4cbdb364bf41fabb97cb19e485d75a14390d2322))
- [info] simplifying ruby version + removing java home ([251b351](https://github.com/aversini/envtools/commit/251b3513e70195aab2a3031da68ce710cbbf8cf4))
- [info] adding ruby + better versions formatting ([922a7a3](https://github.com/aversini/envtools/commit/922a7a356be8aa7d22b1597adc88d70215274398))
- [info + fix] try to detect JAVA_HOME on Windows ([dfbc957](https://github.com/aversini/envtools/commit/dfbc957fb942a51d52186e28f450313c81c01a60))
- [info] adding maven and java versions + locations ([6fcf02f](https://github.com/aversini/envtools/commit/6fcf02f12c0933a8f918f6212f433c7c7e63a68d))

__1.0.2 / 2016-11-20__

- [info] adding help ([b514648](https://github.com/aversini/envtools/commit/b5146481fc03de1fbb417925ac4889e3091febfe))
- [info] better display ([b201cd3](https://github.com/aversini/envtools/commit/b201cd30975ae78f78573effd1651dc18fab79ed))
- [fix] ignore ping timeout when behind proxy ([a77c39f](https://github.com/aversini/envtools/commit/a77c39f2504e9aa4c8e5fde3c42613e3cdff2681))
- [info] refactor + adding public ip ([87875f3](https://github.com/aversini/envtools/commit/87875f305aeebc6be658ee989b232f936a7025ac))
- [info] total memory limit to 2 digits ([bf01e3e](https://github.com/aversini/envtools/commit/bf01e3e1cba607e50c335393d9e5f1ff03fd15c3))
- [info] first pass at gathering system info ([d7d8f03](https://github.com/aversini/envtools/commit/d7d8f03ea43930a5531e8bda90ea9fc5e0a81afb))
- [fix] removing unused dependency ([70a68b6](https://github.com/aversini/envtools/commit/70a68b63a6d929a883ddd764c772e56cdbdb8543))
- [help] removing bootstrap source maps ([abe2b0d](https://github.com/aversini/envtools/commit/abe2b0d0f9e6dbcd4817598fd5d439123965c0b5))

__1.0.1 / 2016-11-18__

- Bumping to version 1.0.0 ([62c7a70](https://github.com/aversini/envtools/commit/62c7a701b098e80e947a6f00962a65eb36a89c20))
- [help] adding favicon :/ ([855a516](https://github.com/aversini/envtools/commit/855a516afc1f516c52efea5bfcf363315b54bc2c))
- [help] refactoring + adding expand/collapse TOC ([92e7fc7](https://github.com/aversini/envtools/commit/92e7fc73b5792ff1d8e0889c1194a2aa1588dabb))
- adding option to change npm prefix is destination folder is not writable ([5bee4a1](https://github.com/aversini/envtools/commit/5bee4a1ea08a65396a8dae0611a0c2082aa5bdb6))

__0.0.171 / 2016-11-18__

- Fix post publish task (no more committing built js/css files) ([ad9bef2](https://github.com/aversini/envtools/commit/ad9bef26880b46f641a1026bc53fec49c10bbe09))

__0.0.170 / 2016-11-18__

- [npm] Ignoring assets and templates ([b364eb6](https://github.com/aversini/envtools/commit/b364eb60da9c7cf6732a6d0140f8b0893a45d43e))
- [help] different inlining approach + getting rid of bootstrap glyphicons ([4e46185](https://github.com/aversini/envtools/commit/4e46185d87730f18a046468f0b4a874bda0b1f3a))
- [help] adding timeout to kill help server if too slow to stop ([30a9b46](https://github.com/aversini/envtools/commit/30a9b46259bca098d8a595bc1d395c164f02717e))
- [help] kill TOC highlight when navigating to another tab ([f20bb33](https://github.com/aversini/envtools/commit/f20bb33481f5e53898a8d663e961c792bc9a56f5))
- [help] inlining most assets ([a0de121](https://github.com/aversini/envtools/commit/a0de12158c6086ec3e13adf0e4c8d3c52969b2fb))
- [help] updating footer ([ab105ea](https://github.com/aversini/envtools/commit/ab105ea9a00289a242c2343c7fb58f7221a574f0))
- [faq] new entry: load envtools automatically explanation ([8b619a3](https://github.com/aversini/envtools/commit/8b619a3563b496860ac5e1a404dd0a712ed13a65))
- [faq] hiding the TOC if using the search bar ([a53ba75](https://github.com/aversini/envtools/commit/a53ba755f98d877f77a30d86e6c82920b167fe0f))
- [help] adding introduction to alias page ([78c8283](https://github.com/aversini/envtools/commit/78c8283ee1ea37601b4728467e89085678f6e012))
- [help] adding explanation for 'check for update' option ([28d6cd2](https://github.com/aversini/envtools/commit/28d6cd22f9fd522c611bcd42f4d417a204a79ddd))
- [faq] adding TOC and highlight ([b53290b](https://github.com/aversini/envtools/commit/b53290bb01efce816eac4eb14d06627ba78067e2))
- [faq] change link for js beautify options ([089fcc6](https://github.com/aversini/envtools/commit/089fcc6fcdf41733e880902f4ccf1eb37df227ef))

__0.0.169 / 2016-11-17__

- [faq] adding entries for backup and screensaver ([418894b](https://github.com/aversini/envtools/commit/418894b09ea1d36da8a38a4793100cf37725e9f5))
- [faq] fixing highlight on multiple keywords ([5717673](https://github.com/aversini/envtools/commit/57176738700349ef1590dba5a4cba153c0951328))
- Fix menu alignment for npm packages list ([53718cb](https://github.com/aversini/envtools/commit/53718cb735a9081bd30be1a5eaffd86514f83736))

__0.0.168 / 2016-11-17__

- [faq] adding nvm entries ([9fcc425](https://github.com/aversini/envtools/commit/9fcc4255553f61e4e158b603feb6f0c9164e6420))
- Better wording on Atom packages option ([b52caf5](https://github.com/aversini/envtools/commit/b52caf5c5e81d4fb695e7aaaf8397a1549dda748))
- [faq] adding sinopia entry ([b17fe22](https://github.com/aversini/envtools/commit/b17fe229d0148f387502bdaaa27d06308c71cc60))
- [faq] typo ([b43b910](https://github.com/aversini/envtools/commit/b43b910769db79f7aef3acb959982df746b08162))
- [faq] adding entries for jsBeautify and core node packages ([fc2cdc0](https://github.com/aversini/envtools/commit/fc2cdc093319fc9ed6ce8215cffd022886759566))
- [faq] removing html tags from search index ([0be241d](https://github.com/aversini/envtools/commit/0be241de6f809598bf9412f18b092053258ee9f8))
- Better sds output ([42a7d1d](https://github.com/aversini/envtools/commit/42a7d1dba47a87d01c1dbebc5f6d54d75ad9432b))

__0.0.167 / 2016-11-16__

- [faq] adding highlighting ([433aca0](https://github.com/aversini/envtools/commit/433aca04b748a4c6d42416c47d89a8880502654f))
- [faq] more actual content ([4259b6e](https://github.com/aversini/envtools/commit/4259b6e205395d7d6a0b17bc9e71eadffe2194e1))
- [faq] adding support for tags ([bbc9ba9](https://github.com/aversini/envtools/commit/bbc9ba9ea2f4ba3afdfc90cddeb88abab7cf3cbc))
- [faq] changing header titles ([091bedf](https://github.com/aversini/envtools/commit/091bedfe8de674907d4dc87dd601603d705bb46d))
- Making sure that faqs.id are present and not duplicated ([21741d1](https://github.com/aversini/envtools/commit/21741d1609d556a4306189603bea4dfd00e34a61))
- First commit for FAQ ([e2dde19](https://github.com/aversini/envtools/commit/e2dde19354858502d4c8b2ecae5e97b5d956a6d3))
  - adding lunr.js to support search within the FAQ
  - adding extra FAQ tab to help page
  - first FAQ entry (custom prompt)
  

__0.0.166 / 2016-11-16__

- Adding sds ([1b6848d](https://github.com/aversini/envtools/commit/1b6848da28da9c82ffa1827f6f214c628bb7ae9d))
- Fix `fedtools config` that got broken by the previous configuration optimization ([f7ab45e](https://github.com/aversini/envtools/commit/f7ab45e5d1bf351909fc71840495e9565ed99837))
- [help] fading bottom part of header ([ddcc317](https://github.com/aversini/envtools/commit/ddcc317782ebe83101277b946c7faf830fb63b1a))

__0.0.165 / 2016-11-14__

- Allowing proxy to be entered full ([69ab957](https://github.com/aversini/envtools/commit/69ab9573a0477431ba7be17ea83378000c72226f))
- Adding proxy url to `pq` ([08910f6](https://github.com/aversini/envtools/commit/08910f6b519788adb1be5779cf8ab1df5282b00a))
- Removing smart proxy detection ([70becfb](https://github.com/aversini/envtools/commit/70becfb74e9924abdfcc020e7e3a2401b07b25b0))
- [eslint] fixing `envtools auto` mode ([b05f0eb](https://github.com/aversini/envtools/commit/b05f0eb2789f0ae742548747d33976f43e449e9c))
- Do not crash if the configuration file is empty... ([5dd06f2](https://github.com/aversini/envtools/commit/5dd06f26a0bd56f4c8885987c92802c21c1b3b90))
- Better `envtools config` ([cafbce8](https://github.com/aversini/envtools/commit/cafbce81cfbd3bcfa5cb39eaad024284747638a1))
- [envtools config] adding option to ask for version check ([3039783](https://github.com/aversini/envtools/commit/3039783c14092c083522bb0c7bd7620fde3a44b6))
- Fixing `envtools lite` for freaking Windows ([5a706e3](https://github.com/aversini/envtools/commit/5a706e3363fa26833f2abb4f2ed27dc4f6e7c5bc))

__0.0.164 / 2016-11-12__

- Optimizing `ff` for windows ([5318431](https://github.com/aversini/envtools/commit/5318431de040e5490dfb7e0509b22e619eb6287a))
- Removing posix dependency ([316d778](https://github.com/aversini/envtools/commit/316d77887870f13d646fea4eb4dded664aa8b80d))
- [eslint] removing js formating (only json will be supported by envtools) ([3d82e16](https://github.com/aversini/envtools/commit/3d82e1622eecb6b7a2312f6046512fc5491fd9b9))
- [eslint] revert es6 coding since node v4 is not supporting it perfectly.. ([b1d63eb](https://github.com/aversini/envtools/commit/b1d63eb75ea509efa89364b44d4bd70be81a62e4))
- Revert using 'let'... to continue to support node 4 ([fc6d598](https://github.com/aversini/envtools/commit/fc6d598297e256a22357e4b81a071845d8deb52e))
- [eslint] reverting switch case indent requirement ([f9b0294](https://github.com/aversini/envtools/commit/f9b0294ee1a284ff0ed27447981dbc00d20feb89))
- [eslint] small typo ([d1dd747](https://github.com/aversini/envtools/commit/d1dd747cb14a4300607882b7f8548babf1d49aa4))
- [eslint] complete rewrite ([8961b09](https://github.com/aversini/envtools/commit/8961b0994e5ff2cf27df79822db11652057db73f))
- [eslint] only style.js left ([59c6660](https://github.com/aversini/envtools/commit/59c6660c8ab20fb590b1ce9fdbb3935b86a2a500))
- Better ESLint configuration options ([1cf9f36](https://github.com/aversini/envtools/commit/1cf9f366e5ca7d66cbc7df779d2a1cbf0ebddcea))
- Removing duplicate routing for 'config' ([068c8eb](https://github.com/aversini/envtools/commit/068c8ebc04675ce510a6ce5ae083f8fa2da552ef))

__0.0.163 / 2016-11-08__

- Adding extra option to git to not fail in case of ssl certificate issue ([b0c4272](https://github.com/aversini/envtools/commit/b0c42728e3e1f947570c9d37845fd1981e25399d))
- [win] update dir-colors for windows terminals ([aca1b30](https://github.com/aversini/envtools/commit/aca1b3068dc2ce90b732e33fbce52694497301ab))
- [help] removing some introduction data when not applicable ([ba617d3](https://github.com/aversini/envtools/commit/ba617d3ed4a0dd9e1afc573443b83c12d84c6e41))
- Adding proxy info when starting sinopia ([cf1b9f1](https://github.com/aversini/envtools/commit/cf1b9f140acbf07b35b6fe4aa0c26dcb03969bc5))
- Do not run npm commands if npm is not installed ([66888c6](https://github.com/aversini/envtools/commit/66888c6182941f1fdef61fe19c915a6eea0fcc30))

__0.0.162 / 2016-11-07__

- Do not run git commands/prompt if git is not installed ([9be15cd](https://github.com/aversini/envtools/commit/9be15cd059f460edf50453ca1793b0c0788b3be8))

__0.0.161 / 2016-11-07__

- Adding git-completion support ([fd2d9b0](https://github.com/aversini/envtools/commit/fd2d9b005b6133bd9990e37e01d35e964e917553))
- Bumping grunt-import to latest version ([bec44bf](https://github.com/aversini/envtools/commit/bec44bf7bc68a1451f16234052efb0ab6eb49fe5))
- bumping to fs-extra latest release ([16c8caa](https://github.com/aversini/envtools/commit/16c8caa2f585118538135907e00e6c7d59448b32))
- Getting rid of old dev dependency ([0c76f19](https://github.com/aversini/envtools/commit/0c76f19e296dc5b9128ab741b3c3b911f41bb4de))

__0.0.160 / 2016-11-06__

- [build] re-enabling push (should be all fine now) ([b7f6e96](https://github.com/aversini/envtools/commit/b7f6e96320d1b8e6b7a9d3df65a569c3030616b9))
- [build] fixing callback hell ([d9a02ef](https://github.com/aversini/envtools/commit/d9a02ef563ed31e0c7d898ae5bd346f36c560e87))
- [build] deactivating push for a test run ([955dfd8](https://github.com/aversini/envtools/commit/955dfd8a5419aed30596a63f04a1b4f478a95300))
- [build] adding all before and after custom tasks ([4d259bb](https://github.com/aversini/envtools/commit/4d259bbc43c4f92c8bbe5d52320b4270dfafcc0c))
- [build] complete rewrite of publish process ([11c4878](https://github.com/aversini/envtools/commit/11c4878be2b00b63d1c9f75cc2b5737f7ba378b9))
- Still trying to fix the build, after push maybe? ([d3adf03](https://github.com/aversini/envtools/commit/d3adf036b37db013806668fe6d6def42c842c625))
- logging version to grunt bash task ([518228b](https://github.com/aversini/envtools/commit/518228b271199b9b76e3917cd05ed468ff3c0035))
- updating the middle-release grunt task to not push ([6e86d70](https://github.com/aversini/envtools/commit/6e86d7099e0f1f90937a866daba6589d357289d3))

__0.0.159 / 2016-11-05__

- Trying to re-fix the build process... ([d6c25db](https://github.com/aversini/envtools/commit/d6c25db015b72b0e7f984b0ba28760e042cdeae4))

__0.0.158 / 2016-11-05__

- [help] adding json-data and footer to help file ([cad4bbc](https://github.com/aversini/envtools/commit/cad4bbcb9838ee26b528574bca8792c3ff7df518))

__0.0.157 / 2016-11-05__

- Fixing build/deploy process ([f3121ac](https://github.com/aversini/envtools/commit/f3121ace57ce203705b6bdec42f53d0fc6663fe8))

__0.0.155 / 2016-11-04__

- First pass at `envtools config` ([e4675ff](https://github.com/aversini/envtools/commit/e4675ff11abc3835adfd4ed2e1c9c0411a6112fb))
- [help] even more help wording update ([46718ea](https://github.com/aversini/envtools/commit/46718ea75defad2c82c597dc7a46e66e3b80e2bc))
- [help] a11y audit remediation ([01d3116](https://github.com/aversini/envtools/commit/01d3116301adc98c164904b04f8fa899fec28756))
- Adding powered-by to `envtools web` ([9dc5e1f](https://github.com/aversini/envtools/commit/9dc5e1fda2b85f99053c0d7d0038b6a63d2a567c))
- Fix proxy + sinopia issue: if sinopia ON, then no need for npm proxy ([6a56e29](https://github.com/aversini/envtools/commit/6a56e29f77944c956dfc9d5ea087cec715389025))
  cipser
  
- [help] better wording for command tab ([2a7cf9e](https://github.com/aversini/envtools/commit/2a7cf9e21efc6ba24655d44eb570dd812fa0e2c4))
- Update LANG to be compatible with Atom spell check ([adf9cd9](https://github.com/aversini/envtools/commit/adf9cd99de7f1c7316b2d43538673dfa328465fb))
- [help] hide history tab on smaller bp ([c356f27](https://github.com/aversini/envtools/commit/c356f27e2afc700c5a9265aea075440b44c14ea8))
- [help toc] still trying to fix IE11 ([ff01f6a](https://github.com/aversini/envtools/commit/ff01f6a7d2eca41381b8fbcc9eacee95cf1c851c))
- [help toc] adding support for IE11 ([8b0126d](https://github.com/aversini/envtools/commit/8b0126d0ef27fcd8df3df3ca5f0cc0fb4392880f))
- Adding TOC to commands tab ([22f3b2d](https://github.com/aversini/envtools/commit/22f3b2d7ffe8bbaf62387eb832a37f6e0c150bbc))
- [help] concat + minify css and js ([2d45816](https://github.com/aversini/envtools/commit/2d45816132a4fc47cc6e543bf973f5306edd6951))
- [help] removing unused files ([f90cf55](https://github.com/aversini/envtools/commit/f90cf55a2a099d923decd00762c81faa006e01c7))
- [help] upgrading to bootstrap 3.3.7 ([02526d1](https://github.com/aversini/envtools/commit/02526d1533e6ada927e0bb77012682dff00f3f9c))
- [help] better server termination ([442e6d7](https://github.com/aversini/envtools/commit/442e6d7de9420164bfa1a5932213c0ca735aaa58))
- [help] more robust server - if crashed, restart it ([7d0bc0a](https://github.com/aversini/envtools/commit/7d0bc0aec8a63caa20207c4046d2005a21ba2fa4))
- Adding name and version to commons ([6e32a59](https://github.com/aversini/envtools/commit/6e32a59155ed2c0e1e565f71dd700bfb6434c484))
- [help] adding size to img tag ([63247b1](https://github.com/aversini/envtools/commit/63247b12aca44a1b87e8dcfc8662bc4d7d754191))
- [help] removing obsolete css ([b6e33ce](https://github.com/aversini/envtools/commit/b6e33ceb5fe83c843ec72371c95e79013fdb8364))
- Adding autoprefixer to handle css prefixes ([c661274](https://github.com/aversini/envtools/commit/c6612743cd00bca24ddba61ef0e0debb9aa11b86))
- Update help for `envtools notifier` with more Growl information ([19323a0](https://github.com/aversini/envtools/commit/19323a0c7aa56d86e3d249f6b77e0c9151384644))
- [growlnotify] removing debug code ([338535b](https://github.com/aversini/envtools/commit/338535b9302f20b75fd83b1f3f3f771712adf61d))
- Installing growlnotify if needed ([cf66cb0](https://github.com/aversini/envtools/commit/cf66cb0d1f44ad17566be4dcf31204fdac827582))
- Moving aliases `down` and `desk` to win/mac ([6c2c8a5](https://github.com/aversini/envtools/commit/6c2c8a5665d0f63262fcaa61c556ba3265474972))
- [help] scroll back to top on tab change ([cdf405d](https://github.com/aversini/envtools/commit/cdf405d6acd3b5c00762b1e747ece294d5547f83))

__0.0.154 / 2016-10-31__

- [help] crisper logo on retina displays ([89078a4](https://github.com/aversini/envtools/commit/89078a493ccdeb98a7bbcf242af35f0de7dc8fc5))
- [help] do not start another help server if one is already up ([1b0d4e4](https://github.com/aversini/envtools/commit/1b0d4e4594434b387cba6f41962f6133818a88e4))
- Adding `envtools notifier` to the fold ([3fcfe1b](https://github.com/aversini/envtools/commit/3fcfe1bc047646fa16512b73feac89315ddda610))
- Moving order of commands in help ([1400a1e](https://github.com/aversini/envtools/commit/1400a1ee8303b872ed276c747480ff48c5f85728))
- [timer] done, integrated into `envtools timer` ([6107836](https://github.com/aversini/envtools/commit/6107836f6876a2f9619dcc85b983a4daefb5e23a))
- First pass at integrating `envtools timer` ([3684e1f](https://github.com/aversini/envtools/commit/3684e1f99d3bed14ff383c8eef61b25033997740))
- Adding `envtools encrypt` and `envtools decrypt` to the fold ([7fa92a9](https://github.com/aversini/envtools/commit/7fa92a93f21f7ac6e1815130d14aa700e2d5a1a4))
- [help] back to centered ([32532c2](https://github.com/aversini/envtools/commit/32532c23b6b7f94896926d5bb0f6ec2061fb55db))
- [help] no more center, use whole page ([9933fdf](https://github.com/aversini/envtools/commit/9933fdfa43ce38fb996b721006c9db8055768b1a))
- [help] minifying help file ([aaabe57](https://github.com/aversini/envtools/commit/aaabe577d80f022068ed843ae10ecf44a056d2b3))
- [help] link to actual sinopia readme ([4bb6eed](https://github.com/aversini/envtools/commit/4bb6eed48b93f1628fda585e95a891eca6bed07f))
- [help] better wording ([7507c66](https://github.com/aversini/envtools/commit/7507c66db2f37823017442ff8f6b54e2d0281dcb))
- `envtools —help` is back.. ([4085ea1](https://github.com/aversini/envtools/commit/4085ea195f072497caa5ae4d3861ea43afaa9385))
- [help]  add targeting help tab ([3b0769c](https://github.com/aversini/envtools/commit/3b0769c7855eb34fcb416202dfb65f4900527e25))
- [help] remove obsolete internal help ([e85e92b](https://github.com/aversini/envtools/commit/e85e92b0c37f643c4c39536bca729b379b4ffe71))
- [help] remove debug code ([c03e37e](https://github.com/aversini/envtools/commit/c03e37e575d05c4787d265fce54e76877f331d29))
- Better help: ([89f87d4](https://github.com/aversini/envtools/commit/89f87d42f19d9bf9d601e98e310cca6c1fd4b61e))
  - Possibility to open at a specific tab
  - Less FOUC
  
- Better help server start/stop feedback ([10f1ca3](https://github.com/aversini/envtools/commit/10f1ca3291739572bf190506a3ff8febcdc54609))
- spawing mini web server for help ([835dfc0](https://github.com/aversini/envtools/commit/835dfc075ba4eeea5193d9b71ff817e536364ad1))
- Fix `psf` and `net` aliases: color + better filtering ([a9b712a](https://github.com/aversini/envtools/commit/a9b712a85f83c7fd706805390a7a7cff21c6e06f))
- Adding some color to grep ([bcafab9](https://github.com/aversini/envtools/commit/bcafab9836e6cb7db8f42c2337b62e20afa14d79))
- Fixing calls to isMac/isWindows/isLinux ([31557de](https://github.com/aversini/envtools/commit/31557de2557fc675d6ae519f82f041bbd5d39eff))
- Fix psf for windows ([5094fdf](https://github.com/aversini/envtools/commit/5094fdf4566116f672bf40e30376eace25e92985))
- Refactoring bash OS detection ([88fe469](https://github.com/aversini/envtools/commit/88fe469ae44975b78570ed3cc0524bb170e23fa5))

__0.0.153 / 2016-10-28__

- Fix node modules installation in auto mode ([159c342](https://github.com/aversini/envtools/commit/159c3428b0aa01f902cc208481f9f1fa3b318758))

__0.0.152 / 2016-10-28__

- Moving all node packages together ([765d0a1](https://github.com/aversini/envtools/commit/765d0a1f25d1a12afcda2552a3da04d0b44664d5))
- Removing check for apps (too changing) ([160e2b1](https://github.com/aversini/envtools/commit/160e2b1d47f262b8c174e8bf18d93d3c684c9728))
- Simplify help + better wording ([a4848a3](https://github.com/aversini/envtools/commit/a4848a31fa23a97c1c537112b1fadd0c27e42260))
- Removing obsolete dependency ([937204c](https://github.com/aversini/envtools/commit/937204c30c441c90b23368b84075f449c7325b10))
- If sinopia is stopped, change prompt status color ([2daf61c](https://github.com/aversini/envtools/commit/2daf61c8d1abb44914c7faf7412f5f6ebfec6e70))
- Adding win64 support ([cb0c3af](https://github.com/aversini/envtools/commit/cb0c3af1dcc7d760f137ef20c911f6fbccee0299))
- Fixing alias for ls in color (diff between mac and linux) ([0eea480](https://github.com/aversini/envtools/commit/0eea480385cf8f72d6fe79324dfe86dc0ac7e1ca))
- typo ([f3c5963](https://github.com/aversini/envtools/commit/f3c5963a3e7c83b8bf1f13962a378c581eacde96))
- Simplifying git credential keychain (always installed on mac now) ([a8f9fe3](https://github.com/aversini/envtools/commit/a8f9fe35c90aeb569de4b782db36cd9f1744900e))
- Typo ([90e9f48](https://github.com/aversini/envtools/commit/90e9f480ac7f0eef96459dfe5f8755d9788ba31b))
- Migrating chown for /usr/local with graphical sudo ([fb5ed42](https://github.com/aversini/envtools/commit/fb5ed4242a16126f61606be6a750fa1dd9a30604))
- No more forcing admin when starting auto mode ([2984922](https://github.com/aversini/envtools/commit/29849225d9e7cad8c117853dc552d5ef48dfb976))
- Do not suggest to restart session after installing npm package ([1141ec1](https://github.com/aversini/envtools/commit/1141ec13b959593afe29c0e4c346e958930db3eb))
- Using the newly common npm installer to install fedtools ([69aa400](https://github.com/aversini/envtools/commit/69aa40026161fd1225988e5665bfdbdbb0129738))
- Refactoring npm installation and moving it to common ([dc5034c](https://github.com/aversini/envtools/commit/dc5034c4b5c7f05e9d1a181192a6c03e1969648d))
- Fixing sudo when installing npm ([6560c00](https://github.com/aversini/envtools/commit/6560c00488906481d6b7c8a02b191b326ed6e25c))
- oops, wrong maven settings... fixing it! ([cc891dc](https://github.com/aversini/envtools/commit/cc891dcb33710dd7d7096b3f0c78ebae7068583a))
- Replacing maven configuration with latest (encrypted) ([2d44433](https://github.com/aversini/envtools/commit/2d444333d4517885409e5a4788b83dae99c352ff))
- Migrating node/npm to use as little sudo as possible ([e1d87db](https://github.com/aversini/envtools/commit/e1d87dbb5daa864602fcd8e45dee389340553ea1))
- [sudo] removing sudo when installing fedtools ([713dd7e](https://github.com/aversini/envtools/commit/713dd7ef34fabbb7329ec0c78d503689f575d015))
- Adding webpack to the list of core node packages ([82e622a](https://github.com/aversini/envtools/commit/82e622a51b43b4090b04bf0e746200f2a91f0fa9))

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
