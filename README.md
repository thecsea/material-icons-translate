# material-icons-translator
This library translates all occurrences of material icons name to the unicode form

this library doesn't work if material is added by css

there are two versions of the library:
1. Simple version, which uses only a regex. So you cannot translate occurrences inside inner tags. This is the default version
1. Complex version, which uses a grammar parser. It has a bigger exclusivity power, but it has some issues, as you can see in the issues.