console.clear();
let allKeys = new Set();
const keysPressed = new Set();
let index = 0;
let songNotes = [];
let loadedNotes = {};
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audio = new Audio(`tunes/c4.mp3`);
let currentAudio = null;

const pianoKeys = document.querySelectorAll(".piano-keys .piano-key");
const volumeSlider = document.querySelector(".volume-control");
const keysCheckbox = document.querySelector(".keys-checkbox input");
const noteDisplay = document.querySelector("#play-note h4");

$(document).ready(function () {
	let volume = localStorage.getItem('piano-volume');
	if (volume !== null)
		volumeSlider.value = parseFloat(volume);
	else
		volumeSlider.value = 0.457;

	if (audio)
		audio.volume = volumeSlider.value;
});

new Set(["c4", "d4", "e4", "f4", "g4", "a4", "b4", "c5", "d5", "e5"]).forEach(
  (note) => {
    note = note.toLowerCase();
    // loadedNotes[note] = new Audio(`tunes/${note}.mp3`);
    loadedNotes[note] = `tunes/${note}.mp3`;
  }
);

pianoKeys.forEach((key) => {
  // key.querySelector('span').innerHTML = key.dataset.note;
  key.addEventListener("click", () => playTune(key));
  allKeys.add(key.dataset.key);
});

keysCheckbox.addEventListener("click", () => {
  pianoKeys.forEach((key) => key.classList.toggle("hide"));
});

volumeSlider.addEventListener("input", (event) => {
  audio.volume = event.target.value;
	localStorage.setItem('piano-volume', audio.volume.toString());
});

document.addEventListener("keydown", (event) => {
  let key = event.key.toLowerCase();
  if ((event.ctrlKey || event.shiftKey) && allKeys.has(key))
    event.preventDefault();

  // prevent debouncing
  if (keysPressed.has(key)) return;
  keysPressed.add(event.key);

  if (allKeys.has(key)) {
    console.log(`key: ${key}`);
    let activeKey = document.querySelector(`[data-key="${key}"]`);
    playTune(activeKey);
    console.log("activeKey:", activeKey);
    // noteDisplay.innerHTML = activeKey.dataset.note;
  }
});

document.addEventListener("keyup", function (event) {
  keysPressed.delete(event.key);
});


const playTune = (activeKey) => {
  let key = activeKey.dataset.key.toLowerCase();
  let note = activeKey.dataset.note.toLowerCase();
  // audio = new Audio(`tunes/${note}.mp3`);
  // audio = loadedNotes[note];
  // audio.load();
  // audio.src = `tunes/${note}.mp3`;
	
  activeKey.classList.add("active");
  setTimeout(() => {
    activeKey.classList.remove("active");
  }, 150);

  note = note.toUpperCase();
  // console.log(`note: ${note}`);
  // console.log(`curr note: ${songNotes[index]}`);
	
	playNoteFully(note);
  $(".piano-white").css("--done-height", `0%`);
  if (note === songNotes[index]) {
		// if (audio) audio.play();
    index++;
    if (index < songNotes.length) {
      $(".piano-current").removeClass("piano-current");
      noteDisplay.innerText = songNotes[index];
      $(`[data-note="${songNotes[index]}"]`).addClass("piano-current");
    } else {
      index = -1;
      $(".piano-current").removeClass("piano-current");
      $(".piano-white").css("--done-height", `100%`);
      noteDisplay.innerText = "Done";
			$('#play-note').attr("data-original-title", "Show Melodies").tooltip('hide');
    }
  }
};

$('.piano-melody').hover(
	function() {
		let title = this.innerText || "Show Piano";
		var newTitle = "New Tooltip Title";
		$('#play-note').attr('data-original-title', title).tooltip('show');
	}, 
	function() {
		$('#play-note').attr('data-original-title', "Show Melodies").tooltip('hide');
	}
);

$('.piano-melody').click(function () {
	const ajax = new XMLHttpRequest();
	let title = this.innerText || "Show Melodies";
	
	ajax.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			let melody = this.responseText;
			melody = melody.replace(/\n/g, ' ');
			melody = melody.replace(/ +/g, ' ');
			melody = melody.replace(/ $/g, '');

			songNotes = melody.split(' ');
			index = 0;
			$(".piano-white").css("--done-height", `0%`);
			$(`[data-note="${songNotes[index]}"]`).addClass("piano-current");
			noteDisplay.innerText = songNotes[index];
			$('#play-note').attr("data-original-title", title).tooltip('show');
			// $('#play-note').attr("data-original-title", title).tooltip();
		}
	}

	ajax.open("GET", `melody/${this.dataset.path}`, true);
	ajax.send();
	console.log('finished');
});

function playNoteFully(note) {
	note = note.toLowerCase();
	// if (currentAudio) {
	// 		currentAudio.stop();
	// }
	const audioBufferSourceNode = audioContext.createBufferSource();
	currentAudio = audioBufferSourceNode;

	console.log(loadedNotes[note]);
	console.log("-----------");
	// fetch('tunes/a3.mp3')
	fetch(loadedNotes[note])
			.then(response => response.arrayBuffer())
			.then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
			.then(audioBuffer => {
					audioBufferSourceNode.buffer = audioBuffer;
					audioBufferSourceNode.connect(audioContext.destination);
					audioBufferSourceNode.start();
					audioBufferSourceNode.onended = () => {
							currentAudio = null;
					};
			});
}