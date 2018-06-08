/**
 * Created by claudio on 09/09/16.
 */
var chai = require('chai');
var MaterialIconsTranslator = require('../src/MaterialIconsTranslator');
var fs = require('fs');
//var assert = chai.assert;

// npm test --coverage to get coverage

var should = chai.should();

var consoleValue = '';
var myLog = function(str, str2){
    "use strict";
    str2 = str2 || '';
    consoleValue = str + str2;
    setLog(false);
};
var originalLog = console.log;

function setLog(custom){
    "use strict";
    if(custom) {
        consoleValue = '';
        console.log = myLog;
    }else
        console.log = originalLog;
}


describe('Material Icons Translator', () => {
    describe('New', () => {
        describe('Content', () => {
            it('Should set the content', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<aaa class="material-icons">delete</aaa>ssss');
                materialIconsTranslator.should.have.property('content').equal('<aaa class="material-icons">delete</aaa>ssss');
            });

            it('Should set automatically the debug value', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<aaa class="material-icons">delete</aaa>ssss');
                materialIconsTranslator.should.have.property('debug').equal(false);
            });

            it('Should set the debug value', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<aaa class="material-icons">delete</aaa>ssss', true);
                materialIconsTranslator.should.have.property('debug').equal(true);
            });
        });
    });

    describe('Simple parser', () => {
        describe('Simple parse', () => {
            it('Should parse', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<i class="material-icons">delete</i>');
                materialIconsTranslator.simpleTranslate().should.be.equal('<i class="material-icons">&#xE872;</i>');
            });

            it('Should parse double', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<i class="material-icons">delete</i><i class="material-icons">delete</i>');
                materialIconsTranslator.simpleTranslate().should.be.equal('<i class="material-icons">&#xE872;</i><i class="material-icons">&#xE872;</i>');
            });

            it('Should parse inner', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<html><i class="material-icons">delete</i></html>');
                materialIconsTranslator.simpleTranslate().should.be.equal('<html><i class="material-icons">&#xE872;</i></html>');
            });

            it('Should parse other classes', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<i class="material-icons pippo">delete</i>');
                materialIconsTranslator.simpleTranslate().should.be.equal('<i class="material-icons pippo">&#xE872;</i>');
            });
        });
    });
});