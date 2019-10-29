import createSocket from './websocket';
const socket = createSocket();

import {
	INITIAL_ROUTE_COMPLETE,
	FIRST_BIKE_LEG_COMPLETE,
	TRANSIT_LEG_COMPLETE,
	LAST_BIKE_LEG_COMPLETE,
} from '../constants/route-progress';
import {
	MAKE_ROUTE_STATUS_UPDATE,
	MAKE_ROUTE_COMPLETE,
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
			} else {
				onUpdate(message);
			}
		}, options, requestKey);
	});
}

export function makeRouteWebsocket(origin, destination, onUpdate, options, requestKey) {
	socket.send('makeRoute', {
		origin,
		destination,
		options,
		requestKey,
	});
	socket.onMessage(onUpdate);
}