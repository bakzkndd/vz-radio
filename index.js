import { Plugin } from "@vizality/entities";
import { getModuleByDisplayName } from "@vizality/webpack";
import { patch, unpatch } from "@vizality/patcher";

const HeaderBarButton = require("./components/HeaderBarButton");
const radio = require("./functions/radio.json");

export default class vzradio extends Plugin {
  async start() {
    const HeaderBarContainer = await getModuleByDisplayName(
      "HeaderBarContainer"
    );
    patch(
      "radio-header-bar",
      HeaderBarContainer.prototype,
      "render",
      (args, res) => {
        res.props.toolbar.props.children.unshift(
          <HeaderBarButton
            settings={this.settings}
            bartype={HeaderBarContainer.Icon}
          />
        );
        return res;
      }
    );
    const url = radio.stream;
    const audio = new Audio(url);
    audio.play;
  }

  stop() {}
}
