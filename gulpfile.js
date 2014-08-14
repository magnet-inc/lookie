var gulp = require('gulp');
var broweserify = require('browserify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var del = require('del');
var karma = require('gulp-karma');
var serve = require('gulp-serve');

gulp.task('clean', function(cb) {
  del(['build', 'dist'], cb);
});

gulp.task('build', ['clean'], function() {
  return broweserify('./src/lookie.js').bundle().
    pipe(source('lookie.js')).
    pipe(gulp.dest('./build/'));
});

gulp.task('compile', ['build'], function() {
  return gulp.src('build/*.js').
    pipe(uglify()).
    pipe(gulp.dest('./dist/'));
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

gulp.task('serve', serve(__dirname));

gulp.task('watch', ['build'], function() {
  gulp.watch('src/*.js', ['build']);
  gulp.src('test/*.js').
    pipe(karma({
      configFile: 'karma.conf.js',
      action: 'watch'
    }));
});

gulp.task('default', ['watch']);
