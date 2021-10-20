import { get } from "@vizality/http";
import fs from "fs";

const audio = require('./audio')
const radioJSON = require('./radio.json')

exports.getStation = async (stationName, volume, play, station  ) => {
  const radio = await get(
    `http://91.132.145.114/json/stations/byname/${stationName}`
  );

  let results = []

  for (let i = 0; i < radio.body.length && i < 10; i++) {
    results.push({ value: i, label: radio.body[i].name })
  }

  fs.readFile(
    `${__dirname}/radio.json`,
    "utf8",
    function readFileCallback(err, data) {
      if (err) {
        console.error(err);
      } else {
        let obj = JSON.parse(data); //now it an object
        obj.name = radio.body[station].name; //add some data
        obj.stream = radio.body[station].url_resolved; //add some data
        obj.favicon = radio.body[station].favicon; //add some data
        obj.description = radio.body[station].tags.split(",")[0]; //add some data
        obj.homepage = radio.body[station].homepage; //add some data
        obj.station = station
        obj.results = results
        let json = JSON.stringify(obj); //convert it back to json
        fs.writeFile(`${__dirname}/radio.json`, json, "utf8", (result) => {
          if (result) console.error(err);
        }); // write it back
      }
    }
  );

  if (play) {
    audio.stop();
    audio.play(radio.stream, volume);
  }
};
