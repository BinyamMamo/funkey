// Page loading animation
$(window).on('load', function () {
  // Menu Dropdown Toggle
  if ($('.menu-trigger').length) {
    $('.menu-trigger').on('click', function (e) {
      e.preventDefault();
      $(this).toggleClass('active');
      $('.header-area .nav').slideToggle(200);
    });
  }
});

var width = $(window).width();
$(window).resize(function () {
  if (width > 992 && $(window).width() < 992) {
    location.reload();
  } else if (width < 992 && $(window).width() > 992) {
    location.reload();
  }
});

// Page loading animation
if ($('.cover').length) {
  $('.cover').parallax({
    imageSrc: $('.cover').data('image'),
    zIndex: '1',
  });
}

// $('#js-preloader').animate(
//   {
//     opacity: '0',
//   },
//   2000,
//   function () {
// 		$('#js-preloader').find('.loader-spinner').css('visibility', 'hidden').fadeOut();
// 		// $('#js-preloader').find('.loader-spinner').css('display', 'none');
// 		$('#js-preloader').css('visibility', 'hidden').fadeOut();
//   }
// );
// $(window).on('load', function () {
// });
