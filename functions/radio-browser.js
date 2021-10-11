import { get } from "@vizality/http";
import fs from "fs";

exports.getStation = async (stationName) => {
  const data = await get(
    `http://91.132.145.114/json/stations/byname/${stationName}`
  );

  fs.readFile("radio.json", "utf8", function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      obj = JSON.parse(data); //now it an object
      obj.name = data.body[0].name; //add some data
      obj.stream = data.body[0].url_resolved; //add some data
      json = JSON.stringify(obj); //convert it back to json
      fs.writeFile("radio.json", json, "utf8", callback); // write it back
    }
  });
};
