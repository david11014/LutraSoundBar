const Grid = tui.Grid;

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

class AudioRenderer {
	constructor(props) {
		const cont = document.createElement('div');
		const bt = document.createElement('button');
		bt.textContent = '▶';
		bt.classList.add("btn");
		bt.classList.add("btn-secondary");

		const el = document.createElement('audio');
		el.controls = 'controls';
		el.loop = false;

		cont.appendChild(bt);
		cont.appendChild(el);

		this.el = cont;
		this.render(props);
	}

	getElement() {
		return this.el;
	}

	render(props) {
		var audio = this.el.childNodes[1];
		audio.src = String(props.value["url"]);
		audio.classList.add("TryAudio");
		this.el.childNodes[1].hidden = true;

		this.el.childNodes[0].addEventListener("click",
			function () {
				if (playState == EPlayState.idle) {
					audio.currentTime = 0
					audio.play();
				}
			});
	}
}

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
			width: 100,
			renderer: {
				type: AudioRenderer
			}
		}
	],
	data: []
});
Grid.applyTheme('striped'); // Call API of static method
