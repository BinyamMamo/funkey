// TODO -- THINK ABOUT ADDING A FLAG TO CHECK IF LYRICS IS LOADED BEFORE PLAYING THE MUSIC
//      -- check if the music has started playing before allowing the user to type
// let DEFAULT_TEXT = "Lorem ipsum dolor sit amet consectetur adipisicing elit";
let DEFAULT_TEXT = '...'; // "♪"
let textboxContent = DEFAULT_TEXT;
const SPEED = 1;

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

$(document).ready(function () {
  // console.clear();

  // loading();  // TODO: check if no need and remove it
  $('.overlay-loader').show();

  // fetch('/uploads/lyrics.txt').then((res) => res.text()).then((res) => {
  // 	console.log(res);
  // })

  let ajax = new XMLHttpRequest();

  ajax.onreadystatechange = async function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log('connection stablished!');

      let response = this.responseText;
      response = response.split('\n');

      console.log('response', response);
      TITLE = response[0].split('(')[0];

      for (let i = 1; i < response.length; i++) {
        let id = response[i];
        i++;

        let stamp = response[i];
        stamp = stamp.split(' --> ')[0];
        i++;

        let verse = '';
        while (response[i] != '') {
          verse += response[i] || '';
          verse += EOL;
          i++;
        }

        lyrics.push({
          id,
          stamp,
          verse,
        });
      }

      let line = TITLE; // TODO = TITLE
      fillTextBox(line);
      $('#play').show();

      console.log(lyrics);
    }
  };

  let lyricsUrl = $('.whole-body').find('input[type="hidden"]').val();
  // lyricsUrl = lyricsUrl || "/uploads/lyrics.txt";
  console.log('lyricsUrl', lyricsUrl);
  ajax.open('GET', `/${lyricsUrl}`, true);
  ajax.send();
});

function playMusic(btn) {
  let musicId = btn.dataset.id;
  fetch(`/update/views/${musicId}`, {
    method: 'PUT',
  });

  $('.lyrics-container').show();
  $('.keyboard-container').show();
  $('.overlay-loader').hide();
  begin_music();
}

function begin_music() {
  vid.controls = false;
  vid.playbackRate = SPEED;

  vid.play();

  interval_id = setInterval(timer, 1000);
}

function fillTextBox(line) {
  cursor = 0;
  line = parse(line);
  line = easy(line);
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
  if (textbox.childNodes.length > 0)
    textbox.childNodes[0].classList.add('cursor');
  // console.log(textbox.childNodes[0])
}

let previous_time = 0;
let finished = false;
document.addEventListener('keypress', (ev) => {
  // console.log(ev.key, cursor, textboxContent, ev.key == textboxContent[cursor]);
  // console.log("textboxContent: ", textboxContent.charAt(0), " dsfsdfsd");
  if (cursor >= textboxContent.length) {
    // console.log(textboxContent.split(" ").length," ", time);
    console.log('FINISHED!!!');
  } else if (ev.key == textboxContent[cursor]) {
    let curr = document.getElementsByClassName('cursor')[0];
    curr.classList.remove('cursor');
    curr.classList.add('done');
    if (curr.nextElementSibling) {
      curr.nextElementSibling.classList.add('cursor');
      // console.log(curr);
      cursor += 1;
    } else {
      console.log('FINISHED!!!');
      update_wpm();
      finished = true;
    }
  }
});

function update_wpm() {
  // let words = textboxContent.split(" ").length;
  let words = cursor;
  let wpm_count = 0;
  wpm_count = words / (time - previous_time);
  wpm_count *= 60000;
  wpm_count /= 5;

  console.log('cursor', cursor);
  console.log('time', time);
  console.log('prev time', previous_time);
  console.log(wpm_count);
  previous_time = time;

  if (isNaN(wpm_count) || wpm_count === Number.POSITIVE_INFINITY) wpm_count = 0;
  wpm.innerHTML = `${Math.floor(wpm_count)}WPM`;
  wpm_array.push(wpm_count);
}

function parse(line) {
  // line = line.replace(/\n/g, "newlinenewlinenewline");
  line = line.replace(/\n/g, ' ');
  line = line.replace(/^ /, '');
  line = line.replace(/ $/, '');

  return line;
}

function easy(line) {
  line = line.toLowerCase();
  line = line.replace(/[^(a-z| |\n)]/g, ''); // couldn't inlcude braces ()
  line = line.replace(/ +/g, ' ');

  return line;
}

let time = 0;
let curr = 0;
function timer() {
  const time_cont = document.getElementById('timer');

  sec = time / 1000;
  min = Math.floor(sec / 60);
  let output = '';

  sec = sec % 60;

  if (min < 10) output += `0${min}`;
  else output += `${min}`;

  output += ':';

  if (sec < 10) output += `0${Math.floor(sec)}`;
  else output += `${Math.floor(sec)}`;

  let stamp = null;
  if (curr + 1 < lyrics.length) stamp = lyrics[curr + 1].stamp;
  else {
    console.log('FINALLY WE HAVE FINISHED');
		$('.keyboard-container').hide();
		$('.ratings-parent').show();
    let averagey =
      wpm_array.reduce(
        (accumulator, currentValue) =>
          accumulator + (isNaN(currentValue) ? 0 : currentValue),
        0
      ) / wpm_array.length;
    console.log('Average wpm:', averagey);
    fillTextBox(averagey.toString());
    // container.innerHTML = `WPM: ${averagey}`;
    clearInterval(interval_id);
    return;
  }
  stamp = stamp.split(':');

  let lyrics_time = parseInt(stamp[0] * 3600);
  lyrics_time += parseInt(stamp[1] * 60);
  lyrics_time *= 1000;
  lyrics_time += parseInt(stamp[2].replace(',', ''));

  if (time + 1500 * SPEED > lyrics_time) {
    curr++;
    if (curr >= lyrics.length) {
      console.log('Finished!'); // FInal Finish
      const average =
        wpm_array.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        ) / wpm_array.length;
      fillTextBox(`WPM: ${average}`);
    } else {
      let line = lyrics[curr].verse;
      // console.log(line);

      if (!finished) {
        console.log('reached here: final');
        update_wpm();
      }
      finished = false;

      previous_time = time;
      fillTextBox(line);
    }
  }

  time_cont.innerHTML = output;
  time += 1000 * SPEED;
}

function do_seeking() {
  // console.log(vid.currentTime);
  time = vid.currentTime * 1000;
}

function do_seeked() {
  // console.log(vid.currentTime);
  timer();
}
