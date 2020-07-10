# design notes

## features

define a workspace (root directory), default current directory

exclude list .brainignore

read front matter recursively in any non-excluded file or directory

allow group by any front matter property (e.g. group by tags or tag value)

fuzzy file finder for file autocomplete in workspace

-- mvp --

spaced reptition based note review

allow nth group by (group by tag THEN frequency THEN difficulty)

broken link finder

move/rename diff detection

content-type plugin utility

cache/database

## code

testing
jest

front matter parser
gray-matter

command line parser
yargs

fuzzy finder library
fuzzysort

javascript object transform (group by, inversion)
lodash

api vs command line -- a function for every command line sub-command
-w, --workspace workspace, global option, default cwd
non-mvp, -e, --exclude .brainignore default

build:
read front matter recursively in any non-excluded file or directory
this will be implicit until caching

group
allow group by any front matter property (e.g. group by tags or tag value)

find
fuzzy file finder for file autocomplete in workspace
return a list of potential matches by matchyness

## structure

main.js - command line parsing, require all functions in
fuzzy.js - fuzzy find files in workspace
group.js - group by front matter attributes, incl tags
parse.js - get front matter from all files in workspace
files.js - recursively list all files not ignored, parse .brainignore
