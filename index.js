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
module.exports = function(content){
    return new MaterialIconsTranslator(content).translate();
}