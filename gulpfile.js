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
var exorcist = require('exorcist');
var pkg = require('./package.json');

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


gulp.task('clean', function() {

    return gulp.src(['./dist','./build'], {
        read: false
    })
    .pipe(clean());

});


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


gulp.task('browserify', ['templates'], function() {

    var bundleStream = browserify('./src/app/app.js').bundle({
        debug: !env.production
    });

    bundleStream = bundleStream
        .pipe(source('../app.js'));

    if (env.production) {
        bundleStream = bundleStream
            .pipe(streamify(ngmin()))
            .pipe(streamify(uglify()));
    }

    return bundleStream.pipe(gulp.dest('{0}/app.js'.format(env.destFolder)));

});


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


gulp.task('css', ['sass'], function() {

    var cssPipe = gulp.src(pkg.config.paths.stylesheets.concat(['{0}/app.css'.format(env.destFolder)]))
        .pipe(concat('app.css'));

    if (env.production) {
        cssPipe = cssPipe
            .pipe(minifyCSS());
    }

    return cssPipe.pipe(gulp.dest(env.destFolder))
});


gulp.task('html', function() {
    return gulp.src('./src/index.html')
        .pipe(gulp.dest(env.destFolder));
});


gulp.task('js', ['browserify'], function() {
    
	return gulp.src('./build/templates.js', {
        read: false
    })
    .pipe(clean({
        force: true
    }));
	
});


gulp.task('build',['clean'],function() {
    env.production = false;
    env.destFolder = './build';

    // Must use start to ensure clean has completed
    gulp.start('js', 'css', 'html');
});


gulp.task('release',['clean'],function() {
    env.production = true;
    env.destFolder = './dist';

    // Must use start to ensure clean has completed
    gulp.start('js', 'css', 'html');
});


gulp.task('default', ['build'], function() {

});
