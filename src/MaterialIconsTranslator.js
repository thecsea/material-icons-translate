/**
 * Created by claudio on 09/09/16.
 */

"use strict";
var requireText = require('require-text');
var Utils = require('./Utils');
var materialTable = requireText('material-design-icons/iconfont/codepoints', require);
materialTable = materialTable.split(/\n/g).map(value=>value.split(/ /g).list('key', 'value'));
var parser = require('./Parser')(getUnicode);;

module.exports = class MaterialIconsTranslator{
    constructor(content){
        this.content = content;
    }

    translate(){
        return parser.parse(this.content);
    }


};

function getUnicode(name){
    name = name.trim();
    var results = materialTable.filter(value=>value.key==name);
    if(results.length == 0)
        return null;
    return '&#'+results[0].value;
}