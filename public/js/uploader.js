$(document).ready(function () {
  $('.uploaded-thumbnail').click(function (e) {
    e.preventDefault();
    $('#thumbnail-upload').trigger('click');
  });

  $('#thumbnail-upload').on('cancel', () => {
    console.log('Cancelled.');
  });

  $('#thumbnail-upload').on('change', function (e) {
    let element = $(this).prev()[0];
    const file = this.files[0];

    handleUpload(file, element);
  });

	$('.drag-drop').each(function (index, element) {
		$(element)
			.find('a')
			.click(function () {
				$(this).next('input').trigger('click');
			});
	});

  $('.drop-browse').on('cancel', () => {
    console.log('Cancelled.');
  });

  $('.drop-browse').on('change', function () {
    console.log('I am changed');
    let element = $(this).parent().parent()[0];

    handleUpload(this.files[0], element);
  });


  var dropZone = $('.drop-zone');

  dropZone.on('dragover', function (event) {
    event.preventDefault();
    this.classList.add('hover');
  });

  dropZone.on('dragleave', function (event) {
    event.preventDefault();
    this.classList.remove('hover');
  });

  // dropZone.on('drop', function (event) {
  $.each(dropZone, function (index, element) {
    element.addEventListener('drop', function (event) {
      event.preventDefault();
      element.classList.remove('hover');
      let files = event.dataTransfer.files;
      if ($(element).is('.uploaded-thumbnail'))
        $(element).next('input[type="file"]')[0].files = files;
      else $(element).find('input[type="file"]')[0].files = files;

      handleUpload(files[0], element);
    });
  });

  function handleUpload(file, element) {
    if ($(element).is('.uploaded-thumbnail')) {
      if (!file) return console.error();
      const reader = new FileReader();

      const blobUrl = URL.createObjectURL(file);

      $('.uploaded-thumbnail').css('background-image', `url('${blobUrl}')`);
      return;
    }

    const fileDetails = $(element).find('.file-details');
    const fileName = $(element).find('.file-name');
    const closeBtn = $(element).find('.cancel-upload');
    let icon = $(element).find('i');

    closeBtn.click(function (e) {
      e.preventDefault();
      $(icon[0]).show();
      fileDetails.hide();
      toastInfo('Upload removed');
      $(element).find('input[type="file')[0].form.reset();
      $(element).find('input[type="hidden').val('');
    });

    $(icon[0]).hide();
    fileDetails.show();
    fileName.html(`${file.name}`);
  }

  $('#upload-form').on('submit', async function (event) {
    event.preventDefault();
		event.stopPropagation();

    $('.spinner-overlay').show();

    const video = $(this).find('input[name="video-upload"]')[0].files[0];
    console.log('video:', video);
    const thumbnail = $(this).find('input[name="thumbnail-upload"]')[0]
      .files[0];
    const lyrics = $(this).find('input[name="lyrics-upload"]')[0].files[0];

		const videoDrop = $(this).find('.video-drop')[0];
		const lyricsDrop = $(this).find('.lyrics-drop')[0];

    let music = {};
    music.title = $(this).find('input[name="title"]').val();
    music.artist = $(this).find('input[name="artist"]').val();

		music.thumbnail = await uploadFile(thumbnail, null);
		music.video = await uploadFile(video, videoDrop);
		music.lyrics = await uploadFile(lyrics, lyricsDrop);

		$('.spinner-overlay').hide();
		console.log('saving music:', music);
		saveMusic(music);

		toastSuccess('upload complete!');
  });

  function saveMusic(music) {
    fetch('/music/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(music),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((err) => Promise.reject(err));
        return res.json();
      })
      .then((res) => {
        toastSuccess('upload complete!');
				location.reload();
      }).catch(err => {
				toastDanger(err.message);
				toastDanger('try again!');
				console.error(err);
			});
  }

  function uploadFile(file, element) {
    return new Promise(async (resolve, reject) => {
      console.log('file:', file);
      let type = file.type.split('/')[0];
      let icon = `${type}-upload-icon`;
      $('.upload-btn').find('.liquid').css('top', `0px`);

      let folderName = 'progress';
      const response = await fetch(`/signed-upload?folder=${folderName}`);
      const { signature, timestamp, cloud_name, api_key } =
        await response.json();

      const url = `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', api_key);
      formData.append('timestamp', timestamp);
      // formData.append('signature', signature);
      formData.append('upload_preset', 'mrom3lig');
      formData.append('folder', `uploads/${folderName}`);
      formData.append('public_id', file.name.split('.')[0]);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);

      // Show progress bar
      // const progressContainer = document.getElementById('progressContainer');
      // const progressBar = document.getElementById('progressBar');
      // const progressText = document.getElementById('progressText');
      // progressContainer.style.display = 'block';

      // Update progress bar
      xhr.upload.addEventListener('progress', function (event) {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );

					if (element)
						handleProgress(element, percentComplete);
          // progressBar.value = percentComplete;
          // progressText.textContent = `${percentComplete}%`;
          if (percentComplete < 60) {
            grayValue = Math.round((percentComplete / 60) * 50); // 0-50
          } else {
            grayValue = Math.round(225 + ((percentComplete - 60) / 40) * 30); // 150-255
          }
          const grayColor = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
          $('.upload-btn').css('color', grayColor);
          $('.upload-btn').css('border-color', '#57575722');

          let max = $('html').css('--upload-btn-width');
          max = parseInt(max);
          max = max / 2 + 20;
          let min = 30;
          // let progress = Math.min(Math.max(parseInt(percentComplete), 20), max);
          let progress = ((max - min) / 100) * percentComplete + min;
          console.log('max:', max);
          console.log('percentComplete:', percentComplete);
          console.log('progress:', progress);
          $('.upload-btn')
            .find('.progress-display')
            .html(`${percentComplete}%`);
          $('.upload-btn').find('.liquid').css('top', `-${progress}px`);
          $('.default-upload-icon').hide();
          $(`.${icon}`).show();
        }
      });

      // Handle upload complete
      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          // alert('File uploaded successfully!');
          console.log('File uploaded successfully!');
          console.log('Upload response:', response);
          $('.upload-btn').css('border-color', '#f7f7f7');
          $('.upload-btn').css('color', '#f7f7f7');
          $(`.${icon}`).hide();
          $('.default-upload-icon').show();
          resolve(response.secure_url);
        } else {
          console.log(xhr.response);
          alert('Error uploading file');
          reject(this.secure_url);
        }
      });

      xhr.send(formData);
    });
  }

	function handleProgress(element, percentComplete) {
    if (!$(element).is('.uploaded-thumbnail')) {
      const progressContainer = $(element).find('.progress-container');
      const progressBar = $(element).find('.progress-bar');
      const percentDisplay = $(element).find('.progress-text');

      progressContainer.show();
      progressBar.css('width', `${percentComplete}%`);
      percentDisplay.html(`${Math.round(percentComplete)}%`);
    }
  }
});
