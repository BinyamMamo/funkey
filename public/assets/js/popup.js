$(document).ready(function () {
	$('.thumbnail').click(function () {
		let item = this.parentElement;
		console.log('item:', item);
		let img = $(item).find('.thumbnail img');
		let title = $(item).find('.footnote h4');
		title = $(title).prop('innerText').replace(/\n/g, ' - ');
		$('.level-selector-container img').attr('src', $(this).attr('data-image-url'));
		$('.level-selector-title').html(title);
	});
});