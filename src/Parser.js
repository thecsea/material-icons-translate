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
                ["\\s+",                    "return 'SPACES'"],
                ["<!--",                    "return 'LC'"],
                ["--!>",                    "return 'RC'"],
                ["material-icons",          "return 'MATERIAL'"], //consider to insert \\b
                ["area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr|!DOCTYPE ", "return 'NON_CLOSING'"], //consider to insert \\b
                ["<\\/",                     "return 'CLOSE_L'"],
                ["\\/>",                     "return 'CLOSE_G'"],
                ["<",                        "return 'LT'"],
                [">",                        "return 'GT'"],
                ["[^<>\\/]",                 "return 'CHAR'"],
            ]
        },

        "bnf": {
            "expressions" :[[ "e EOF",   "return $1;"],[ "EOF","return '';"]],

            "e" :[
                ["tags", "$$ = $1;"],
            ],

            "tags":[
                ["full_text", "$$ = $1;"],
                ["tag", "$$ = $1;"],
                ["full_text tag tags", "$$ = $1 + $2 + $3"],
                ["full_text tag", "$$ = $1 + $2;"],
                ["tag tags", "$$ = $1 + $2;"], //TODO insert also tag full_text tags?
            ],

            "tag":[
                ["open_tag tags close_tag", "$$ = $1 + $2 + $3;"],
                ["open_tag close_tag", "$$ = $1 + $2;"],
                ["material_open_tag material_tags close_tag", "$$ = $1 + $2 + $3;"],
                ["material_open_tag close_tag", "$$ = $1 + $2;"],
                ["open_close_tag", "$$ = $1;"],
                ["only_open_tag", "$$ = $1;"],
            ],

            "material_tags":[
                ["full_text", "$$ = GLOBAL._parser.callbacks["+id+"]($1);"],
                ["material_tag", "$$ = $1;"],
                ["full_text material_tag material_tags", "$$ = GLOBAL._parser.callbacks["+id+"]($1) + $2 + $3"],
                ["full_text material_tag", "$$ = GLOBAL._parser.callbacks["+id+"]($1) + $2;"],
                ["material_tag material_tags", "$$ = $1 + $2;"], //TODO insert also tag full_text material_tags?
            ],

            "material_tag":[
                ["open_tag material_tags close_tag", "$$ = $1 + $2 + $3;"],
                ["open_tag close_tag", "$$ = $1 + $2;"],
                ["material_open_tag material_tags close_tag", "$$ = $1 + $2 + $3;"],
                ["material_open_tag close_tag", "$$ = $1 + $2;"],
                ["open_close_tag", "$$ = $1;"],
                ["only_open_tag", "$$ = $1;"],
            ],

            "open_tag":[
              ["LT closing_words GT", "$$ = $1 + $2 + $3;"]
            ],

            "close_tag":[
                ["CLOSE_L closing_text GT", "$$ = $1 + $2 + $3;"] //TODO or closing_words?
            ],

            "material_open_tag":[
                ["LT closing_words MATERIAL full_text GT", "$$ = $1 + $2 + $3 + $4 + $5;"] //TODO insert words before MATERIAL (class=")
            ],

            "only_open_tag":[
                ["LT non_closing GT", "$$ = $1 + $2 + $3;"]
            ],

            "open_close_tag":[
                ["LT non_closing CLOSE_G", "$$ = $1 + $2 + $3;"]
            ],

            "non_closing":[
                ["SPACES NON_CLOSING text","$$ = $1 + $2 + $3;"],
                ["NON_CLOSING text","$$ = $1 + $2;"],
                ["NON_CLOSING","$$ = $1;"],
                ["SPACES NON_CLOSING","$$ = $1 + $2;"],
            ],

            "closing_words":[
                ["closing SPACES words_with_non_closing", "$$ = $1 + $2 + $3;"],
                ["closing", "$$ = $1;"],
            ],

            "closing_text":[
                ["closing SPACES full_text", "$$ = $1 + $2 + $3;"],
                ["closing", "$$ = $1;"],
            ],

            "closing":[
                ["SPACES word","$$ = $1 + $2;"],
                ["word","$$ = $1;"],
            ],

            "full_text":[
                ["text_comments NON_CLOSING full_text", "$$ = $1 + $2 + $3;"],
                ["text_comments NON_CLOSING", "$$ = $1 + $2;"],
                ["NON_CLOSING full_text", "$$ = $1 + $2;"],
                ["NON_CLOSING", "$$ = $1;"],
                ["text_comments", "$$ = $1;"],
            ],

            "text_comments":[
                ["text comments text_comments", "$$ = $1 + $2 + $3;"],
                ["comments text_comments", "$$ = $1 + $2;"],
                ["comments", "$$ = $1;"],
                ["text", "$$ = $1;"],
            ],

            "comments":[
                ["LC text RC", "$$ = $1 + $2 + $3;"],
            ],

            "text":[
                ["words MATERIAL text", "$$ = $1 + $2 + $3;"],
                ["MATERIAL text", "$$ = $1 + $2;"],
                ["words", "$$ = $1;"],
                ["MATERIAL", "$$ = $1;"],
            ],

            "words_with_non_closing":[
                ["NON_CLOSING words_with_non_closing","$$ = $1 + $2;"],
                ["NON_CLOSING","$$ = $1;"],
                ["words NON_CLOSING words_with_non_closing","$$ = $1 + $2 + $3;"],
                ["words NON_CLOSING","$$ = $1 + $2;"],
                ["words","$$ = $1;"],
            ],

            "words":[
                ["SPACES words","$$ = $1 + $2;"],
                ["SPACES","$$ = $1;"],
                ["word SPACES words","$$ = $1 + $2 + $3;"],
                ["word SPACES","$$ = $1 + $2;"],
                ["word","$$ = $1;"],
            ],

            "word":[
                ["CHAR word","$$ = $1 + $2;"],
                ["CHAR","$$ = $1;"],
            ],
        }
    };

    // `grammar` can also be a string that uses jison's grammar format
    var parser = new Parser(grammar);

    //TODO unset unused callbacks

    return parser;
};