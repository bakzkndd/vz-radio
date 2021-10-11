import { get } from '@vizality/http';

exports = {
    async getStationName(stationName) {
        const data = await get(`http://91.132.145.114/json/stations/byname/${stationName}`)
        return data.name
    },

    async getStationStream(stationName) {
        const data = await get(`http://91.132.145.114/json/stations/byname/${stationName}`)
        return data.name
    }
}