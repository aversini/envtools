# Aliases

## Folder Navigation/Listing

Alias | Description
------|-------------
`..`  | Equivalent to 'cd ..'
`la`  | Enhanced `ls` to list files and dot files, sorted by oldest on top.
`ld`  | Directories are listed as plain files (not searched recursively).
`ll`  | List in long format unsorted. A total sum for all the file sizes is output on a line before the long listing.
`lrt` | List in long format sorted alphabetically and the most recent first.

## Files/folders Search/Diff

Alias    | Description
---------|-------------
`axdiff` | Performs a diff using Araxis Merge. Takes 2 arguments (folders or files).
`diffd`  | Performs a folder diff using plain bash diff. Takes 2 arguments (folders only).
`ksdiff` | Performs a diff using Kaleidoscope. Takes 2 arguments (folders or files).
`ff`     | Find files or folders matching a pattern. Takes multiple arguments. See `ff -h` for options.
`fgrs`   | Find a string in files. Takes multiple arguments. See `fgrs -h` for options.
`tailf`  | Displays the content of a file and updates automatically if the content changes. Takes a file as an argument. Equivalent to `tail -f`.

## Mac Specific

Alias    | Description
---------|-------------
`f`      | Open the Finder for the current folder. If an argument is passed, it tries to open that file is the corresponding Application (for folders, Finder is used).
`fix`    | Fix the 'Open With' shortcut in Finder. It removes duplicates entries.
`kjamf`  | Kill any running processes with "jamf" in their name (Provisioning Software).
`klync`  | Kill any running processes with "lync" in their name (Microsoft Lync).
`knot`   | Kill any running processes with "symdaemon" in their name (Norton Antivirus).
`kout`   | Kill any running processes with "outlook" in their name (Microsoft Outlook).
`mate`   | Open Sublime Text 3. If an existing Sublime is opened, it will be used. If an argument is passed, it will load that file/folder. If not, it will be blank.
`maten`  | Same as `mate` but will open a new Sublime Text Window instead of reusing one.
`net`    | List opened connections matching the address passed in argument. `net TCP` will list all opened IP connections.
`openc`  | Open a file in Google Chrome.
`psf`    | List running processes matching the string passed in argument. `psf node` will list all running node processes.
`vm`     | VirtualBox Manager. Allows you to start/stop and list all VirtualBox installed appliances.

## Proxy Helpers

Alias    | Description
---------|-------------
`poff`   | If a proxy is know (see `envtools auto`), it will be turned OFF (in env, in git configuration, in npm configuration and in sublime configuration - if any).
`pon`    | If a proxy is know (see `envtools auto`), it will be turned ON (in env, in git configuration, in npm configuration and in sublime configuration - if any).
`pq`     | Displays the current status of the proxy (ON, OFF or N/A).


## Environment Helpers

Alias    | Description
---------|-------------
`r`      | Shortcut to reload your environment without having to restart your terminal.
`sds`    | Shortcut for `sudo su -`
`web`    | Starts a small web server on port 8080, serving files in the current folder.
