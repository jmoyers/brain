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
- yaml - js-yaml
- toml - toml
- command line parser - yargs
- fuzzy finder library - fuzzysort
- javascript object transform (group by, inversion) - lodash

### design

the goal is to retain funcitonality for a command line app, so we have a nice
clear seperation of concerns and we don't get too linked to a vscode
extension. this is so somebody could conceivably use it bare with markdown
files, or create a vim extension etc.

#### .brain database

- purpose
  - avoid full recursive walk of file system, even when no changes
  - allow binary files such as pdfs, images, videos to be tracked in your
    notetaking. we can't necessary store meta data directly in any content
- negatives
  - now we have to deal with getting out of sync with reality
  - files move, get renamed, now we're left with dangling references. we can
    detect dangling reference and allow the user to make a repair manually
    easily. more sophisticated rename/move detection would require git-like
    functionality which is a big hesitation.
- json, yaml, toml exchangable formats - in addition to it being human readable,
  its also human editable. may turn out to be an easy way to tag a ton of stuff quickly
- store parsed meta data information in the form file -> metadata
- we transform that structure in memory to more interesting formats, e.g. tags ->
  dynamic programming -> list of files
- think we put it in a directory .brain/database, so we can easily use this
  later to cache/expand to multiple files if we need some gitlike functionality,
  or downloading online resources like videos

#### options

##### add [file/default recursive walk from ./]

read front matter recursively in any non-excluded file or directory. this is an
implicit functionality, though we are going to need a database for binary files
regardless, so its a little silly to have two sources for such information.
however, at the risk of a design wart, we'll optimize for working within the
editor context directly

also here we need to detect dangling references -- file got moved, deleted,
renamed. really don't want to lose meta data that isn't stored directly with the
file. seems inevitable we'd have to store one compressed copy of the file to do
a diff with newly detected content and do mv/rename detection. overlaps with
git, but don't want to make git a dependency. could use git if present, later
on.

as far as cache invalidation, we need to use something to determine if a file
has changed and so therefore has invalidated a portion of our brain. we can use
the sha1 of the contents of a file and map it to the name for now. we can store
that in .brain/fingerprint. we also need the modified time, if we're not going
to check the contents of every file every time -- compare file stats, on finding
a difference, compute sha1, if different compute metadata

##### group

allow group by any front matter property (e.g. group by tags or tag value)

##### find

fuzzy file finder for file autocomplete in workspace. return a list of potential
matches by matchyness. this is for link autocompletion functionality.

also should consider a more complicated search expression parser. what i mean by
this is something like this: "'dyanmic programming' in tags order by difficulty
['easy', 'medium', 'hard']

## structure

- [x] fuzzy.js - fuzzy find files in workspace
- [x] group.js - group by front matter attributes, incl tags
- [x] parse.js - get front matter from all files in workspace
- [x] files.js - recursively list all files not ignored, parse .brainignore
- extension/ (vscode specific files)

  - [x] extension.js - root of vscode extension, register tree view
  - [ ] tree.js - the attribute tree view
  - [x] links.js - parse files for [[file]] and link to them directly

  - [ ] Autocomplete.js - [[context]] aware file/note autocomplete
  - [ ] AttributeView.js - edit attributes for a file, right hand view
  - [ ] RelatedView.js - show other notes which are attribute related

- [x] brain.js - given a meta structure, write and read .brain
- [x] fingerprint.js - fingerprint files in brain, check database validity

- [ ] main.js - command line parsing, require all functions in

## idea bucket

- side panel of `related material` which is other notes which have a good
  likeness in terms of the meta data. for example, you might get a list of other
  notes related to tags `graph problems` or `depth first search` or the like.
- create a `study path` which is really a way to navigate a learning topic,
  start to finish. this would be a graph path thru notes. you retain all the
  functionality of brain as you do so. could have a fully curated list. could
  have a dynamically generated list based on some basic intelligence about tags.
  say given the tag `dynamic programming` it might give you notes sorted like
  `select * where tags contain 'dynamic programming' order by difficulty, number`
- link to other brains. imagine git cloning someone elses notes and then
  referring to them from your own. other referring directly to a github address
  a la golang modules
- investigate document embedded videos/images for markdown. a reference to a
  video that was used to internalize a concept is probably the way to go.
  optionally download the videos/images and cache them in a .brain
