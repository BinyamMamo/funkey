window.addEventListener('load', () => {
	console.clear();
	const ajax = new XMLHttpRequest();
	console.log("hey");

	ajax.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("keyboard-container").innerHTML = this.response;
		}
	}
	ajax.open("GET", "keyboard.html", true);
	ajax.send();
});