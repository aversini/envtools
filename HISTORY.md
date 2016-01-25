
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
