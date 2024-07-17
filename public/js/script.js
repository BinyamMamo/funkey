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
const WHITESPACEs = ["·", "&nbsp;", "_"];
const WHITESPACE = WHITESPACEs[1];


window.addEventListener('load', () => {
  // const ajax = new XMLHttpRequest();
  // ajax.onreadystatechange = function() {
  //   if (this.readyState == 4 && this.status == 200) {
  //     text = this.response;
  //     text = text.trim().replace(/\n/g, " ");
  //     console.log("text: ", text);
  //     fillTextBox();
  //   }
  // }
  
  // ajax.open("GET", "text.txt", true);
  // ajax.send();
	text = text.trim().replace(/\n/g, " ");
  fillTextBox();
});


function fillTextBox() {
  document.getElementById("textbox").innerHTML = "";
  for (let i = 0; i < text.length; i++) {
    let b = document.createElement("char");
    if (i == cursor)
      b.classList = ["char cursor"];
    else
      b.classList = ["char"];
    b.innerHTML = text[i] == " " ? WHITESPACE : text[i];
    document.getElementById("textbox").appendChild(b);
  }
}

document.addEventListener("keypress", (ev) => {
	let audio = document.getElementById('bg-music');
  console.log();
	if (ev.key == ' ') {
		ev.preventDefault();
		console.log('space is pressed');
	}
	if (audio.paused) {
		audio.play();
	}
  if (cursor >= text.length) {
    console.log("FINISHED!!!");
  } else if (ev.key == text[cursor]) {
    let curr = document.getElementsByClassName("cursor")[0];
    curr.classList.remove("cursor");
    if (curr.nextElementSibling) {
      curr.nextElementSibling.classList.add("cursor");
      console.log(curr);
      cursor += 1;
    } else {
      console.log("FINISHED!!!");
    }
  }
});
