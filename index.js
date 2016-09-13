/**
 * Created by claudio on 09/09/16.
 */
var MaterialIconsTranslator = require('./src/MaterialIconsTranslator');

/**
 *
 * @param content JSON or OBJECT
 * @param options
 * @returns Promise
 */
module.exports.default = function(content, debug){
    return new MaterialIconsTranslator(content, debug).translate();
};

module.exports.simple = function(content, debug){
    return new MaterialIconsTranslator(content, debug).simpleTranslate();
};