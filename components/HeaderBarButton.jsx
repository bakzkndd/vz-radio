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
              <svg class="icon-22AiRD" width="24px" height="24px">
                <path
                  fill="currentColor"
                  points="80.947 155.28h350.126c24.555 0 44.401 19.876 44.401 44.431v201.697c0 24.043-19.845 44.442-44.401 44.442h-350.126c-24.546 0-44.431-20.398-44.431-44.442v-201.708c0-24.546 19.886-44.421 44.431-44.421v0zM79.391 208.599c-6.277 0-11.489 5.212-11.489 12.022v0c0 6.267 5.212 11.489 11.489 11.489h172.974c6.789 0 12.022-5.222 12.022-11.489v0c0-6.81-5.233-12.022-12.022-12.022h-172.974zM79.391 248.832c-6.277 0-11.489 5.222-11.489 11.49v0c0 6.8 5.212 12.042 11.489 12.042h172.974c6.789 0 12.022-5.243 12.022-12.042v0c0-6.267-5.233-11.489-12.022-11.489h-172.974zM79.391 288.563c-6.277 0-11.489 5.223-11.489 12.002v0c0 6.277 5.212 11.5 11.489 11.5h172.974c6.789 0 12.022-5.223 12.022-11.5v0c0-6.779-5.233-12.002-12.022-12.002h-172.974zM79.391 328.796c-6.277 0-11.489 5.223-11.489 11.479v0c0 6.779 5.212 12.002 11.489 12.002h172.974c6.789 0 12.022-5.223 12.022-12.002v0c0-6.257-5.233-11.479-12.022-11.479h-172.974zM79.391 368.517c-6.277 0-11.489 5.202-11.489 12.002v0c0 6.277 5.212 11.5 11.489 11.5h172.974c6.789 0 12.022-5.223 12.022-11.5v0c0-6.8-5.233-12.002-12.022-12.002h-172.974zM371.507 220.089c-44.411 0-80.466 36.065-80.466 80.476 0 44.421 36.055 80.476 80.466 80.476 44.401 0 80.476-36.055 80.476-80.476 0.010-44.411-36.075-80.476-80.476-80.476v0zM371.507 235.776c-35.553 0-64.788 28.723-64.788 64.788 0 35.543 29.235 64.798 64.788 64.798 35.533 0 64.809-29.255 64.809-64.798 0-36.065-29.276-64.788-64.809-64.788z"
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
