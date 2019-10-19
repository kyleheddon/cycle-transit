import * as https from 'https';
import { GOOGLE_MAP_API_DEV_KEY } from '../../keys';
export const MODE_TRANSIT = 'transit';
export const MODE_BICYCLING = 'bicycling';
export const TRANSIT_MODE_RAIL = 'rail';
const API_URL = 'https://maps.googleapis.com/maps/api/directions/json';

export function queryMapsApi(origin, destination, mode, optionalParams = {}) {
	const options = { ...optionalParams };
	if (mode === MODE_TRANSIT) {
		options.transit_mode = TRANSIT_MODE_RAIL;
	}

	const optionsString = Object.keys(options).reduce((acc, key) => {
		return `${acc}&${key}=${options[key]}`;
	}, '');
	const url = API_URL + `?origin=${origin}&destination=${destination}&mode=${mode}&key=${GOOGLE_MAP_API_DEV_KEY}${optionsString}`;

	return new Promise((resolve) => {
		https.get(url, (res) => {
			let rawData = '';
			res.setEncoding('utf8');
			res.on('data', (chunk) => { rawData += chunk; });
			res.on('end', () => {
				resolve(JSON.parse(rawData));
			});
		});
	});
}
