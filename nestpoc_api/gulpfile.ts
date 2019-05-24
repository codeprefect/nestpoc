import * as gulp from 'gulp';

export default () => {
  return gulp.src(['./src/**/*', '!./**/*.ts'])
    .pipe(gulp.dest('dist'));
};
