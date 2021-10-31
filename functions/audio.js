import { get } from "@vizality/http";
import {
  getModule,
  getModuleByDisplayName,
} from "@vizality/webpack";
import { getOwnerInstance } from "@vizality/util/react";
import { waitForElement } from "@vizality/util/dom";
const RADIO_DEFAULT_IMAGE = "https://i.imgur.com/nWLt7eE.jpg";
const radiobrowser = require("./radio-browser")

let audio;
let settings = {}
exports.play = async (stream, volume) => {
  const url = stream;

  audio = new Audio(url);
  audio.volume = volume / 100
  audio.play()
    .catch(err => {
      $vz.notifications.sendNotice({
          message: "Radio failed to play! Error: " + err,
          color: "RED",
          buttons: [
            {
              text: "Okay",
              onClick: () => {
                $vz.notifications.closeAllActiveToasts()
                audio.pause();
                audio.currentTime = 0;
                audio.src = "";

                settings.set("vz-radio", false)
                forceUpdate()
              }
            }
          ]
      })
    });
  setMediaSession()
};

exports.stop = () => {
  if(!audio) return
  audio.pause();
  audio.currentTime = 0;
  audio.src = "";
};

exports.volume = (volume) => {
  audio.volume = volume / 100;
}

exports.setup = (get, set) => {
  settings.get = get
  settings.set = set
}

async function setMediaSession() {
  const radio = require("./radio.json")

  radio.name = settings.get("advanced-settings-override", false)
    ? settings.get("radio-name-override", radio.name)
    : radio.name;
  radio.stream = settings.get("advanced-settings-override", false)
    ? settings.get("radio-stream-override", radio.stream)
    : radio.stream;
  radio.homepage = settings.get("advanced-settings-override", false)
    ? settings.get("radio-homepage-override", radio.homepage)
    : radio.homepage;
  radio.description = settings.get("advanced-settings-override", false)
    ? settings.get("radio-category-override", radio.description)
    : radio.description;
  radio.favicon = settings.get("advanced-settings-override", false)
    ? settings.get("radio-image-override", radio.favicon)
    : radio.favicon;
  radio.results = radio.results || [{ value: 0, label: "Dash Pop X" }]
  radio.station = radio.station || 0


  let icon = await get(radio.favicon)
  if(icon.statusText.toLowerCase() != "ok") radio.favicon = RADIO_DEFAULT_IMAGE

  navigator.mediaSession.metadata = new MediaMetadata({
    title: radio.name,
    artist: "Category: " + radio.description,
    album: radio.homepage,
    artwork: [
      { src: radio.favicon, sizes: '96x96', type: 'image/png' },
      { src: radio.favicon, sizes: '128x128', type: 'image/png' },
      { src: radio.favicon, sizes: '192x192', type: 'image/png' },
      { src: radio.favicon, sizes: '256x256', type: 'image/png' },
      { src: radio.favicon, sizes: '384x384', type: 'image/png' },
      { src: radio.favicon, sizes: '512x512', type: 'image/png' },
    ]
  });

  navigator.mediaSession.setActionHandler('play', function () {
    const url = radio.stream;
    audio = new Audio(url);
    audio.volume = volume / 100
    audio.play();

    navigator.mediaSession.playbackState = "playing";
    settings.set("vz-radio", true)
    forceUpdate()
   });
  navigator.mediaSession.setActionHandler('pause', function () {
    settings.set("vz-radio", false)
    if(!audio) return
    audio.pause();
    audio.currentTime = 0;
    audio.src = "";

    navigator.mediaSession.playbackState = "paused";
    settings.set("vz-radio", false)
    forceUpdate()
   });
  navigator.mediaSession.setActionHandler('stop', function () {
    settings.set("vz-radio", false)
    if(!audio) return
    audio.pause();
    audio.currentTime = 0;
    audio.src = "";

    navigator.mediaSession.playbackState = "none";
    settings.set("vz-radio", false)
    forceUpdate()
   });
  navigator.mediaSession.setActionHandler('seekbackward', function () { /* Code excerpted. */ });
  navigator.mediaSession.setActionHandler('seekforward', function () { /* Code excerpted. */ });
  navigator.mediaSession.setActionHandler('seekto', function () { /* Code excerpted. */ });
  navigator.mediaSession.setActionHandler('previoustrack', function () {
    if(settings.get("advanced-settings-override", false)) return
    radio.station -= 1

    if (radio.station < 0) radio.station = radio.results.length - 1
    
    radiobrowser.getStation(
      settings.get("vz-radio-station"),
      settings.get("volume-slider", 100),
      settings.get("vz-radio", false),
      radio.station
    );
   });
  navigator.mediaSession.setActionHandler('nexttrack', function () {
    if(settings.get("advanced-settings-override", false)) return
    radio.station += 1

    if (radio.station >= radio.results.length) radio.station = 0
    
    radiobrowser.getStation(
      settings.get("vz-radio-station"),
      settings.get("volume-slider", 100),
      settings.get("vz-radio", false),
      radio.station
    );
   });
}

async function forceUpdate() {
  const { container } = getModule("container", "usernameContainer");
  const accountContainer = await waitForElement(`section > .${container}`);
  const instance = getOwnerInstance(accountContainer);
  instance.forceUpdate();
}