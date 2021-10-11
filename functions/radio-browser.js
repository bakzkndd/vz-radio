import { get } from "@vizality/http";
import fs from "fs";

exports.getStation = async (stationName) => {
  const radio = await get(
    `http://91.132.145.114/json/stations/byname/${stationName}`
  );

  fs.readFile(
    `${__dirname}/radio.json`,
    "utf8",
    function readFileCallback(err, data) {
      if (err) {
        console.error(err);
      } else {
        let obj = JSON.parse(data); //now it an object
        obj.name = radio.body[0].name; //add some data
        obj.stream = radio.body[0].url_resolved; //add some data
        let json = JSON.stringify(obj); //convert it back to json
        fs.writeFile(`${__dirname}/radio.json`, json, "utf8", (result) => {
          if (result) console.error(err);
        }); // write it back
      }
    }
  );
};
