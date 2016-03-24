/**
 * Created by yjh on 16/2/1.
 */
var gulp=require('gulp');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-htmlmin');
var minifyCss = require('gulp-cssnano');
var rev = require('gulp-rev');
var shell = require('gulp-shell');

gulp.task('tsc',shell.task(['tsc'],{ignoreErrors:true}));

gulp.task('clean',shell.task(['rm -rf dist']));


gulp.task('cleanBuild',['usemin'],shell.task(['rm -rf build']));
gulp.task('cleanBuild_module',['usemin_module'],shell.task(['rm -rf build']));

gulp.task('usemin',['clean','tsc'], function() {
    return gulp.src('app/*.html')
        .pipe(usemin({
            css:[minifyCss],
            html: [ minifyHtml({ empty: true }) ],
            js: [uglify() ]
        }))
        .pipe(gulp.dest('./dist/'));
});
gulp.task('copy',function(){
    gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}')
        .pipe(gulp.dest('./dist/fonts'));
    gulp.src('./app/images/**/*.{jpg,png}')
        .pipe(gulp.dest('./dist/images'));
});

gulp.task('default', ['tsc','clean','usemin','cleanBuild','copy']);

