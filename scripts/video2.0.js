console.clear();
// let DEFAULT_TEXT = "Lorem ipsum dolor sit amet consectetur adipisicing elit";
let DEFAULT_TEXT = "...";
// let DEFAULT_TEXT = "♪";
let textboxContent = DEFAULT_TEXT;
const SPEED = 0.5;

const vid = document.getElementById("video");
const WHITESPACEs = ["·", "&nbsp;", "_"];
const WHITESPACE = WHITESPACEs[0];
const textbox = document.getElementById("textbox");

// const EOL = "<br>";
const EOL = "\n";
let lyrics = [];
let TITLE = "";

// TODO -- THINK ABOUT ADDING A FLAG TO CHECK IF LYRICS IS LOADED BEFORE PLAYING THE MUSIC

window.addEventListener("load", () => {
  console.clear();

  fillTextBox("Loading Data...");

  let ajax = new XMLHttpRequest();

  ajax.onreadystatechange = async function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log("connection stablished!");

      let response = this.responseText;
      response = response.split("\n");

      TITLE = response[0].split("(")[0];

      for (let i = 1; i < response.length; i++) {
        let id = response[i];
        i++;

        let stamp = response[i];
        stamp = stamp.split(" --> ")[0];
        i++;

        let verse = "";
        while (response[i] != "") {
          verse += response[i];
          verse += EOL;
          i++;
        }

        lyrics.push({
          id,
          stamp,
          verse,
        });
      }

      console.log(lyrics);
      // let line = lyrics[0].verse; // TODO = TITLE
      let line = TITLE; // TODO = TITLE
      fillTextBox(line);
    }
  };

  ajax.open("GET", "trial.txt", true);
  ajax.send();
});

function start() {
  document.getElementById("start").style.display = "none";
  document.getElementById("overlay").style.display = "none";

  // begin music
  begin_music();
}

function begin_music() {
  vid.playbackRate = SPEED;
  vid.play();
  setInterval(timer, 1000);
}

function fillTextBox(text) {
  cursor = 0;
  text = parse(text);
  text = easy(text);
  textboxContent = text;
  textboxContent = textboxContent.replace(/\n/g, "<br>");
  textbox.innerHTML = "";

  console.log("text: ", text);
  console.log("textboxContent: ", textboxContent);
  for (let i = 0; i < text.length; i++) {
    let b = document.createElement("char");
    if (i == cursor) b.classList = ["char cursor"];
    else b.classList = ["char"];

    if (text[i] != "\n") {
      b.innerHTML = text[i] == " " ? WHITESPACE : text[i];
      textbox.appendChild(b);
    } else textbox.appendChild(document.createElement("br"));
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

function parse(line) {
  // line = line.replace(/\n/g, "newlinenewlinenewline");
  line = line.replace(/\n/g, " ");
  line = line.replace(/^ /, "");
  line = line.replace(/ $/, "");

  return line;
}

function easy(line) {
  line = line.toLowerCase();
  line = line.replace(/[^(a-z| |\n)]/g, ""); // couldn't inlcude braces ()
  line = line.replace(/ +/g, " ");

  return line;
}

let time = 0;
let curr = 0;
function timer() {
  const time_cont = document.getElementById("timer");

  sec = time / 1000;
  min = Math.floor(sec / 60);
  let output = "";

  sec = sec % 60;

  if (min < 10) output += `0${min}`;
  else output += `${min}`;

  output += ":";

  if (sec < 10) output += `0${sec}`;
  else output += `${sec}`;

  let stamp = lyrics[curr + 1].stamp;
  stamp = stamp.split(":");

  let lyrics_time = parseInt(stamp[0] * 3600);
  lyrics_time += parseInt(stamp[1] * 60);
  lyrics_time *= 1000;
  lyrics_time += parseInt(stamp[2].replace(",", ""));

  if (time + (1500 * SPEED) > lyrics_time) {
    curr++;
    if (curr >= lyrics.length) {
      console.log("Finished!");
      container.innerHTML = ".";
    } else {
      let line = lyrics[curr].verse;
      fillTextBox(line);
      console.log(line);
    }
  }

  time_cont.innerHTML = output;
  time += (1000 * SPEED);
}
