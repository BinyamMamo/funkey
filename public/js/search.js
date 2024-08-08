$('#searchText').on('focus', function () {
  $('#searchResults').show();
});
$('#searchText').on('blur', function (event) {
  event.preventDefault();
  event.stopPropagation();
  if ($('#searchResults').is(':focus') || $('#searchResults').is(':active'))
    $(this).focus();
});

$(document).on('click', function (event) {
  const $searchInput = $('#searchText');
  const $searchResults = $('#searchResults');

  if (
    !(
      $searchInput.is(event.target) ||
      $searchResults.is(event.target) ||
      $searchResults.has(event.target).length > 0
    )
  ) {
    $searchResults.hide();
    $('body').focus();
  }
});

$('#searchText').on('input', function (e) {
  e.preventDefault();
  const query = $(this).val();

  // if (query.length < 2) { // Optional: avoid sending requests for very short queries
  // 	// $('#searchResults').html('');
  // 	return;
  // }

  $.ajax({
    url: '/search',
    type: 'GET',
    data: {
      query,
    },
    success: function (data) {
      // Display results
      console.log('data:', data);
      $('#searchResults').html(
        data.musics
          .map(
            (music) => `
			<div class="item music-clip"
					style="background-color: #27292a88; display: flex; flex-direction: row; flex-wrap: nowrap; align-items: center; padding: 0.4em; gap: 0.15em;">
					<div class="thumb" style="margin: 0;">
						<span data-id="${music._id}" class="clip-thumbnail"
							style="background-image: url('${music.thumbnail}')">
							<span class="overlay">

								<i class="fas fa-play"></i>
							</span>
						</span>
					</div>
					<div class="down-content"
						style="width: 100%; padding-left: 0.5em; display: flex; flex-direction: column; justify-content: space-around; gap: 0.5em">
						<h4 class="clip-title" data-id="${
              music._id
            }" style="line-height: 1.2; cursor: pointer;">
							${music.title}
						</h4>
						<div class="view-n-rating"
							style="display: flex; flex-direction: row; justify-content: flex-start; flex-wrap: wrap; gap: 1.15em">
							<div>
								<span>
									${music.rating.toFixed(2)}
								</span>
								<i class="fa fa-star"></i>
								</div>
								<div>
								<span>
									${music.views}
									</span>
									<i class="fa fa-users"></i>
							</div>
						</div>
					</div>
				</div>
				`
          )
          .join('')
      );
    },
    error: function (err) {
      console.error(err);
      $('#searchResults').html('Error fetching results');
    },
  });
});

async function showPlayMenu(musicId) {
  let response = await fetch(`/api/music/${musicId}`);
  let music = await response.json();

  console.log('music:', music);

  $('#levelsModal')
    .find('.music-title')
    .text(`${music.artist} - ${music.title}`);
  $('#levelsModal').find('.thumbnail-img').attr('src', `${music.thumbnail}`);
  $('#levelsModal').find('input[name="music"]').val(musicId);

  $('#levelsModal').modal('show');
}

$('[data-music_id]').on('click', function (event) {
  event.preventDefault();
  console.log('this.dataset.music_id:', this.dataset.music_id);
  showPlayMenu(this.dataset.music_id);
});
