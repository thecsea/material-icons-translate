/**
 * Created by claudio on 09/09/16.
 */

"use strict";
var requireText = require('require-text');
var Utils = require('./Utils');
var materialTable = requireText('material-design-icons/iconfont/codepoints', require);
materialTable = materialTable.split(/\n/g).map(value=>value.split(/ /g).list('key', 'value'));

module.exports = class MaterialIconsTranslator{
    constructor(content, debug){
        this.content = content;
        this.debug = debug || false;
    }

    simpleTranslate(){
        return this.content.replace(/(<i[^<]*material-icons[^<]*>)([^<]*)(<\/i>)/gi, MaterialIconsTranslator.replacer);
    }

    static replacer(match, p1, p2, p3, offset, string) {
        // p1 is nondigits, p2 digits, and p3 non-alphanumerics
        p2 = MaterialIconsTranslator.getUnicode(p2) || p2;
        return [p1, p2, p3].join('');
    }

    static getUnicode(name){
        return getUnicode(name);
    }

};

function getUnicode(name){
    name = name.trim();
    var results = materialTable.filter(value=>value.key==name);
    if(results.length == 0)
        return null;
    return '&#x'+results[0].value.toUpperCase()+';';
}