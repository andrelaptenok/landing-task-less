const project_folder = 'dist';
const source_folder = 'src';

const path = {
    build: {
        html: project_folder + '/',
        css: project_folder + '/styles/',
        js: project_folder + '/js/',
        img: project_folder + '/images/',
        fonts: project_folder + '/fonts/',
    },
    src: {
        html: source_folder + '/*.html',
        css: source_folder + '/styles/*.css',
        js: source_folder + '/js/**/*.js',
        img: source_folder + '/images/**/*.png',
        fonts: source_folder + '/fonts/*.{ttf,woff,woff2}',
    },
    watch: {
        html: source_folder + '/**/*.html',
        css: source_folder + '/styles/*.css',
        js: source_folder + '/js/**/*.js',
        img: source_folder + '/images/**/*.png',
    },
    clean: './' + project_folder + '/',
};

const { src, dest } = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    gcmq = require('gulp-group-css-media-queries'),
    cleanCss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify-es').default,
    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp'),
    webphtml = require('gulp-webp-html'),
    ttf2woff = require('gulp-ttf2woff'),
    ttf2woff2 = require('gulp-ttf2woff2')

function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: './' + project_folder + '/',
        },
        port: 3000,
        notify: false,
    });
}

function html() {
    return src(path.src.html)
        .pipe(webphtml())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}

function css() {
    return src(path.src.css)
        .pipe(gcmq())
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 5 version'],
                cascade: true,
            }),
        )
        .pipe(dest(path.build.css))
        .pipe(cleanCss())
        .pipe(
            rename({
                extname: '.min.css',
            }),
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream());
}

function js() {
    return src(path.src.js)
        .pipe(uglify())
        .pipe(
            rename({
                extname: '.min.js',
            }),
        )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream());
}

function images() {
    return src(path.src.img)
        .pipe(
            webp({
                quality: 70
            })
        )
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true,
                optimizationLevel: 3
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream());
}

function fonts() {
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts))
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts))
}

function watchFiles(params) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

function clean(params) {
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fonts = fonts;
exports.js = js;
exports.html = html;
exports.css = css;
exports.images = images;
exports.build = build;
exports.watch = watch;
exports.default = watch;