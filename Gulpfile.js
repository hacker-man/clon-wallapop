var gulp = require('gulp'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    inject = require('gulp-inject'),
    wiredep = require('wiredep').stream,
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    jscs = require('gulp-jscs'),
    stylish = require('gulp-jscs-stylish');


// Busca errores en el JS y nos los muestra por pantalla
gulp.task('jshint', function() {
    return gulp.src(['./public/scripts/**/*.js','!public/scripts/filters/timeago.js','./routes/api/apipop.js', './lib/*.js', '!lib/config.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
});

gulp.task('jscs', function() {
    return gulp.src(['./public/scripts/**/*.js','!public/scripts/filters/timeago.js','./routes/api/apipop.js', './lib/*.js', '!lib/config.js'])
        .pipe(jscs('.jscsrc'))
        .pipe(stylish());
});

gulp.task('watch', function() {

    gulp.watch(['./public/scripts/**/*.js'], ['jshint']);
    gulp.watch(['./routes/api/apipop.js'], ['jshint']);
    gulp.watch(['./lib/*.js'], ['jshint']);
    gulp.watch(['./public/modules/**/*.js'], ['jshint']);

    gulp.watch(['./public/scripts/**/*.js'], ['jscs']);
    gulp.watch(['./routes/api/apipop.js'], ['jscs']);
    gulp.watch(['./lib/*.js'], ['jscs']);
    gulp.watch(['./public/modules/**/*.js'], ['jscs']);

    gulp.watch(['./public/less/*.less'], ['less']);

    gulp.watch(['./bower.json'], ['wiredep']);

});


gulp.task('less', function() {

    return gulp.src('./public/less/style.less')
        .pipe(less())
        .pipe(gulp.dest('./public/stylesheets/'));
});

gulp.task('concat', function() {
    gulp.src(['./public/bower_components/angular/angular.js',
            './public/bower_components/angular-ui-router/release/angular-ui-router.js',
            './public/bower_components/satellizer.js',
            './public/modules/**/*.js',
            './public/scripts/**/*.js'
        ])
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/prod/'))
});

// Busca en las carpetas de estilos y javascript los archivos que hayamos creado
// para inyectarlos en el index.html
gulp.task('inject', function() {
    var sources = gulp.src(['./public/scripts/**/*.js', './public/modules/**/*.js', './public/stylesheets/**/*.css']);
    return gulp.src('index.html', { cwd: './public' })
        .pipe(inject(sources, {
            ignorePath: '/public'
        }))
        .pipe(gulp.dest('./public'));
});

// Inyecta las librerias que instalemos vía Bower
gulp.task('wiredep', function() {
    gulp.src('./public/index.html')
        .pipe(wiredep({
            directory: './public/lib'
        }))
        .pipe(gulp.dest('./public'));
});


gulp.task('default', ['jscs', 'jshint', 'wiredep', 'inject', 'less', 'watch']);
gulp.task('prod', ['concat']);
