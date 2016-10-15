import gulp from 'gulp'
import sass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import nodemon from 'gulp-nodemon'
import browserify from 'browserify'
import babelify from 'babelify'
import cleanCSS from 'gulp-clean-css'
import source from 'vinyl-source-stream'
import mainBowerFiles from 'main-bower-files'
import uglify from 'gulp-uglify'
import concat from 'gulp-concat'

const paths = {
  scripts: ['./src/server/index.js', './src/client/app/**/**/**/*.js'],
  styles: './src/assets/scss/main.scss',
  html: './src/**/**/**/**/*.html'
}

gulp.task('nodemon', () => {
  nodemon({
    script: paths.scripts[0],
    env: {'NODE_ENV': 'development'}
  })
})

gulp.task('move', () => {
  gulp.src(paths.html)
    .pipe(gulp.dest('dist'))
})

gulp.task('bower', () => {
  return gulp.src(mainBowerFiles())
    .pipe(gulp.dest('dist/assets/vendors'))
})

gulp.task('js', () => {
  return gulp.src([
    paths.scripts[1]
  ])
  .pipe(concat('app.js'))
  .pipe(gulp.dest('dist/client/app'))
})

gulp.task('sass', () => {
  gulp.src(paths.styles)
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('dist/assets/css'))
})

gulp.task('watch', () => {
  gulp.watch(paths.scripts[1], ['js'])
  gulp.watch(paths.html, ['move'])
  gulp.watch(paths.styles, ['sass'])
})

gulp.task('default', ['nodemon', 'js', 'sass', 'bower', 'watch'])