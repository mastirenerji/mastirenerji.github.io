const gulp = require("gulp"),
      browserSync = require("browser-sync").create(),
      sass = require("gulp-sass"),
      htmlmin = require("gulp-htmlmin"),
      imagemin = require("gulp-imagemin"),
      deploy = require('gulp-gh-pages');

// Compile Sass & Inject Into Browser
gulp.task("sass", function() {
  return gulp
    .src(["node_modules/bootstrap/scss/bootstrap.scss", "src/scss/*.scss"])
    .pipe(sass())
    .pipe(gulp.dest("src/css"))
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
});

// Move JS Files to src/js
gulp.task("js", function() {
  return gulp
    .src([
      "node_modules/bootstrap/dist/js/bootstrap.min.js",
      "node_modules/jquery/dist/jquery.min.js",
      "node_modules/popper.js/dist/umd/popper.min.js"
    ])
    .pipe(gulp.dest("src/js"))
    .pipe(gulp.dest("dist/js"))
    .pipe(browserSync.stream());
});

// Watch Sass & Serve
gulp.task("serve", ["sass"], function() {
  browserSync.init({
    server: "./dist"
  });

  gulp.watch(
    ["node_modules/bootstrap/scss/bootstrap.scss", "src/scss/*.scss"],
    ["sass"]
  );
  gulp.watch("dist/*.html").on("change", browserSync.reload);
});

// Move Fonts to src/fonts
gulp.task("fonts", function() {
  return gulp
    .src("node_modules/font-awesome/fonts/*")
    .pipe(gulp.dest("src/fonts"))
    .pipe(gulp.dest("dist/fonts"));
});

// Move Font Awesome CSS to src/css
gulp.task("fa", function() {
  return gulp
    .src("node_modules/font-awesome/css/font-awesome.min.css")
    .pipe(gulp.dest("src/css"))
    .pipe(gulp.dest("dist/css"));
});

gulp.task("minify-html", function() {
  return gulp.src("src/**/*.html")
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("dist"));
});

gulp.task("minify-img", function() {
  return  gulp.src("src/img/**")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/img"))
});

/**
 * Push build to gh-pages
 * To make it effective add "deploy" to default task
 */
gulp.task("deploy", function () {
  return gulp.src("./dist/**/*")
    .pipe(deploy())
});

// Build
gulp.task('build', ['minify-html', 'minify-img', 'fa', 'fonts', 'js', 'sass']);

gulp.task("default", ["js", "serve", "fa", "fonts", "minify-html", "minify-img"]);
