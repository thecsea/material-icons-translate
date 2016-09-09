/**
 * Created by claudio on 09/09/16.
 */
var chai = require('chai');
var MaterialIconsTranslator = require('../src/MaterialIconsTranslator');
var fs = require('fs');
//var assert = chai.assert;

// npm test --coverage to get coverage

var should = chai.should();

describe('Material Icons Translator', () => {
    describe('New', () => {
        describe('Content', () => {
            it('Should set the content', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<aaa class="material-icons">delete</aaa>ssss');
                materialIconsTranslator.should.have.property('content').equal('<aaa class="material-icons">delete</aaa>ssss');
            });
        });
    });

    describe('Parse', () => {
        "use strict";
        describe('Unicode', () => {
            it('Should retrieve the right unicode value', () => {
                MaterialIconsTranslator.getUnicode('delete').should.be.equal('&#xE872;');
            });

            it('Should return null for non existing icons', () => {
                var tmp = MaterialIconsTranslator.getUnicode('deleteAAAAA');
                should.not.exist(tmp);
            });
        });

        describe('Simple parsing', () => {
            it('Should parse simple content', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<aaa class="material-icons">delete</aaa>');
                materialIconsTranslator.translate().should.be.equal('<aaa class="material-icons">&#xE872;</aaa>');
            });

            it('Should parse simple content with end chars', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<aaa class="material-icons">delete</aaa>ssss');
                materialIconsTranslator.translate().should.be.equal('<aaa class="material-icons">&#xE872;</aaa>ssss');
            });

            it('Should parse simple content with begining chars', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('ssss<aaa class="material-icons">delete</aaa>');
                materialIconsTranslator.translate().should.be.equal('ssss<aaa class="material-icons">&#xE872;</aaa>');
            });

            it('Should parse empty string', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('');
                materialIconsTranslator.translate().should.be.equal('');
            });

            it('Should parse content without valid icon', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<aaa class="material-icons">deleteA</aaa>ssss');
                materialIconsTranslator.translate().should.be.equal('<aaa class="material-icons">deleteA</aaa>ssss');
            });

            it('Should parse content without icons', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<aaa>AAAA</aaa>ssss');
                materialIconsTranslator.translate().should.be.equal('<aaa>AAAA</aaa>ssss');
            });

            it('Should parse content without valid tags', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<aaa>AAAA</aaaA>ssss');
                materialIconsTranslator.translate().should.be.equal('<aaa>AAAA</aaaA>ssss');
            });

            it('Should parse content without closing tag', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<br>aaaa');
                materialIconsTranslator.translate().should.be.equal('<br>aaaa');
            });

            it('Should parse content with closing tag in the tag open', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<br/>aaaa');
                materialIconsTranslator.translate().should.be.equal('<br/>aaaa');
            });

            it('Should not parse content without valid HTML', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<aaa<AAAA</aaaA>ssss');
                var thrown = false;
                try {
                    materialIconsTranslator.translate();
                }catch(e){
                    thrown = true;
                }
                thrown.should.be.equal(true);
            });
        });
    });
});