var gulp = require('gulp')
var git = require('gulp-git')
var del = require('del')
var eslint = require('gulp-eslint')
var flatten = require('gulp-flatten')
var shell = require('gulp-shell')
var browserify = require('gulp-browserify')
var runSequence = require('run-sequence')

gulp.task('default', ['local'])

gulp.task('git-build', ['client', 'server', 'test'])

// This build option assumes the three project repos (main(redtop), server and client)
// are in the same directory
// ['l-client', 'l-server', 'l-test', 'restart', 'watch']

// Use this option for testing changes made without pushing to github
gulp.task('local', function () {
  runSequence('lint', ['l-client', 'l-cli-login', 'l-server', 'l-test'], ['restart', 'watch'])
})

// Runs npm test from gulp
gulp.task('restart', shell.task('npm test &'))

// NOT CURRENTLY USED
// The linting task, run on all javascript resources in the build directory
// TODO: Organize linting to be run before the browserify step
gulp.task('lint', () => {
  return gulp.src(['../client/src/js/**/*.js', '../server/src/js/**/*.js', '!node_modules/**', '!lib/js/bootstrap.min.js'])
  .pipe(eslint(
    {
      'configFile': './.eslintrc.json'
    }
  ))
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
})

gulp.task('l-cli-login', function () {
  return gulp.src('../client/src/js/scripts/aws-login.js')
  .pipe(
    browserify({
      insertGlobals: true,
      debug: !gulp.env.production
    })
  )
  .pipe(gulp.dest('./lib/js'))
})

gulp.task('l-client', function () {
  return gulp.src('../client/src/js/scripts/ClientMessenger.js')
  .pipe(flatten())
  .pipe(
    browserify({
      insertGlobals: true,
      debug: !gulp.env.production,
      paths: ['../client/src/js/scripts', '../client/src/js/objects']
    })
  )
  .pipe(gulp.dest('./lib/js'))
})

// Exectue build steps related to the server from local assets
gulp.task('l-server', ['l-app-main', 'l-public', 'l-css', 'l-server-scripts', 'l-bootstrap'])

gulp.task('l-bootstrap', function () {
  return gulp.src('./node_modules/bootstrap/dist/js/bootstrap.min.js')
  .pipe(flatten())
  .pipe(gulp.dest('lib/js'))
})

gulp.task('l-app-main', function () {
  return gulp.src('../server/src/server.js')
  .pipe(flatten())
  .pipe(gulp.dest('lib/'))
})

gulp.task('l-public', function () {
  return gulp.src('../server/**/*.html')
  .pipe(flatten())
  .pipe(gulp.dest('public/'))
})

gulp.task('l-css', function () {
  return gulp.src('../server/**/*.css')
  .pipe(flatten())
  .pipe(gulp.dest('lib/css'))
})

gulp.task('l-server-scripts', function () {
  return gulp.src('../server/src/js/*.js')
  .pipe(flatten())
  .pipe(gulp.dest('lib/js/'))
})

gulp.task('l-test', function () {
  return gulp.src('../server/test/*')
  .pipe(flatten())
  .pipe(gulp.dest('lib/test'))
})

// Runs the restart task when changes are detected in any .js files in the given directories
gulp.task('watch', function () {
  gulp.watch('../client/src/**/*.js', ['l-client', 'restart'])
  gulp.watch('../server/public/**.html', ['l-public', 'restart'])
  gulp.watch('../server/src/server.js', ['l-app-main', 'restart'])
  gulp.watch('../server/src/js/**/*.js', ['l-server-scripts', 'restart'])
  gulp.watch('../server/src/css/**/*.css', ['l-css', 'restart'])
})

gulp.task('cloneAssets', function (callback) {
  runSequence('clone-cli', 'clone-server')
})

gulp.task('clone-cli', function () {
  git.clone('https://github.com/RedisClusterTopo/redtop-client', {args: 'assets/client'}, function (err) {
    if (err) throw err
  })
})

gulp.task('clone-server', function () {
  git.clone('https://github.com/RedisClusterTopo/redtop-server', {args: 'assets/server'}, function (err) {
    if (err) throw err
  })
})

gulp.task('client', function () {
  return gulp.src('assets/**/*.js')
  .pipe(gulp.dest('lib/js/'))
})

gulp.task('cli-objects', function () {
  return gulp.src('assets/client/src/js/objects/*.js')
  .pipe(gulp.dest('lib/js/'))
})

gulp.task('cli-scripts', function () {
  return gulp.src('assets/client/src/js/scripts/*.js')
  .pipe(gulp.dest('lib/js/'))
})

gulp.task('server', ['app-main', 'public', 'css', 'server-scripts'])

gulp.task('app-main', function () {
  return gulp.src('assets/server/src/server.js')
  .pipe(gulp.dest('lib/'))
})

gulp.task('public', function () {
  return gulp.src('assets/server/**/*.html')
  .pipe(gulp.dest('public/'))
})

gulp.task('css', function () {
  return gulp.src('assets/server/**/*.css')
  .pipe(gulp.dest('lib/css'))
})
gulp.task('server-scripts', function () {
  gulp.src('assets/server/src/server.js')
  .pipe(gulp.dest('lib/'))
  return gulp.src('assets/server/src/js/*.js')
  .pipe(gulp.dest('lib/js/'))
})

gulp.task('test', function () {
  return gulp.src('assets/server/test/*')
  .pipe(flatten())
  .pipe(gulp.dest('lib/test'))
})

gulp.task('clean', function () {
  return del(['assets', 'lib', 'public'])
})

gulp.task('cleanAssets', function () {
  return del(['assets/client', 'assets/server'], {force: true})
})

gulp.task('cleanSrc', function () {
  return del(['lib'], {force: true})
})

gulp.task('cleanPublic', function () {
  return del(['public'], {force: true})
})
