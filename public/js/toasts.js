function toastSuccess(message) {
  toastMessage(message, 'Success', 'toast-success', 'fa fa-thumbs-up');
}

function toastWarning(message) {
  toastMessage(message, 'Warning', 'toast-warning', 'fa fa-exclamation-circle');
}

function toastError(message) {
  toastMessage(message, 'Error', 'toast-danger', 'fa fa-bug');
}

function toastDanger(message) {
  toastMessage(message, 'Error', 'toast-danger', 'fa fa-bug');
}

function toastInfo(message) {
  toastMessage(message, 'Info', 'toast-info', 'fa fa-info-circle');
}

// const toastContainer = document.querySelector('.toast-container');
const toastContainer = document.createElement('div');
toastContainer.id = 'toast-container';
toastContainer.classList.add('toast-container');
document.body.appendChild(toastContainer);

function toastMessage(message, header, category, categoryIcon) {
  let delay = 4000 + message.length * 50;

  // Create a new toast element
  const toastEl = document.createElement('div');
  toastEl.classList.add('toast');
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('data-delay', `${delay}`);
  toastEl.setAttribute('aria-atomic', 'true');
  toastEl.innerHTML = `
			<div class="toast-header ${category}">
					<i class="${categoryIcon}"></i>
					<strong class="mr-auto">${header}</strong>
					<small>Just now</small>
					<button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
							<span aria-hidden="true">&times;</span>
					</button>
			</div>
			<div class="toast-body">
					${message}
			</div>
	`;

  // Append the toast to the container
  toastContainer.appendChild(toastEl);

  // Initialize the toast
  const toast = new bootstrap.Toast(toastEl);
  toast.show();

  // Remove the toast after a delay (e.g., 5 seconds)
  // setTimeout(() => {
  //   toast.hide();
  //   toastContainer.removeChild(toastEl);
  // }, delay);

  let remainingTime = delay / 1000;
  const countdownSpan = $(toastEl).find('small')[0];
  const countdownInterval = setInterval(() => {
    countdownSpan.textContent = ` (${(Math.round(remainingTime))}s)`;
    remainingTime--;
    if (remainingTime < 0) {
      clearInterval(countdownInterval);
      toast.hide();
      toastContainer.removeChild(toastEl);
    }
  }, 1000);
}
