console.clear();
let text = "Lorem ipsum dolor sit amet consectetur adipisicing elit.";

let cursor = 0;
const WHITESPACEs = ["·", "&nbsp;", "_"];
const WHITESPACE = WHITESPACEs[2];


window.addEventListener('load', () => {
  const ajax = new XMLHttpRequest();
  ajax.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      text = this.response;
      text = text.trim().replace(/\n/g, " ");
      console.log("text: ", text);
      fillTextBox();
    }
  }
  
  ajax.open("GET", "text.txt", true);
  ajax.send();
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
  console.log();
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
