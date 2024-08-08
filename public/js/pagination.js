$('.disabled').on('click load', function (event) {
	event.preventDefault();
	event.stopPropagation();
});

// // if ($('.page-no').first().addClass('active'));
// if ($('.active').prev().is('.prev'))
//   $('.prev').addClass('disabled');
// if ($('.active').next().is('.next'))
//   $('.next').addClass('disabled');

// $('.page-no').on('click', function(event) {
//   event.preventDefault();
//   if ($(this).is('.active')) return;
//   $('.active').removeClass('active');
//   $(this).addClass('active');

//   let firstItem = $('.page-no').first();
//   let lastItem = $('.page-hellip').prev();
//   let endItem = $('.page-hellip').next();

//   let firstPage = parseInt($(firstItem).text());
//   let lastPage = parseInt($(lastItem).text());
//   let endPage = parseInt($(endItem).text());
//   let currPage = parseInt($(this).text());

//   if ($(this).is(firstItem) && firstPage == 1) $('.prev').addClass('disabled');
//   else $('.prev').removeClass('disabled');
//   if ($(this).is(endItem)) $('.next').addClass('disabled');
//   else $('.next').removeClass('disabled');


//   let next = lastPage - currPage;
//   let previous = currPage - firstPage;
//   next = Math.abs(next);
//   previous = Math.abs(previous);
//   console.log('next', next);

//   if (previous < 1 && firstPage > 1) {
//     $('.page-hellip').show();
//     lastItem.remove();
//     let newItem = firstItem.clone(true);
//     newItem.removeClass('active');
//     $(newItem).find('a').text(parseInt($(firstItem).text()) - 1);
//     firstItem.before(newItem);
//   }


//   if (next >= 1 || endPage - lastPage < 2) return;
//   $('.page-hellip').show();
//   firstItem.remove();
//   let newItem = lastItem.clone(true);
//   newItem.removeClass('active');
//   $(newItem).find('a').text(parseInt($(lastItem).text()) + 1);
//   lastItem.after(newItem);
//   if (endPage - lastPage < 3)
//     $('.page-hellip').hide();
// });

// $('.prev').on('click', function(event) {
//   event.preventDefault();
//   if ($(this).is('.disabled')) return;

//   let prev = $('.active').prev().first();
//   if ($(prev).is('.page-hellip')) prev = $(prev).prev().first();
//   $(prev).trigger('click');
// });

// $('.next').on('click', function(event) {
//   event.preventDefault();
//   if ($(this).is('.disabled')) return;

//   let next = $('.active').next().first();
//   if ($(next).is('.page-hellip')) next = $(next).next().first();
//   $(next).trigger('click');
// });
