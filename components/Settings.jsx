const { React } = require("@vizality/webpack");
const { TextInput } = require("@vizality/components/settings");
const radiobrowser = require("../functions/radio-browser.js");

module.exports = class vzradiosettings extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const radio = require("../functions/radio.json");
    const { getSetting, toggleSetting, updateSetting } = this.props;

    return (
      <>
        <TextInput
          note="Here you can enter any known radio station."
          defaultValue={getSetting("vz-radio-station", "Dash Pop X")}
          required={false}
          onChange={(val) => {
            updateSetting("vz-radio-station", val);
            radiobrowser.getStationName(val);
          }}
        >
          Enter a radio station of your choice here
        </TextInput>
        Currently using <b>{radio.name}</b> as your radio station!
      </>
    );
  }
};
