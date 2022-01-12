import { Plugin } from "@vizality/entities";
import {
  getModule,
  contextMenu,
  getModuleByDisplayName,
} from "@vizality/webpack";
import { patch, unpatch } from "@vizality/patcher";
import React, { useRef } from "react";
import { joinClassNames } from "@vizality/util/dom";
import { AsyncComponent } from "@vizality/components";
import { sleep } from "@vizality/util/time";
import { getOwnerInstance, findInTree } from "@vizality/util/react";
import { waitForElement } from "@vizality/util/dom";
import { shell } from "electron";
import ContextMenu from "./components/ContextMenu";

const PanelSubtext = AsyncComponent.fromDisplayName("PanelSubtext");
const Tooltip = AsyncComponent.fromDisplayName("Tooltip");

const HeaderBarButton = require("./components/HeaderBarButton");
const audio = require("./functions/audio");
const RADIO_DEFAULT_IMAGE = "https://i.imgur.com/nWLt7eE.jpg";

export default class vzradio extends Plugin {
  async start() {
    this.injectStyles("./style.scss");
    audio.setup(this.settings.get, this.settings.set);
    const HeaderBarContainer = await getModuleByDisplayName(
      "HeaderBarContainer"
    );
    const HeaderBar = await getModuleByDisplayName("HeaderBar");

    patch(
      "radio-header-bar",
      HeaderBarContainer.prototype,
      "render",
      (args, res) => {
        res.props.toolbar.props.children.push(
          <HeaderBarButton settings={this.settings} bartype={HeaderBar.Icon} />
        );
        return res;
      }
    );
    this.settings.set("vz-radio", false);
    this._injectPlayer();
  }

  stop() {
    audio.stop();
    unpatch("radio-header-bar");
    unpatch("vz-radio-player");
  }

  render(base) {
    const radio = require("./functions/radio.json");
    const radioJSON = require("./functions/radio.json");
    const { avatar, avatarWrapper } = getModule(
      "container",
      "usernameContainer"
    );
    radio.name = this.settings.get("advanced-settings-override", false)
      ? this.settings.get("radio-name-override", radioJSON.name)
      : radioJSON.name;
    radio.stream = this.settings.get("advanced-settings-override", false)
      ? this.settings.get("radio-stream-override", radioJSON.stream)
      : radioJSON.stream;
    radio.homepage = this.settings.get("advanced-settings-override", false)
      ? this.settings.get("radio-homepage-override", radioJSON.homepage)
      : radioJSON.homepage;
    radio.description = this.settings.get("advanced-settings-override", false)
      ? this.settings.get("radio-category-override", radioJSON.description)
      : radioJSON.description;
    radio.favicon = this.settings.get("advanced-settings-override", false)
      ? this.settings.get("radio-image-override", radioJSON.favicon)
      : radioJSON.favicon;

    return {
      ...base,
      props: {
        ...base.props,
        onMouseEnter: () => void 0,
        onMouseLeave: () => void 0,
        onContextMenu: (e) => {
          contextMenu.openContextMenu(e, () => {
            return (
              <ContextMenu set={this.settings.set} get={this.settings.get} />
            );
          });
        },
        className: base.props.className,
        children: [
          <div className="vz-radio-player-inner">
            <div
              className={joinClassNames(
                "vz-radio-player-album-cover-wrapper",
                avatarWrapper
              )}
              onClick={() => {
                shell.openExternal(radio.homepage);
              }}
            >
              <Tooltip text={radio.name}>
                {(props) => (
                  // Not using LazyImage here because it seems to break the tooltip
                  <img
                    {...props}
                    src={radio.favicon || RADIO_DEFAULT_IMAGE}
                    className={joinClassNames(
                      "vz-radio-player-album-cover",
                      avatar
                    )}
                    onError={(e) => {
                      e.target.src = RADIO_DEFAULT_IMAGE;
                    }}
                    width="32"
                    height="32"
                  />
                )}
              </Tooltip>
            </div>
            <div className="vz-radio-player-metadata">
              <div className="radio-name">{radio.name}</div>
              <PanelSubtext className="radio-artist">
                Category: {radio.description}
              </PanelSubtext>
            </div>
          </div>,
        ],
      },
    };
  }

  async _injectPlayer() {
    await sleep(1e3); // It ain't stupid if it works
    const { container } = getModule("container", "usernameContainer");
    const accountContainer = await waitForElement(`section > .${container}`);
    const instance = getOwnerInstance(accountContainer);
    await patch(
      "spotify-in-discord-player",
      instance.__proto__,
      "render",
      (_, res) => {
        const base = findInTree(res, (t) => t.props?.className === container);

        if (this.settings.get("vz-radio", false))
          return [
            res,
            <div className="vz-radio-player">{this.render(base)}</div>,
          ];
        else return res;
      }
    );
    instance.forceUpdate();
  }
}
