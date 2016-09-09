/**
 * Created by claudio on 09/09/16.
 */
GLOBAL._parser ={};
GLOBAL._parser.callbacks = [];
module.exports = function(callback){
    "use strict";
    var Parser = require("jison").Parser;

    function setElement(ele){
       var tmp = callback(ele);
        if(tmp == null)
            return ele;
        return tmp;
    }

    var id = GLOBAL._parser.callbacks.push(setElement)-1;

    var grammar = {
        "lex": {
            "rules": [
                ["$",                       "return 'EOF';"],
                ["\\s+",                    "/* skip whitespace */"],
                ["material-icons",          "return 'MATERIAL'"], //consider to insert \\b
                ["<",                       "return 'LT'"],
                [">",                       "return 'GT'"],
                ["\\/",                     "return 'CLOSE'"],
                ["[^<>\\/]*",                  "return 'CHARS'"],
            ]
        },

        "bnf": {
            "expressions" :[[ "e EOF",   "return $1;"  ]],

            "e" :[
                ["CHARS e", "$$ = $1+ $2;"],
                ["tag", "$$ = $1;"],
                ["", "$$ = '';"]
            ],

            "tag":[
                ["LT CHARS GT CHARS LT CLOSE CHARS GT e", "$$ = $1 + $2 + $3+  GLOBAL._parser.callbacks["+id+"]($4) + $5 + $6 + $7 + $8 +$9;"],
                ["LT CHARS CLOSE GT e", "$$ = $1 + $2 + $3 + $4 + $5;"],
                ["LT CHARS GT e", "$$ = $1 + $2 + $3 + $4;"],
            ]
        }
    };

    // `grammar` can also be a string that uses jison's grammar format
    var parser = new Parser(grammar);

    //TODO unset unused callbacks

    return parser;
};