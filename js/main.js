var mute = false;

const EItemClass = {
	N: 0,
	R: 1,
	SR: 2,
	UR: 3
};

// Check the string is numeric or not
function isNumeric(str) {
	if (typeof str == "number") return true // we only process strings! 

	if (typeof str != "string") return false // we only process strings!  
	return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
		!isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

// Calculate probability of N class
function CalNClassProbability() {
	var data = ProbabilityTableInstance.getData()[0];

	if (isNumeric(data.UR_probability) == false ||
		isNumeric(data.SR_probability) == false ||
		isNumeric(data.R_probability) == false) {
		ProbabilityTableInstance.setValue(0, "N_probability", "N/A");
		return;
	}

	var fUR_probability = parseFloat(data.UR_probability);
	var fSR_probability = parseFloat(data.SR_probability);
	var fR_probability = parseFloat(data.R_probability);
	var fN_probability = 100.0 - (fUR_probability + fSR_probability + fR_probability);

	if (fR_probability < 0) {
		ProbabilityTableInstance.setValue(0, "N_probability", "N/A");
		return;
	}

	ProbabilityTableInstance.setValue(0, "N_probability", fN_probability);
	return;
}

$("#AddItem_bt").on("click", function () {
	return chooseFile();
});

$("#AddItem_input").on("click", function () {
	this.value=""
});

$("#AddItem_input").change(function () {
	if (this.files.length <= 0) {
		return
	}

	var url = URL.createObjectURL(this.files[0]);
	var szFileName = this.files[0].name

	AddItem(url, szFileName);
});

function chooseFile() {
	$("#AddItem_input").click();
	return false;
}

function AddItem(url, szFileName) {
	ItemTableInstance.appendRow({
		ItemName: szFileName.replace(/^.*[\\/]/, ''),
		ItemClass: "N",
		Audio: {
			"url": url,
			"name": szFileName
		}
	});

	ItemTableInstance.refreshLayout();
}

$("#RemoveItem_bt").on("click", function () {
	return RemoveChecked();
});

function RemoveChecked() {
	var CurrentData = ItemTableInstance.getData();
	var NewData = [];

	for (var i = 0; i < CurrentData.length; i++) {
		if (CurrentData[i]._attributes.checked == true) {
			continue;
		}

		NewData.push(CurrentData[i]);
	}

	ItemTableInstance.resetData(NewData);
}

const EPlayState = {
	idle: 'idle',
	Playing: 'Playing',
	PlayEnd: 'PlayEnd',
	Reseting: 'Reseting',
};

var playState = EPlayState.idle;

$("#MainSVG").ready(
	function () {
		var SVGHeigh = $("#MainSVG").height();
		SVG("#Drink").dmove(0, -SVGHeigh);
		SVG("#Bouble").attr({ opacity: 0 });
		SVG("#Result").attr({ opacity: 0 });

		SVG('#bouble1').animate({ duration: 1467 }).dmove(0, -40).attr({ opacity: 0.5 }).loop();
		SVG('#bouble2').animate({ duration: 1000 }).dmove(0, -23).attr({ opacity: 0.4 }).loop();
		SVG('#bouble3').animate({ duration: 1800 }).dmove(0, -40).attr({ opacity: 0.5 }).loop();
		SVG('#bouble4').animate({ duration: 1900 }).dmove(0, -20).attr({ opacity: 0.6 }).loop();
		SVG('#bouble5').animate({ duration: 1500 }).dmove(0, -20).attr({ opacity: 0.7 }).loop();
		SVG('#bouble6').animate({ duration: 1900 }).dmove(0, -50).attr({ opacity: 0.2 }).loop();
		SVG('#bouble7').animate({ duration: 2300 }).dmove(0, -70).attr({ opacity: 0.5 }).loop();
		SVG('#bouble8').animate({ duration: 1700 }).dmove(0, -70).attr({ opacity: 0.1 }).loop();
		SVG('#bouble9').animate({ duration: 1200 }).dmove(0, -50).attr({ opacity: 0.7 }).loop();
		SVG('#bouble10').animate({ duration: 1200 }).dmove(0, -50).attr({ opacity: 0.7 }).loop();
		SVG('#bouble11').animate({ duration: 1200 }).dmove(0, -70).attr({ opacity: 0.7 }).loop();
		SVG('#bouble12').animate({ duration: 1200 }).dmove(0, -40).attr({ opacity: 0.7 }).loop();

	});

SVG("#MainSVG").click(
	function () {
		DoDraw();
	}
);

$("#myaudio").on("ended", function () {
	playState = EPlayState.PlayEnd;
});

async function DoDraw() {
	if (playState == EPlayState.idle) {
		playState = EPlayState.Playing;

		var ItemIdx = DrawItem();

		if (ItemIdx < 0) {
			playState = EPlayState.idle
			alert("請設定品項");
			return;
		}

		var szText = ItemTableInstance.getData()[ItemIdx].ItemName;
		var url = ItemTableInstance.getData()[ItemIdx].Audio.url;
		$("#ResultText").text(szText);

		switch (ItemTableInstance.getData()[ItemIdx].ItemClass) {
			case 'UR':
				Stream.setAttribute("fill", "url(#linearGradientRainbow)");
				break;
			case 'SR':
				Stream.setAttribute("fill", "url(#linearGradientResultGold)");
				break;
			default:
				Stream.setAttribute("fill","#fff");
				break;
		}

		await Shake(1000, 2);
		await PopCrop(800);
		await DrinkDown(1500);
		await ShowBGBouble(1000);
		await ShowResult(1000);

		if (mute == true) {
			// sleep play sound
			playState = EPlayState.PlayEnd;
		}
		else {
			// play sound
			PlaySound(url);
		}
	}
	else if (playState == EPlayState.PlayEnd) {
		playState = EPlayState.Reseting;
		await FadeOut(1000);
		await ResetPos();
		playState = EPlayState.idle;
	}
}

// shake bottle
async function Shake(Duration, ShakeCount) {
	var BeginDeg = 10;
	for (var i = 0; i < ShakeCount; i++) {
		SVG('#Rotate_object').animate({ duration: Duration / 2 }).rotate(-BeginDeg, 80, 100)
			.animate({ duration: Duration / 2 }).rotate(BeginDeg, 80, 100);
		BeginDeg /= 2;
	}
	await delay(Duration * ShakeCount);
}

// Pop the crop
async function PopCrop(Duration) {
	SVG('#LutrarmyCork').animate({ duration: Duration }).dmove(0, -45);
	SVG('#Stream').animate({ duration: Duration }).dmove(0, -40);
	await delay(Duration);
}

async function DrinkDown(Duration) {
	var SVGHeigh = $("#MainSVG").height();
	SVG("#Drink").attr({ opacity: 1 });
	SVG("#Drink").animate({ duration: Duration }).dmove(0, SVGHeigh);
	await delay(Duration);
}

async function ShowBGBouble(Duration) {
	SVG("#Bouble").animate({ duration: Duration }).attr({ opacity: 1 });
	SVG('#LutrarmyCork').animate({ duration: Duration }).dmove(0, 45);
	SVG('#Stream').animate({ duration: Duration }).dmove(0, 40);
	await delay(Duration);
}

async function ShowResult(Duration) {
	SVG("#Result").animate({ duration: Duration }).ease("<").attr({ opacity: 1 });
	await delay(Duration);
}

async function FadeOut(Duration) {
	SVG("#Drink").animate({ duration: Duration }).attr({ opacity: 0 });
	SVG("#Bouble").animate({ duration: Duration }).attr({ opacity: 0 });
	SVG("#Result").animate({ duration: Duration }).attr({ opacity: 0 });
	await delay(Duration);
}

async function ResetPos() {
	var SVGHeigh = $("#MainSVG").height();
	SVG("#Drink").dmove(0, -SVGHeigh);
}

// play the specific sound file in res folder
function PlaySound(szFileName) {
	for (var i = 0; i < $(".TryAudio").length; i++) {
		$(".TryAudio")[i].pause();
		$(".TryAudio")[i].currentTime = 0;
	}

	$("#audioSource")[0].src = szFileName;
	$("#myaudio")[0].load(); //call this to just preload the audio without playing
	$("#myaudio")[0].loop = false;
	$("#myaudio")[0].play(); //call this to play the song right away
}

function delay(ms) {
	return new Promise(function (resolve) {
		setTimeout(resolve, ms);
	});
}

// Draw one item
function DrawItem() {
	var ItemTableData = ItemTableInstance.getData();
	var ProbabilityTableData = ProbabilityTableInstance.getData();

	if (ItemTableData.length <= 0) {
		return -1;
	}

	// update class count
	var ClassCountTable = {};
	ClassCountTable["N"] = 0;
	ClassCountTable["R"] = 0;
	ClassCountTable["SR"] = 0;
	ClassCountTable["UR"] = 0;
	for (var i = 0; i < ItemTableData.length; i++) {
		ClassCountTable[ItemTableData[i].ItemClass]++;
	}

	// calculate accumulate Probability table
	var ClassProbabilityTable = {};
	ClassProbabilityTable["N"] = ProbabilityTableData[0].N_probability * 100.0 / ClassCountTable["N"];
	ClassProbabilityTable["R"] = parseFloat(ProbabilityTableData[0].R_probability) * 100.0 / ClassCountTable["R"];
	ClassProbabilityTable["SR"] = parseFloat(ProbabilityTableData[0].SR_probability) * 100.0 / ClassCountTable["SR"];
	ClassProbabilityTable["UR"] = parseFloat(ProbabilityTableData[0].UR_probability) * 100.0 / ClassCountTable["UR"];

	var nMAXVal = 0;
	var ItemProbability = [];
	for (var i = 0; i < ItemTableData.length; i++) {
		nMAXVal += ClassProbabilityTable[ItemTableData[i].ItemClass];
		ItemProbability.push(ClassProbabilityTable[ItemTableData[i].ItemClass]);
	}

	var nRandVal = Math.floor(Math.random() * nMAXVal);
	var nCurrentAcc = 0
	for (var i = 0; i < ItemTableData.length; i++) {
		if (nCurrentAcc <= nRandVal && nRandVal < nCurrentAcc + ItemProbability[i]) {
			return i;
		}
		nCurrentAcc += ItemProbability[i];
	}

	return Math.floor(Math.random() * ItemTableData.length);
}