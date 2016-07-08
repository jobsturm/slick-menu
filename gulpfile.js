//*********** IMPORTS *****************
var gulp = require('gulp'),
    babel = require("gulp-babel"),
    gutil = require('gulp-util'),
    rename = require("gulp-rename"),
    map = require("map-stream"),
    livereload = require("gulp-livereload"),
    concat = require("gulp-concat"),
    uglify = require('gulp-uglify'),
    notify = require("gulp-notify"),
    watch = require('gulp-watch'),
    size = require('gulp-size'),
    minifyCss = require('gulp-minify-css'),
    inline = require('gulp-inline'),
    inlinesource = require('gulp-inline-source'),
    insert = require('gulp-insert'),
    fileinclude = require("gulp-file-include"),
    prettify = require('gulp-prettify'),
    gm = require('gulp-gm'),
    imageop = require('gulp-image-optimization'),
    filesize,
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    autoprefixer = require('gulp-autoprefixer'),
    reload = browserSync.reload;



var src = "dev/";

function swallowError(error) {
    // If you want details of the error in the console
    notify(error.toString());
    this.emit('end');
}

global.errorMessage = '';

gulp.task("default", ['images', 'sass', 'watch', 'js-custom', 'js-library', 'inline']);

// Browser sync
gulp.task('server', function() {
    browserSync.init({
        proxy: "localhost:1337/__new/history/build/"
    });
});

// JS

gulp.task('js-custom', function () {
    return gulp.src('dev/scripts/custom/*.js')
        .pipe(insert.prepend('/* Build by Job Sturm in 2016 */'))
        .pipe(babel())
        .on('error', swallowError)
        .pipe(concat('main.js'))
        .on('error', swallowError)
        .pipe(insert.append('console.log("Last updated on ' + Date() + '");'))
        .pipe(gulp.dest('build/scripts'))
        .pipe(livereload({
            start: true
        }));
});

gulp.task('js-library', function () {
    return gulp.src('dev/scripts/_libs/*.js')
        .pipe(concat('library.js'))
        .pipe(gulp.dest('build/scripts'))
        .pipe(livereload({
            start: true
        }));
});

// INLINE & INCLUDE

gulp.task('inline', ['js-custom'], function () {
    return gulp.src('dev/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'dev'
        }))
        .pipe(prettify({
            indent_size: 4
        }))
        .pipe(inline({
            js: uglify,
            css: minifyCss,
            disabledTypes: ['svg', 'img'],
            ignore: "../build/scripts/library.js"
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('filesize', ['inline'], function () {
    browserSync.reload();
    var s = size();    
    return gulp.src('dev/*.html')
        .pipe(s)    
        .pipe(notify({
            onLast: true,
            message: function message() {
                return 'Finsished gulp. Filesize is ' + s.prettySize;
            }
        }));
});

// IMAGES
gulp.task('images', function () {
    return gulp.src('dev/images/*')
        .pipe(gm(function (gmfile) {
            return gmfile;
        }))
        .pipe(imageop({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))    
        .pipe(gulp.dest('build/images/big'))
        .pipe(gm(function (gmfile) {
            return gmfile.resize(50, 50);
        }))
        .pipe(imageop({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))    
        .pipe(gulp.dest('build/images/small'));
});

// SCSS
gulp.task('sass', function () {
  return gulp.src('dev/sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 1 versions'],
        cascade: false
    }))  
    .pipe(gulp.dest('build/styles/css/'));
});

// WATCH

gulp.task('watch', function () {
    // Watc JS files
    gulp.watch('dev/scripts/custom/*.js', ['js-custom', 'inline', 'filesize']);
    gulp.watch('dev/scripts/_libs/*.js', ['js-library', 'inline', 'filesize']);

    // Watch SCSS files
    gulp.watch('dev/sass/**/*.scss', ['sass', 'inline', 'filesize']);
    
    // Watch HTML files
    gulp.watch('dev/**/*.html', ['js-custom', 'js-library', 'inline', 'filesize']);
    gulp.watch('dev/sass/*.scss', ['js-custom', 'js-library', 'inline', 'filesize']);
    gulp.watch("build/*.html").on('change', reload);    
});
