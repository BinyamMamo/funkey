$(document).ready(function () {
	let pressedKey = null;

	$(document).on('keydown', function(event) {
		const key = event.key.toLowerCase();
		// console.log('Key pressed:', key);

		pressedKey = $(`.key-${key}`);
		if (key == " ")
			pressedKey = $('.key-space');
		pressedKey.css("background-color", "var(--keyboard-hover-clr)");
		pressedKey.css("font-size", "var(--keyboard-hover-size)");
	});

	$(document).on('keyup', function(event) {
		setTimeout(() => {
			$(".keys").css("background-color", "var(--keyboard-clr)");
			$(".keys").css("font-size", "var(--keyboard-size)");
		}, 300);
	});
});
