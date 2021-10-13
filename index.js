import { Plugin } from "@vizality/entities";
import { getModuleByDisplayName } from "@vizality/webpack";
import { patch, unpatch } from "@vizality/patcher";
import React from "react";

const HeaderBarButton = require("./components/HeaderBarButton");
const audio = require("./functions/audio");
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
        res.props.toolbar.props.children.push(
          <HeaderBarButton
            settings={this.settings}
            bartype={HeaderBarContainer.Icon}
          />
        );
        return res;
      }
    );
    if (this.settings.get("vz-radio", false)) {
      audio.play(radio.stream, this.settings.get('volume-slider', 100));
    }
  }

  stop() {
    audio.stop();
    unpatch("radio-header-bar");
  }
}
