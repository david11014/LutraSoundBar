const Grid = tui.Grid;

// Probability Table define
ProbabilityTableInstance = new Grid({
	el: document.getElementById('ProbabilityTable'), // Container element
	columns: [
		{
			header: 'UR(%)',
			name: 'UR_probability',
			editor: 'text',
			onAfterChange(ev) {
				CalNClassProbability();
			},
		},
		{
			header: 'SR(%)',
			name: 'SR_probability',
			editor: 'text',
			onAfterChange(ev) {
				CalNClassProbability();
			},
		},
		{
			header: 'R(%)',
			name: 'R_probability',
			editor: 'text',
			onAfterChange(ev) {
				CalNClassProbability();
			},
		},
		{
			header: 'N(%)',
			name: 'N_probability'
		}
	],
	data: [
		{
			UR_probability: 0.5,
			SR_probability: 1.5,
			R_probability: 3,
			N_probability: 95
		}
	]
});

Grid.applyTheme('striped'); // Call API of static method

// Audio try play render
class AudioRenderer {
	constructor(props) {
		const contDiv = document.createElement('div');
		const btElm = document.createElement('button');
		btElm.textContent = '▶';
		btElm.classList.add("btn");
		btElm.classList.add("btn-secondary");

		const audioElm = document.createElement('audio');
		audioElm.controls = 'controls';
		audioElm.loop = false;

		contDiv.appendChild(btElm);
		contDiv.appendChild(audioElm);

		this.el = contDiv;
		this.render(props);
	}

	getElement() {
		return this.el;
	}

	render(props) {
		var audioElm = this.el.childNodes[1];
		audioElm.src = String(props.value["url"]);
		audioElm.classList.add("TryAudio");
		this.el.childNodes[1].hidden = true;

		// chick button trigger play sound
		this.el.childNodes[0].addEventListener("click",
			function () {
				if (playState == EPlayState.idle) {
					audioElm.currentTime = 0
					audioElm.play();
				}
			});
	}
}

// Item Table define
ItemTableInstance = new Grid({
	el: document.getElementById('ItemTable'), // Container element
	rowHeaders: ['checkbox'],
	bodyHeight: 'fitToParent',
	columns: [
		{
			header: '名字',
			name: 'ItemName',
			editor: 'text'
		},
		{
			header: '稀有度',
			name: 'ItemClass',
			width: 100,
			align: 'center ',
			editor: {
				type: 'select',
				options: {
					listItems: [
						{ text: 'UR', value: 'UR' },
						{ text: 'SR', value: 'SR' },
						{ text: 'R', value: 'R' },
						{ text: 'N', value: 'N' },
					]
				}
			}
		},
		{
			header: '試聽',
			name: 'Audio',
			width: 60,
			align: 'center ',
			renderer: {
				type: AudioRenderer
			}
		}
	],
	data: []
});
Grid.applyTheme('striped'); // Call API of static method
