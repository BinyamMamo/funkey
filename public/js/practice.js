console.clear();
// let text = "Lorem ipsum dolor sit amet consectetur adipisicing .";
let text = `
Elara, a girl with eyes the color of storm clouds and a mop of tangled auburn hair, had always been a dreamer. She spent her days wandering the dusty, sun-baked streets of her village, lost in tales of enchanted lands and magical creatures. One day, while exploring the abandoned attic of her grandmother's house, she stumbled upon a dusty leather backpack tucked away in a cobwebbed corner.
The backpack was unlike any she'd ever seen. It was intricately woven with silver thread, its leather soft as a whisper. A tarnished silver buckle adorned the front, etched with swirling patterns that seemed to shift and shimmer when Elara touched it. Curiosity overwhelming her, Elara slung the backpack over her shoulder. A wave of warmth flowed through her, and a strange, comforting feeling settled in her heart.
Later that evening, as Elara walked home, she noticed a peculiar detail. Every time she passed a stray cat, a bowl of fresh milk appeared on the doorstep of the house she was passing. The next day, a flock of sparrows followed her, chirping happily as they feasted on seeds that seemed to magically appear in her hand.  She started leaving the backpack in her room at night, and woke to find her room filled with the sweet scent of freshly baked bread and the comforting aroma of cinnamon tea. 
Elara realized the backpack wasn't just any ordinary bag. It was a magic backpack, imbued with the power to grant her wishes, even if they were unspoken. She started using it to help others. She gifted fresh vegetables to a struggling family, helped a sick child recover by leaving medicine by their bedside, and even helped a lost puppy find its way home by leaving a bowl of water in its path. 
One day, Elara discovered a small, tattered book tucked into the backpack's pocket. It contained a list of magical spells, each one more incredible than the last. She learned to summon a gentle breeze to cool the air on scorching days, to make flowers bloom in the barren desert, and to heal minor injuries with a touch.
However, as Elara grew bolder, she began to use the backpack's magic for her own benefit. She wished for a golden carriage to impress the village boys, for a magnificent gown to wear to the annual festival, and even for a handsome prince to sweep her off her feet.  
But the magic backfired. The carriage turned into a rickety cart, the gown into a tattered cloak, and the prince into a grumpy old farmer. Elara was horrified. She realized that her selfishness had corrupted the magic. The backpack no longer granted her wishes, but twisted them into something ugly and unkind.
Despondent, Elara returned the backpack to the attic, vowing to never use its magic again. But she knew she had learned a valuable lesson: true magic lies in kindness and generosity, not in personal gain. From then on, Elara continued to help others, using her own strength and compassion, and her heart, finally free from the burden of magical desires, found true happiness.
`;
let cursor = 0;
const WHITESPACEs = ['·', '&nbsp;', '_'];
const WHITESPACE = WHITESPACEs[1];

window.addEventListener('load', () => {
  beginPractice();
});

function beginPractice() {
  cursor = 0;
  text = text.trim().replace(/\n+/g, '\n');
  // text = text.replace(/\n/g, ' ');
  text = text.replace(/  +/g, ' ');
  text = text.replace(/\n /g, '\n');
  text = text.replace(/ \n/g, '\n');
  fillTextBox();
}

function fillTextBox() {
  document.getElementById('textbox').innerHTML = '';
  for (let i = 0; i < text.length; i++) {
    let b = document.createElement('char');
    if (i == cursor && text[i] != '\n') b.classList = ['char cursor'];
    else b.classList = ['char'];
    b.innerHTML = text[i] == '\n' ? ' ' : text[i];
    b.innerHTML = text[i] == ' ' ? WHITESPACE : text[i];
    if (text[i] == '\n') b.classList.add('break');
    document.getElementById('textbox').appendChild(b);
  }
}

let time = null;
let timerId = null;
document.addEventListener('keypress', (ev) => {
  let modal = document.getElementById('practiceModal').style;
  if (modal.display == 'block') return;

  if (time == null) {
    time = 0;
    timerId = setInterval(() => {
      time += 1000;
    }, 1000);
  }
  if (ev.key == ' ') ev.preventDefault();
  if (cursor >= text.length) {
    console.log('FINISHED!!!');
  } else if (
    (ev.key === 'Enter' && text[cursor] == '\n') ||
    ev.key == text[cursor]
  ) {
    let curr = document.getElementsByClassName('cursor')[0];
    if (cursor + 1 < text.length && text[cursor + 1] != '\n')
      curr.classList.remove('cursor');

    if (curr.nextElementSibling) {
      let sibling = $(curr).first().nextAll('.char').not('.break').first();
      if (cursor + 1 < text.length && text[cursor + 1] != '\n')
        sibling.addClass('cursor');
      curr.classList.add('done');
      cursor += 1;
    } else {
      if (timerId) clearInterval(timerId);
      let words = text.length / 5;
      let minute = time / 60000;

      document.body.ondblclick = null;
      let wpm = Math.round(words / minute);
      $('.stats-container')
        .find('.replay')
        .on('click', function (e) {
          e.preventDefault();
          cursor = 0;
          time = null;
          bgMusic.load();
          if (bgMusic) bgMusic.play();
          $('.char').removeClass('done');
          $('.char').removeClass('cursor');
          $('.char').first().addClass('cursor');
          $('.stats-container').hide();

          document.body.ondblclick = (e) => { showStats(e) };
        });

      $('.stats-container').find('.wpm-display').text(`${wpm} wpm`);
      $('.stats-container').find('.close-stats').hide();
      $('.stats-container').find('.replay').show();
      $('.stats-container').show();
      bgMusic.pause();
      console.log('FINISHED!!!');
    }
  }
});

let selectedAudio = new Audio(`/assets/audio/forest.mp3`);

$(document).ready(function () {
  $('.audio-selector').on('change', function (e) {
    e.preventDefault();
    let value = $(this).val();
    let selected = $(this).find('option:selected')[0];
    localStorage.setItem('audioSelected', value);
    if (!value) {
      if (!selectedAudio.paused) selectedAudio.pause();
      return;
    }

    selectedAudio.load();
    selectedAudio.src = `/assets/audio/${value}`;
    if (selectedAudio) selectedAudio.play();
  });

  $('.audio-selector').on('blur', function (e) {
    if (!selectedAudio.paused) selectedAudio.pause();
  });
  $('.audio-selector').val(localStorage.getItem('audioSelected'));

  $('#themeCarousel').on('slide.bs.carousel', function (e) {
    let activeItem = e.relatedTarget;
    let caption = activeItem.getAttribute('data-caption');
    $('#carouselCaption').text(caption);
    localStorage.setItem('themeCarousel', e.to.toString());
    $(this).find('input[name="theme"]').val(activeItem.dataset.view);
  });
  $('#themeCarousel').carousel({
    pause: true,
  });
  $('#themeCarousel').carousel(parseInt(localStorage.getItem('themeCarousel')));
});

let bgMusic = new Audio(`/assets/audio/forest.mp3`);
$(document).ready(function () {
  $('#practice-menu').on('submit', function (e) {
    e.preventDefault();
    $('.spinner').show();
    $('#practiceModal').hide();

    document.body.ondblclick = (e) => { showStats(e) };

    let textarea = $(this).find('textarea');
    let prompt = $(this).find('input[name="prompt"]').val();
    let capitals = $(this).find('input[name="capitals"]')[0].checked;
    let punctuations = $(this).find('input[name="punctuations"]')[0].checked;
    let theme = $(this).find('input[name="theme"]').val();
    let length = $(this).find('input[name="length"]').val();
    let audio = $(this).find('select[name="audio"]').val();
    console.log('length:', length);
    if (length && parseInt(length))
      prompt = `${prompt}. And the length should not exceed ${length} words`;

    console.log('prompt:', prompt);
    console.log('audio:', audio);
    bgMusic.load();
    bgMusic.src = `/assets/audio/${audio}`;
    bgMusic.loop = true;

    theme = `/practice/partials/${theme}`;
    localStorage.setItem('theme', theme);
    fetch(theme)
      .then((res) => {
        if (!res.ok) return res.text().then((err) => Promise.reject(err));
        return res.text();
      })
      .then((res) => {
        // console.log(res);
        if (res.error) return;
        $('#theme-container').html(res);
      });

    if (textarea.val()) {
      document.getElementById('practiceModal').style.display = 'none';
      text = textarea.val();
      if (!capitals) text = text.toLowerCase();
      if (!punctuations) text = text.replace(/[^(A-Z|a-z| |\n)]/g, '');
      beginPractice();
      if (bgMusic) bgMusic.play();
      return;
    } else if (prompt == '' || !prompt) {
      $('.spinner').hide();
      if (!capitals) text = text.toLowerCase();
      if (!punctuations) text = text.replace(/[^(A-Z|a-z| |\n)]/g, '');
      beginPractice();
      if (bgMusic) bgMusic.play();
      return;
    }

    fetch('/practice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((err) => Promise.reject(err));
        return res.json();
      })
      .then((res) => {
        $('.spinner').hide();
        document.getElementById('practiceModal').style.display = 'none';
        text = res.response;
        if (!capitals) text = text.toLowerCase();
        if (!punctuations) text = text.replace(/[^(A-Z|a-z| |\n)]/g, '');

        beginPractice();
        if (bgMusic) bgMusic.play();
      })
      .catch((err) => {
        $('.spinner').hide();
        console.error(err);
      });
  });

	function getRandomInt(min, max) {
		const randomBuffer = new Uint32Array(1);
		window.crypto.getRandomValues(randomBuffer);
		let randomNumber = randomBuffer[0] / (0xFFFFFFFF + 1);
		return Math.floor(randomNumber * (max - min) + min);
	}

  $('.generate-prompt').on('click', function (e) {
    e.preventDefault();
    let prompts = [
      'a story about Ethiopia',
      'a poem about hard working',
      'a funny fairy tale',
      'funny dad jokes',
      'a horror story',
    ];
    let randomIndex = getRandomInt(0, prompts.length);
    let prompt = prompts[randomIndex];
    let index = 0;
    $('.prompt-message').val('');
    let intervalId = setInterval(() => {
      if (index >= prompt.length) {
        clearInterval(intervalId);
        return;
      }
      content = $('.prompt-message').val();
      $('.prompt-message').val(`${content}${prompt[index]}`);
      index++;
    }, 40);
  });

  function showStats(e) {
    e.preventDefault();
    let words = cursor / 5;
    let minute = time / 60000;
    $('.stats-container')
      .find('.close-stats')
      .on('click', function (e) {
        bgMusic.play();
        $('.stats-container').hide();
      });

    let wpm = Math.round(words / minute);
		if (words < 5 || time < 1000	)
    	$('.stats-container').find('.wpm-display').text(` _ wpm`);
    else
			$('.stats-container').find('.wpm-display').text(`${wpm} wpm`);
    $('.stats-container').find('.close-stats').show();
    $('.stats-container').find('.replay').hide();
    $('.stats-container').toggle();
    if (bgMusic.paused) bgMusic.play();
    else bgMusic.pause();
  }
}); // doc ready
