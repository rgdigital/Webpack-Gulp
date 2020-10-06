import * as path from 'path'
import * as gulp from 'gulp'
import * as process from 'process'
import webpack from 'webpack-stream'
import Browser from 'browser-sync'
import htmlPartial from 'gulp-html-partial';
import inlinesource from 'gulp-inline-source';
import htmlmin from 'gulp-htmlmin';
import { series, parallel, watch } from 'gulp';
import sass from 'gulp-sass'
sass.compiler = require('node-sass');

const browser = Browser.create()
const reload = function(cb) {
    browser.reload()
    cb();
}

const isProduction = (process.env.NODE_ENV === 'production')

/* 
 * Compile app bundle
 */
gulp.task('app', function () {
    return gulp.src('./src/js/Index.js')
        .pipe(webpack({
            // watch: true,
            mode: 'development',
            entry: './src/js/Index.js',
            output: {
                filename: 'bundle.js',
                path: path.resolve(__dirname, './dist')
            },
            context: path.resolve(__dirname, './'),
            plugins: isProduction ? [new webpack.optimize.UglifyJsPlugin()] : []
        }))
        .pipe(gulp.dest('dist/'));
});

/* 
 * Compile preloader bundle
 */
gulp.task('preloader', function () {
    return gulp.src('./src/js/Preloader.js')
        .pipe(webpack({
            // watch: true,
            mode: 'development',
            entry: './src/js/Preloader.js',
            output: {
                filename: 'preloader.js',
                path: path.resolve(__dirname, './dist')
            },
            context: path.resolve(__dirname, './'),
            plugins: isProduction ? [new webpack.optimize.UglifyJsPlugin()] : []
        }))
        .pipe(gulp.dest('dist/'));
});

/* 
 * Copy HTML
 */
gulp.task('html', function () {
    return gulp.src(['./src/index.html'])
        .pipe(htmlPartial({
            basePath: 'src/_partials/'
        }))
        .pipe(inlinesource({
            rootpath : './dist'
        }))
        .pipe(htmlmin({
            collapseWhitespace: true,
            useShortDoctype: true,
            removeComments: true
        }))
        // .pipe(embedSvg({
        //     selectors: '.inline-svg',
        //     root: './src/'
        // }))
        .pipe(gulp.dest('dist'));
});

/* 
 * Scss
 */
gulp.task('scss', function () {
    return gulp.src('./src/css/scss/**/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(gulp.dest('./dist'))
        .pipe(browser.stream())
});

/* 
 * Assets
 */
gulp.task('assets', function () {
    return gulp.src([
        './src/public/**/*.{jpg,jpg,png,svg,gif}',
        './src/public/**/*.{ttf,woff,eot}',
    ], { base: './src/' })
        .pipe(gulp.dest('./dist'))
});

/* 
 * Default task
 */
gulp.task('default', series('html', 'app', 'preloader', 'scss', 'assets', function () {
    // Serve
    browser.init({
        server: 'dist',
    })
    // Watch files
    gulp.watch(['./src/public/**/*'], series('assets', reload));
    gulp.watch(['./src/js/Index.js'], series('app', reload));
    gulp.watch(['./src/js/Preloader.js'], series('preloader', 'html', reload));
    gulp.watch(['./src/css/scss/**/*.scss'], series('scss'));
    gulp.watch([
        './src/**/*.html',
        // './src/public/img/generic/icons/**/*.svg'
    ], series('html', reload));
}))