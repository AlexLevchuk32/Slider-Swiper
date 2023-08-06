// ========================================================================================
// Подключаем поиск файлов, выгрузку в целевую директорию, наблюдателя за изменениями
// в файлах, paralel - паралельный запуск слежения и отслеживания изменений в файлах,
// series - последовательное выполнение задач

// ========================================================================================
// Переменные
const { src, dest, watch, parallel, series } = require('gulp');

// Константа для работы с фаловой системой
// const fs = require('fs');

// ========================================================================================
// Плагины

// Препроцессор SASS (конвертация *.scss файлов в обычные *.css)
const scss = require('gulp-sass')(require('sass'));

// Конкатенация файлов (плагин gulp-concat из нескольких файлов делает один файл)
// Также этот плагин переименовывает файлы
const concat = require('gulp-concat');

// Плагин для минификации JS-кода
// const uglify = require('gulp-uglify-es').default;
const webpack = require('webpack-stream');

// Плагин для синхронизации и отображения изменений файлов в реальном времени.
const browserSync = require('browser-sync').create();

// Автопрефиксы для тсарых браузеров
const autoprefixer = require('gulp-autoprefixer');

// Сжатие изображений
// const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imageMin = require('gulp-imagemin');
const newer = require('gulp-newer');

// Конвертация шрифтов
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');

// Подключение html-компонентов
const fileInclude = require('gulp-file-include');

// Замена путей подключаемых файлов на правильные
const replace = require('gulp-replace');

// Очистка папки dist перед сборкой проекта
const clean = require('gulp-clean');

// ========================================================================================
// ----------------------------------------------------------------------------------------
// Работа с препроцессором SASS и минимизация стилей
function styles() {
	return (
		src('./src/scss/style.scss')
			// Для подключения всех файлов стилей лучше использовать @import в файле style.scss
			// Файлы указываем без расширения, чтобы gulp подключал не строку, а содержимое файла
			// Пример:
			// @import './scss/css/fancybox';
			// @import './src/css/fancybox';
			.pipe(scss().on('error', scss.logError)) // Включаем коменнтарии в стиле JS
			.pipe(
				autoprefixer({
					grid: true,
					overrideBrowserslist: ['last 10 version'],
					cascade: true,
				}),
			)
			.pipe(concat('style.min.css'))
			.pipe(scss({ outputStyle: 'compressed' }))
			.pipe(dest('./src/css/'))
			.pipe(browserSync.stream())
	);
}

// ----------------------------------------------------------------------------------------
// Минимизация js-файлов
function scripts() {
	return (
		// src('./src/js/main.js')

		// Подключаем все js-файлы в main.min.js, чтобы не подключать их вручную
		//src(['./src/js/*.js', '!./src/js/main.min.js'])

		src('./src/js/**/*.js')
			// .pipe(concat('main.min.js'))
			// .pipe(uglify())
			.pipe(webpack(require('./webpack.config.js')))
			.pipe(dest('./src/js/'))
			.pipe(browserSync.stream())
	);
}

// ----------------------------------------------------------------------------------------
// Подключение html-компонентов (блоков)
function html() {
	return src('./src/html/*.html')
		.pipe(fileInclude())
		.pipe(replace(/@img\//g, 'img/'))
		.pipe(replace(/@css\//g, 'css/'))
		.pipe(replace(/@js\//g, 'js/'))
		.pipe(dest('./src/'))
		.pipe(browserSync.stream());
}

// ----------------------------------------------------------------------------------------
// Оптимизация и сжатие изображений
function img() {
	return (
		src(['./src/img/!src/**/*', '!./src/img/!src/**/*.svg'])
			// .pipe(src('./src/img/!src/**/*'))
			// .pipe(newer('./src/img/'))
			// .pipe(avif({ quality: 75 }))

			.pipe(src('./src/img/!src/**/*'))
			.pipe(newer('./src/img/'))
			.pipe(webp())

			.pipe(src('./src/img/!src/**/*'))
			// .pipe(src(['./src/img/!src/**/*', '!./src/img/!src/**/*.jpg']))
			.pipe(newer('./src/img/'))
			.pipe(
				imageMin([
					imageMin.gifsicle({ interlaced: true }),
					imageMin.mozjpeg({ quality: 75, progressive: true }),
					imageMin.optipng({ optimizationLevel: 5 }),
					imageMin.svgo({
						plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
					}),
				]),
			)

			.pipe(dest('./src/img/'))
	);
}

// ----------------------------------------------------------------------------------------
// Конвертация шрифтов
function fonts() {
	return src('./src/fonts/!src/*.*')
		.pipe(
			fonter({
				formats: ['woff', 'ttf'],
			}),
		)
		.pipe(src('./src/fonts/!src/*.*'))
		.pipe(ttf2woff2())
		.pipe(dest('./src/fonts/'));
}

// ----------------------------------------------------------------------------------------
// Очистка папки dist перед сборкой проекта
function cleanDist() {
	// return src('dist').pipe(clean());
	return src('dist', { allowEmpty: true }).pipe(clean());
}

// ----------------------------------------------------------------------------------------
// Отслеживание изменений в файлах
function watching() {
	browserSync.init({
		server: {
			baseDir: './src/',
		},
	});

	// watch(['./src/scss/style.scss'], styles);
	// Отслеживаем изменения во всех файлах scss
	watch(['./src/scss/**/*.scss'], styles);
	watch(['./src/js/**/*.js'], scripts);

	// Отслеживание изменений в папке с картинками
	// watch(['./src/img/src/**/*'], img);

	// Ослеживать изменений в html-файлах
	// watch(['./src/html/**/*.html'], html);

	// Отслеживание изменений всех html-файлов во всех вложенных папках
	// watch(['/src/**/*.html']).on('change', browserSync.reload);

	watch(['./src/*.html']).on('change', browserSync.reload);
}

// ----------------------------------------------------------------------------------------
// Сборка проекта
function building() {
	return src(
		[
			'./src/css/style.min.css',
			'./src/js/*.min.js',
			'./src/*.html',
			// './src/**/*.html', // Забираем все html-файлы из папки src и вложенных каталогов
			'./src/img/**/*',
			'!./src/img/{!src,!src/**/*}',
			'./src/fonts/*.*',
			'!./src/fonts/{!src,!src/**/*}',
		],
		{
			base: './src/',
		},
	).pipe(dest('dist'));
}

// ========================================================================================
// Экспортируем функции для внешнего вызова
exports.styles = styles; // Работа со стилями
exports.scripts = scripts; // Работа со скриптами
exports.html = html; // Работа с html-файлами
exports.img = img; // Минимизация изображений
exports.fonts = fonts; // Конвертация шрифтов
exports.watching = watching; // Наблюдатель за файлами
exports.cleanDist = cleanDist; // Очистка директории dist перед сборкой проекта
exports.building = building; // Сборка проекта

// ========================================================================================
// Сборка проекта
// exports.build = series(cleanDist, images, building); // Со сжатием картинок
exports.build = series(cleanDist, building); // Без сжатия картинок

// ========================================================================================
// Паралельный запуск всех функций, dev-режим
// exports.default = parallel(styles, scripts, browsersync, watching); // browsersync перенес в watching

// exports.default = parallel(styles, scripts, html, watching); // Без отслеживания картинок
exports.default = parallel(styles, scripts, watching); // Без отслеживания html
// exports.default = parallel(styles, scripts, images, watching); // С отслеживание картинок
