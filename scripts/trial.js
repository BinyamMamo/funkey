// const EOL = "\n";
const EOL = "<br>";
let lyrics = [];
let TITLE = "";

window.addEventListener("load", () => {
  console.clear();
  console.log(parseFloat("50,000".replace(",", "")));
  let container = document.getElementById("content");

  container.innerHTML = "Loading Data...";

  let ajax = new XMLHttpRequest();

  ajax.onreadystatechange = async function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log("connection stablished!");

      let response = this.responseText;
      response = response.split("\n");

      TITLE = response[0];

      for (let i = 1; i < response.length; i++) {
        let id = response[i];
        i++;

        let stamp = response[i];
        stamp = stamp.split("-->")[0];
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
        container.innerHTML = lyrics[0].verse;

      setInterval(timer, 1000);
    }
  };

  ajax.open("GET", "trial.txt", true);
  ajax.send();
});

/**
 * timer() - TIMER
 */
let time = 0;
let cursor = 1;
function timer() {
  const time_cont = document.getElementById("timer");
  const container = document.getElementById("content");

  sec = time / 1000;
  min = Math.floor(sec / 60);
  let output = "";

  sec = sec % 60;

  if (min < 10) output += `0${min}`;
  else output += `${min}`;

  output += ":";

  if (sec < 10) output += `0${sec}`;
  else output += `${sec}`;

  let stamp = lyrics[cursor].stamp;

  stamp = stamp.split(":");

  let lyrics_time = parseInt(stamp[0] * 3600);
  lyrics_time += parseInt(stamp[1] * 60);
  lyrics_time *= 1000;
  lyrics_time += parseInt(stamp[2].replace(",", ""));

  if (time > lyrics_time) {
	cursor++;
	if (cursor >= lyrics.length) {
		console.log("Finished!");
		container.innerHTML = ".";
	} else
		container.innerHTML = lyrics[cursor].verse;
  }

  console.log("time:", time);
  console.log("lyrics_stamp:", stamp);
  console.log("lyrics_time:", lyrics_time);
  time_cont.innerHTML = output;
  time += 1000;
}
