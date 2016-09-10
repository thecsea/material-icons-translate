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

    function setElements(elements){
        return elements.split(/ /g).map(setElement).join(' ');
    }

    var id = GLOBAL._parser.callbacks.push(setElements)-1;

    var grammar = {
        "lex": {
            "rules": [
                ["$",                       "return 'EOF';"],
                ["\\s+",                       "return 'SPACES'"],
                ["material-icons",          "return 'MATERIAL'"], //consider to insert \\b
                ["area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr", "return 'NON_CLOSING'"], //consider to insert \\b
                ["<",                       "return 'LT'"],
                [">",                       "return 'GT'"],
                ["\\/",                     "return 'CLOSE'"],
                ["[^<>\\/]",               "return 'CHAR'"],
            ]
        },

        "bnf": {
            "expressions" :[[ "e EOF",   "return $1;"],[ "EOF","return '';"]],

            "e" :[
                ["text tag e", "$$ = $1+ $2 + $3;"],
                ["text tag", "$$ = $1+ $2;"],
                ["text", "$$ = $1;"],
                ["tag e", "$$ = $1 + $2;"],
                ["tag", "$$ = $1;"],
            ],

            "tag":[
               ["open_close_tag", "$$ = $1;"],
               ["only_open_tag", "$$ = $1;"],
               ["open_tag tag close_tag", "$$ = $1 + $2 + $3;"],
               ["open_tag text close_tag", "$$ = $1 + $2 + $3;"],
               ["material_open_tag material_tag close_tag", "$$ = $1 + $2 + $3;"],
               ["material_open_tag text close_tag", "$$ = $1 + GLOBAL._parser.callbacks["+id+"]($2) + $3;"],
            ],

            "material_tag":[
                ["open_tag material_tag close_tag", "$$ = $1 + GLOBAL._parser.callbacks($2) + $3;"],
                ["open_tag text close_tag", "$$ = $1 + GLOBAL._parser.callbacks($2) + $3;"],
                ["material_open_tag material_tag close_tag", "$$ = $1 + GLOBAL._parser.callbacks($2) + $3;"],
                ["material_open_tag text close_tag", "$$ = $1 + GLOBAL._parser.callbacks["+id+"]($2) + $3;"],
            ],

            "open_tag":[
              ["LT words GT", "$$ = $1 + $2 + $3;"]
            ],

            "close_tag":[
                ["LT CLOSE text GT", "$$ = $1 + $2 + $3 + $4;"]
            ],

            "material_open_tag":[
                ["LT words MATERIAL words GT", "$$ = $1 + $2 + $3 + $4 + $5;"]
            ],

            "only_open_tag":[
                ["LT non_closing GT", "$$ = $1 + $2 + $3;"]
            ],

            "open_close_tag":[
                ["LT non_closing CLOSE GT", "$$ = $1 + $2 + $3 + $4;"]
            ],

            "non_closing":[
                ["SPACES NON_CLOSING text","$$ = $1 + $2 + $3;"],
                ["NON_CLOSING text","$$ = $1 + $2;"],
                ["NON_CLOSING","$$ = $1;"],
                ["SPACES NON_CLOSING","$$ = $1 + $2;"],
            ],

            "text":[
                ["words MATERIAL text", "$$ = $1 + $2;"],
                ["MATERIAL text", "$$ = $1 + $2;"],
                ["words", "$$ = $1;"],
                ["MATERIAL", "$$ = $1;"],
            ],

            "words":[
                ["word_element words","$$ = $1 + $2;"],
                ["word_element","$$ = $1;"],
            ],

            "word_element":[
                ["SPACES","$$ = $1;"],
                ["CHAR","$$ = $1;"],
            ],
        }
    };

    // `grammar` can also be a string that uses jison's grammar format
    var parser = new Parser(grammar);

    //TODO unset unused callbacks

    return parser;
};