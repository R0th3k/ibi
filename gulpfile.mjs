import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import cleanCSS from 'gulp-clean-css';
import gulpRename from 'gulp-rename';
import browserSync from 'browser-sync';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';

const sass = gulpSass(dartSass);
const reload = browserSync.reload;

const paths = {
  www: {
    base: 'www',
    html: 'www/**/*.html',
    scss: 'www/assets/scss/**/*.scss', // Ajuste del directorio SCSS
    js: 'www/assets/js/*.js',
    jsmin: 'www/assets/js/min',
    images: 'www/assets/img/**/*',
    css: 'www/assets/css' 
  }
};

// Compilar Sass, minificar CSS y renombrar
export function compileSass() {
  return gulp.src(paths.www.scss)
    .pipe(sourcemaps.init()) // Inicializar sourcemaps
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest(paths.www.css))
    .pipe(cleanCSS()) // Minificar CSS
    .pipe(gulpRename({ suffix: '.min' })) // Renombrar a .min.css
    .pipe(sourcemaps.write('.')) // Escribir sourcemaps
    .pipe(gulp.dest(paths.www.css))
    .pipe(browserSync.stream()); // Recargar BrowserSync cuando se actualicen los estilos
}

function minifyScripts() {
  return gulp.src(paths.www.js)
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(gulp.dest(paths.www.jsmin))
    .pipe(sourcemaps.write('.'))
    .pipe(browserSync.stream()); // Recargar BrowserSync cuando se actualicen los scripts
}

// Servidor local con BrowserSync
export function serve() {
  browserSync.init({
    server: {
      baseDir: paths.www.base
    },
    port: 3000, // Puerto de BrowserSync
    open: false // No abrir automáticamente una pestaña del navegador
  });

  // Observar cambios en archivos Sass, JS y HTML e iniciar compilación, minificación y recarga del servidor
  gulp.watch(paths.www.scss, compileSass).on('change', reload);
  gulp.watch(paths.www.js, minifyScripts).on('change', reload);
  gulp.watch(paths.www.html).on('change', reload); // Recargar BrowserSync cuando cambien los archivos HTML
}

// Tarea por defecto: compilar Sass, minificar scripts, servir con BrowserSync y observar cambios
export default gulp.series(
  gulp.parallel(compileSass, minifyScripts),
  serve // Agregar servidor BrowserSync como parte de la tarea por defecto
);
