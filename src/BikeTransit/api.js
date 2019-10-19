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

export function makeRouteV2(origin, destination, onUpdate) {
	return new Promise((resolve, reject) => {
		makeRouteWebsocket(origin, destination, (message) => {
			if (message.status === MAKE_ROUTE_COMPLETE) {
				resolve(message.result);
			} else {
				onUpdate(message);
			}
		}, options);
	});
}

export function makeRouteWebsocket(origin, destination, onUpdate) {
	socket.send('makeRoute', {
		origin,
		destination,
	});
	socket.onMessage(onUpdate);
}