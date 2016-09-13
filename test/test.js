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

            it('Should parse content without closing tag (double)', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<br ><br>aaaa');
                materialIconsTranslator.translate().should.be.equal('<br ><br>aaaa');
            });

            it('Should parse content with closing tag in the tag open', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<br/>aaaa');
                materialIconsTranslator.translate().should.be.equal('<br/>aaaa');
            });

            it('Should parse content with closing tag in the tag open (double)', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<br /><br/>aaaa');
                materialIconsTranslator.translate().should.be.equal('<br /><br/>aaaa');
            });

            it('Should parse epty tag', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<aaaa></aaaa>');
                materialIconsTranslator.translate().should.be.equal('<aaaa></aaaa>');
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

        describe('Complex parsing', () => {
            it('Should parse content inner other tags', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<aaaa><aaa class="material-icons">delete</aaa></aaaa>');
                materialIconsTranslator.translate().should.be.equal('<aaaa><aaa class="material-icons">&#xE872;</aaa></aaaa>');
            });

            it('Should parse content into t2o different tags tags', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<aaa class="material-icons">delete</aaa><aaaa class="material-icons">delete</aaaa>');
                materialIconsTranslator.translate().should.be.equal('<aaa class="material-icons">&#xE872;</aaa><aaaa class="material-icons">&#xE872;</aaaa>');
            });

            it('Should parse content inner other tags (2 tags)', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<aaaa><aaa class="material-icons">delete</aaa><aaa class="material-icons">delete</aaa></aaaa>');
                materialIconsTranslator.translate().should.be.equal('<aaaa><aaa class="material-icons">&#xE872;</aaa><aaa class="material-icons">&#xE872;</aaa></aaaa>');
            });


            it('Should parse content inner other tags (external class)', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<aaaa class="material-icons"><aaa>delete</aaa></aaaa>');
                materialIconsTranslator.translate().should.be.equal('<aaaa class="material-icons"><aaa>&#xE872;</aaa></aaaa>');
            });

            it('Should parse content inner other tags with middle text', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<aaaa>text<aaa class="material-icons">delete</aaa></aaaa>');
                materialIconsTranslator.translate().should.be.equal('<aaaa>text<aaa class="material-icons">&#xE872;</aaa></aaaa>');
            });

            it('Should not parse content inner other tags (no class)', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<aaaa><aaa>delete</aaa></aaaa>');
                materialIconsTranslator.translate().should.be.equal('<aaaa><aaa>delete</aaa></aaaa>');
            });

            it('Should allow to use non closing chars', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<aaaa><aaa>br</aaa></aaaa>');
                materialIconsTranslator.translate().should.be.equal('<aaaa><aaa>br</aaa></aaaa>');
            });

            it('Should allow to use non closing chars 2', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<aaaa br><aaa></aaa></aaaa>');
                materialIconsTranslator.translate().should.be.equal('<aaaa br><aaa></aaa></aaaa>');
            });

            it('Should allow to use non closing chars 3 (with class)', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<aaaa class="material-icons" br ><aaa></aaa></aaaa>');
                materialIconsTranslator.translate().should.be.equal('<aaaa class="material-icons" br ><aaa></aaa></aaaa>');
            });

            it('Should allow to use non closing chars 4 (external)', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('br<aaaa><aaa></aaa></aaaa>');
                materialIconsTranslator.translate().should.be.equal('br<aaaa><aaa></aaa></aaaa>');
            });

            it('Should allow to use non closing chars 5 (inside class)', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<aaaa class="material-icons br"><aaa>delete</aaa></aaaa>');
                materialIconsTranslator.translate().should.be.equal('<aaaa class="material-icons br"><aaa>&#xE872;</aaa></aaaa>');
            });

            it('Should allow to use spaces', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<aaaa class="material-icons" ><aaa>delete</aaa></aaaa>');
                materialIconsTranslator.translate().should.be.equal('<aaaa class="material-icons" ><aaa>&#xE872;</aaa></aaaa>');
            });

            it('Should allow to use material-icons as text 1', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<aaaa class="material-icons" ><aaa>material-icons</aaa></aaaa>');
                materialIconsTranslator.translate().should.be.equal('<aaaa class="material-icons" ><aaa>material-icons</aaa></aaaa>');
            });

            it('Should allow to use material-icons as text 2', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('material-icons<aaaa class="material-icons" ><aaa>aaa</aaa></aaaa>');
                materialIconsTranslator.translate().should.be.equal('material-icons<aaaa class="material-icons" ><aaa>aaa</aaa></aaaa>');
            });

            it('Should allow to use class in self-closed without parsing', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<br class="material-icons" ><aaa>delete</aaa>');
                materialIconsTranslator.translate().should.be.equal('<br class="material-icons" ><aaa>delete</aaa>');
            });

            it('Should allow to use class in self-closed in material elements', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<aaaaa class="material-icons" ><aaa><br>delete</aaa></aaaaa>');
                materialIconsTranslator.translate().should.be.equal('<aaaaa class="material-icons" ><aaa><br>&#xE872;</aaa></aaaaa>');
            });

            it('Should allow to insert blank spaces and new lines', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('    <html>\n<br class="material-icons" ><aaa>delete</aaa></html>');
                materialIconsTranslator.translate().should.be.equal('    <html>\n<br class="material-icons" ><aaa>delete</aaa></html>');
            });

            it('Should allow to use html comments', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<!--comment--!>');
                materialIconsTranslator.translate().should.be.equal('<!--comment--!>');
            });
        });
    });
    describe('Lex', () => {
        "use strict";
        describe('Simple lex', () => {
            it('Should lex', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<aaa class="material-icons">delete</aaa>ssss', true);
                setLog(true);
                materialIconsTranslator.translate();
                consoleValue.should.be.not.equal('');
            });

            it('Should not lex', () => {
                var materialIconsTranslator = new MaterialIconsTranslator('<aaa class="material-icons">delete</aaa>ssss', false);
                setLog(true);
                materialIconsTranslator.translate();
                consoleValue.should.be.equal('');
            });

            it('Should retrieve the right lex value', () => {
                //setLog(true);
                var materialIconsTranslator = new MaterialIconsTranslator('<aaa class="material-icons">delete</aaa>ssss', true);
                setLog(true);
                materialIconsTranslator.translate();
                consoleValue.should.be.equal('LT CHAR CHAR CHAR SPACES CHAR CHAR CHAR CHAR CHAR CHAR CHAR MATERIAL CHAR GT CHAR CHAR CHAR CHAR CHAR CHAR CLOSE_L CHAR CHAR CHAR GT CHAR CHAR CHAR CHAR EOF ');
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
        });
    });
});