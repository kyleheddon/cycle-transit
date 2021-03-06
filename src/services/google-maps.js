import { getJson } from './base-api';
import { asyncCache } from './util';
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
const REVERSE_GEOCODE_API_URL = `${API_BASE_URL}/geocode/json?key=${GOOGLE_MAP_API_DEV_KEY}`
const MAP_IMAGE_URL = `${API_BASE_URL}/staticmap?key=${GOOGLE_MAP_API_DEV_KEY}`;
const ATLANTA_LAT_LON = '33.7489954,-84.3879824';
const useCache = process.env['USE_GOOGLE_MAPS_CACHE'];

export const reverseGeocode = asyncCache((lat, lng) => {
	const url = `${REVERSE_GEOCODE_API_URL}&latlng=${lat},${lng}`;
	return getJson(url);
}, useCache);

export function queryDirections(origin, destination, mode, optionalParams = {}) {
	const options = { ...optionalParams };
	if (mode === MODE_TRANSIT) {
		options.transit_mode = TRANSIT_MODE_RAIL;
	}

	const optionsString = Object.keys(options).reduce((acc, key) => {
		return `${acc}&${key}=${options[key]}`;
	}, '');
	const url = `${DIRECTIONS_API_URL}&origin=${origin}&destination=${destination}&mode=${mode}${optionsString}`;

	return getJson(url).then((result) => {
		return {
			...result,
			image_base_url: MAP_IMAGE_URL,
		}
	});
}

export function findPlace(searchString, logUrl = false) {
	const url = `${FIND_PLACE_API_URL}&inputtype=textquery&input=${searchString}`;
	if (logUrl) {
		console.log('findPlace', url);
	}
	return getJson(url);
}

export const getPlaceDetails = asyncCache((placeId) => {
	const url = `${PLACE_DETAILS_API_URL}&place_id=${placeId}`;
	return getJson(url);
}, useCache);

export const autoComplete = asyncCache((str) => {
	const url = `${AUTO_COMPLETE_API_URL}&input=${str}&location=${ATLANTA_LAT_LON}&radius=50&components=country:us`;
	return getJson(url);
}, useCache);
