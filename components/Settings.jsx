const { React } = require("@vizality/webpack");
const { TextInput, SliderInput } = require("@vizality/components/settings");
const radiobrowser = require("../functions/radio-browser.js");
const audio = require("../functions/audio");
const radio = require("../functions/radio.json");
let cooldown = false;

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
            if (!cooldown) {
              radiobrowser.getStation(
                val,
                getSetting("volume-slider", 100),
                getSetting("vz-radio", false)
              );
              cooldown = true;
              setTimeout(function () {
                cooldown = false;
              }, 500);
            }
          }}
        >
          Enter a radio station of your choice here
        </TextInput>
        Currently using <b>{radio.name}</b> as your radio station!
        <SliderInput
          disabled={false}
          note={"Volume slider."}
          initialValue={100}
          defaultValue={getSetting("volume-slider", 100)}
          onValueChange={(v) => {
            updateSetting("volume-slider", v);
            if (getSetting("vz-radio", false)) {
              audio.stop();
              audio.play(radio.stream, v);
            }
          }}
        >
          Change the volume here
        </SliderInput>
      </>
    );
  }
};
