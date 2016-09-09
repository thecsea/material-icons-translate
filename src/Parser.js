/**
 * Created by claudio on 09/09/16.
 */
GLOBAL._parser ={};
GLOBAL._parser.callbacks = [];
module.exports = function(callback){
    "use strict";
    var Parser = require("jison").Parser;

    var id = GLOBAL._parser.callbacks.push(callback)-1;

    var grammar = {
        "lex": {
            "rules": [
                ["\\s+",                    "/* skip whitespace */"],
                ["[0-9]+(?:\\.[0-9]+)?\\b", "return 'NUMBER';"],
                ["\\*",                     "return '*';"],
                ["\\/",                     "return '/';"],
                ["-",                       "return '-';"],
                ["\\+",                     "return '+';"],
                ["\\^",                     "return '^';"],
                ["\\(",                     "return '(';"],
                ["\\)",                     "return ')';"],
                ["PI\\b",                   "return 'PI';"],
                ["E\\b",                    "return 'E';"],
                ["$",                       "return 'EOF';"]
            ]
        },

        "operators": [
            ["left", "+", "-"],
            ["left", "*", "/"],
            ["left", "^"],
            ["left", "UMINUS"]
        ],

        "bnf": {
            "expressions" :[[ "e EOF",   "GLOBAL._parser.callbacks["+id+"]($1); return $1;"  ]],

            "e" :[[ "e + e",   "$$ = $1 + $3;" ],
                [ "e - e",   "$$ = $1 - $3;" ],
                [ "e * e",   "$$ = $1 * $3;" ],
                [ "e / e",   "$$ = $1 / $3;" ],
                [ "e ^ e",   "$$ = Math.pow($1, $3);" ],
                [ "- e",     "$$ = -$2;", {"prec": "UMINUS"} ],
                [ "( e )",   "$$ = $2;" ],
                [ "NUMBER",  "$$ = Number(yytext);" ],
                [ "E",       "$$ = Math.E;" ],
                [ "PI",      "$$ = Math.PI;" ]]
        }
    };

    // `grammar` can also be a string that uses jison's grammar format
    var parser = new Parser(grammar);

    //TODO unset unused callbacks

    return parser;
};