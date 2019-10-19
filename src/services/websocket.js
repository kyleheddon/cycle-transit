import WebSocket from 'ws';
import { makeRouteV2 } from './route';
const wss = new WebSocket.Server({ port: 8080 });
import {
	FULL_ROUTE_COMPLETE
} from '../constants/route-progress';
import {
	MAKE_ROUTE_STATUS_UPDATE,
	MAKE_ROUTE_COMPLETE,
} from '../constants/websocket-messages';
const Routes = {
	makeRoute: handleMakeRoute,
}

wss.on('connection', (ws) => {
	ws.on('message', (rawMessage) => {
		const message = parseRawMessage(rawMessage);
		if (Routes[message.route]) {
			console.log('handing route:', message.route);
			Routes[message.route](message.payload, ws);
		} else {
			console.log('unknown message:', message);
		}
	});
	// ws.send('something');
});

function parseRawMessage(rawMessage) {
	try {
		return JSON.parse(rawMessage);
	} catch (error) {
		console.log('error parsing websocket message: ', rawMessage);
	}
}

function handleMakeRoute(params, ws) {
	const {
		origin,
		destination,
		options,
	} = params;
	
	const updateProgress = (status) => {
		ws.send(JSON.stringify({
			route: MAKE_ROUTE_STATUS_UPDATE,
			status
		}));
	}

	makeRouteV2(origin, destination, options, updateProgress).then((result) => {
		ws.send(JSON.stringify({
			route: MAKE_ROUTE_COMPLETE,
			result,
		}));
	});
}