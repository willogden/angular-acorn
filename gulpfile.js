var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var ngHtml2Js = require("gulp-ng-html2js");
var minifyHtml = require("gulp-minify-html");
var clean = require('gulp-clean');
var inject = require("gulp-inject");
var sass = require('gulp-ruby-sass');
var rename = require('gulp-rename');
var template = require('gulp-template');
var karma = require('gulp-karma');
var livereload = require('gulp-livereload');
var glob = require("glob")
var pkg = require('./package.json');


/**
 * Store environment variables
 */
var env = {
    destFolder: "./dist",
    buildFolder: "./build",
};


/**
 * Helper for use in manipulating paths based on evironment build type
 */
String.prototype.format = function() {
    var args = arguments;
    return this.replace(
        /\{(\w+)\}/g,
        function(a, b) {
            return args[b];
        }
    );
};


/**
* Clean the build and dist directorys
*/
gulp.task('clean', function() {

    return gulp.src([env.destFolder, env.buildFolder], {
        read: false
    }).pipe(clean());

});


/**
* Convert the html partials into js file to be required into Browserify
*/
gulp.task('templates', function() {

    return gulp.src("./src/**/*.tpl.html")
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(ngHtml2Js({
            stripPrefix: "app/"
        }))
        .pipe(concat("templates.js"))
        .pipe(gulp.dest(env.buildFolder)); // Always store the compiled templates in build folder as need single location for require statement. Don't want to put into src folder.

});


/**
* Browserify app
*/
gulp.task('browserify', ['templates'], function() {

    return browserify('./src/app/app.js',{debug: true})
          .bundle()
          .pipe(source('../app.js'))
          .pipe(buffer())
          .pipe(sourcemaps.init({loadMaps: true}))
          .pipe(ngAnnotate())
          .pipe(uglify())
          .pipe(sourcemaps.write('./'))
          .pipe(gulp.dest('{0}/app.js'.format(env.destFolder)));
});


/**
* Introspect src folder for sass files, then preprocess
*/
gulp.task('css', function() {

    return gulp.src('./src/scss/app.scss')
        .pipe(inject(gulp.src(["./src/app/**/*.scss","!./src/app/**/_*.scss"], {
            read: false
        }), {
            transform: function(filepath) {
                return "@import '../.." + filepath + "'; /* " + filepath + " */"
            },
            starttag: "/* inject:scss */",
            endtag: "/* endinject */"
        }))
        .pipe(sass({ style: 'compressed' }))
        .pipe(gulp.dest(env.destFolder));

});


/**
* Copy & template index.html to destination folder
*/
gulp.task('html', function() {
    return gulp.src('./src/index.html')
        .pipe(template(pkg))
        .pipe(gulp.dest(env.destFolder));
});


/**
* Concat external js and app js
*/
gulp.task('js', ['browserify','browserify-tests'], function() {

    // Remove templates.js as browserify'ed into app.js already
    return gulp.src('./build/templates.js', {
        read: false
    })
    .pipe(clean({
        force: true
    }));

});


/**
* Introspect for tests and create test entrypoint js file for Browserify
*/
gulp.task('create-tests',["templates"], function() {

    return gulp.src('./src/app/tests.js')
        .pipe(rename('tests-introspected.js'))
        .pipe(inject(gulp.src(["./src/app/**/*_test.js"], {
            read: false
        }), {
            transform: function(filepath) {
                return "require('.." + filepath + "');"
            },
            starttag: "/* inject:js */",
            endtag: "/* endinject */"
        }))
        .pipe(gulp.dest('{0}'.format(env.buildFolder)));
});


/**
* Browserify tests
*/
gulp.task('browserify-tests', ['create-tests'], function() {

    return browserify('{0}/tests-introspected.js'.format(env.buildFolder),{debug: true})
    .bundle()
    .pipe(source('../tests.js'))
    .pipe(gulp.dest('{0}/tests.js'.format(env.buildFolder)));

});


/**
* Create build version
*/
gulp.task('build', ['clean'], function() {

    // Must use start to ensure clean has completed
    gulp.start('js', 'css', 'html');

});


/**
* Run tests
*/
gulp.task('test',['browserify-tests'], function() {

    // Kill any dead karma instances that are lying around
    /*
    child = exec('killall node',
      function (error, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });
    */

    // Including es5 shim as PhantomJS has old version of webkit
    return gulp.src(['./vendor/es5-shim/es5-shim.min.js','./src/app/**/*_fixtures.html','{0}/*.css'.format(env.distFolder),'{0}/tests.js'.format(env.buildFolder)])
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'watch'
        })).on('error', function(err) {
            // Make sure failed tests cause gulp to exit non-zero
            throw err;
        });
});


/**
* Create build version then watch for changes
*/
gulp.task('default', ['build'], function() {

    gulp.start('watch');

});


/**
* Watch for changes
*/
gulp.task('watch', function() {

    // Build tasks
    gulp.watch(['./src/app/**/*.js','./src/app/**/*.html'], ['js']);
    gulp.watch(['./src/app/**/*.scss','./src/scss/**/*.scss'], ['css']);
    gulp.watch(['./src/images/**/*.*'],['images']);

    // Livereload
    livereload.listen();
    gulp.watch(['{0}/**'.format(env.distFolder)]).on('change', livereload.changed);

    // Fire up Karma which watches for changes to browserified tests
    gulp.start('test');

});
