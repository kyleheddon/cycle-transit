import {
	MODE_TRANSIT,
	MODE_BICYCLING,
	TRANSIT_MODE_RAIL,
	queryDirections,
	findPlace,
	getPlaceDetails,
} from './google-maps';
import { reverseGeocode as mapQuestReverseGeocode } from './map-quest';
import moment from 'moment';

import {
	INITIAL_ROUTE_COMPLETE,
	FIRST_BIKE_LEG_COMPLETE,
	TRANSIT_LEG_COMPLETE,
	LAST_BIKE_LEG_COMPLETE,
} from '../constants/route-progress';
import { asyncCache } from './util';
const useCache = process.env['USE_GOOGLE_MAPS_CACHE'];

export const makeRoute = asyncCache((origin, destination, updateProgress = () => {}, options) => {
	return options && options.bikeOnly
		? makeBikeRoute(origin, destination)
		: makeMixedRoute(origin, destination, updateProgress, options);
}, useCache);

async function makeBikeRoute(origin, destination) {
	const result = await queryDirections(origin, destination, MODE_BICYCLING);
	const duration = result.routes[0].legs[0].duration.value;
	return {
		...result,
		arrivalTime: moment().add(duration, 's').format('h:mm a'),
	}
}

async function makeMixedRoute(origin, destination, updateProgress, options) {
	const [originStation, destinationStation] = await Promise.all([
		findNearbyRailStation(origin),
		findNearbyRailStation(destination)
	]);
	
	console.log({
		originStation: originStation.name,
		destinationStation: destinationStation.name,
	});

	const [firstBikeRoute, lastBikeRoute] = await Promise.all([
		makeBikeRoute(origin, originStation.name),
		// assumes last bike route will have the same duration if queried at time of transit arrival
		makeBikeRoute(destinationStation.name, destination)
	]);

	const transitRoute = await getTransitRoute(originStation, destinationStation, {
		departureTime: firstBikeRoute.arrivalTime
	});

	const arrivalTime = calculateArrivalTime(transitRoute, lastBikeRoute);
	
	return {
		firstBikeRoute,
		transitRoute,
		lastBikeRoute,
		arrivalTime,
		stations: {
			origin: originStation.name,
			destination: destinationStation.name,
		},
		duration: getDurationFromNow(arrivalTime),
	};
}

function getDurationFromNow(arrivalTime) {
	const arrival = moment(arrivalTime, 'h:mm a');
	const now = moment();

	const days = arrival.diff(now, 'days');
	const hours = arrival.subtract(days, 'days').diff(now, 'hours');
	const minutes = arrival.subtract(hours, 'hours').diff(now, 'minutes');

	if (hours) {
		return `${hours} hrs ${minutes} mins`;
	} else {
		return `${minutes} mins`;
	}
}

function getTransitRoute(originStation, destinationStation, options) {
	const { departureTime } = options;
	return queryDirections(originStation.name, destinationStation.name, MODE_TRANSIT, {
		departure_time: moment(departureTime, 'h:mm a').unix()
	});
}

function calculateArrivalTime(transitRoute, lastBikeRoute) {
	const bikeDuration = lastBikeRoute.routes[0].legs[0].duration.value;
	const transitArrivalTime = transitRoute.routes[0].legs[0].arrival_time.value;
	return moment.unix(transitArrivalTime).add(bikeDuration, 's').format('h:mm a')
}

async function findNearbyRailStation(location) {
	const searchString = `Marta sations near ${location}`;
	const placeResults = await findPlace(searchString);

	if (!placeResults.candidates || !placeResults.candidates.length) {
		console.log('no place candidates for ' + location);
		return [];
	}
	
	const placeId = placeResults.candidates[0].place_id;

	const results = await getPlaceDetails(placeId);
	return results.result;
}

function locationToString(location) {
	return location.lat + ',' + location.lng;
}

export function reverseGeocode(latitude, longitude) {
	return mapQuestReverseGeocode(latitude, longitude).then((result) => {
		if (result.info.statuscode !== 0) {
			throw 'reverseGeocode failed';
		}
		
		try {
			const location = result.results[0].locations[0];
			const {
				street,
				adminArea3: state,
				adminArea5: city,
			} = location;
			
			return {
				street,
				state,
				city,
			}
		} catch (e) {
			throw 'reverseGeocode failed';
		}
	});
}
