/**
 * Created by claudio on 22/10/16.
 */

"use strict";
const MaterialIconsTranslator = require('./index');
const loaderUtils = require('loader-utils');

module.exports = function(source) {
  this.cacheable && this.cacheable();
  let options = loaderUtils.getOptions(this) || {};
  return MaterialIconsTranslator.simple(source, options.debug || false);
};