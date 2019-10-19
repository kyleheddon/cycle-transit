import {
	MODE_TRANSIT,
	MODE_BICYCLING,
	TRANSIT_MODE_RAIL,
	queryMapsApi,
} from './google-maps';
import moment from 'moment';
const { GOOGLE_MAP_API_DEV_KEY } = process.env;

import {
	INITIAL_ROUTE_COMPLETE,
	FIRST_BIKE_LEG_COMPLETE,
	TRANSIT_LEG_COMPLETE,
	LAST_BIKE_LEG_COMPLETE,
} from '../constants/route-progress';
const Cache = {}
const useCache = false;

export async function makeRouteV2(origin, destination, options = {}, updateProgress = () => {}) {
	console.log('make route v2')
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
	updateProgress(INITIAL_ROUTE_COMPLETE);

	const { steps } = route.routes[0].legs[0];
	const departureTime = route.routes[0].legs[0].departure_time.value;
	const startOfTransit = locationToString(steps[0].end_location);
	const endOfTransit = locationToString(steps[steps.length - 2].end_location);
	// get start bicycle route
	const firstBikeRoute = await queryMapsApi(origin, startOfTransit, MODE_BICYCLING);
	updateProgress(FIRST_BIKE_LEG_COMPLETE);

	const firstBikeArrivalTime = departureTime + firstBikeRoute.routes[0].legs[0].duration.value;
	// get transit route
	const transitRoute = await queryMapsApi(startOfTransit, endOfTransit, MODE_TRANSIT, { departure_time: firstBikeArrivalTime });
	updateProgress(TRANSIT_LEG_COMPLETE);
	
	const transitArrivalTime = firstBikeArrivalTime + transitRoute.routes[0].legs[0].duration.value;
	// get end bicycle route
	const lastBikeRoute = await queryMapsApi(endOfTransit, destination, MODE_BICYCLING, { departure_time: transitArrivalTime });
	updateProgress(LAST_BIKE_LEG_COMPLETE);
	
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
