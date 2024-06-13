console.clear();
console.log("console cleared");

document.getElementById("clickme").onclick = () => {
  console.log("I am clicked");
  const ajax = new XMLHttpRequest();

  ajax.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.response);
      document.getElementById("clickme").innerHTML = this.response;
    }
  }
  ajax.open("GET", "text.xml", true);
  ajax.send();
};
