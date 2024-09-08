$(document).ready(function () {
	let LIBRARY_FILTER = 'library';

	function updateMusicLibrary(filter = LIBRARY_FILTER) {
		fetch(`/${filter}`)
			.then((res) => {
				if (!res.ok)
					return res.json().then((err) => Promise.reject(err));
				return res.json()
			}).then((res) => {
				let musics = res.musics;

				let musicLibrary = $('.music-library');
				$(musicLibrary).html('');
				musics.forEach(music => {
					let updatedAt = music.updatedAt.toString().split('T')[0];
					musicLibrary.append(`
					<div class="item music-library" data-fav-id="${music._id}">
						<input type="hidden" name="music" value="${music._id}">
						<input type="hidden" name="favorite" value="${music.favorite}">
						<ul>
							<li><span class="tiny-thumbnail" data-image-url="${music.thumbnail}" style="background-image: url('${music.thumbnail}')"></span></li>
							<li class="music-details">
								<h4>${music.artist}</h4>
								<span>${music.title}</span>
								</li>
							<li>
									<h4>Date Added</h4>
									<span class="text-truncate">${updatedAt}</span>
									</li>
							<li>
								<h4>Rating</h4>
								<span>${music.rating.toFixed(1)}</span>
								</li>
							<li>
								<h4>Views</h4>
								<span>${music.views}</span>
								</li>
								<li>
									<h4>Type</h4>
									<span>${music.type}</span>
									</li>
							<li>
								<div class="btn btn-primary main-button library-play-btn" data-toggle="modal" data-target="#levelsModal" data-music="${music._id}">Play</div>
							</li>
						</ul>
					</div>
				`);
				});
			});
		setTimeout(() => {
			$('.tiny-thumbnail').each(function () {
				var imageUrl = $(this).data('image-url');
				$(this).css('background-image', 'url(' + imageUrl + ')');
			});

			$('.library-play-btn').click(async function (e) {
				let musicId = this.dataset.music;
				let item = $(`[data-fav-id="${musicId}"]`);
				let img = $(item).find('.tiny-thumbnail');
				let artist = $(item).find('.music-details h4').text();
				let title = $(item).find('.music-details span').text();
				title = `${artist} - ${title}`;

				$('.level-selector-container img').attr(
					'src',
					$(img).attr('data-image-url')
				);
				$('.level-selector-title').html(title);

				let music = $(item).find('input[name="music"]').val();
				$('.levels-form').find('input[name="music"]').val(music);

				let res = await fetch(`/library/favorite/${musicId}`);
				let favorite = await res.json();
				$('.levels-form').find('.thumbnail-img-overlay i').removeClass('far fas');
				if (favorite.music)
					$('.levels-form').find('.thumbnail-img-overlay i').addClass('fas');
				else $('.levels-form').find('.thumbnail-img-overlay i').addClass('far');
			});
		}, 500);
	}
	updateMusicLibrary();

	$('.thumbnail').click(async function () {
		let item = this.parentElement;
		let musicId = this.dataset.id;
		let img = $(item).find('.thumbnail img');
		let title = $(item).find('.footnote h4');
		title = $(title).prop('innerText').replace(/\n/g, ' - ');
		$('.level-selector-container img').attr(
			'src',
			$(this).attr('data-image-url')
		);
		$('.level-selector-title').html(title);

		let music = $(this).find('input[name="music"]').val();
		$('.levels-form').find('input[name="music"]').val(music);
		let res = await fetch(`/library/favorite/${musicId}`);
		let favorite = await res.json();
		$('.levels-form').find('.thumbnail-img-overlay i').removeClass('far fas');
		if (favorite.music)
			$('.levels-form').find('.thumbnail-img-overlay i').addClass('fas');
		else $('.levels-form').find('.thumbnail-img-overlay i').addClass('far');
	});

	$('.thumbnail-img-overlay').on('click', async function (e) {
		e.preventDefault();
		$(this).find('i').toggleClass('far fas');
		let musicId = $('.levels-form').find('input[name="music"]').val();

		console.log('fav musicId:', musicId);
		fetch(`/library/favorite/toggle/${musicId}`);
		location.reload();
	});

	$('.levels-form').on('submit', function (e) {
		e.preventDefault();
		let musicId = $('.levels-form').find('input[name="music"]').val();
		let capitals = $('.levels-form').find('input[name="capital-letters"]').prop('checked');
		let punctuation = $('.levels-form').find('input[name="Punctuation"]').prop('checked');
		let double_spaces = $('.levels-form').find('input[name="double-spaces"]').prop('checked');
		let speed = $('.levels-form').find('select[name="speed"]').val();

		localStorage.setItem('capitals', capitals);
		localStorage.setItem('punctuation', punctuation);
		localStorage.setItem('double_spaces', double_spaces);
		localStorage.setItem('speed', speed);
		window.location.href = `/music/${musicId}`;
	});

	$('.library-filter').find('.favorites').on('click', function (e) {
		e.preventDefault();
		$('.library-filter-title').find('span').text('favorites');
		LIBRARY_FILTER = 'favorites';
		updateMusicLibrary();
	});
	$('.library-filter').find('.uploaded').on('click', function (e) {
		e.preventDefault();
		$('.library-filter-title').find('span').text('uploads');
		LIBRARY_FILTER = 'uploads';
		updateMusicLibrary();
	});
	$('.library-filter').find('.none').on('click', function (e) {
		e.preventDefault();
		$('.library-filter-title').find('span').text('');
		LIBRARY_FILTER = 'library';
		updateMusicLibrary();
	});


	$('.levels-form').find('.level-buttons label[data-level="easy"]').on('click', function (e) {
		e.preventDefault();
		$('.levels-form').find('input[name="capital-letters"]').prop('checked', false);
		$('.levels-form').find('input[name="Punctuation"]').prop('checked', false);
		$('.levels-form').find('input[name="double-spaces"]').prop('checked', false);
		$('.levels-form').find('select[name="speed"]').val('0.75');
	});

	$('.levels-form').find('.level-buttons label[data-level="medium"]').on('click', function (e) {
		e.preventDefault();
		$('.levels-form').find('input[name="capital-letters"]').prop('checked', false);
		$('.levels-form').find('input[name="Punctuation"]').prop('checked', false);
		$('.levels-form').find('input[name="double-spaces"]').prop('checked', false);
		$('.levels-form').find('select[name="speed"]').val('1.0');
	});

	$('.levels-form').find('.level-buttons label[data-level="hard"]').on('click', function (e) {
		e.preventDefault();
		$('.levels-form').find('input[name="capital-letters"]').prop('checked', true);
		$('.levels-form').find('input[name="Punctuation"]').prop('checked', true);
		$('.levels-form').find('input[name="double-spaces"]').prop('checked', false);
		$('.levels-form').find('select[name="speed"]').val('1.25');
	});


});
