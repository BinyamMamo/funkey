$(document).ready(function () {
  $('input[name="artist"]').on('input', function () {
    const value = $(this).val();
    const output = $('.artist-music-name span');
    output[0].innerHTML = value;

    if (output.text().length < 25) output[1].innerHTML = ' - ';
    else output[1].innerHTML = '<br>';
    if (value == '') output[0].innerHTML = 'Unkown';
  });

  $('input[name="title"]').on('input', function () {
    const value = $(this).val();
    const output = $('.artist-music-name span');
    output[2].innerHTML = value;

    if (output.text().length < 25) output[1].innerHTML = ' - ';
    else output[1].innerHTML = '<br>';
    if (value == '') output[1].innerHTML = 'Track';
  });

  $('.drag-drop').each(function (index, element) {
    $(element)
      .find('a')
      .click(function () {
        $(this).next('input').trigger('click');
      });
  });

  $('.uploaded-thumbnail').click(function (e) {
    e.preventDefault();
    $('#thumbnail-upload').trigger('click');
  });

  $('#thumbnail-upload').on('cancel', () => {
    console.log('Cancelled.');
  });

  $('#thumbnail-upload').on('change', function () {
    let element = $(this).prev()[0];

    handleUpload(this.files[0], element);
  });

  $('.drop-browse').on('cancel', () => {
    console.log('Cancelled.');
  });

  $('.drop-browse').on('change', function () {
    console.log('I am changed');
    let element = $(this).parent().parent()[0];

    handlesFiles(this.files, element);
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
      var files = event.dataTransfer.files;
      if ($(element).is('.uploaded-thumbnail'))
        $(element).next('input[type="file"]')[0].files = files;
      else $(element).find('input[type="file"]')[0].files = files;

      handlesFiles(files, element);
    });
  });

  function handlesFiles(files, element) {
    if (files.length > 1) return toastDanger('Upload one file only');

		let file = files[0];
    let type = element.dataset.type;
    if (!validFile(file, type)) return;

    handleUpload(file, element);
  }

  function validFile(file, type) {
    const allowedMimeTypes = {
      image: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
      video: ['video/mp4', 'video/webm', 'video/ogg'],
      lyrics: ['text/plain', 'text/lrc', 'text/srt'],
    };

    if (!file) {
      toastDanger('No file uploaded.');
      console.log('error: No file uploaded.');

      return false;
    }

    if (!allowedMimeTypes[type].includes(file.type)) {
      let allowedTypes = allowedMimeTypes[type]
        .map((mimeType) => '.' + mimeType.replace(`${type}/`, ''))
        .join(', ');
      if (type === 'lyrics') allowedTypes = '.txt';
      toastDanger(
        `Invalid file type! <br> Upload ${type} type(${allowedTypes}) only.`
      );
      console.log('error: Invalid file type.');
      return false;
    }

    return true;
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

  function handleUpload(file, element) {
    if ($(element).is('.uploaded-thumbnail')) {
      if (!file) return console.error();
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
    const formData = new FormData(this);

    $('.spinner-overlay').show();

    const video = $(this).find('input[name="video-upload"]')[0].files[0];
    const thumbnail = $(this).find('input[name="thumbnail-upload"]')[0].files[0];
    const lyrics = $(this).find('input[name="lyrics-upload"]')[0].files[0];

		const videoDrop = $(this).find('.video-drop')[0];
		const lyricsDrop = $(this).find('.lyrics-drop')[0];
    let music = {};
    music.title = $(this).find('input[name="title"]').val();
    music.artist = $(this).find('input[name="artist"]').val();

    await uploadFile(thumbnail, null).then((res) => {
      music.thumbnail = res.url;
    });
    
		await uploadFile(video, videoDrop).then((res) => {
      music.video = res.url;
    });

		await uploadFile(lyrics, lyricsDrop).then((res) => {
      music.lyrics = res.url;
    });

		console.log('FINAL FINISH');
  });

  function uploadFile(file, element) {
    return new Promise(async (resolve, reject) => {
      console.log('file:', file);
      let type = file.type.split('/')[0];

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

      // Update progress bar
      xhr.upload.addEventListener('progress', function (event) {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
					if (element)
						handleProgress(element, percentComplete);
        }
      });

      // Handle upload complete
      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          // alert('File uploaded successfully!');
          console.log('File uploaded successfully!');
          console.log('Upload response:', response);
          resolve(response);
        } else {
          console.log(xhr.response);
          alert('Error uploading file');
          reject(this);
        }
      });

      xhr.send(formData);
    });
  }

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
        setTimeout(() => {
          location.reload();
        }, 500);
      })
      .catch((err) => {
        toastDanger(err.message);
        console.error(err);
      });
  }
});
