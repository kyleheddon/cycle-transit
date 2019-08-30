import { GOOGLE_MAP_API_DEV_KEY } from '../../keys';
const MODE_TRANSIT = 'transit';
const MODE_BICYCLING = 'bicycling';
const TRANSIT_MODE_RAIL = 'rail';
const API_URL = 'https://maps.googleapis.com/maps/api/directions/json';
import * as http from 'http';
import * as https from 'https';
import moment from 'moment';

const Cache = {}
const useCache = false;

export async function makeRouteV2(origin, destination, options = {}) {
	if (!options.includeTransitMode) {
		const bikeRoute = await queryMapsApi(origin, destination, MODE_BICYCLING);
		return {
			bikeRoute,
			arrivalTime: bikeRoute.routes[0].legs[0].duration.value,
			duration: bikeRoute.routes[0].legs[0].duration.text,
		}
	}
	if (useCache && Cache[cacheKey(origin, destination)]) {
		return Promise.resolve(Cache[cacheKey(origin, destination)]);
	}
	// get full route
	const route = await queryMapsApi(origin, destination, MODE_TRANSIT);

	const { steps } = route.routes[0].legs[0];
	const departureTime = route.routes[0].legs[0].departure_time.value;
	const startOfTransit = locationToString(steps[0].end_location);
	const endOfTransit = locationToString(steps[steps.length - 2].end_location);
	// get start bicycle route
	const firstBikeRoute = await queryMapsApi(origin, startOfTransit, MODE_BICYCLING);
	const firstBikeArrivalTime = departureTime + firstBikeRoute.routes[0].legs[0].duration.value;
	// get transit route
	const transitRoute = await queryMapsApi(startOfTransit, endOfTransit, MODE_TRANSIT, { departure_time: firstBikeArrivalTime });
	const transitArrivalTime = firstBikeArrivalTime + transitRoute.routes[0].legs[0].duration.value;
	// get end bicycle route
	const lastBikeRoute = await queryMapsApi(endOfTransit, destination, MODE_BICYCLING, { departure_time: transitArrivalTime });
	const arrivalTime = transitArrivalTime + lastBikeRoute.routes[0].legs[0].duration.value;
	
	const arrivalMoment = moment.unix(arrivalTime);
	const departureMoment = moment.unix(departureTime);
	const routes = {
		firstBikeRoute,
		transitRoute,
		lastBikeRoute,
		arrivalTime: arrivalMoment.format('h:mm a'),
		duration: arrivalMoment.from(departureMoment, true),
	};

	Cache[cacheKey(origin, destination)] = routes;
	return routes;
}

function cacheKey(origin, destination) {
	return `origin="${origin}", destination="${destination}"`
}

function locationToString(location) {
	return location.lat + ',' + location.lng;
}

export async function makeRoute(origin, destination) {
	const response = await queryMapsApi(origin, destination, MODE_TRANSIT);
	const steps = getStepsFromResponse(response);
	const [firstStep, lastStep] = await Promise.all([
		replaceStepWithBicycleLeg(steps[0], { origin }),
		replaceStepWithBicycleLeg(steps[steps.length - 1], { destination })
	]);

	return replaceStepsInResponse(response, [
		firstStep,
		...steps.slice(1, steps.length - 1),
		lastStep
	]);
}

async function replaceStepWithBicycleLeg(step, options = {}) {
	const { start_location, end_location } = step;
	const origin = options.origin
		? options.origin
		: `${start_location.lat},${start_location.lng}`;
	const destination = options.destination
		? options.destination
		: `${end_location.lat},${end_location.lng}`;

	const response = await queryMapsApi(origin, destination, MODE_BICYCLING);
	return response.routes[0].legs[0];
}

function queryMapsApi(origin, destination, mode, optionalParams = {}) {
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

function getStepsFromResponse(response) {
	return response.routes[0].legs[0].steps;
}

function replaceStepsInResponse(response, steps) {
	return {
		...response,
		routes: replaceStepsInRoutes(response.routes, steps)
	}
}

function replaceStepsInRoutes(routes, steps) {
	return [
		{
			...routes[0],
			legs: replaceStepsInLegs(routes[0].legs, steps)
		},
		...routes.slice(1)
	];
}

function replaceStepsInLegs(legs, steps) {
	return [
		{
			...legs[0],
			steps
		},
		...legs.slice(1)
	];
}
