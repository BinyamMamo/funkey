// affirm.js

// Function to create and show the confirmation modal
function affirm(message) {
	return new Promise((resolve) => {
			// Create the modal HTML
			const modalHtml = `
					<div class="modal fade" id="affirmModal" tabindex="-1" role="dialog" aria-labelledby="affirmModalLabel" aria-hidden="true">
							<div class="modal-dialog" role="document">
									<div class="modal-content">
											<div class="modal-header">
													<h5 class="modal-title" id="affirmModalLabel">Confirm</h5>
													<button type="button" class="close" data-dismiss="modal" aria-label="Close">
															<span aria-hidden="true">&times;</span>
													</button>
											</div>
											<div class="modal-body">
													${message}
											</div>
											<div class="modal-footer">
													<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
													<button type="button" class="btn btn-danger" id="affirmYesButton">Yes</button>
											</div>
									</div>
							</div>
					</div>
			`;

			// Append the modal HTML to the body
			document.body.insertAdjacentHTML('beforeend', modalHtml);

			// Show the modal
			$('#affirmModal').modal('show');

			// Function to handle the confirmation
			function handleConfirmation() {
					$('#affirmModal').modal('hide');
					resolve(true);
			}

			// Handle the 'Yes' button click
			document.getElementById('affirmYesButton').addEventListener('click', handleConfirmation);

			// Handle the Enter key press
			document.addEventListener('keydown', function onKeydown(event) {
					if (event.key === 'Enter') {
							handleConfirmation();
							document.removeEventListener('keydown', onKeydown);
					}
			});

			// Set focus to the "Yes" button when the modal is shown
			$('#affirmModal').on('shown.bs.modal', function () {
					document.getElementById('affirmYesButton').focus();
			});

			// Handle the modal close event
			$('#affirmModal').on('hidden.bs.modal', () => {
					$('#affirmModal').remove();
					resolve(false);
			});
	});
}

// Example usage
// affirm('Are you sure you want to delete this user?').then((result) => {
//     if (result) {
//         console.log('User confirmed');
//     } else {
//         console.log('User cancelled');
//     }
// });
