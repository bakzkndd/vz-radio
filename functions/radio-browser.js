import { get } from "@vizality/http";

exports.getStationName = async (stationName) => {
  const data = await get(
    `http://91.132.145.114/json/stations/byname/${stationName}`
  );
  return data.body[0].name;
};

exports.getStationStream = async (stationName) => {
  const data = await get(
    `http://91.132.145.114/json/stations/byname/${stationName}`
  );
  return data.body[0].url_resolved;
};
