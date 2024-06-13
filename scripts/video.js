console.clear();
// let DEFAULT_TEXT = "Lorem ipsum dolor sit amet consectetur adipisicing elit";
let DEFAULT_TEXT = "...";
// let DEFAULT_TEXT = "♪";
let textboxContent = DEFAULT_TEXT;
const SPEED = 1;

let cursor = 0;
const vid = document.getElementById("video");
const WHITESPACEs = ["·", "&nbsp;", "_"];
const WHITESPACE = WHITESPACEs[0];
const textbox = document.getElementById("textbox");

function start() {
  document.getElementById("start").style.display = "none";
  document.getElementById("overlay").style.display = "none";

  // begin music
  begin_music();
}

function begin_music() {
  const ajax = new XMLHttpRequest();
  ajax.onreadystatechange = async function () {
    if (this.readyState == 4 && this.status == 200) {
      const lyrics = this.responseXML.getElementsByTagName("VERSE");
      let duration = 0;
      vid.play();
      vid.playbackRate = SPEED;

      for (let i = 0; i < lyrics.length; i++) {
        let verse = lyrics[i];
        let line =
        verse.getElementsByTagName("LINE")[0].childNodes[0].nodeValue;
        line = line.replace(/\n/g, "");
        line = line.replace(/^ /, "");
        line = line.replace(/ $/, "");
        line = easy(line);

        let length = verse.getElementsByTagName("LENGTH")[0].childNodes[0].nodeValue;
        duration += parseInt(length);
        duration /= SPEED;
        setTimeout(fillTextBox, duration, line);
      }
    }
  };
  
  ajax.open("GET", "lyrics.xml", true);
  ajax.send();
}

window.addEventListener("load", () => {
  fillTextBox(DEFAULT_TEXT);
});

function fillTextBox(text) {
  cursor = 0;
  textboxContent = text;
  textbox.innerHTML = "";
  for (let i = 0; i < text.length; i++) {
    let b = document.createElement("char");
    if (i == cursor) b.classList = ["char cursor"];
    else b.classList = ["char"];
    b.innerHTML = text[i] == " " ? WHITESPACE : text[i];
    textbox.appendChild(b);
  }
  // let curr = document.getElementsByClassName("cursor")[0];
  // curr.classList.remove("cursor");
  if (textbox.childNodes.length > 0)
    textbox.childNodes[0].classList.add("cursor");
  // console.log(textbox.childNodes[0])
}

document.addEventListener("keypress", (ev) => {
  // console.log(ev.key, cursor, textboxContent, ev.key == textboxContent[cursor]);
  // console.log("textboxContent: ", textboxContent.charAt(0), " dsfsdfsd");
  if (cursor >= textboxContent.length) {
    console.log("FINISHED!!!");
  } else if (ev.key == textboxContent[cursor]) {
    let curr = document.getElementsByClassName("cursor")[0];
    curr.classList.remove("cursor");
    if (curr.nextElementSibling) {
      curr.nextElementSibling.classList.add("cursor");
      // console.log(curr);
      cursor += 1;
    } else {
      console.log("FINISHED!!!");
    }
  }
});

function easy(line) {
  line = line.replace(/[^(A-Z| )]/gi, "");
  line = line.toLowerCase();

  return line;
}