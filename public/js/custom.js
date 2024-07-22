(function ($) {
  'use strict';

  // Page loading animation
  $(window).on('load', function () {
    console.log('hey I am here');
    // $('#js-preloader').addClass('loaded');
    console.log('custom.js');
    // Menu Dropdown Toggle
    if ($('.menu-trigger').length) {
      $('.menu-trigger').on('click', function (e) {
        e.preventDefault();
        console.log('triggered menu!;');
        $(this).toggleClass('active');
        $('.header-area .nav').slideToggle(200);
        console.log('finsihed triggered menu!;');
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
  $(window).on('load', function () {
    if ($('.cover').length) {
      $('.cover').parallax({
        imageSrc: $('.cover').data('image'),
        zIndex: '1',
      });
    }

    $('#preloader').animate(
      {
        opacity: '0',
      },
      600,
      function () {
        setTimeout(function () {
          $('#preloader').css('visibility', 'hidden').fadeOut();
        }, 300);
      }
    );
  });

});