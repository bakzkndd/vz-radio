const { React } = require("@vizality/webpack");
const { TextInput } = require("@vizality/components/settings");
const radiobrowser = require("../functions/radio-browser.js");

module.exports = class vzradiosettings extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { getSetting, toggleSetting, updateSetting } = this.props;

    radiobrowser
      .getStationName(getSetting("vz-radio-station", "Dash Pop X"))
      .then((station) => {
        return (
          <>
            <TextInput
              note="Here you can enter any known radio station."
              defaultValue={getSetting("vz-radio-station", "Dash Pop X")}
              required={false}
              onChange={(val) => updateSetting("vz-radio-station", val)}
            >
              Enter a radio station of your choice here
            </TextInput>
            Currently using <b>{station}</b> as your radio station!
          </>
        );
      });
  }
};
