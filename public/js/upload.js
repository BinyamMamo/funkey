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
    let element = $(this).prev();

    uploadFile(this.files[0], element[0]);
  });

  $('.drop-browse').on('cancel', () => {
    console.log('Cancelled.');
  });

  $('.drop-browse').on('change', function () {
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
    let type = element.dataset.type;

		if (!validFile(file, type))
			return;

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
        let response = JSON.parse(xhr.response);
        toastDanger(response.error);
      }
    };

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
			let allowedTypes = allowedMimeTypes[type].map(mimeType => '.' + mimeType.replace(`${type}/`, '')).join(', ');
			if (type === 'lyrics')
				allowedTypes = '.txt'; 
      toastDanger(`Invalid file type! <br> Upload ${type} type(${allowedTypes}) only.`);
      console.log('error: Invalid file type.');
      return false;
    }

		return true;
	}

  function handleProgress(element, percentComplete) {
    if (!$(element).is('.thumbnail')) {
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
		type = type.charAt(0).toUpperCase() + type.slice(1)

		if ($(element).is('.thumbnail')) {
			$('.thumbnail').css('background-image', `url('/${file.path}')`);
			toastSuccess('Thumbnail uploaded successfully!');
		} else {
			toastSuccess(`${type} uploaded successfully!`);
	
			const fileDetails = $(element).find('.file-details');
			const fileName = $(element).find('.file-name');
			const progressContainer = $(element).find('.progress-container');
			const closeBtn = $(element).find('button.close');
	
			closeBtn.css('color', 'red');
			closeBtn.click(function (e) {
				e.preventDefault();
				let icon = $(element).find('i');
				$(icon[0]).show();
				fileDetails.hide();
				toastInfo('Upload removed');
			});
3
			progressContainer.hide();
			$(element).find('.progress-bar').css('width', '0%');
			let icon = $(element).find('i');
			$(icon[0]).hide();
			
			fileDetails.show();
			fileName.html(`${file.originalname}`);
		}
	}
});
