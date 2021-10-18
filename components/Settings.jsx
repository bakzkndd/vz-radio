const { React } = require("@vizality/webpack");
const {
  TextInput,
  SliderInput,
  Category,
  SwitchItem,
} = require("@vizality/components/settings");
const fs = require("fs");
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

    radio.name = getSetting("advanced-settings-override", false)
      ? getSetting("radio-name-override", radio.name)
      : radio.name;
    radio.stream = getSetting("advanced-settings-override", false)
      ? getSetting("radio-stream-override", radio.stream)
      : radio.stream;
    radio.homepage = getSetting("advanced-settings-override", false)
      ? getSetting("radio-homepage-override", radio.homepage)
      : radio.homepage;
    radio.description = getSetting("advanced-settings-override", false)
      ? getSetting("radio-category-override", radio.description)
      : radio.description;
    radio.favicon = getSetting("advanced-settings-override", false)
      ? getSetting("radio-image-override", radio.favicon)
      : radio.favicon;

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
              toggleSetting("advanced-settings-override");
              if (getSetting("advanced-settings-override", false)) {
                if (getSetting("vz-radio", false)) {
                  audio.stop();
                  audio.play(
                    getSetting("radio-stream-override", radio.stream),
                    getSetting("volume-slider", 100)
                  );
                }
              } else {
                radiobrowser.getStation(
                  getSetting("vz-radio-station", "Dash Pop X"),
                  getSetting("volume-slider", 100),
                  getSetting("vz-radio", false)
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
