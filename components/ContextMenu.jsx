import { shell } from "electron";
import { getModule, contextMenu, messages, channels } from "@vizality/webpack";
import { ContextMenu } from "@vizality/components";
import { React } from "@vizality/webpack";

const audio = require("../functions/audio");
const radio = require("../functions/radio.json");
const Slider = getModule((m) =>
  m?.render?.toString()?.includes("sliderContainer")
);

module.exports = class HeaderBarButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.get = this.props.get;
    this.set = this.props.set;
    radio.name = this.get("advanced-settings-override", false)
      ? this.get("radio-name-override", radio.name)
      : radio.name;
    radio.stream = this.get("advanced-settings-override", false)
      ? this.get("radio-stream-override", radio.stream)
      : radio.stream;
    radio.homepage = this.get("advanced-settings-override", false)
      ? this.get("radio-homepage-override", radio.homepage)
      : radio.homepage;
  }
  render() {
    return (
      <ContextMenu.Menu onClose={contextMenu.closeContextMenu}>
        <ContextMenu.Item
          id="title"
          label={
            this.get("vz-radio", false)
              ? "Currently listening to: " + radio.name
              : "Not listening right now"
          }
          disabled={true}
        />
        <ContextMenu.ControlItem
          id="volume"
          label="Volume"
          disabled={!this.get("vz-radio", false)}
          control={(props, ref) => (
            <Slider
              mini
              ref={ref}
              value={this.get("volume-slider", 100)}
              onChange={(v) => {
                this.set("volume-slider", v);
                if (this.get("vz-radio", false)) {
                  audio.stop();
                  audio.play(radio.stream, v);
                }
              }}
              {...props}
            />
          )}
        />
        <ContextMenu.Item
          id="homepage"
          label="Open homepage"
          disabled={!this.get("vz-radio", false)}
          action={() => {
            shell.openExternal(radio.homepage);
          }}
        />
        <ContextMenu.Item
          id="send-homepage"
          label="Send homepage to channel"
          disabled={!this.get("vz-radio", false)}
          action={() => {
            try {
              messages.sendMessage(channels.getChannelId(), {
                content: radio.homepage,
              });
            } catch (err) {
              _error(err);
            }
          }}
        />
        <ContextMenu.Item
          id="vz-radio-plugin-settings"
          label="VZ-Radio plugin settings"
          action={() =>
            vizality.api.routes.navigateTo("/vizality/plugin/vz-radio/settings")
          }
        />
      </ContextMenu.Menu>
    );
  }
};
