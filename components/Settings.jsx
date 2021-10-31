const { React } = require("@vizality/webpack");
const {
  TextInput,
  SliderInput,
  Category,
  SwitchItem,
  SelectInput,
} = require("@vizality/components/settings");
const fs = require("fs");
const radiobrowser = require("../functions/radio-browser.js");
const audio = require("../functions/audio");
let cooldown = false;

module.exports = class vzradiosettings extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const radio = require("../functions/radio.json");
    const radioJSON = require("../functions/radio.json");
    const { getSetting, toggleSetting, updateSetting } = this.props;

    radio.name = getSetting("advanced-settings-override", false)
      ? getSetting("radio-name-override", radioJSON.name)
      : radioJSON.name;
    radio.stream = getSetting("advanced-settings-override", false)
      ? getSetting("radio-stream-override", radioJSON.stream)
      : radioJSON.stream;
    radio.homepage = getSetting("advanced-settings-override", false)
      ? getSetting("radio-homepage-override", radioJSON.homepage)
      : radioJSON.homepage;
    radio.description = getSetting("advanced-settings-override", false)
      ? getSetting("radio-category-override", radioJSON.description)
      : radioJSON.description;
    radio.favicon = getSetting("advanced-settings-override", false)
      ? getSetting("radio-image-override", radioJSON.favicon)
      : radioJSON.favicon;
    radio.results = radioJSON.results || [{ value: 0, label: "Dash Pop X" }]
    radio.station = radioJSON.station || 0

    console.log(getSetting("advanced-settings-override", false))

    return (
      <>
        <TextInput
          note="Here you can enter any known radio station."
          defaultValue={getSetting("vz-radio-station", "Dash Pop X")}
          required={false}
          disabled={getSetting("advanced-settings-override", false)}
          onChange={(val) => {
            updateSetting("vz-radio-station", val);
            if (!cooldown) {
              radiobrowser.getStation(
                val,
                getSetting("volume-slider", 100),
                getSetting("vz-radio", false),
                0
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
        <SelectInput
        note={'Here you can choose a station from search results.'}
        value={radio.station}
        disabled={getSetting("advanced-settings-override", false)}
        options={radio.results}
        onChange={res => {
          updateSetting("vz-radio-choice", res.label);
            if (!cooldown) {
              radiobrowser.getStation(
                getSetting("vz-radio-station"),
                getSetting("volume-slider", 100),
                getSetting("vz-radio", false),
                res.value
              );
              cooldown = true;
              setTimeout(function () {
                cooldown = false;
              }, 500);
            }
        }}
      >
        Choose your station here
      </SelectInput>
        <text>
          Currently using <b>{radio.name}</b> as your radio station!
        </text>
        <br />
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
        <Category
          name={"Advanced Settings"}
          description={"Advanced Settings (Switch tabs to update the player)"}
        >
          <SwitchItem
            note="Here you can enable/disable the advanced settings override."
            value={getSetting("advanced-settings-override", false)}
            onChange={() => {
              if (!getSetting("advanced-settings-override", false)) {
                updateSetting("advanced-settings-override", true)
                if (getSetting("vz-radio", false)) {
                  audio.stop();
                  audio.play(
                    getSetting("radio-stream-override", radio.stream),
                    getSetting("volume-slider", 100)
                  );
                }
              } else {
                updateSetting("advanced-settings-override", false)
                radiobrowser.getStation(
                  getSetting("vz-radio-station", "Dash Pop X"),
                  getSetting("volume-slider", 100),
                  getSetting("vz-radio", false),
                  radio.station
                );
              }
            }}
          >
            Advanced Settings Override
          </SwitchItem>
          <TextInput
            note="Here you can change the stream link. (If you don't hear sound, the stream is invalid"
            defaultValue={getSetting("radio-stream-override", radio.stream)}
            required={false}
            disabled={!getSetting("advanced-settings-override", false)}
            onChange={(val) => {
              updateSetting("radio-stream-override", val);

              if (getSetting("vz-radio", false)) {
                audio.stop();
                audio.play(val, getSetting("volume-slider", 100));
              }
            }}
          >
            Stream Link Override
          </TextInput>
          <TextInput
            note="Here you can change the radio name."
            defaultValue={getSetting("radio-name-override", radio.name)}
            required={false}
            disabled={!getSetting("advanced-settings-override", false)}
            onChange={(val) => {
              updateSetting("radio-name-override", val);
            }}
          >
            Radio Name Override
          </TextInput>
          <TextInput
            note="Here you can change the radio image. (Make sure it's a valid image link)"
            defaultValue={getSetting("radio-image-override", radio.favicon)}
            required={false}
            disabled={!getSetting("advanced-settings-override", false)}
            onChange={(val) => {
              updateSetting("radio-image-override", val);
            }}
          >
            Radio Image Override
          </TextInput>
          <TextInput
            note="Here you can change the radio category."
            defaultValue={getSetting(
              "radio-category-override",
              radio.description
            )}
            required={false}
            disabled={!getSetting("advanced-settings-override", false)}
            onChange={(val) => {
              updateSetting("radio-category-override", val);
            }}
          >
            Radio Category Override
          </TextInput>
          <TextInput
            note="Here you can change the radio homepage. (Make sure it's a valid link)"
            defaultValue={getSetting("radio-homepage-override", radio.homepage)}
            required={false}
            disabled={!getSetting("advanced-settings-override", false)}
            onChange={(val) => {
              updateSetting("radio-homepage-override", val);
            }}
          >
            Radio Homepage Override
          </TextInput>
        </Category>
      </>
    );
  }
};
