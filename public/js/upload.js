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
    let element = $(this).prev();

    uploadFile(this.files[0], element[0]);
  });

  $('.drop-browse').on('cancel', () => {
    console.log('Cancelled.');
  });

  $('.drop-browse').on('change', function () {
    console.log('I am changed');
    let element = $(this).parent().parent();

    uploadFile(this.files[0], element[0]);
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
      handlesFiles(files, element);
    });
  });

  function handlesFiles(files, element) {
    if (files.length > 1) {
      toastDanger('Upload one file only');
    } else {
      uploadFile(files[0], element);
    }
  }

  function uploadFile(file, element) {
    let filePath = $(element).find('input[type="hidden"]').val();
    if (filePath && filePath != '') {
      fetch('/deleteUpload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath }),
      })
        .then((res) => {
          if (!res.ok) return res.json().then((err) => Promise.reject(err));
          return res.json();
        })
        .then((res) => {
          toastSuccess(`previous upload is ${res.message}`);
          console.log(`previous upload is ${res.message}`);
        })
        .catch((err) => {
          toastDanger(err.message);
          console.log(err.message);
        });
    }

    let type = element.dataset.type;

    if (!validFile(file, type)) return;

    var formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);

    // Track progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        handleProgress(element, percentComplete);
      }
    };

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // Handle server response (if needed)
        console.log('Upload complete!');
        let response = JSON.parse(xhr.response);
        handleFileDetails(element, response);
      } else if (xhr.readyState == 4) {
        let response = { error: 'nothing' };
        if (xhr.responseText) {
          try {
            response = JSON.parse(xhr.responseText);
            // Process the JSON response
          } catch (e) {
            console.error('Parsing error:', e);
          }
        } else {
          console.warn('Empty response');
        }
        toastDanger(response.error);
      }
    };
    console.log('input:', $(element).find('input[type="hidden"]')[0]);

    xhr.send(formData);
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

  function handleFileDetails(element, file) {
    let type = element.dataset.type.toString().split('/')[0];
    type = type.charAt(0).toUpperCase() + type.slice(1);

    const hiddenInput = $(element).find('input[type="hidden"]');
    hiddenInput.val(file.path);
    if ($(element).is('.uploaded-thumbnail')) {
      // $('.uploaded-thumbnail').css('background-image', `url('${file.path}')`);
      $('.uploaded-thumbnail').css('background-image', `url('/${file.path}')`);
      toastSuccess('Thumbnail uploaded successfully!');
    } else {
      toastSuccess(`${type} uploaded successfully!`);

      const fileDetails = $(element).find('.file-details');
      const fileName = $(element).find('.file-name');
      const progressContainer = $(element).find('.progress-container');
      const closeBtn = $(element).find('.cancel-upload');

      closeBtn.css('color', 'red');
      closeBtn.click(function (e) {
        e.preventDefault();
        let icon = $(element).find('i');
        $(icon[0]).show();
        fileDetails.hide();
        toastInfo('Upload removed');
        $(element).find('input[type="file')[0].form.reset();
        $(element).find('input[type="hidden').val('');

        fetch('/deleteUpload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filePath: file.path }),
        })
          .then((res) => {
            if (!res.ok) return res.json().then((err) => Promise.reject(err));
            return res.json();
          })
          .then((res) => {
            toastSuccess(res.message);
            console.log(res.message);
          })
          .catch((err) => {
            toastDanger(err.message);
            console.log(err.message);
          });
      });

      progressContainer.hide();
      $(element).find('.progress-bar').css('width', '0%');
      let icon = $(element).find('i');
      $(icon[0]).hide();

      fileDetails.show();
      fileName.html(`${file.originalname}`);
    }
  }

  $('#upload-form').on('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(this);

		$('.spinner-overlay').show();
		fetch('/uploadMusic', {
			method: 'POST',
			body: formData,
			headers: {
				'Accept': 'application/json',
			}}).then(res => {  // parse json
				if (!res.ok)
					return res.json().then(err => Promise.reject(err))
				return res.json()
			}).then(res => { // get response
				$('.spinner-overlay').hide();
				console.log(res.message);
				toastSuccess(res.message);
			}).catch(err => {  // catch error
				$('.spinner-overlay').hide();
				console.error(err);
				toastDanger(err.message);
			});
  });
});
