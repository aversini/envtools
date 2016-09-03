
__0.0.124 / 2016-09-03__

- Adding npm badge to help file
- Removed markdown dependency on building aliases help page

__0.0.123 / 2016-09-02__

- Adding a lot more about Sinopia and Node v6

__0.0.122 / 2016-09-02__

- Merge remote-tracking branch 'origin/master' into npm-node-sinopia
- Fixing prompt cutting of after a big amount of key strokes
- Merge remote-tracking branch 'origin/master' into npm-node-sinopia
- Adding short logs (feedback text) for each command
- wip on re-writting help pages
- removing debug code
- wip
- wip
- wip node vs proxy
- Removing phantomjs installation - not required anymore

__0.0.121 / 2016-08-31__

- Fix for git boostrap when there is no config at all

__0.0.120 / 2016-08-31__

- Better session reloading mechanism
- Remove duplicate warning logs
- Refactoring to simplify some tasks
- Adding testing CLI to envtools

__0.0.119 / 2016-08-26__

- Fix login prompt not remembering previous location
- Log error when homebrew installation of wget fails
- Migrating to lodash and replacing mkdirp with ensureDir

__0.0.118 / 2016-08-25__

- Optimizing sinopia (better external usage)
- Bump download dependency version
- Bump dev dependencies
- No need to remove “progress” for npm (fixed perf at master)
- Better README
- Simplifying "envtools -h" since the web page is now supported

__0.0.117 / 2016-08-21__

- Refactoring help page (available for Windows too)

__0.0.116 / 2016-08-21__

- Refactoring maven settings installation

__0.0.115 / 2016-08-20__

- Removing git link from history since it’s a private repo
- Slight better wording for manual options
- Slight refactor of “checkForApps” - better logging
- Slight refactor of load.sh

__0.0.114 / 2016-08-17__

- Bumping maven version to 3.3.9 since it's now supported

__0.0.113 / 2016-08-08__

- Removing getArtifacts - not needed anymore
- Spelling!

__0.0.112 / 2016-08-07__

- Adding example to customization tab
- Fix lint issues in Gruntfile

__0.0.110 / 2016-08-06__

- Better wording for the command prompt option
- eslint rules: adding es6 support
- eslint rules: allowing template litterals

__0.0.108 / 2016-06-17__

- Updating gith because of an API change in fedtools-utilities

__0.0.107 / 2016-06-15__

- Small refactoring

__0.0.106 / 2016-06-14__

- In extra mode, allowing the user to choose which atom packages to install
- In manual mode, allowing the user to choose which npm packages to install

__0.0.105 / 2016-06-10__

- Better handling of npm installationg failure

__0.0.104 / 2016-06-10__

- Fixing homebrew installing - need to run update now

__0.0.103 / 2016-06-10__

- Refactoring - extracting each individual plugin

__0.0.102 / 2016-06-09__

- Special character is not working on windows

__0.0.101 / 2016-06-08__

- Do not check for ruby in auto mode on windows
- Lowering ulimit for windows

__0.0.100 / 2016-06-08__

- Better welcome banner for non-mac

__0.0.99 / 2016-06-08__

- Limiting 'h' for help on mac

__0.0.98 / 2016-06-08__

- Adding alias for clear (c)
- no sudo on windows - take 2

__0.0.97 / 2016-06-07__

- Removing stars in banner on Windows
- Merge branch 'master' of https://github.com/aversini/envtools
- No sudo on windows

__0.0.96 / 2016-06-07__

- Replacing "cp -f" with fs.copy
- Merge branch 'master' of https://github.com/aversini/envtools
- Merge branch 'master' of https://github.com/aversini/envtools
- Merge branch 'master' of https://github.com/aversini/envtools
- First pass at trying to support windows
- First pass at trying to support windows
- (internal) Adding sugar shell method "confirm"

__0.0.95 / 2016-05-24__

- Adding gulp to needed npm packages

__0.0.94 / 2016-05-19__

- Updating npm bootstrap to take sinopia into account (if already setup)

__0.0.93 / 2016-05-13__

- Fix envtools message display in node v6+

__0.0.92 / 2016-05-05__

- Restricting phantomjs installation to 1.9.8

__0.0.91 / 2016-05-01__

- Slightly better help (for sinopia shortcuts)
- Need to reload env when setting sinopia (on or off)
- Reload custom export when reloading prompt (for ex via pq or sq)

__0.0.90 / 2016-04-30__

- Adding more sinopia goodies

__0.0.89 / 2016-04-29__

- Removing gemnasium from README

__0.0.88 / 2016-04-29__

- Tiny update to trigger a bump - failing to publish because of... sinopia :)

__0.0.85 / 2016-04-29__

- Fix package dev dependencies
- Removing time-grunt
- Adding Sinopia to handle npm caching locally
- update .jsbeautifyrc to add a new line at the end of files
- Fix invalid fs-extra dep version
- Update to latest stable version of inquirer (migrating to promises)
- Adding license to package.json to prevent CLI warning
- Updating to latest stable version of glob
- Updating to latest stable version of fs-extra

__0.0.84 / 2016-04-27__

- Enabling by-passing a few steps in "envtools auto"
- Sorting Vms

__0.0.83 / 2016-04-27__

- Linting via ESLint
- Adding unicorn as a required App for framework

__0.0.82 / 2016-04-26__

- Updating ESLintrc to latest from framework

__0.0.81 / 2016-04-25__

- Updating ESLintrc

__0.0.80 / 2016-04-21__

- Try to limit grunt dependencies
- grunt-cli is enough, not need to install grunt as well
- Adding chai to globals for ESLint

__0.0.79 / 2016-04-21__

- Removing reserved words
- Revert "Removing fedtools installation from envtools"
- Removing grunt check
- Moving version checking to public package
- Removing submodule - not working..
- Not sure what I'm doing here..
- Adding submodule "versions"

__0.0.78 / 2016-04-15__

- Adding a few more Atom packages

__0.0.77 / 2016-04-13__

- Removing fedtools installation from envtools

__0.0.76 / 2016-04-11__

- Simplifying README
- Adding eslint and unicorn to default NPM packages
- Fix lint error

__0.0.75 / 2016-02-17__

- Dump the resume_auto file only in auto mode!

__0.0.74 / 2016-02-12__

- Updating `la` alias to list only hidden files
- Sligthly better help

__0.0.73 / 2016-02-11__

- Adding support for .bash_profile (on top of .profile)
- Relaxing eslint rule for style of wrap-iife functions

__0.0.72 / 2016-02-08__

- Removing App Store fix since it does not work...

__0.0.71 / 2016-02-05__

- Adding wget as the first real core package needed after brew

__0.0.70 / 2016-02-05__

- Add bash function `getArtifacts` to get nexus artifacts quickly
- Removing Atom package atomatigit (not working very well)
- Adding project-manager to the list of Atom packages to be installed

__0.0.69 / 2016-02-04__

- Adding alias to fix icon association in Finder
- Adding alias for testing HDD performance (hdd)

__0.0.68 / 2016-02-03__

- Oops, forgot vendor prefixes... who do I think I am..

__0.0.67 / 2016-02-03__

- Even better logo via SVG

__0.0.66 / 2016-02-03__

- Fixed header for the help page
- Adding default .jsbeautifyrc file

__0.0.65 / 2016-02-03__

- Ooops - fixing regression introduced by ESLint config - async.waterfall issue

__0.0.64 / 2016-02-03__

- Adding ESLint configuration to auto and manual
- Trying to fix Atom package installation

__0.0.63 / 2016-02-02__

- Refactoring `gith` to access better tags info and removing useless sugar (git status really?!?)

__0.0.62 / 2016-02-02__

- Adding 'new version available' to banner if there is one...

__0.0.61 / 2016-02-02__

- Adding isDirtyGit bash function to check if a local repo is clean

__0.0.60 / 2016-02-01__

- Fixing Araxis Merge

__0.0.59 / 2016-02-01__

- Reverting to Maven 3.2.5 (See PN-13533)

__0.0.58 / 2016-02-01__

- Removing heroku and status from gith
- Removing support for sublime proxy switch (was buggy)
- Renaming options.bootstrap into options.auto for consistency
- Adding 'svgo' to core npm packages and removing 'jshint'

__0.0.57 / 2016-01-31__

- Resuming envtools auto after first time env/proxy setup

__0.0.56 / 2016-01-31__

- Adding power charging sound
- Adding fix for Mac App Store

__0.0.55 / 2016-01-31__

- Adding atomatigit to atom package list

__0.0.54 / 2016-01-31__

- Removing wrong notification

__0.0.53 / 2016-01-31__

- Missing file in the final npm package

__0.0.52 / 2016-01-31__

- Removing test from publish since there are no tests... so far..
- No need to artificially bump bash version since it's now part of "release"
- Removing old file

__0.0.51 / 2016-01-31__

- Adding history to help file
- Better proxy fat finger filtering
- Better error/message on proxy setting

__0.0.50 / 2016-01-30__

- Better auto mode: do not ask for env or proxy if already set

__0.0.49 / 2016-01-30__

- Better centralized messaging
- Setting the proxy should not end the process
- Setting fancy banner and prompt for auto mode

__0.0.48 / 2016-01-30__

- Refactoring to handle auto/manual/extra requests more efficiently in the future
- More Atom packages
- Minifying help file

__0.0.47 / 2016-01-29__

- Adding more essential Atom packages

__0.0.46 / 2016-01-29__

- Ooops, missing banner setup during auto

__0.0.45 / 2016-01-29__

- Create runtime dir only if it doesnt exist (~/.envtools)
- Adding option to remove the welcome banner
- Adding http-proxy to Atom proxy helper
- Adding Atom packages
- Customization help - TBD
- Adding Atom to the help intro

__0.0.44 / 2016-01-28__

- Setting npm progess false by default (to speed up node v5+)
- Removing maven warning during bootstrap

__0.0.43 / 2016-01-28__

- Adding envtools web

__0.0.42 / 2016-01-27__

- Adding small blurb about `fedtools extra` in the help file.
- Renamed help.md into aliases.md (cleaner...)
- Updating git-ptompt to latest release
- Unused var

__0.0.41 / 2016-01-27__

- Slighty better README/help
- Fixing "version" alias
- If boring is passed, do not ask for the changelog
- displayProxy should also reset the env if status is known

__0.0.40 / 2016-01-26__

- Updating proxy setup for Atom
- Adding screensaver fix to extra options
- Hidden option for extra
- Fixing backup dir to just day hour min

__0.0.39 / 2016-01-25__

- Fix check version process and display

__0.0.38 / 2016-01-25__

- Display proxy should also update the prompt

__0.0.37 / 2016-01-25__

- workaround mkdirp async issue

__0.0.36 / 2016-01-25__

- Fixing quicklook plugins - remove only the ones that are going to be installed
- Starting to add extra goodies (quicklook this time)

__0.0.35 / 2016-01-25__

- Help: adding warning about node and java

__0.0.34 / 2016-01-25__

- Better help

__0.0.33 / 2016-01-24__

- Adding Envtools vesion to welcome banner
- Ignore error when setting proxy off and git config complains - it's ok
- Do not ask for Proxy confirmation if proxy is already set (in auto mode)

__0.0.32 / 2016-01-24__

- Wip on adding debug flag
- Bypassing maven check if we just installed it before...
- Installing Compass should be silent in auto mode
- Logging error message when failure to download maven

__0.0.31 / 2016-01-24__

- Adding .hushlogin to prevent nasty welcome banner

__0.0.30 / 2016-01-24__

- Allow banner to be disabled
- Still playing with the banner :)

__0.0.29 / 2016-01-24__

- Playing with the welcome banner...

__0.0.28 / 2016-01-24__

- Display welcome banner via node
- Better wording for ruby/compass installation

__0.0.27 / 2016-01-24__

- Fixing async installation of ruby/compass

__0.0.26 / 2016-01-24__

- Better wording for restarting session needs

__0.0.25 / 2016-01-24__

- Need to specifiy gem install dir (in case env is not setup yet)

__0.0.24 / 2016-01-24__

- Fixing brew installation (was not working since standard brew script is interactive)
- Default to yellow command prompt when ssh'ing

__0.0.23 / 2016-01-24__

- No async for array of commands..
- Adding shifter in core npm packages

__0.0.22 / 2016-01-23__

- Confirm Admin request for git only if not bootstrap mode

__0.0.21 / 2016-01-23__

- Set gem path via brew only if brew is installed

__0.0.20 / 2016-01-23__

- If .profile doesnt exist, create it

__0.0.19 / 2016-01-23__

- Refactoring the prompt code to allow easier overridde
- Moving custom functions/exports/aliases at the very end to make sure they can override anything
- Better proxy set/unset with environment auto reload if needed

__0.0.18 / 2016-01-23__

- Adding missing commit logs to npm package

__0.0.17 / 2016-01-23__

- Oops debug logs in prod..

__0.0.16 / 2016-01-23__

- Oops missing rimraf dep

__0.0.15 / 2016-01-23__

- Oops, forgot to change the path to custom functions
- Adding enabling/disabling command prompt
- ff ignores node_modules by default, but adding --rainbow to bypass
- Removing unused code
- Fixing typos in help file

__0.0.14 / 2016-01-22__

- Adding fedtools step
- Adding usr local chown + m2 settings

__0.0.13 / 2016-01-21__

- Fixing async issue with mkdirp - too tired to investigate :/

__0.0.11 / 2016-01-21__

- Adding Maven installation
- Adding aliases for desktop/download folders on mac
- Fixing invalid custom folder in help
- Fixing display banner for linux (no help here)
- Adding missing ccc alias

__0.0.10 / 2016-01-21__

- Adding alias for help in mac
- Updating alias for Sublime
- Generating help.html
- Man pages: adding extra bit about customization
- Better man pages

__0.0.9 / 2016-01-20__

- Fixing git bootstrap - forgot array of cmd would not be async...

__0.0.8 / 2016-01-20__

- Adding missing file at root level of npm package - not sure if this is going to work thouhg..
- Changing commands to 'auto' and 'manual' - makes more sense
- Better introduction + better verbiage on proxy

__0.0.7 / 2016-01-20__

- Better handling of proxy setting (before and after)
- Do not ask for admin access in bootstrap mode

__0.0.6 / 2016-01-20__

- Adding bash version file to grunt task
- Fixing envtools logo...

__0.0.5 / 2016-01-20__

- Fixing grunt tasks...

__0.0.4 / 2016-01-20__

- Adding shell folder to npm distro

__0.0.3 / 2016-01-20__

- bad json bad!
- posix package would not install on linux...
