var gulp = require('gulp');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var ngHtml2Js = require("gulp-ng-html2js");
var minifyHtml = require("gulp-minify-html");
var minifyCSS = require("gulp-minify-css");
var clean = require('gulp-clean');
var inject = require("gulp-inject");
var sass = require('gulp-ruby-sass');
var rename = require('gulp-rename');
var ngmin = require('gulp-ngmin');
var template = require('gulp-template');
var karma = require('gulp-karma');
var livereload = require('gulp-livereload');
var pkg = require('./package.json');

// Live reload server
var server = livereload();

/**
 * Store environment variables
 */
var env = {};

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
* Set environment vars
*/
var setRelease = function(isRelease) {
    
    if(isRelease) {
        env.release = true;
        env.destFolder = './dist';
    }
    else {    
        env.release = false;
        env.destFolder = './build';
    }

};

/**
* css helper
*/
var processCSS = function(srcArray,destFilename) {

    if(srcArray.length > 0) {

        var cssPipe = gulp.src(srcArray)
            .pipe(concat(destFilename));

        if (env.release) {
            cssPipe = cssPipe
                .pipe(minifyCSS());
        }

        return cssPipe
            .pipe(gulp.dest(env.destFolder));
    }

}

/**
* JS helper
*/
var processJS = function(srcArray,destFilename) {

    if(srcArray.length > 0) {

        var jsPipe = gulp.src(srcArray);
            
        // Only uglify in release builds
        if (env.release) {

            jsPipe = jsPipe
                .pipe(uglify());
        }

        return jsPipe
            .pipe(concat(destFilename))
            .pipe(gulp.dest(env.destFolder));
    }

}

/**
* Clean the build and dist directorys
*/
gulp.task('clean', function() {

    return gulp.src(['./dist', './build'], {
        read: false
    })
        .pipe(clean());

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
        .pipe(uglify())
        .pipe(gulp.dest("./build")); // Always store the compiled templates in build folder as need single location for require statement. Don't want to put into src folder.

});

/**
* Browserify app
*/
gulp.task('browserify', ['templates'], function() {

    var bundleStream = browserify('./src/app/app.js').bundle({
        debug: !env.release
    }).pipe(source('../app.js'));

    // Make safe for minification
    if (env.release) {
        bundleStream = bundleStream
            .pipe(streamify(ngmin()));
    }

    return bundleStream.pipe(gulp.dest('{0}/app.js'.format(env.destFolder)));

});

/**
* Introspect src folder for sass files, then preprocess
*/
gulp.task('sass', function() {

    return gulp.src('./src/scss/main.scss')
        .pipe(inject(gulp.src(["./src/app/**/*.scss"], {
            read: false
        }), {
            transform: function(filepath) {
                return "@import '../.." + filepath + "';"
            },
            starttag: "/* inject:scss */",
            endtag: "/* endinject */"
        }))
        .pipe(sass())
        .pipe(rename('app.css'))
        .pipe(gulp.dest(env.destFolder));

});

/**
* Concat external css files and app css
*/
gulp.task('css', ['sass'], function() {

    return processCSS(pkg.config.paths["stylesheets"].concat(['{0}/app.css'.format(env.destFolder)]),'app.css');

});

/**
* Concat external css specific to IE
*/
gulp.task('css-ie', ['sass'], function() {

    return processCSS(pkg.config.paths["stylesheets-ie"],'app-ie.css');

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
gulp.task('js', ['browserify'], function() {

    // Remove templates.js as browserify'ed into app.js already
    gulp.src('./build/templates.js', {
        read: false
    })
    .pipe(clean({
        force: true
    }));

    return processJS(pkg.config.paths["scripts"].concat(['{0}/app.js'.format(env.destFolder)]),'app.js');

});

/**
* Concat external js specific to IE
*/
gulp.task('js-ie', function() {

    return processJS(pkg.config.paths["scripts-ie"],'app-ie.js');

});

/**
* Introspect for tests and create test entrypoint js file for Browserify
*/
gulp.task('create-tests', ['templates'], function() {

    return gulp.src('./src/app/tests.js')
        .pipe(inject(gulp.src(["./src/app/**/*_test.js"], {
            read: false
        }), {
            transform: function(filepath) {
                return "require('.." + filepath + "');"
            },
            starttag: "/* inject:js */",
            endtag: "/* endinject */"
        }))
        .pipe(gulp.dest('./build'));
});

/**
* Browserify tests
*/
gulp.task('browserify-tests', ['create-tests'], function() {

    return browserify('./build/tests.js').bundle({
        debug: true
    })
    .pipe(source('../tests.js'))
    .pipe(gulp.dest('./build/tests.js'));

});

/**
* Create build version
*/
gulp.task('build', ['clean'], function() {
    
    setRelease(false);

    // Must use start to ensure clean has completed
    gulp.start('js', 'js-ie', 'css', 'css-ie', 'html');

});

/**
* Create release version
*/
gulp.task('release', ['clean'], function() {
    
    setRelease(true);

    // Must use start to ensure clean has completed
    gulp.start('js', 'js-ie', 'css', 'css-ie', 'html');

});

/**
* Run tests
*/
gulp.task('test', ['browserify-tests'], function() {

    return gulp.src(['./build/tests.js'])
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }));
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

    setRelease(false);

    gulp.watch(['./src/app/**/*.js','./src/**/*.html'],['js','html']);
    gulp.watch(['./src/app/**/*.scss','./src/scss/**/*.scss'],['css']);
    gulp.watch(['./build/app.js'],['test']);

    gulp.watch('./build/**').on('change', function(file) {
        server.changed(file.path);
    });

});
