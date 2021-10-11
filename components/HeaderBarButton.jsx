import { React } from "@vizality/webpack";
import { Tooltip } from "@vizality/components";
const audio = require("../functions/audio");
const radio = require("../functions/radio.json");

module.exports = class HeaderBarButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.get = this.props.settings.get;
    this.set = this.props.settings.set;
    this.enabled = this.get("vz-radio", false);
  }

  render() {
    return (
      <>
        <Tooltip
          text={`${this.enabled ? "Disable" : "Enable"} vz-radio`}
          position="bottom"
        >
          <this.props.bartype
            icon={() => (
              <svg class="icon-22AiRD" viewBox="0 0 450 400">
                <path
                  fill="currentColor"
                  transform="translate(0,-40)"
                  d="M 80.947 155.28 h 350.126 c 24.555 0 44.401 19.876 44.401 44.431 v 201.697 c 0 24.043 -19.845 44.442 -44.401 44.442 h -350.126 c -24.546 0 -44.431 -20.398 -44.431 -44.442 v -201.708 c 0 -24.546 19.886 -44.421 44.431 -44.421 v 0 Z M 79.391 208.599 c -6.277 0 -11.489 5.212 -11.489 12.022 v 0 c 0 6.267 5.212 11.489 11.489 11.489 h 172.974 c 6.789 0 12.022 -5.222 12.022 -11.489 v 0 c 0 -6.81 -5.233 -12.022 -12.022 -12.022 h -172.974 Z M 79.391 248.832 c -6.277 0 -11.489 5.222 -11.489 11.49 v 0 c 0 6.8 5.212 12.042 11.489 12.042 h 172.974 c 6.789 0 12.022 -5.243 12.022 -12.042 v 0 c 0 -6.267 -5.233 -11.489 -12.022 -11.489 h -172.974 Z M 79.391 288.563 c -6.277 0 -11.489 5.223 -11.489 12.002 v 0 c 0 6.277 5.212 11.5 11.489 11.5 h 172.974 c 6.789 0 12.022 -5.223 12.022 -11.5 v 0 c 0 -6.779 -5.233 -12.002 -12.022 -12.002 h -172.974 Z M 79.391 328.796 c -6.277 0 -11.489 5.223 -11.489 11.479 v 0 c 0 6.779 5.212 12.002 11.489 12.002 h 172.974 c 6.789 0 12.022 -5.223 12.022 -12.002 v 0 c 0 -6.257 -5.233 -11.479 -12.022 -11.479 h -172.974 Z M 79.391 368.517 c -6.277 0 -11.489 5.202 -11.489 12.002 v 0 c 0 6.277 5.212 11.5 11.489 11.5 h 172.974 c 6.789 0 12.022 -5.223 12.022 -11.5 v 0 c 0 -6.8 -5.233 -12.002 -12.022 -12.002 h -172.974 Z M 371.507 220.089 c -44.411 0 -80.466 36.065 -80.466 80.476 c 0 44.421 36.055 80.476 80.466 80.476 c 44.401 0 80.476 -36.055 80.476 -80.476 c 0.01 -44.411 -36.075 -80.476 -80.476 -80.476 v 0 Z M 371.507 235.776 c -35.553 0 -64.788 28.723 -64.788 64.788 c 0 35.543 29.235 64.798 64.788 64.798 c 35.533 0 64.809 -29.255 64.809 -64.798 c 0 -36.065 -29.276 -64.788 -64.809 -64.788 Z"
                />
                <path
                  fill="currentColor"
                  transform="translate(0,-40)"
                  d="M440.94 177.034l-286.69-92.511 5.928-18.37 286.69 92.511-5.928 18.37z"
                />
              </svg>
            )}
            className={`radio-toggle-button ${
              this.enabled ? "active" : "inactive"
            }`}
            onClick={() => {
              this.enabled = !this.enabled;
              this.enabled ? audio.play(radio.stream) : audio.stop();
              this.set("vz-radio", this.enabled);
              this.forceUpdate();
            }}
          />
        </Tooltip>
      </>
    );
  }
};
