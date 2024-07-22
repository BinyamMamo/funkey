$(document).ready(function () {
	let LIBRARY_FILTER = 'library';

	function updateMusicLibrary(filter=LIBRARY_FILTER) {
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
				musicLibrary.append(`
					<div class="item music-library" data-fav-id="${ music._id }">
						<input type="hidden" name="music" value="${ music._id }">
						<input type="hidden" name="favorite" value="${ music.favorite }">
						<ul>
							<li><span class="tiny-thumbnail" data-image-url="${ music.thumbnail }"></span></li>
							<li class="music-details">
								<h4>${ music.artist }</h4>
								<span>${ music.title }</span>
								</li>
							<li>
									<h4>Date Added</h4>
									<span>${ music.favorite ? music.favoritedAt : '22/06/2036' }</span>
									</li>
							<li>
								<h4>Rating</h4>
								<span>${ music.rating.toFixed(1) }</span>
								</li>
							<li>
								<h4>Views</h4>
								<span>${ music.views }</span>
								</li>
								<li>
									<h4>Type</h4>
									<span>${ music.favorite ? 'favorite' : 'uploaded' }</span>
									</li>
							<li>
								<div class="btn btn-primary main-button library-play-btn" data-toggle="modal" data-target="#levelsModal" data-music="${ music._id }">Play</div>
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

			$('.library-play-btn').click(function (e) {
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
				let favorite = $(item).find('input[name="favorite"]').val();
		
				$('.levels-form').find('.thumbnail-img-overlay i').removeClass('far fas');
				if (favorite == 'true')
					$('.levels-form').find('.thumbnail-img-overlay i').addClass('fas');
				else $('.levels-form').find('.thumbnail-img-overlay i').addClass('far');
			});
		}, 500);
	}
	updateMusicLibrary();

  $('.thumbnail').click(function () {
    let item = this.parentElement;
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
    let favorite = $(this).find('input[name="favorite"]').val();

    $('.levels-form').find('.thumbnail-img-overlay i').removeClass('far fas');
    if (favorite == 'true')
      $('.levels-form').find('.thumbnail-img-overlay i').addClass('fas');
    else $('.levels-form').find('.thumbnail-img-overlay i').addClass('far');
  });

  $('.thumbnail-img-overlay').on('click', function (e) {
    e.preventDefault();
    $(this).find('i').toggleClass('far fas');
    let musicId = $('.levels-form').find('input[name="music"]').val();

    // let favorite = $(`[data-id="${musicId}"]`).find('input[name="favorite"]');
    // favorite.val(favorite.val() == 'true' ? 'false' : 'true');
		// let musicLibrary = $('.music-library');
		
		// if (favorite.val() == 'false')
		// 	musicLibrary.find(`[data-fav-id="${musicId}"]`).remove();
		// else {
		// 	updateMusicLibrary();
		// }
		
		fetch('/music/favorite', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: musicId }),
		});
		location.reload();
  });

  $('.levels-form').on('submit', function (e) {
    e.preventDefault();
    let musicId = $('.levels-form').find('input[name="music"]').val();
    window.location.href = `/music/${musicId}`;
  });

	$('.library-filter').find('.favorites').on('click', function (e) {
		e.preventDefault();
		LIBRARY_FILTER = 'favorites';
		updateMusicLibrary();
	});
	$('.library-filter').find('.uploaded').on('click', function (e) {
		e.preventDefault();
		LIBRARY_FILTER = 'uploaded';
		updateMusicLibrary();
	});
});
