var gulp = require('gulp');
var less = require('gulp-less');
var rename = require('gulp-rename');
var header = require('gulp-header');
var sourcemaps = require('gulp-sourcemaps');
var nano = require('gulp-cssnano');
var autoprefixer = require('autoprefixer');
var postcss = require('gulp-postcss');
var pkg = require('./package.json');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

// 编译、压缩LESS文件，生成发布的CSS文件
gulp.task('build-less', function() {
   var remark = [
    '/*!',
    ' * SimpleUI v<%= pkg.version %>',
	' * URL: <%= pkg.homepage %>',
    ' * (c) <%= new Date().getFullYear() %> by <%= pkg.author %>. All rights reserved.',
    ' * Licensed under the <%= pkg.license %> license',
    ' */',
    ''].join('\n');
    
   gulp.src('src/style/simpleui.less')
       .pipe(sourcemaps.init())
       .pipe(less())
       .pipe(postcss([autoprefixer(['iOS >= 7', 'Android >= 4.1'])]))
       .pipe(header(remark, { pkg : pkg } ))
       .pipe(gulp.dest('dist/style/'))
       .pipe(rename({suffix: '.min'}))
       .pipe(nano({
            zindex: false,
            autoprefixer: false,
            discardComments: {discardComments: true},
            normalizeCharset: false
        }))
       .pipe(gulp.dest('dist/style/'));
});

// 编译、压缩 Zepto文件
gulp.task('build-zepto', function() {
	gulp.src([
		'./node_modules/zepto/src/zepto.js',
		'./node_modules/zepto/src/event.js',
		'./node_modules/zepto/src/ajax.js',
		'./node_modules/zepto/src/form.js',
		'./node_modules/zepto/src/fx.js',
		'./node_modules/zepto/src/fx_methods.js',
		'./src/src/zepto_extends.js',
		'./node_modules/zepto/src/selector.js',
		'./node_modules/zepto/src/touch.js',
		'./node_modules/zepto/src/stack.js'
	])
		.pipe(concat({ path: 'zepto.js'}))
		.pipe(gulp.dest('dist/js/'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify({
			preserveComments: "license"
		}))
		.pipe(gulp.dest('dist/js/'))
});

// 编译发布
gulp.task('default', ['build-less', 'build-zepto']);