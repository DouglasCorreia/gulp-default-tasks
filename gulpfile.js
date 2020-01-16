"use strict";

// Load plugins
const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const gulp = require("gulp");
const merge = require("merge-stream");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const concat = require('gulp-concat');
const image = require('gulp-image');
const mergeMedia = require('gulp-merge-media-queries');

// Files to deploy
var filesToSearch = ['**/assets/*', '*{.html,.php}', '*.css'];
var filesDestination = 'deploy/';

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./"
    },
    port: 3000
  });
  done();
}

// BrowserSync reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Bring third party dependencies from node_modules into vendor directory
function modules() {
  // Bootstrap
  var bootstrap = gulp.src('./node_modules/bootstrap/dist/**/*')
    .pipe(gulp.dest('assets/vendor/bootstrap'));

  // Font Awesome
  var fontAwesomeCSS = gulp.src('./node_modules/@fortawesome/fontawesome-free/css/**/*')
    .pipe(gulp.dest('assets/vendor/fontawesome-free/css'));
  var fontAwesomeWebfonts = gulp.src('./node_modules/@fortawesome/fontawesome-free/webfonts/**/*')
    .pipe(gulp.dest('assets/vendor/fontawesome-free/webfonts'));
  
  // jQuery
  var jquery = gulp.src([
      './node_modules/jquery/dist/*',
      '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('assets/vendor/jquery'));

    return merge(bootstrap, fontAwesomeCSS, fontAwesomeWebfonts, jquery);
}

// CSS task
function css() {
  return gulp
    // Find the file
    .src('developer/scss/**/style.scss')
    .pipe(plumber())
    .pipe(sass({
      outputStyle: "expanded",
      includePaths: "./node_modules",
    }))
    .on("error", sass.logError)
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(mergeMedia({
      log: true
    }))
    .pipe(gulp.dest("./assets/css"))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest("./assets/css"))
    .pipe(browsersync.stream());
}

// JS task
function js() {
  return gulp
    // Find the file
    .src([
      './developer/js/*.js',
      '!./developer/js/*.min.js'
    ])
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./assets/js'))
    .pipe(browsersync.stream());
}

// Image minify
function imageMinify() {
  return gulp.src('developer/images/*')
  .pipe(image())
  .pipe(gulp.dest('assets/images'))
}

// Deploy files
function deployFiles() {
  return gulp.src(filesToSearch)
  .pipe(gulp.dest(filesDestination))
}

// Watch files
function watchFiles() {
  gulp.watch("developer/scss/**/*", css);
  gulp.watch(["developer/js/**/*", "!./developer/js/**/*.min.js"], js);
  gulp.watch("./**/*{.html,.php}", browserSyncReload);
}

// Define complex tasks
const vendor = gulp.series(modules);
const build = gulp.series(vendor, gulp.parallel(css, js));
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));

// Export tasks
exports.css = css;
exports.js = js;
exports.vendor = vendor;
exports.build = build;
exports.watch = watch;
exports.default = build;
exports.deploy = deployFiles;
exports.imageMinify = imageMinify;