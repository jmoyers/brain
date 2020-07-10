# Brain Notes

## features

- [x] read front matter recursively in any non-excluded file or directory
- [x] allow group by any front matter property (e.g. group by tags or tag value)
- [x] fuzzy file finder for file autocomplete in workspace
- [ ] exclude list .brainignore, exclude binary files by default for parsing
- [ ] .brain cache/database - we need a db for binary files

---

- [ ] spaced reptition based note review
- [ ] allow nth group by (group by tag THEN frequency THEN difficulty)
- [ ] broken link finder
- [ ] move/rename diff detection
- [ ] content-type plugin utility

## code

### library selection

- testing - jest
- front matter parser - gray-matter
- command line parser - yargs
- fuzzy finder library - fuzzysort
- javascript object transform (group by, inversion) - lodash

### design

the goal is to retain funcitonality for a command line app, so we have a nice
clear seperation of concerns and we don't get too linked to a vscode
extension. this is so somebody could conceivably use it bare with markdown
files, or create a vim extension etc.

#### options

##### add [file/default recursive walk from ./]

read front matter recursively in any non-excluded file or directory. this is an
implicit functionality, though we are going to need a database for binary files
regardless, so its a little silly to have two sources for such information.
however, at the risk of a design wart, we'll optimize for working within the
editor context directly

##### group

allow group by any front matter property (e.g. group by tags or tag value)

find
fuzzy file finder for file autocomplete in workspace
return a list of potential matches by matchyness

## structure

- [x] fuzzy.js - fuzzy find files in workspace
- [x] group.js - group by front matter attributes, incl tags
- [x] parse.js - get front matter from all files in workspace
- [x] files.js - recursively list all files not ignored, parse .brainignore
- extension/ (vscode specific files)
  - [x] extension.js - root of vscode extension, register tree view
  - [x] BrainTreeDataProvider.js - the attribute tree view
- [ ] write.js - write .brain file with all attributes
- [ ] attr.js - write a new attribute to be associated witha file
- [ ] main.js - command line parsing, require all functions in
