import WebSocket from 'ws';
import { makeRoute } from './route';
const wss = new WebSocket.Server({ port: process.env.WEBSOCKET_PORT });
import {
	MAKE_ROUTE_STATUS_UPDATE,
	MAKE_ROUTE_COMPLETE,
} from '../constants/websocket-messages';
const Endpoints = {
	makeRoute: handleMakeRoute,
}

wss.on('connection', (ws) => {
	ws.on('message', (rawMessage) => {
		const message = parseRawMessage(rawMessage);
		if (Endpoints[message.endpoint]) {
			console.log('handing endpoint:', message.endpoint, message.payload);
			try {
				Endpoints[message.endpoint](message.payload, ws);
			} catch (e) {
				console.error('error', e, e.stack);
			}
		} else {
			console.log('unknown message:', message);
		}
	});
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
	} = params;
	
	const updateProgress = (status) => {
		ws.send(JSON.stringify({
			status: MAKE_ROUTE_STATUS_UPDATE,
			status
		}));
	}

	makeRoute(origin, destination, updateProgress).then((result) => {
		ws.send(JSON.stringify({
			status: MAKE_ROUTE_COMPLETE,
			result,
		}));
	});
}