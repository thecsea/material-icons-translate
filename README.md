# material-icons-translator

[![npm version](https://badge.fury.io/js/material-icons-translator.svg)](https://badge.fury.io/js/material-icons-translator)

This library translates all occurrences of material icons name to the unicode form

this library doesn't work if material is added by css

there are two versions of the library:

1. Simple version, which uses only a regex. So you cannot translate occurrences inside inner tags. This is the default version
1. Complex version, which uses a grammar parser. It has a bigger exclusivity power, but it has some issues, as you can see in the issues.

## Example

### Standalone

``` javascript
const MaterialIconsTranslator = require('material-icons-translator').simple;
const content = '<aaa class="material-icons">delete</aaa>ssss';
const translated = MaterialIconsTranslator(content); //equal to '<aaa class="material-icons">&#xE872;</aaa>ssss'
```

### Gulp

``` javascript
const MaterialIconsTranslatorGulp = require('material-icons-translator/gulp');
const Gulp = require('gulp');
Gulp.task('translate', ()=>{
  return Gulp.src('files/**')
    .pipe(MaterialIconsTranslatorGulp())
    .pipe(Gulp.dest('filesTranslated');
});
```
