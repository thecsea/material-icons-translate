/**
 * Created by claudio on 09/09/16.
 */
var MaterialIconsTranslator = require('./src/MaterialIconsTranslator');

var lib = function (content, debug){
    "use strict";
    return lib.simple(content, debug);
};

lib.simple = function(content, debug){
    return new MaterialIconsTranslator(content, debug).simpleTranslate();
};
module.exports = lib;