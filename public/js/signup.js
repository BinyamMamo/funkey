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

	async function uploadFile(file, element) {
		let folderName = 'users';
		let res = await fetch(`/signed-upload?folder=${folderName}`);
		const { signature, timestamp, cloud_name, api_key } = await res.json();

		let type = file.type.split('/')[0];
		let resourceType = type === 'video' || type === 'image' ? type : 'raw';
		const url = `https://api.cloudinary.com/v1_1/${cloud_name}/${resourceType}/upload`;

		const formData = new FormData();
		formData.append('file', file);
		formData.append('api_key', api_key);
		formData.append('timestamp', timestamp);
		formData.append('upload_preset', 'mrom3lig');
		formData.append('public_id', file.name); // TODO: handle same file names

		res = await fetch(url, { method: 'POST', body: formData });
		let data = await res.json();

		return data.secure_url;
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
				setTimeout(async () => {
					toastSuccess(data.msg);
					await login(email, password);
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

	async function login(email, password) {
		try {
			const response = await fetch('/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (response.ok) {
				// Redirect to homepage
				toastSuccess(data.message);
				setTimeout(() => {
					$('.spinner').hide();
					window.location.href = data.redirect_url;
				}, 500);
			} else {
				$('.spinner').hide();
				toastError(data.message);
				console.error(data.error);
			}
		} catch (error) {
			// $('.spinner').hide();
			toastError(`Error: ${error.message}`);
			console.error('Error:', error);
		}
	}
});
