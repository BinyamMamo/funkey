$(document).ready(function () {
  $('.login-form').on('submit', async function (event) {
    event.preventDefault();

    const email = $(this).find('input[name="email"]')[0].value;
    const password = $(this).find('input[name="password"]')[0].value;

    $('.spinner').show();
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
  });

  $('.google-login').on('click', async function (event) {
    event.preventDefault();

    $('.spinner').show();
    window.location.href = '/auth/google';
		setTimeout(() => {
			$('.spinner').hide();
			toastDanger('signin with google is taking too long...')
		}, 5000);
  });
});
