import * as https from 'https';
export const MODE_TRANSIT = 'transit';
export const MODE_BICYCLING = 'bicycling';
export const TRANSIT_MODE_RAIL = 'rail';
const { GOOGLE_MAP_API_DEV_KEY } = process.env;
const API_BASE_URL = 'https://maps.googleapis.com/maps/api';
const DIRECTIONS_API_URL = `${API_BASE_URL}/directions/json?key=${GOOGLE_MAP_API_DEV_KEY}`;
const NEARBY_PLACES_API_URL = `${API_BASE_URL}/place/nearbysearch/json?key=${GOOGLE_MAP_API_DEV_KEY}`;
const FIND_PLACE_API_URL = `${API_BASE_URL}/place/findplacefromtext/json?key=${GOOGLE_MAP_API_DEV_KEY}`;
const PLACE_DETAILS_API_URL = `${API_BASE_URL}/place/details/json?key=${GOOGLE_MAP_API_DEV_KEY}`;
const AUTO_COMPLETE_API_URL = `${API_BASE_URL}/place/autocomplete/json?key=${GOOGLE_MAP_API_DEV_KEY}`;

export function queryDirections(origin, destination, mode, optionalParams = {}) {
	const options = { ...optionalParams };
	if (mode === MODE_TRANSIT) {
		options.transit_mode = TRANSIT_MODE_RAIL;
	}

	const optionsString = Object.keys(options).reduce((acc, key) => {
		return `${acc}&${key}=${options[key]}`;
	}, '');
	const url = `${DIRECTIONS_API_URL}&origin=${origin}&destination=${destination}&mode=${mode}${optionsString}`;

	return getJson(url);
}

export function findPlace(searchString) {
	const url = `${FIND_PLACE_API_URL}&inputtype=textquery&input=${searchString}`;
	return getJson(url);
}

export function getPlaceDetails(placeId) {
	const url = `${PLACE_DETAILS_API_URL}&place_id=${placeId}`;
	return getJson(url);
}

export function autoComplete(str) {
	const url = `${AUTO_COMPLETE_API_URL}&input=${str}&location=Atlanta+Ga+USA`;
	return getJson(url);
}

export function getJson(url) {
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
