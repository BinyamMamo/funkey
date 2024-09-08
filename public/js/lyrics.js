let DEFAULT_TEXT = '♪'; // ""
let textboxContent = DEFAULT_TEXT;

const WHITESPACE_OPTIONS = ['·', '&nbsp;', '_'];
const WHITESPACE = WHITESPACE_OPTIONS[1];

const EOL = '\n'; // <br>
let lyrics = [];
let TITLE = '';

const vid = document.getElementById('music-video');
const textbox = document.getElementById('lyrics-container');
const wpm = document.getElementById('wpm');
let wpm_array = [];

let interval_id = null;

const SPEED = parseFloat(localStorage.getItem('speed'));
const capitals = localStorage.getItem('capitals') != 'true' ? false : true;
const punctuation =
	localStorage.getItem('punctuation') != 'true' ? false : true;
const double_spaces =
	localStorage.getItem('double_spaces') != 'true' ? false : true;


$(document).ready(async function () {
	console.clear();
	$('.overlay-loader').show();
	const track = document.getElementById('subtitle-track');
	let src = track.dataset.src;
	let res = await fetch(src);
	let vttContent = await res.text();
	const vttBlob = new Blob([vttContent], { type: 'text/vtt' });
	const vttUrl = URL.createObjectURL(vttBlob);
	track.src = vttUrl;
	const subtitleTrack = vid.textTracks[0];

	subtitleTrack.mode = 'hidden';

	subtitleTrack.addEventListener('cuechange', () => {
		const activeCue = subtitleTrack.activeCues[0];
		let line = activeCue ? activeCue.text : '';
		if (line)
			fillTextBox(line);

		fetch('/update/watchHour', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ watchHour: vid.currentTime, musicId: window.musicId }),
		});

		update_wpm();
	});

	vid.ontimeupdate = () => {
		const time_cont = document.getElementById('timer');

		let output = '--:--';
		let percent = (vid.duration - vid.currentTime) / vid.duration;
		if (localStorage.getItem('timerMode') == 'ctdwn') {
			output = formatTime(vid.duration - vid.currentTime);
			percent = vid.currentTime / vid.duration;
		} else
			output = formatTime(vid.currentTime);

		time_cont.style.color = `hsla(${parseInt(percent * 100)}, 100%, 75%, 0.9)`;
		time_cont.style.borderColor = `hsla(${parseInt(percent * 100)}, 100%, 75%, 0.3)`;

		time_cont.innerHTML = output;
	}

	vid.onseeked = () => {
		const activeCue = subtitleTrack.activeCues[0];
		let line = activeCue ? activeCue.text : '';

		if (line)
			fillTextBox(line);
	}

	vid.onended = () => { showEnd() };
	$('#play').show();
});

function formatTime(sec) {
	let min = Math.floor(sec / 60);
	let output = '';

	sec = sec % 60;

	if (min < 10) output += `0${min}`;
	else output += `${min}`;

	output += ':';

	if (sec < 10) output += `0${Math.floor(sec)}`;
	else output += `${Math.floor(sec)}`;

	return output;
}

function showEnd() {
	console.log('FINISHED!!!');
	// let averagey =
	// 	wpm_array.reduce(
	// 		(accumulator, currentValue) =>
	// 			accumulator + (isNaN(currentValue) ? 0 : currentValue),
	// 		0
	// 	) / wpm_array.length;
	let sum = 0;
	score_array.forEach((score) => {
		if (score > 0) sum += score;
	});
	let average = sum / score_array.length || 0;
	let score = Math.min(Math.max(parseInt(average), 1), 100);

	fetch('/update/score', {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ score }),
	});

	$('.keyboard-container').hide();
	$('.ratings-parent').show();
	$('.stats-container .wpm-display').text(`${Math.round(average)} %`);
}

document.getElementById('play').addEventListener('click', function (event) {
	playMusic();
});

function playMusic() {
	let musicId = document.getElementById('play').dataset.id;

	fetch(`/update/views/${musicId}`, {
		method: 'PUT',
	});

	$('.lyrics-container').show();
	$('.keyboard-container').show();
	$('.overlay-loader').hide();
	begin_music();
	document.getElementById('play').remove();
}

function begin_music() {
	vid.controls = false;
	vid.playbackRate = SPEED;
	vid.volume = parseFloat(localStorage.getItem('music-volume')) || 0.5;
	localStorage.setItem('music-volume', vid.volume);

	vid.play();
}

function fillTextBox(line) {
	cursor = 0;
	line = parse(line);
	textboxContent = line;
	textboxContent = textboxContent.replace(/\n/g, '<br>');
	textbox.innerHTML = '';

	for (let i = 0; i < line.length; i++) {
		let char = document.createElement('char');
		if (i == cursor) char.classList = ['char cursor'];
		else char.classList = ['char'];

		if (line[i] != '\n') {
			char.innerHTML = line[i] == ' ' ? WHITESPACE : line[i];
			textbox.appendChild(char);
		} else textbox.appendChild(document.createElement('br'));
	}
	// let curr = document.getElementsByClassName("cursor")[0];
	// curr.classList.remove("cursor");
	if (textbox.childNodes.length > 0) {
		$(`.active-key`).removeClass('active-key');
		textbox.childNodes[0].classList.add('cursor');
		let char = line[0];
		if (char == WHITESPACE)
			char = 'space';
		$(`.regular-keys.key-${char}`).addClass('active-key');
	}
}

let previous_time = 0;
let finished = false;
function pauseEverything(ev) {
	vid.pause();
	clearInterval(interval_id);
	interval_id = null;
	// let averagey =
	// 	wpm_array.reduce(
	// 		(accumulator, currentValue) =>
	// 			accumulator + (isNaN(currentValue) ? 0 : currentValue),
	// 		0
	// 	) / wpm_array.length;
	// let average =
	// 	score_array.reduce(
	// 		(accumulator, currentValue) =>
	// 			accumulator + (isNaN(currentValue) ? 0 : currentValue),
	// 		0
	// 	) / score_array.length;
	// let sum = 0;
	// score_array.forEach((score) => {
	// 	if (score > 0) sum += score;
	// });
	// let average = sum / score_array.length || 0;
	// let score = ((cursor + 1) / textboxContent.length) * 100;
	// if (!average) average = score;
	// $('.stats-container .wpm-display').text(`${Math.round(percent)} %`);

	// let percent = (vid.currentTime / vid.duration) * 100;
	$('.stats-container .wpm-display').html(`
			<span class="text-info">${formatTime(vid.currentTime)}</span>
			 <span class="text-secondary"> / ${formatTime(vid.duration)}</span>`);
	$('.stats-container .wpm-display').css('font-size', '1.75rem');
	$('.stats-container').show();
	$('.keyboard-container').hide();

	$('.stats-container .close-stats, .stats-container .btn-close').on('click', function (e) {
		e.preventDefault();
		if (!interval_id) {
			interval_id = setInterval(timer, 100);
		}
		if (vid.paused) vid.play();
		$('.stats-container').hide();
		$('.keyboard-container').show();
	});
}

let debounceTimer;
document.addEventListener('keydown', (ev) => {
	if (debounceTimer) return;

	let seek = (amt) => {
		$('#seek span').text(`${Math.abs(parseInt(amt))} sec`);
		$('#seek i').hide();
		$('#seek').show();

		if (amt < 0) {
			$('#seek .back').show();
			$('#seek').css('left', '5em');
			$('#seek').css('right', 'auto');
		}
		else {
			$('#seek .fwd').show();
			$('#seek').css('left', 'auto');
			$('#seek').css('right', '5em');
		}

		vid.currentTime += amt;
	}

	let changeSpeed = (sign) => {
		if (sign < 0) {
			vid.playbackRate = Math.max(vid.playbackRate - 0.25, 0);
		}
		else {
			vid.playbackRate = Math.min(vid.playbackRate + 0.25, 2);
		}
		$('#seek').css('left', 'auto');
		$('#seek').css('right', '5em');
		$('#seek span').text(`x ${vid.playbackRate.toFixed(vid.playbackRate === 1 ? 1 : 2)}`);
		$('#seek i').hide();
		$('#seek').show();

	}

	// playback controll
	if (ev.ctrlKey && ev.shiftKey && ev.key === 'ArrowRight')
		seek(30);
	else if (ev.ctrlKey && ev.key === 'ArrowRight')
		seek(15.0);
	else if (ev.key === 'ArrowRight')
		seek(5.0);
	else if (ev.key === 'ArrowLeft')
		seek(-5.0);

	if (ev.shiftKey && ev.key === '>')
		changeSpeed(1);
	else if (ev.shiftKey && ev.key === '<')
		changeSpeed(-1);

	// volume controll
	let volume = parseFloat(localStorage.getItem('music-volume'));
	// if (ev.ctrlKey && ev.key === 'ArrowDown')
	if (ev.key === 'ArrowUp') {
		$('#volume .fas').hide();
		$('#volume .up').show();
		vid.volume = Math.min(volume + 0.05, 1.0);
		$('#volume span').text(`${parseInt(vid.volume * 100)}%`);
		$('#volume').show();
	}

	if (ev.key === 'ArrowDown') {
		$('#volume .fas').hide();
		$('#volume .down').show();
		vid.volume = Math.max(volume - 0.05, 0.0);
		$('#volume span').text(`${parseInt(vid.volume * 100)}%`);
		$('#volume').show();
	}

	debounceTimer = setTimeout(() => {
		debounceTimer = null;
	}, 100);

	localStorage.setItem('music-volume', vid.volume);
});

document.addEventListener('keyup', function (event) {
	if (event.ctrlKey && event.key == 'Enter') {
		event.preventDefault();
		toggleFullscreen(document.documentElement);
	}

	if (event.key === 'Escape' || (event.ctrlKey && event.code == 'Space')) {
		event.preventDefault();
		event.stopPropagation();
		pauseEverything(event);
	}

	// $('#volume').hide();
	setTimeout(() => {
		$('#volume').hide();
		$('#seek').hide();
	}, 500);
});

document.addEventListener('keypress', (event) => {
	if ($('#play').length > 0) {
		if (event.code == 'Space' || event.code == 'Enter')
			playMusic();
		return;
	}

	if ((event.code == 'Enter' || event.code == 'Space') && vid && vid.paused) {
		vid.play();
		$('.keyboard-container').show();
		$('.stats-container').hide();
	}

	if (cursor >= textboxContent.length) {
		console.log('FINISHED!!!');
	} else if (event.key == textboxContent[cursor]) {
		$(`.active-key`).removeClass('active-key');
		let curr = document.getElementsByClassName('cursor')[0];
		curr.classList.remove('cursor');
		curr.classList.add('done');
		if (curr.nextElementSibling) {
			curr.nextElementSibling.classList.add('cursor');
			let char = curr.nextElementSibling.innerHTML;
			if (char == WHITESPACE)
				char = 'space'
			$(`.keys.key-${char.toLowerCase()}`).addClass('active-key');
			// console.log(curr);
			cursor += 1;
		} else {
			// showEnd();
			console.log('FINISHED!!!');
			// update_wpm();
			// finished = true;
		}
	}
});

let score_array = [];
function update_wpm() {
	let words = textboxContent.length;
	// let words = cursor;
	// let wpm_count = 0;
	// wpm_count = words / (time - previous_time);
	// wpm_count *= 60000;
	// wpm_count /= 5;

	// previous_time = time;

	// if (isNaN(wpm_count) || wpm_count === Number.POSITIVE_INFINITY) wpm_count = 0;
	// wpm.innerHTML = `${Math.floor(wpm_count)}WPM`;

	console.log('score updating...');

	let count = (cursor / words) * 100;
	console.log("count:", count);
	// wpm_array.push(count);
	score_array.push(count);
	fetch('/update/score', {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			score: Math.min(Math.max(parseInt(count), 1), 100),
		}),
	});
}

function parse(line) {
	// line = line.replace(/\n/g, "newlinenewlinenewline");
	line = line.replace(/\n/g, ' ');
	line = line.replace(/^ /, '');
	line = line.replace(/ $/, '');

	if (!capitals) line = line.toLowerCase();
	if (!punctuation) {
		line = line.replace(/[^(a-z| |\n)]/g, '');  // TODO: exclude 0 - 9 too
		line = line.replace(/\(/g, '');
		line = line.replace(/\)/g, '');
	}
	if (!double_spaces) {
		line = line.trim().replace(/\n+/g, '\n');
		line = line.replace(/  +/g, ' ');
		line = line.replace(/\n /g, '\n');
		line = line.replace(/ \n/g, '\n');
	}

	return line;
}

function enterFullscreen(element) {
	if (element.requestFullscreen) {
		element.requestFullscreen();
	} else if (element.mozRequestFullScreen) { // Firefox
		element.mozRequestFullScreen();
	} else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
		element.webkitRequestFullscreen();
	} else if (element.msRequestFullscreen) { // IE/Edge
		element.msRequestFullscreen();
	}
}

function exitFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.mozCancelFullScreen) { // Firefox
		document.mozCancelFullScreen();
	} else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
		document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) { // IE/Edge
		document.msExitFullscreen();
	}
}

function toggleFullscreen(element) {
	console.log("entering full screen");
	if (!document.fullscreenElement &&    // Standard
		!document.mozFullScreenElement && // Firefox
		!document.webkitFullscreenElement && // Chrome, Safari and Opera
		!document.msFullscreenElement) { // IE/Edge
		enterFullscreen(element);
	} else {
		exitFullscreen();
	}
}