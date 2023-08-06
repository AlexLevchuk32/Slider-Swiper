import Swiper from 'swiper/bundle';
import mobileNav from './modules/mobile-nav';

mobileNav();

const swiper = new Swiper('.swiper', {
	// Optional parameters
	loop: true,
	parallax: true,
	speed: 2000,
	keyboard: {
		enable: true,
	},

	// If we need pagination
	pagination: {
		el: '.slider-controls__count',
		type: 'fraction',
	},

	// Navigation arrows
	navigation: {
		nextEl: '#sliderNext',
		prevEl: '#sliderPrev',
	},

	// And if we need scrollbar
	scrollbar: {
		el: '.swiper-scrollbar',
	},
});
