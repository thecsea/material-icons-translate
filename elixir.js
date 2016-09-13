/**
 * Created by claudio on 13/09/16.
 */
var Elixir = require('laravel-elixir');
var Gulp = require('gulp');

var Print = require('gulp-print');
var Plumber = require('gulp-plumber');

var MaterialIconsTranslator = require('./gulp');

var Task = Elixir.Task;

Elixir.extend('materialIconsTranslator', function (src, pipe, simple)
{
    new Task('materialIconsTranslator', function ()
    {
        return Gulp
            .src(src)
            .pipe(Print())
            .pipe(Plumber())
            .pipe(MaterialIconsTranslator(simple))
            .pipe(pipe())
            .pipe(Print());
    }).watch(src);
});
//TODO notify
