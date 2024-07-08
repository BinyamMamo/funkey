$(document).ready(function () {
  console.clear();
  $('#file-upload').css('opacity', '0');

  $('#file-browser').click(function (e) {
    e.preventDefault();
    $('#file-upload').trigger('click');
  });

  var dropZone = document.getElementById('drop_zone');

  dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.classList.add('hover');
  });

  dropZone.addEventListener('dragleave', (event) => {
    event.preventDefault();
    dropZone.classList.remove('hover');
  });

  dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('hover');
    var files = event.dataTransfer.files;
    handlesFiles(files);
  });

  function handlesFiles(files) {
    for (var count = 0; count < files.length; count++) {
      var file = files[count];
      uploadFile(file);
    }
  }

  function uploadFile(file) {
    var formData = new FormData();
    formData.append('file', file);
    fetch('/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        const gallery = document.getElementById('uploadedImage');
        let html = `<img src="/uploads/${data.filename}" class="img-thumbnail" />`;
        gallery.innerHTML = gallery.innerHTML + html;
      });
  }
});
