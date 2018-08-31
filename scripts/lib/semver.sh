#!/bin/bash

# adapted from https://gist.github.com/lxe/b167d3ec4e4f94d246ebdc4bcfdfb6ac

# set -x

# Stupid Simple Semver range validator
# (no build metadata and no prereleases, and no multiple ranges (||))

# Prints a list of versions that match a semver range
# ./semver.sh "range" version version version...

# ./semver.sh ">=0.10.32 <7" 0.10.32 6.7.0 6.9.2 6.9.4 6.10.0 7.3.0 7.4.0 | xargs
# 0.10.32 6.7.0 6.9.2 6.9.4 6.10.0

# ./semver.sh "^6.9.4" 0.10.32 6.7.0 6.9.2 6.9.4 6.10.0 7.3.0 7.4.0 | xargs
# 6.9.4 6.10.0

# ./semver.sh "~6.9.4" 0.10.32 6.7.0 6.9.2 6.9.4 6.10.0 7.3.0 7.4.0 | xargs
# 6.9.4

# TODO: error handling, validation

# Basic concept:
# 1.x.x  = ^1.0.0 = (>=1.0.0 <2.0.0)
# 1.1.x  = ~1.1.0 = (>=1.1.0 <1.2.0)
# ^1.x.x = ^1.0.0
# ~1.x.x = ~1.0.0

SEMVER_RANGE="$1"; shift
SEMVER_AVAILABLE_VERSIONS="$@"

SEMVER_RE_COMPARATOR='[<>=\^~]*'
SEMVER_RE_VERSION='[0-9x\.]+'

# Takes a range with multiple comparisons, and splits it into lines
# >=1.2.3 < 3
#    >=1.2.3
#    < 3
semver_split_range () {
  grep -E -o "($SEMVER_RE_COMPARATOR\\s*$SEMVER_RE_VERSION)"
}

# Hacky way to make versions comparable
# Won't work if version numbers are over 100k'
# 1.2.3 => 000001000002000003
semver_to_number () {
  tr "." " " | xargs printf "%06g"
}

# Convert a range part into a set of comparison lines processable by bc
# ^1.2.3 => >=1.2.3 <2.0.0
#    >= 000001000002000003
#    <  000002000000000000
semver_create_comparator () {
  local COMPARATOR="$(grep -E -o "^$SEMVER_RE_COMPARATOR" <<< "$1")"
  local VERSION="$(grep -E -o "$SEMVER_RE_VERSION$" <<< "$1")"
  local VP

  local ZERO_OR_X
  if [[ -n "$COMPARATOR" ]]; then
    ZERO_OR_X="0"
  else
    ZERO_OR_X="x"
  fi

  # Append either 0's or x's to the version, depending on comparator presence
  #  4 => 4.x.x
  # ^4 => 4.0.0
  while [[ "$(grep -E -o "\\." <<< "$VERSION" | wc -l)" -lt "2" ]]; do
    VERSION="$VERSION.$ZERO_OR_X"
  done

  # If comparator is not defined (1.x.x, 1.x, 1, 1.0.x, 1.0.0 etc),
  # assign one based on the number of x's
  # 1.x.x => ^  1.x.x
  # 1.0.x => ~  1.0.x
  # 1.0.0 => == 1.0.0
  if [[ -z "$COMPARATOR" ]]; then
    if [[ "$VERSION" =~ \.x\.x ]]; then
      COMPARATOR="^"
    elif [[ "$VERSION" =~ \.x ]]; then
      COMPARATOR="~"
    else
      COMPARATOR="=="
    fi
  fi

  # Finally, replace all the x's with 0s'
  # ^  1.x.x => ^ 1.0.0
  VERSION=$(sed -E 's|\.x|\.0|g' <<< "$VERSION")

  # Convert the ~,^ into proper >=, < comparator ranges
  # ^1.0.0 = (>=1.0.0 <2.0.0)
  # ~1.0.0 = (>=1.0.0 <1.1.0)
  if [[ "$COMPARATOR" =~ \^|~ ]]; then
    IFS="." read -ra VP <<< "$VERSION"
    if [[ "$COMPARATOR" == "~" ]]; then
      # Up the minor; 0 the patch
      VP[1]=$(( VP[1] + 1 ))
      VP[2]=0
    else
      # Up the major; 0 the minor and patch
      VP[0]=$(( VP[0] + 1 ))
      VP[1]=0
      VP[2]=0
    fi
    COMPARATOR=">="
    echo "< $(semver_to_number <<< "${VP[0]}.${VP[1]}.${VP[2]}")"
  fi

  echo "$COMPARATOR $(semver_to_number <<< "$VERSION")"
}

# Create all of the comparator lines processable by bc for the entire semver range
# TODO: make it break for invalid ranges
semver_create_comparators () {
  local R

  while read -r R; do
    semver_create_comparator "$R"
  done < <(semver_split_range <<< "$SEMVER_RANGE")
}

# Run a semver against all comparisons
# If all conditions pass, return success
semver_compare () {
  local C

  while read -r C; do
    [[ "$MATCH" == "false" ]] && break
    if [[ "$(bc <<< "$1 $C")" == "0" ]]; then
      return 1
    fi
  done < <(echo -e "$V_COMPARATORS")
}

# Precompute the range into bc-processable comparator strings
V_COMPARATORS="$(semver_create_comparators)"

# Compare each provided version against the provided range, and print
# the ones that succeed
for A in $SEMVER_AVAILABLE_VERSIONS; do
  semver_compare "$(semver_to_number <<< "$A")" && echo $A
done
