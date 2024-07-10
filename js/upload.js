$(document).ready(function () {
  $('input[name="artistName"]').on('input', function () {
    const value = $(this).val();
    const output = $('.artist-music-name span');
    output[0].innerHTML = value;
    if (value == '') output[0].innerHTML = 'Artist Name';
  });

  $('input[name="musicName"]').on('input', function () {
    const value = $(this).val();
    const output = $('.artist-music-name span');
    output[1].innerHTML = value;
    if (value == '') output[1].innerHTML = 'Music Name';
  });

  $('.drag-drop').each(function (index, element) {
    $(element)
      .find('a')
      .click(function () {
        $(this).next('input').trigger('click');
      });
  });

  $('.thumbnail').click(function (e) {
    e.preventDefault();
    $('#thumbnail-upload').trigger('click');
  });

  $('#thumbnail-upload').on('cancel', () => {
    console.log('Cancelled.');
  });

  $('#thumbnail-upload').on('change', function () {
    const formData = new FormData();
    console.log('this:', this);
    formData.append('file', this.files[0]);

    // Use AJAX to send the file to the server
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // Handle server response (if needed)
        console.log('Upload complete!');
        let response = JSON.parse(xhr.response);
        $('.thumbnail').css(
          'background-image',
          `url('/uploads/${response.filename}')`
        );
        toastSuccess('Thumbnail uploaded successfully!');
      } else if (xhr.readyState == 4) {
        let response = JSON.parse(xhr.response);
        toastDanger(response.error);
      }
    };

    xhr.send(formData);
  });

  $('.drop-browse').on('cancel', () => {
    console.log('Cancelled.');
  });

  $('.drop-browse').on('change', function () {
    console.log('this:', this);
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
      console.log('event:', event);
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

    // for (var count = 0; count < files.length; count++) {
    //   var file = files[count];
    // }
  }

  function uploadFile(file, element) {
    var formData = new FormData();
    formData.append('file', file);

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
				console.log('response:', response);
        handleFileDetails(element, response);
      } else if (xhr.readyState == 4) {
        let response = JSON.parse(xhr.response);
        toastDanger(response.error);
      }
    };

    xhr.send(formData);
  }

  function handleProgress(element, percentComplete) {
    if ($(element).is('.thumbnail')) {
      console.log('yes it is');
    } else {
      const progressContainer = $(element).find('.progress-container');
      const progressBar = $(element).find('.progress-bar');
      const percentDisplay = $(element).find('.progress-text');

      progressContainer.show();
      progressBar.css('width', `${percentComplete}%`);
      percentDisplay.html(`${Math.round(percentComplete)}%`);
    }
  }
});

function handleFileDetails(element, file) {
  if ($(element).is('.thumbnail')) {
    $('.thumbnail').css(
      'background-image',
      `url('/${file.path}')`
    );
    toastSuccess('Thumbnail uploaded successfully!');
  } else {
    if ($(element).is('.video-drop'))
      toastSuccess('Video uploaded successfully!');
    else if ($(element).is('.lyrics-drop'))
      toastSuccess('Lyrics uploaded successfully!');
    else toastSuccess('File uploaded successfully!');

    const fileDetails = $(element).find('.file-details');
    const fileName = $(element).find('.file-name');
    const progressContainer = $(element).find('.progress-container');
    const closeBtn = $(element).find('button.close');

    closeBtn.css('color', 'red');
    closeBtn.click(function (e) {
      e.preventDefault();
      let icon = $(element).find('i');
      $(icon[0]).show();
      progressContainer.hide();
      fileDetails.hide();
			toastInfo('Removed upload');
    });

    let icon = $(element).find('i');
    $(icon[0]).hide();
    progressContainer.hide();
    $(element).find('.progress-bar').css('width', '0%');
    fileDetails.show();
    fileName.html(`${file.originalname}`);
		
		console.log('file:', file);
  }
}
