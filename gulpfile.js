var gulp = require("gulp"),
    less = require("gulp-less"),
    // cssnano = require("gulp-cssnano"),
    // uglify = require("gulp-uglify"),
    // htmlmin = require("gulp-htmlmin"),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    spriter = require('gulp-css-spriter');

gulp.task('run', function () {
    gulp.src('src/images/*.{png,jpg,gif,ico}')
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/images'));
});
gulp.task('css', function() {
    return gulp.src('dist/css/*.css')
        .pipe(spriter({
            'spriteSheet': 'dist/images/spritesheet.png', //这是雪碧图自动合成的图。 很重要
            'pathToSpriteSheetFromCSS': '../images/spritesheet.png' //这是在css引用的图片路径，很重要
        }))
        .pipe(gulp.dest('dist/css')); //最后生成出来
});

gulp.task("style", function() {
  gulp.src(['src/style/*.less', '!src/style/_*.less'])
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'Android >= 4.0'],
      cascade: true,
      remove: true
    }))
    // .pipe(cssnano())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task("js", function() {
  gulp.src("src/js/*.js")
    // .pipe(uglify())
    .pipe(gulp.dest("dist/js"))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task("images", function() {
  gulp.src("src/images/*.*")
    .pipe(gulp.dest("dist/images"))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task("lib", function() {
  gulp.src("src/lib/*.*")
    .pipe(gulp.dest("dist/lib"))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task("html", function() {
  gulp.src("src/*.html")
    // .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.reload({
      stream: true
    }));
});


var browserSync = require("browser-sync");
gulp.task("serve", function() {
  browserSync({
    server: {
      baseDir: ['dist']
    },
  }, function(err, bs) {
    console.log(bs.options.getIn(["urls", "local"]));
  });

  gulp.watch('src/style/*.less', ['style'])
  gulp.watch('src/images/*.*', ['images'])
  gulp.watch('src/lib/*.*', ['lib'])
  gulp.watch('src/js/*.js', ['js'])
  gulp.watch('src/*.html', ['html'])
});
