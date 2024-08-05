$(document).ready(function () {
  let fetchBtn = $('#fetch-ytvideo');

  $('.youtube-url').on('keypress', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      fetchBtn.trigger('click');
    }
  });

  fetchBtn.on('click', async function (e) {
    e.preventDefault();
		try {
			$('#uploadModal').find('.spinner-overlay').show();
			let videoUrl = $('.youtube-url').val();
    const regex =
		/^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    const match = videoUrl.match(regex);
    if (!videoUrl || !match) {
      setTimeout(() => {
        $('#uploadModal').find('.spinner-overlay').hide();
      }, 200);
      throw new Error('Invalid URL');
    }
		
    let thumbnail = await handleThumbnail(videoUrl);
    let details = await handleDetails(videoUrl);

    let video = await handleVideo(videoUrl, details);
    let lyrics = await handleLyrics(videoUrl, details);
	} catch (err) {
		toastDanger(err.message);
	} finally {
		$('#uploadModal').find('.spinner-overlay').hide();
	}
		
  });

  //  Functions
  async function handleThumbnail(videoUrl) {
    try {
      let response = await fetch(`/api/yt/thumbnail?url=${videoUrl}`, {
        method: 'POST',
      });

      let data = await response.json();
			if (!response.ok) throw new Error(data.error);

      let thumbnail = data.url;
			$('.uploaded-thumbnail').css('background-image', `none`);
			$('.uploaded-thumbnail').css('background-image', `url('${thumbnail}')`);
			// $('.uploaded-thumbnail').css('background-color', `#000`);
			$('.uploaded-thumbnail').css('opacity', `0`);
			$('.uploaded-thumbnail').css('box-shadow', `inset 0 0 0 1000px rgba(0, 0, 0, 0.2)`);

      const img = document.getElementById('preload-img');
      img.src = thumbnail;			
			
      img.onload = function () {
				// $('.uploaded-thumbnail').css('background-color', `transparent`);
				$('.uploaded-thumbnail').css('opacity', `1`);
				$('.uploaded-thumbnail').css('box-shadow', `none`);
      };
			
      $('input[name="thumbnail"').val(thumbnail);
      return thumbnail;
    } catch (err) {
      console.error(err);
      toastError(err.message);
    }
  }

  async function handleDetails(videoUrl) {
    try {
      $('#upload-form')
        .find('input[name="artist"]')
        .css('animation', 'blink 2s linear infinite');
      $('#upload-form')
        .find('input[name="title"]')
        .css('animation', 'blink 2s linear infinite');

      let response = await fetch(`/api/yt/details?url=${videoUrl}`, {
        method: 'POST',
      });

      let data = await response.json();
			if (!response.ok) throw new Error(data.error);
      let details = data;

      $('#upload-form').find('input[name="artist"]').val(details['artist']);
      $('#upload-form').find('input[name="artist"]').trigger('input');

      $('#upload-form').find('input[name="title"]').val(details['title']);
      $('#upload-form').find('input[name="title"]').trigger('input');

      console.log('details:', details);
      return details;
    } catch (err) {
      console.error(err);
      toastError(err.message);
    } finally {
      $('#upload-form').find('input[name="artist"]').css('animation', 'none');
      $('#upload-form').find('input[name="title"]').css('animation', 'none');
    }
  }

  async function handleVideo(videoUrl, details) {
    try {
      $('#upload-form')
        .find('.video-drop')
        .css('animation', 'blink 2s linear infinite');

      let response = await fetch(`/api/yt/video?url=${videoUrl}`, {
        method: 'POST',
      });
      console.log('response:', response);

      let data = await response.json();
			if (!response.ok) throw new Error(data.error);

			const video = data.url;
      console.log('video:', video);

      $('#upload-form').find('input[name="video"]').val(video);
      window.handleUpload(
        { name: `${details.video}.mp4` },
        $('#upload-form').find('.video-drop')[0]
      );

      return video;
    } catch (err) {
      console.error(err);
      toastError(err.message);
    } finally {
      $('#upload-form').find('.video-drop').css('animation', 'none');
    }
  }

  async function handleLyrics(videoUrl, details) {
    try {
      $('#upload-form')
        .find('.lyrics-drop')
        .css('animation', 'blink 2s linear infinite');

      let response = await fetch(`/api/yt/lyrics?url=${videoUrl}`, {
        method: 'POST',
      });

      let lyrics = await response.json();
			if (!response.ok) throw new Error(lyrics.error);

      // console.log('lyrics:', lyrics);
      $('#upload-form').find('input[name="lyrics"]').val(lyrics);
      window.handleUpload(
        { name: `${details.video}.srt` },
        $('.lyrics-drop')[0]
      );

      return lyrics;
    } catch (err) {
      console.error(err);
      toastDanger(err.message);
    } finally {
      $('#upload-form').find('.lyrics-drop').css('animation', 'none');
    }
  }
  // end of functions
});
