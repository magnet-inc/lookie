var gulp = require('gulp');
var broweserify = require('browserify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var del = require('del');
var karma = require('gulp-karma');
var serve = require('gulp-serve');
var shell = require('gulp-shell');

gulp.task('clean', function(cb) {
  del(['build'], cb);
});

gulp.task('build', ['clean'], function() {
  return broweserify('./src/lookie.js').bundle().
    pipe(source('lookie.js')).
    pipe(gulp.dest('./build/'));
});

gulp.task('compile', ['build'], function() {
  return gulp.src('build/*.js').
    pipe(uglify()).
    pipe(gulp.dest('.'));
});

gulp.task('test', function() {
  return gulp.src('test/*.js').
    pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    })).
    on('error', function(err) {
      throw err;
    });
});

gulp.task('ci-modern', ['test'], function() {
  return gulp.src('test/*.js').
    pipe(karma({
      configFile: 'karma.conf-ci.js',
      browsers: ['SL_Chrome_Mac', 'SL_Firefox_Mac', 'SL_Safari_7'],
      action: 'run'
    })).
    on('error', function(err) {
      throw err;
    });
});

gulp.task('ci-ie-modern', ['ci-modern'], function() {
  return gulp.src('test/*.js').
    pipe(karma({
      configFile: 'karma.conf-ci.js',
      browsers: ['SL_IE_9', 'SL_IE_10', 'SL_IE_11'],
      action: 'run'
    })).
    on('error', function(err) {
      throw err;
    });
});

gulp.task('ci-ie-legacy', ['ci-ie-modern'], function() {
  return gulp.src('test/*.js').
    pipe(karma({
      configFile: 'karma.conf-ci.js',
      browsers: ['SL_IE_6', 'SL_IE_7', 'SL_IE_8'],
      action: 'run'
    })).
    on('error', function(err) {
      throw err;
    });
});

gulp.task('ci-mobile', ['ci-ie-legacy'], function() {
  return gulp.src('test/*.js').
    pipe(karma({
      configFile: 'karma.conf-ci.js',
      browsers: ['SL_iOS_7', 'SL_Android_4_4'],
      action: 'run'
    })).
    on('error', function(err) {
      throw err;
    });
});

gulp.task('ci-opera', ['ci-mobile'], function() {
  return gulp.src('test/*.js').
    pipe(karma({
      configFile: 'karma.conf-ci.js',
      browsers: ['SL_Opera'],
      action: 'run'
    })).
    on('error', function(err) {
      throw err;
    });
});

gulp.task('ci', ['test', 'ci-modern', 'ci-ie-modern', 'ci-ie-legacy', 'ci-mobile', 'ci-opera']);

gulp.task('serve', ['compile'], serve({
  root: __dirname,
  port: 8080
}));

gulp.task('open', shell.task([
  'open "http://localhost:8080/example/index.html"'
]));

gulp.task('watch', ['compile'], function() {
  gulp.watch('src/*.js', ['compile']);
  gulp.src('test/*.js').
    pipe(karma({
      configFile: 'karma.conf.js',
      action: 'watch'
    }));
});

gulp.task('example', ['serve', 'open']);
gulp.task('default', ['watch']);
