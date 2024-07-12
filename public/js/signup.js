$(document).ready(function () {
  console.clear();
  $('.avatar-container').click(function (e) {
    e.preventDefault();
    $('#avatar-upload').trigger('click');
  });

  $('#avatar-upload').on('change', function () {
    let element = $(this).prev();

    uploadFile(this.files[0], element[0]);
  });

  $('.avatar-container').on('dragover', function (event) {
    event.preventDefault();
    this.classList.add('drop-hover');
  });

  $('.avatar-container').on('dragleave', function (event) {
    event.preventDefault();
    this.classList.remove('drop-hover');
  });

  $('.avatar-container')[0].addEventListener('drop', function (event) {
    event.preventDefault();
    this.classList.remove('drop-hover');
    var files = event.dataTransfer.files;
    handlesFiles(files, this);
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

    if (!validFile(file, type)) return;

    var formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);

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
    const allowedMimeTypes = [
      'image/png',
      'image/jpeg',
      'image/gif',
      'image/webp',
    ];

    if (!file) {
      toastDanger('No file uploaded.');
      console.log('error: No file uploaded.');

      return false;
    }

    if (!allowedMimeTypes.includes(file.type)) {
      let allowedTypes = allowedMimeTypes
        .map((mimeType) => '.' + mimeType.replace(`${type}/`, ''))
        .join(', ');
      toastDanger(
        `Invalid file type! <br> Upload ${type} type(${allowedTypes}) only.`
      );
      console.log('error: Invalid file type.');
      return false;
    }

    return true;
  }

  function handleFileDetails(element, file) {
    $('.avatar-container').css('background-image', `url('/${file.path}')`);
    toastSuccess('Avatar uploaded successfully!');
		$('input[name="avatar"]')[0].value = file.path;
  }
});

$(document).ready(function () {
  $('.signup-form').on('submit', async function (event) {
    event.preventDefault();

    const name = $(this).find('input[name="name"]')[0].value;
    const email = $(this).find('input[name="email"]')[0].value;
    const password = $(this).find('input[name="password"]')[0].value;
    const avatar = $(this).find('input[name="avatar"]')[0].value;

    $('.spinner').show();
    try {
      const response = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, avatar }),
      });

      const data = await response.json();

      if (response.ok) {
				console.log(data.user);
				
        // Redirect to homepage
				window.location.href = '/';  // tODO: think about redirecting to profile page
        setTimeout(() => {
					toastSuccess(data.msg);
					$('.spinner').hide();
        }, 500);
      } else {
        $('.spinner').hide();
        toastError(data.error);
        console.error(data.error);
      }
    } catch (error) {
      $('.spinner').hide();
      toastError(`Error: ${error.message}`);
      console.error('Error:', error);
    }
  });
});
