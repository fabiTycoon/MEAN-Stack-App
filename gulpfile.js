var gulp = require('gulp'); 

// Include Our Plugins
var sass = require('gulp-sass');

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('app/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('app/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['sass', 'watch']);