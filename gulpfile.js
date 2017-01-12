var gulp = require('gulp');
var git = require('gulp-git');
var del = require('del');
var fs = require('fs');
var runSequence = require('run-sequence');



gulp.task('default', ['local']);

gulp.task('git-build', ['client', 'server', 'test']);

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
      .pipe(gulp.dest('lib/js/'));
});

gulp.task('cli-scripts', function(){
  return gulp.src('assets/client/src/js/scripts/*.js')
      .pipe(gulp.dest('lib/js/'));
});

////////////////////////////////////////////////////////////////////////////////

gulp.task('server', ['app-main', 'public', 'css', 'server-scripts']);

gulp.task('app-main', function(){
  return gulp.src('assets/server/src/server.js')
      .pipe(gulp.dest('lib/'));
});

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
      .pipe(gulp.dest('lib/js/'));
});

////////////////////////////////////////////////////////////////////////////////

gulp.task('test', function(){
  return gulp.src('assets/server/test/*')
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




//This build option assumes the three project repos (redtop (called 'main' below), server and client)
//are in the same directory

//Use this option for testing changes made without pushing to github
gulp.task('local', ['l-client', 'l-server', 'l-test']);

gulp.task('l-client', ['l-cli-objects', 'l-cli-scripts']);

gulp.task('l-cli-objects', function(){
  return gulp.src('../client/src/js/objects/*.js')
      .pipe(gulp.dest('lib/js/'));
});

gulp.task('l-cli-scripts', function(){
  return gulp.src('../client/src/js/scripts/*.js')
      .pipe(gulp.dest('lib/js/'));
});

gulp.task('l-server', ['l-app-main', 'l-public', 'l-css', 'l-server-scripts', 'l-bootstrap']);

gulp.task('l-bootstrap', function(){
    return gulp.src('./node_modules/bootstrap/dist/js/bootstrap.min.js')
    .pipe(gulp.dest('lib/js'));
});

gulp.task('l-app-main', function(){
  return gulp.src('../server/src/server.js')
      .pipe(gulp.dest('lib/'));
});

gulp.task('l-public', function(){
  return gulp.src('../server/public/*.html')
      .pipe(gulp.dest('public/'));
});

gulp.task('l-css', function(){
  return gulp.src('../server/src/css/*.css')
      .pipe(gulp.dest('lib/css'));
});

gulp.task('l-server-scripts', function(){
  return gulp.src('../server/src/js/*.js')
      .pipe(gulp.dest('lib/js/'));
});

gulp.task('l-test', function(){
  return gulp.src('../server/test/*')
      .pipe(gulp.dest('lib/test'));
});
