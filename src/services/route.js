import {
	MODE_TRANSIT,
	MODE_BICYCLING,
	TRANSIT_MODE_RAIL,
	queryDirections,
	findPlace,
	textSearch,
	getPlaceDetails,
} from './google-maps';
import { ORIGIN_AND_DESTINATION_STATIONS_ARE_SAME } from '../constants/errors';
import { areRailStationsOnSameDirectionalLine, fromGoogle } from '../constants/marta';
import { reverseGeocode as mapQuestReverseGeocode } from './map-quest';
import moment from 'moment';

import {
	MAKE_ROUTE_STATION_SEARCH,
} from '../constants/websocket-messages';

import {
	INITIAL_ROUTE_COMPLETE,
	FIRST_BIKE_LEG_COMPLETE,
	TRANSIT_LEG_COMPLETE,
	LAST_BIKE_LEG_COMPLETE,
} from '../constants/route-progress';
import { asyncCache } from './util';
const useCache = process.env['USE_GOOGLE_MAPS_CACHE'];
const LOG_FIND_PLACE = false;
const LOG_GET_PLACE_DETAILS = false;

export const makeRoute = asyncCache((origin, destination, updateProgress = () => {}, options) => {
	// console.log(origin, destination);
	return options && options.bikeOnly
		? makeBikeRoute(origin.description, destination.description)
		: makeMixedRoute(origin.description, destination.description, updateProgress, options);
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
	const [originStation, destinationStation] = await findRailStations(origin, destination);

	if (originStation.name === destinationStation.name) {
		console.log('error', ORIGIN_AND_DESTINATION_STATIONS_ARE_SAME)
		throw ORIGIN_AND_DESTINATION_STATIONS_ARE_SAME;
	}

	// console.log('origin', origin)
	// console.log('destination', destination)
	const [firstBikeRoute, lastBikeRoute] = await Promise.all([
		makeBikeRoute(origin, originStation.formatted_address),
		// assumes last bike route will have the same duration if queried at time of transit arrival
		makeBikeRoute(destinationStation.formatted_address, destination)
	]);

	// console.log('destinationStation' ,destinationStation);

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

async function findRailStations(origin, destination) {
	const [originStations, destinationStations] = await Promise.all([
		findNearbyRailStations(origin),
		findNearbyRailStations(destination)
	]);
	console.log('originStations', originStations.map(s => s.name));
	console.log('destinationStations', destinationStations.map(s => s.name));

	const checkPattern = [
		[0,0],
		[0,1],
		[1,0],
		[1,1],
		[0,2],
		[2,0],
		[1,2],
		[2,1],
		[2,2],
	]
	for (let check of checkPattern) {
		const originStation = originStations[check[0]];
		const destinationStation = destinationStations[check[1]];
		const stations = [
			fromGoogle(originStation.name),
			fromGoogle(destinationStation.name),
		];
		if (areRailStationsOnSameDirectionalLine(stations)) {
			console.log(`${stations[0]} and ${stations[1]} are on the same line`);
			return [originStation, destinationStation];
		}
		console.log(`${stations[0]} and ${stations[1]} are not on the same line`);
	}

	return [originStations[0], destinationStations[0]];
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
	return queryDirections(originStation.formatted_address, destinationStation.formatted_address, MODE_TRANSIT, {
		departure_time: moment(departureTime, 'h:mm a').unix()
	}, true);
}

function calculateArrivalTime(transitRoute, lastBikeRoute) {
	const bikeDuration = lastBikeRoute.routes[0].legs[0].duration.value;
	const transitArrivalTime = transitRoute.routes[0].legs[0].arrival_time.value;
	return moment.unix(transitArrivalTime).add(bikeDuration, 's').format('h:mm a')
}

async function findNearbyRailStation(location, updateProgress) {
	const searchString = `Marta rail stations near ${location}`;
	const placeResults = await findPlace(searchString, LOG_FIND_PLACE);

	if (!placeResults.candidates || !placeResults.candidates.length) {
		// TODO: display user error
		console.log('no place candidates for ' + location);
		return [];
	}

	updateProgress(MAKE_ROUTE_STATION_SEARCH, placeResults.candidates);

	const placeId = placeResults.candidates[0].place_id;

	const results = await getPlaceDetails(placeId, LOG_GET_PLACE_DETAILS);
	return results.result;
}

async function findNearbyRailStations(location) {
	const searchString = `Marta rail stations near ${location}`;
	const testSearchResults = await textSearch(searchString, LOG_FIND_PLACE);

	if (!testSearchResults.results || !testSearchResults.results.length) {
		console.log('no place results for ' + location);
		return [];
	}
	// console.log(`findNearbyRailStations("${location}")`, testSearchResults.results.map(r =>));

	return testSearchResults.results;
	// return await Promise.all(testSearchResults.results.map(async (candidate) => {
	// 	const results = await getPlaceDetails(candidate.place_id, LOG_GET_PLACE_DETAILS);
	// 	return results.result;
	// }));
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
