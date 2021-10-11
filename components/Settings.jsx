const { React } = require('@vizality/webpack');
const { TextInput } = require('@vizality/components/settings');
const { getStationName } = require('../functions/radio-browser')

module.exports = class vzradiosettings extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = { category0Opened: false, category1Opened: false };
	}
	async render() {
		const { getSetting, toggleSetting, updateSetting } = this.props;
		const station = await getStationName(getSetting('vz-radio-station', 'Dash Pop X'))
		return (
			<>
				<TextInput
					note='Here you can enter any known radio station.'
					defaultValue={getSetting('vz-radio-station', 'Dash Pop X')}
					required={false}
					onChange={val => updateSetting('vz-radio-station', val)}
					>
					Enter a radio station of your choice here
				</TextInput>

				Currently using <b>{station}</b> as your radio station!
			</>
		);
	}
};