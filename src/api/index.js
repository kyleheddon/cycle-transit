import createSocket from './websocket';
const socket = createSocket();

export function getPlaceDetails(placeId) {
	return fetch(`/getPlaceDetails?placeId=${placeId}`).then(response => response.json());
}

import {
	INITIAL_ROUTE_COMPLETE,
	FIRST_BIKE_LEG_COMPLETE,
	TRANSIT_LEG_COMPLETE,
	LAST_BIKE_LEG_COMPLETE,
} from '../constants/route-progress';
import {
	MAKE_ROUTE_STATUS_UPDATE,
	MAKE_ROUTE_COMPLETE,
	MAKE_ROUTE_ERROR,
} from '../constants/websocket-messages';

export function makeRoute(origin, destination, onUpdate, options = {}) {
	return new Promise((resolve, reject) => {
		const requestKey = JSON.stringify({
			origin,
			destination,
			options,
			timestamp: (new Date().getTime()),
		});

		makeRouteWebsocket(origin, destination, (message) => {
			if (message.requestKey !== requestKey) {
				return;
			}
			if (message.status === MAKE_ROUTE_COMPLETE) {
				resolve(message.result);
			} else if (message.status === MAKE_ROUTE_ERROR) {
				reject(message.error);
			} else {
				onUpdate(message);
			}
		}, options, requestKey);
	});
}

export function locationAutoComplete(str) {
	return fetch(`/locationAutoComplete?str=${str}`).then((response) => {
		return response.json();
	});
}

export function reverseGeocode(latitude, longitude) {
	return fetch(`/reverseGeocode?latitude=${latitude}&longitude=${longitude}`).then((response) => {
		return response.json();
	});
}

export function findPlace(str) {
	return fetch(`/findPlace?str=${str}`).then(response => response.json());
}

function makeRouteWebsocket(origin, destination, onUpdate, options, requestKey) {
	socket.send('makeRoute', {
		origin,
		destination,
		options,
		requestKey,
	});
	socket.onMessage(onUpdate);
}