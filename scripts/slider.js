let slider = document.getElementById("level-slider");

let initialPos = parseInt(slider.value);
let LEVEL = ["Easy", "Medium", "Hard", "Custom"];

slider.onchange = () => {
	console.log("initialPos: ", initialPos);
	let pos = parseInt(slider.value);
	let diff = Math.abs(pos - initialPos);
	
	if (diff < 13) {
		return;
	}
	
	console.log("pos before: ", pos);

	pos_25 = pos / 25;
	pos = Math.floor(pos_25) * 25;
	pos_25 = pos_25 - Math.floor(pos_25);

	if (pos_25 > 0.5)
		pos += 25;

	console.log("pos after: ", pos);

	console.log("------------");
	slider.value = pos;
	document.getElementById("slider-label").style.left = `${pos}%`; 
	document.getElementById("slider-label").innerHTML = LEVEL[Math.floor(pos / 25)]; 
	initialPos = parseInt(slider.value);
}
