var gulp = require('gulp');
var git = require('gulp-git');
var del = require('del');
var fs = require('fs');
var runSequence = require('run-sequence');



gulp.task('default', ['client', 'server', 'test']);

////////////////////////////////////////////////////////////////////////////////

gulp.task('cloneAssets', function(callback){
  runSequence('clone-cli', 'clone-server');

});

gulp.task('clone-cli', function(){
  git.clone('https://github.com/RedisClusterTopo/redtop-client', {args: 'assets/client'},function(err){
    if(err) throw err;
  });
});

gulp.task('clone-server', function(){
  git.clone('https://github.com/RedisClusterTopo/redtop-server', {args: 'assets/server'}, function(err){
    if(err) throw err;
  });

});

////////////////////////////////////////////////////////////////////////////////

gulp.task('client', ['cli-objects', 'cli-scripts']);

gulp.task('cli-objects', function(){
  return gulp.src('assets/client/src/js/objects/*.js')
      .pipe(gulp.dest('lib/js/client-objects/'));
});

gulp.task('cli-scripts', function(){
  return gulp.src('assets/client/src/js/scripts/*.js')
      .pipe(gulp.dest('lib/js/client-scripts/'));
});

////////////////////////////////////////////////////////////////////////////////

gulp.task('server', ['public', 'css', 'server-scripts']);

gulp.task('public', function(){
  return gulp.src('assets/server/public/*.html')
      .pipe(gulp.dest('public/'));
});

gulp.task('css', function(){
  return gulp.src('assets/server/src/css/*.css')
      .pipe(gulp.dest('lib/css'));
});

gulp.task('server-scripts', function(){
  gulp.src('assets/server/src/server.js')
  .pipe(gulp.dest('lib/'));
  return gulp.src('assets/server/src/js/*.js')
      .pipe(gulp.dest('lib/js/server-scripts'));
});

////////////////////////////////////////////////////////////////////////////////

gulp.task('test', function(){
  return gulp.src('assets/client/test/*')
      .pipe(gulp.dest('lib/test'));
});

////////////////////////////////////////////////////////////////////////////////

gulp.task('clean', function(){
    return del(['assets', 'lib', 'public']);
});

gulp.task('cleanAssets', function(){
  return del(['assets/client', 'assets/server'], {force: true});
});

gulp.task('cleanSrc', function(){
  return del(['lib'], {force: true});
});

gulp.task('cleanPublic', function(){
  return del(['public'], {force: true});
});
