const { src, dest, watch, parallel, series } = require('gulp');
const newer = require('gulp-newer');
const browserSync = require('browser-sync').create();
const concatFile = require('gulp-concat');
const clean = require('gulp-clean');
const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass')(require('sass'));
const compressCSS = require('gulp-clean-css');
const compressJS = require('gulp-uglify-es').default;
const babel = require('gulp-babel');
const avifPlugin = require('gulp-avif');
const webpPlugin = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');

const root = () => {
    return src(['src/*.*', '!src/*.html']).pipe(dest('dist'));
};

const html = () => {
    return src('src/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest('dist'));
};

const fonts = () => {
    return src('src/fonts/*.{ttf,otf}')
        .pipe(fonter({ formats: ['woff'] }))
        .pipe(dest('dist/fonts'))
        .pipe(src('src/fonts/*.{ttf,otf}'))
        .pipe(ttf2woff2())
        .pipe(dest('dist/fonts'));
};

const styles = () => {
    return src(['src/css/*.scss', 'src/css/*.css'])
        .pipe(sass().on('error', sass.logError))
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 10 versions'],
                cascade: false,
            }),
        )
        .pipe(compressCSS({ compatibility: 'ie8' }))
        .pipe(concatFile('index.min.css'))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());
};

const scripts = () => {
    return src(['src/js/index.js'])
        .pipe(concatFile('index.min.js'))
        .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(compressJS())
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream());
};

const watching = () => {
    browserSync.init({
        server: {
            baseDir: 'dist/',
        },
    });
    watch(
        ['src/css/*.{css,scss}', 'src/css/*/*.{css,scss}'],
        series(styles, (done) => {
            browserSync.reload();
            done();
        }),
    );
    watch(
        ['src/js/*.js'],
        series(scripts, (done) => {
            browserSync.reload();
            done();
        }),
    );
    watch(
        ['src/*.html'],
        series(html, (done) => {
            browserSync.reload();
            done();
        }),
    );
    watch(
        ['src/assets/img'],
        series(convertToAvif, convertToWebp, toDistSvg, (done) => {
            browserSync.reload();
            done();
        }),
    );
};

const cleanDir = () => {
    return src(['dist/*']).pipe(clean());
};

const deleteCompressDir = () => {
    return src('src/assets/compress-images', { read: false, allowEmpty: true }).pipe(clean());
};

const convertToAvif = () => {
    return src('src/assets/compress-images/*.{png,jpg,jpeg}')
        .pipe(newer('dist/assets/img/'))
        .pipe(avifPlugin())
        .pipe(dest('dist/assets/img/'));
};

const convertToWebp = () => {
    return src('src/assets/compress-images/*.{png,jpg,jpeg}')
        .pipe(newer('dist/assets/img/'))
        .pipe(webpPlugin())
        .pipe(dest('dist/assets/img/'));
};

const toDistSvg = () => {
    return src('src/assets/compress-images/*.svg').pipe(imagemin()).pipe(dest('dist/assets/img/'));
};

const toDistInitFormat = () => {
    return src('src/assets/compress-images/*.{png,jpg,jpeg}')
        .pipe(newer('dist/assets/img/'))
        .pipe(dest('dist/assets/img/'));
};

const compressSrcImage = () => {
    return src('src/assets/img/*.*')
        .pipe(newer('src/assets/compress-images/'))
        .pipe(imagemin())
        .pipe(dest('src/assets/compress-images/'));
};

const images = (done) => {
    series(compressSrcImage, toDistSvg, convertToWebp, convertToAvif, toDistInitFormat, deleteCompressDir)(done);
};

exports.clean = cleanDir;
exports.fonts = fonts;
exports.html = html;
exports.root = root;
exports.scripts = scripts;
exports.styles = styles;
exports.watching = watching;
exports.images = images;
exports.compressSrcImage = compressSrcImage;

exports.convertToAvif = convertToAvif;
exports.convertToWebp = convertToWebp;
exports.toDistSvg = toDistSvg;
exports.toDistInitFormat = toDistInitFormat;
exports.deleteCompressDir = deleteCompressDir;

exports.build = series(cleanDir, html, root, styles, scripts, fonts, images);
exports.default = parallel(html, styles, scripts, watching);
