function mobileNav() {
	// Nav button
	const navBtnOpen = document.querySelector('#modalOpen');
	const navBtnClose = document.querySelector('#modalClose');

	const navOVerlay = document.querySelector('.mobile-nav-overlay');
	const nav = document.querySelector('#mobileNav');

	function toggleMobileNav() {
		navOVerlay.classList.toggle('mobile-nav-overlay--open');
		nav.classList.toggle('mobile-nav--open');
		document.body.classList.toggle('no-scroll');
	}

	navBtnOpen.addEventListener('click', toggleMobileNav);
	navBtnClose.addEventListener('click', toggleMobileNav);
	navOVerlay.addEventListener('click', toggleMobileNav);
}

export default mobileNav;
