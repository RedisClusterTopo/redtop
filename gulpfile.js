var gulp = require('gulp')
var del = require('del')
var eslint = require('gulp-eslint')
var flatten = require('gulp-flatten')
var shell = require('gulp-shell')
var browserify = require('gulp-browserify')
var runSequence = require('run-sequence')

var clientRepoPath = '../client'  // Path to the local client repository
var serverRepoPath = '../server'  // Path to the local server repository

gulp.task('default', ['local'])

// Use this option for testing changes made without pushing to github
gulp.task('local', function () {
  runSequence('l-server', ['l-client', 'l-cli-login'], ['restart', 'watch'])
})

// Runs npm test from gulp
gulp.task('restart', shell.task('npm start local &'))

// The linting task, run on all javascript resources in the build directory
gulp.task('lint', () => {
  return gulp.src([
    clientRepoPath + '/src/js/**/*.js', // All client JavaScript
    serverRepoPath + '/src/**/*.js',    // All server JavaScript
    '!node_modules/**',                 // Ignore node_modules
    '!lib/js/bootstrap.min.js'          // and bootstrap
  ])
  .pipe(eslint(
    {
      'configFile': './.eslintrc.json'
    }
  ))
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
})

gulp.task('l-cli-login', function () {
  return gulp.src(clientRepoPath + '/src/js/scripts/aws-login.js')
  .pipe(
    browserify({
      insertGlobals: true,
      debug: !gulp.env.production
    })
  )
  .pipe(gulp.dest('./lib/js'))
})

gulp.task('l-client', function () {
  console.log(__dirname)
  return gulp.src(clientRepoPath + '/src/js/scripts/ClientMessenger.js')
  .pipe(flatten())
  .pipe(
    browserify({
      insertGlobals: true,
      debug: !gulp.env.production,
      paths: [clientRepoPath + '/src/js/scripts', serverRepoPath + '/src/js/objects', './node_modules']
    })
  )
  .pipe(gulp.dest('./lib/js'))
})
// Exectue build steps related to the server from local assets

gulp.task('l-server', ['l-d3', 'l-socket.io', 'l-app-main', 'l-object', 'l-public', 'l-css', 'l-server-scripts', 'l-bootstrap'])

gulp.task('l-bootstrap', function () {
  return gulp.src('./node_modules/bootstrap/dist/js/bootstrap.min.js')
  .pipe(flatten())
  .pipe(gulp.dest('lib/js'))
})

gulp.task('l-socket.io', function () {
  return gulp.src('./node_modules/socket.io-client/dist/socket.io.js')
  .pipe(flatten())
  .pipe(gulp.dest('lib/js'))
})

gulp.task('l-d3', function () {
  return gulp.src('./node_modules/d3/build/d3.js')
  .pipe(flatten())
  .pipe(gulp.dest('lib/js'))
})

gulp.task('l-object', function () {
  return gulp.src(serverRepoPath + '/src/js/objects/*.js')
  .pipe(flatten())
  .pipe(gulp.dest('lib/js'))
})

gulp.task('l-app-main', function () {
  return gulp.src(serverRepoPath + '/src/server.js')
  .pipe(flatten())
  .pipe(gulp.dest('lib/'))
})

gulp.task('l-public', function () {
  return gulp.src(serverRepoPath + '/**/*.html')
  .pipe(flatten())
  .pipe(gulp.dest('public/'))
})

gulp.task('l-css', function () {
  return gulp.src(serverRepoPath + '/**/*.css')
  .pipe(flatten())
  .pipe(gulp.dest('lib/css'))
})

gulp.task('l-server-scripts', function () {
  return gulp.src(serverRepoPath + '/src/js/*.js')
  .pipe(flatten())
  .pipe(gulp.dest('lib/js/'))
})

gulp.task('l-test', function () {
  return gulp.src(serverRepoPath + '/test/*')
  .pipe(flatten())
  .pipe(gulp.dest('lib/test'))
})

gulp.task('clean', function () {
  return del(['assets', 'lib', 'public'])
})

// Runs the restart task when changes are detected in any .js files in the given directories
gulp.task('watch', function () {
  gulp.watch('../client/src/**/*.js', ['l-client', 'restart'])
  gulp.watch('../server/public/**.html', ['l-public', 'restart'])
  gulp.watch('../server/src/server.js', ['l-app-main', 'restart'])
  gulp.watch('../server/src/js/**/*.js', ['l-server-scripts', 'restart'])
  gulp.watch('../server/src/css/**/*.css', ['l-css', 'restart'])
})
