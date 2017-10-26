const gulp = require("gulp"),
  browserSync = require("browser-sync").create(),
  sass = require("gulp-sass"),
  gulpStylelint = require("gulp-stylelint"),
  htmlmin = require("gulp-htmlmin"),
  imagemin = require("gulp-imagemin"),
  imageminMozjpeg = require("imagemin-mozjpeg"),
  html5Lint = require("gulp-html5-lint");

// Transpile Sass, TS, JS, etc. source files
// Compile Sass & Inject Into Browser
gulp.task("styles", function() {
  return gulp
    .src(["node_modules/bootstrap/scss/bootstrap.scss", "src/scss/*.scss"])
    .pipe(sass())
    .pipe(gulp.dest("dist/css"));
  // .pipe(gulp.dest("dist/css"))
});

gulp.task("lint-css", ["styles"], function lintCssTask() {
  return gulp.src("src/**/*.css").pipe(
    gulpStylelint({
      reporters: [{ formatter: "string", console: true }]
    })
  );
});

// Move JS Files to src/js
gulp.task("scripts", function() {
  return gulp
    .src([
      "node_modules/bootstrap/dist/js/bootstrap.min.js",
      "node_modules/jquery/dist/jquery.min.js",
      "node_modules/popper.js/dist/umd/popper.min.js"
    ])
    .pipe(gulp.dest("dist/js"));
});

// Move Fonts to src/fonts
gulp.task("fonts", function() {
  return gulp
    .src("node_modules/font-awesome/fonts/*")
    .pipe(gulp.dest("dist/fonts"));
});

// Move Font Awesome CSS to src/css
gulp.task("fa", ["fonts"], function() {
  return gulp
    .src("node_modules/font-awesome/css/font-awesome.min.css")
    .pipe(gulp.dest("dist/css"));
});

gulp.task("fonts", function() {
  return gulp
    .src("node_modules/font-awesome/fonts/*")
    .pipe(gulp.dest("dist/fonts"));
});

// Optimize files for serving
gulp.task("html-min", function() {
  return gulp
    .src("src/**/*.html")
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe(gulp.dest("dist"));
});

gulp.task("images", function() {
  return gulp
    .src("src/img/**")
    .pipe(
      imagemin([
        imageminMozjpeg({
          quality: 80
        })
      ])
    )
    .pipe(gulp.dest("dist/img"));
});

// Watch Sass & Serve
// gulp.task("serve", ["styles"], function() {
//   browserSync.init({
//     server: "./dist"
//   });

//   gulp.watch(
//     ["node_modules/bootstrap/scss/bootstrap.scss", "src/scss/*.scss"],
//     ["styles"]
//   );
//   gulp.watch("dist/**/*.{html, css}").on("change", browserSync.reload);
// });

gulp.task("browser-sync", function() {
  var files = ["**/*.html", "**/*.css", "**/*.{png,jpg,gif}"];

  browserSync.init(files, {
    // logLevel: "debug",
    // proxy: "projectname.dev",
    // tunnel: "projectname",
    // serveStatic: ['./src/'],
    // baseDir: "./",
    server: "./dist/"
  });
});

gulp.task("sw-manifest", function() {
  return gulp.src("src/site.webmanifest").pipe(gulp.dest("dist/"));
});

gulp.task("sw-js", function() {
  return gulp.src("src/sw.js").pipe(gulp.dest("dist/"));
});

gulp.task("sw", ["sw-manifest", "sw-js"]);

gulp.task("netlify_headers", function() {
  return gulp.src("./src/_headers").pipe(gulp.dest("dist/"));
});

gulp.task("html5-lint", function() {
  return gulp.src("./src/*.html").pipe(html5Lint());
});

gulp.task("build", [
  "html-min",
  "images",
  "fa",
  "fonts",
  "scripts",
  "styles",
  "sw",
  "netlify_headers"
]);

gulp.task("default", function() {
  gulp.start("browser-sync", "html-min", "scripts", "images", "fa", "sw");

  // Watch .scss files
  gulp.watch("src/scss/**/*.scss", ["styles"]);

  // Watch .js files
  gulp.watch("src/js/**/*.js", ["scripts"]);

  // Watch image files
  gulp.watch("src/img/**/*", ["images"]);

  // Watch image files
  gulp.watch("src/**/*.html", ["html-min"]);
});
