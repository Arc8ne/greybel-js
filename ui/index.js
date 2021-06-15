const build = require('../src/build-light');
const VM = require('./emulator/vm');

hljs.initHighlightingOnLoad();

class Editor extends React.PureComponent {
	state = {
		text: '',
		scrollTop: 0,
		scrollLeft: 0,
	};

	highlight = () => {
		const me = this;

		if (me.codeElement) {
			hljs.highlightBlock(me.codeElement);
		}
	};

	onChangeText = ({target}) => {
		const me = this;

		me.setState({
			text: target.value
		}, me.highlight);
	};

	onScroll = ({target}) => {
		const me = this;

		me.setState({
			scrollTop: target.scrollTop,
			scrollLeft: target.scrollLeft,
		});
	};

	onKeyDown = (evt) => {
		const me = this;

		if (evt.keyCode == 9) {
			evt.preventDefault();
			const target = me.codeInputElement;
			const value = target.value;
			const start = target.selectionStart;
			const end = target.selectionEnd;
			const newValue = `${value.substring(0, start)}\t${value.substring(end)}`;

			target.value = newValue;

			me.setState({
				text: newValue
			}, () => target.selectionStart = target.selectionEnd = start + 1);
		}
	};

	onTranspile = () => {
		const me = this;
		const target = me.codeInputElement;
		const uglifyEl = me.toggleUglifyElement;
		const transpiledEl = me.transpiledElement;
		const output = build({
			uglify: uglifyEl.checked,
			content: target.value
		});

		transpiledEl.value = output;
	};

	onExecute = () => {
		const me = this;

	};

	startConsole = () => {
		const me = this;
		const stdoutEl = me.consoleStdoutElement;
		const stdinEl = me.consoleStdinElement;

		if (stdoutEl && stdinEl) {
			const vm = new VM();

			vm.start(stdoutEl, stdinEl);
			me.vm = vm;
		}
	};

	setToggleUglify = (element) => {
		const me = this;
		me.toggleUglifyElement = element;
	};

	setCodeInputElement = (element) => {
		const me = this;
		me.codeInputElement = element;
	};

	setCodeElement = (element) => {
		const me = this;
		me.codeElement = element;
	};

	setTranspiledElement = (element) => {
		const me = this;
		me.transpiledElement = element;
	};

	setConsoleStdoutElement = (element) => {
		const me = this;
		me.consoleStdoutElement = element;
		me.startConsole();
	};

	setConsoleStdinElement = (element) => {
		const me = this;
		me.consoleStdinElement = element;
		me.startConsole();
	};

	renderIDE = () => {
		const me = this;

		return (
			React.createElement(
				'div', 
				{
					className: 'editor-ide'
				},
				React.createElement(
					'textarea',
					{
						className: 'editor-input-area',
						spellCheck: false,
						autoComplete: 'off',
						autoCorrect: 'off',
						autoCapitalize: 'none',
						value: me.state.text,
						onChange: me.onChangeText,
						onScroll: me.onScroll,
						onKeyDown: me.onKeyDown,
						ref: me.setCodeInputElement
					}
				),
				React.createElement(
					'div',
					{
						className: 'editor-output-area'
					},
					React.createElement(
						'pre',
						{
							className: 'editor-output-area-wrapper',
							style: {
								top: -me.state.scrollTop,
								left: -me.state.scrollLeft
							}
						},
						React.createElement(
							'code', 
							{
								className: 'editor-output-area-body lua',
								ref: me.setCodeElement
							},
							me.state.text
						)
					)
				)
			)
		);
	};

	renderActions = () => {
		const me = this;

		return (
			React.createElement(
				'div', 
				{
					className: 'editor-side-panel'
				},
				React.createElement(
					'div',
					{},
					React.createElement(
						'div', 
						{
							className: 'editor-actions'
						},
						React.createElement(
							'div',
							{
								className: 'editor-transpile'
							},
							React.createElement(
								'a', 
								{
									onClick: me.onTranspile
								},
								'Transpile'
							),
							React.createElement(
								'div',
								{
									className: 'editor-options'
								},
								React.createElement(
									'input', 
									{
										type: 'checkbox',
										ref: me.setToggleUglify
									}
								),
								React.createElement(
									'label',
									{},
									'Uglify'
								),
							),
							React.createElement(
								'label',
								{},
								'Transpiler output:'
							),
							React.createElement(
								'textarea', 
								{
									className: 'editor-transpiled-area',
									readOnly: true,
									autofocus: false,
									ref: me.setTranspiledElement
								}
							)
						),
						React.createElement(
							'div',
							{
								className: 'editor-execute'
							},
							React.createElement(
								'a', 
								{
									onClick: me.onExecute
								},
								'Execute'
							),
							React.createElement(
								'label',
								{},
								'Execution output:'
							),
							React.createElement(
								'textarea',
								{
									className: 'editor-console-stdout',
									readOnly: true,
									autofocus: false,
									ref: me.setConsoleStdoutElement
								}
							),
							React.createElement(
								'input', 
								{
									className: 'editor-console-stdin',
									disabled: true,
									autofocus: false,
									ref: me.setConsoleStdinElement
								}
							)
						)
					)
				)
			)
		);
	};

	render() {
		const me = this;

		return (
			React.createElement(
				'div', 
				{
					className: 'editor-control'
				}, 
				me.renderIDE(),
				me.renderActions()
			)
        );
    }
}

console.log('test');

ReactDOM.render(
    React.createElement(Editor),
    document.getElementById('container')
);