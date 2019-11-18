import { getJson } from './base-api';
import { asyncCache } from './util';
const DEV_KEY = process.env.MAP_QUEST_API_KEY;
const REVERSE_GEOCODE_URL = `http://open.mapquestapi.com/geocoding/v1/reverse?key=${DEV_KEY}`;

const useCache = process.env['USE_MAP_QUEST_CACHE'];

export const reverseGeocode = asyncCache((latitude, longitude) => {
	const url = `${REVERSE_GEOCODE_URL}&location=${latitude},${longitude}`;
	return getJson(url, { useHttps: false });
}, useCache);