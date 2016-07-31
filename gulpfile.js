/**
 * Created by cyh on 16/7/21.
 */
var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
const concat = require('gulp-concat');

gulp.task('html2enml_build', function () {
    return browserify({entries: './src/js/html2enml.js', debug: true})
        .transform("babelify", {presets: ["es2015"]})
        .bundle()
        .pipe(source('html2enml_only.js'))
        .pipe(buffer())
        //.pipe(uglify())
        .pipe(concat('html2enml_only.js'))
        .pipe(gulp.dest('./dest/js'));
});

gulp.task('html2enml_concat',['html2enml_build'], function () {
    return gulp.src(['src/js/lib/*.js', 'dest/js/html2enml_only.js'])
        .pipe(concat('html2enml.js'))
        .pipe(gulp.dest('./dest/js'));
});

gulp.task('app_build', function () {
    return browserify({entries: './src/js/app.js', debug: true})
        .transform("babelify", {presets: ["es2015"]})
        .bundle()
        .pipe(source('app_only.js'))
        .pipe(buffer())
        //.pipe(uglify())
        .pipe(concat('app_only.js'))
        .pipe(gulp.dest('./dest/js'));
});

gulp.task('app_concat',['app_build'], function () {
    return gulp.src(['src/js/lib/*.js', 'dest/js/app_only.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./dest/js'));
});



gulp.task('html2enml_watch', ['html2enml_build','html2enml_concat'], function () {
    gulp.watch('./src/js/*.js', ['html2enml_watch','html2enml_concat']);
});

gulp.task('app_watch', ['app_build','app_concat'], function () {
    gulp.watch('./src/js/*.js', ['app_watch','app_concat']);
});

gulp.task('default', ['html2enml_build','html2enml_concat', 'html2enml_watch']);
gulp.task('app', ['app_build','app_concat', 'app_watch']);