const gulp = require('gulp');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const compass = require('gulp-compass');
const runSequence = require('run-sequence');
const cleanCSS = require('gulp-clean-css');
const include = require('gulp-include');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const sass = require('gulp-sass');

const BASE_PATH = './src/ui';
const path = require('path');

gulp.task('default', function() {
    return runSequence(['clean'],['build'],['server','watch']);
});
gulp.task('clean', function() {
    return del('./src/ui/dist/*',function() {
        console.log('task clean completed');
    })
});
gulp.task('build', function () {
    return runSequence(['sass', 'img', 'html','uglify-js'], function() {
        console.log('task build is completed!');
    });
});

gulp.task('img', function() {
    return gulp.src('./src/ui/src/img/**/*.*')
      .pipe(imagemin())
      .pipe(gulp.dest('./src/ui/dist/img/'))
      .pipe(gulp.dest('./src/public/img/'))
});

gulp.task('uglify-js', function() {
    return gulp.src(['./src/ui/src/js/**/*.js','!./src/ui/src/js/**/*.min.js'])
    .pipe(uglify())
    .pipe(gulp.dest('./src/ui/dist/js/'))
      .pipe(gulp.dest('./src/public/js'));
});

gulp.task('server', function() {
    browserSync.init({
        server:'./src/ui/dist/',
        port: 8001
    });
});

gulp.task('reload', function() {
    return browserSync.reload();
});


gulp.task('sass', function() {
  return gulp.src('./src/ui/src/sass/**/*.scss')
    .pipe(sass({outputStyle:'compressed'}).on('error',sass.logError))
    .pipe(cleanCSS())
    .pipe(autoprefixer({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./src/ui/src/css'))
    .pipe(gulp.dest('./src/ui/dist/css'))
    .pipe(gulp.dest('./src/public/css'));
});

gulp.task('html', function() {
    return gulp.src('./src/ui/src/html/*.html')
        .pipe(include())
        .pipe(gulp.dest('./src/ui/dist/'));
});

gulp.task('watch', function() {
    return gulp.watch([
        './src/ui/src/**/*.*'
    ], function() {
        return runSequence(['build'],['reload']);
    });
});
