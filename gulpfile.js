// list dependeces
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const prefix = require('gulp-autoprefixer');
const minify = require('gulp-clean-css');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const imagewebp = require('gulp-webp');
const browsersync = require('browser-sync').create();

// create functions

// scss
function compileScss() {
    return src('src/scss/*.scss')
            .pipe(sass())
            .pipe(prefix('last 2 versions'))
            .pipe(minify())
            .pipe(dest('dist/css'))
}

// js
function jsMin() {
    return src('src/js/*.js')
            .pipe(terser())
            .pipe(dest('dist/js'))
}

// images
function optimizeImg() {
    return src('src/images/*.{jpg,png}')
            .pipe(imagemin(
                [
                    imagemin.mozjpeg({ quality:80, progressive: true }),
                    imagemin.optipng({ optimizationLevel: 2 })
                ]
            ))
            .pipe(dest('dist/images'))
}

//webp images
function webImage() {
    return src('dist/images/*.{jpg,png}')
            .pipe(imagewebp())
            .pipe(dest('dist/images'))
}

// browsersync tasks
function browsersyncServer(cb) {
    browsersync.init({
        server: {
            baseDir: '.'
        }
    });
    cb();
}

function browsersyncReload(cb) {
    browsersync.reload();
    cb();
}

// create watch tasks
function watchTask() {
    watch('*.html', browsersyncReload);
    watch('src/scss/*.scss', compileScss);
    watch('src/js/*.js', jsMin);
    watch('src/images/*.{jpg,png}', optimizeImg);
    watch('dist/images/*.{jpg,png}', webImage);
}

// default gulp
exports.default = series(
    compileScss,
    jsMin,
    optimizeImg,
    webImage,
    browsersyncServer,
    watchTask
);
