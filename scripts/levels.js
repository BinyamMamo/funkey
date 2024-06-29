// document.addEventListener('load', function () {
// 	$("img").onerror = function () {
// 		$(this).hide();
// 	};
// });

$(document).ready(function () {
	const selectedLevelText = $('#selectedLevelText');
	const customOptions = $('#customOptions');

	$(".custom-btn").on('click', function () {
		customOptions.toggle();
	});

	// Hide dropdown when clicking outside of it
	$(document).on('click', function (event) {
		if (!$(event.target).closest('.custom-options').length) {
			$('.custom-options').hide(); // Hide all dropdown menus
		}
	});

	$('.level-buttons .btn').on('click', function () {
		$('.level-buttons .btn').removeClass('active');
		$(this).addClass('active');

		const level = $(this).data('level');
		$('.level-img').attr('src', `assets/img/${level.toLowerCase()}.png`);
		$(`.level-img`).show();
		updateLevel(level);
	});

	function updateLevel(level) {
		const levelText = getLevelText(level);
		// selectedLevelText.text(`Selected Level: ${levelText}`);
		selectedLevelText.text(`${levelText}`);

		$("#start").show();
	}

	function getLevelText(level) {
		switch (level) {
			case 'easy':
				return 'Easy';
			case 'medium':
				return 'Medium';
			case 'hard':
				return 'Hard';
			case 'custom':
				return 'Custom';
			default:
				return 'Unknown';
		}
	}
});