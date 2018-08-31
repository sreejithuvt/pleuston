#!/usr/bin/env bash

script_dir="$(dirname "$0")"

# Color Support
# See: http://unix.stackexchange.com/a/10065
if test -t 1; then
  ncolors=$(tput colors)
  if test -n "$ncolors" && test $ncolors -ge 8; then
    normal="$(tput sgr0)"
    red="$(tput setaf 1)" && green="$(tput setaf 2)"
  fi
fi

# currently used Node.js version
CURRENT=$(node -v | cut -c 2-)

# get semver range from package.json engines.node enzry
SEMVER_RANGE='';

re="\"(node)\": \"([^\"]*)\"";

while read -r l; do
    if [[ $l =~ $re ]]; then
        value="${BASH_REMATCH[2]}";
        SEMVER_RANGE="$value";
    fi
done < package.json;

# compare semver range with current version
# returns a list of compatible versions when range is met.
# otherwise no result
CHECK=$("$script_dir/lib/semver.sh" "$SEMVER_RANGE" "$CURRENT" | xargs)

# if check result is empty
if [[ -z "$CHECK" ]]; then
    echo ""
    echo "${red}✖ Required Node.js version is not installed.${normal}"
    echo "  Please install a compatible Node.js version and run npm install again."
    echo "  Requested Version: $SEMVER_RANGE"
    echo "  Current Version: $CURRENT"
    echo "  Use nvm for easy switching between Node.js versions https://github.com/creationix/nvm"
    echo ""

    # just stop here
    return 1
else
    echo ""
    echo "${green}✔ Required Node.js version is installed.${normal}"
    echo "  Requested Version: $SEMVER_RANGE"
    echo "  Current Version: $CURRENT"
    echo ""
fi
