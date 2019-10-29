import WebSocket from 'ws';
import { makeRoute } from './route';
import {
	MAKE_ROUTE_STATUS_UPDATE,
	MAKE_ROUTE_COMPLETE,
} from '../constants/websocket-messages';

const Endpoints = {
	makeRoute: handleMakeRoute,
}

export default (server) => {
	const wss = new WebSocket.Server({ server });

	wss.on('connection', (ws) => {
		console.log('client connected');
		handleMessages(ws);
		ws.on('close', () => console.log('Client disconnected'));
	});
}

function handleMessages(ws) {
	ws.on('message', (rawMessage) => {
		const message = parseRawMessage(rawMessage);
		if (Endpoints[message.endpoint]) {
			console.log('handing endpoint:', message.endpoint);
			try {
				Endpoints[message.endpoint](message.payload, ws);
			} catch (e) {
				console.error('error', e, e.stack);
			}
		} else {
			console.log('unknown message:', message);
		}
	});
}

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
		requestKey,
	} = params;
	
	const updateProgress = (status) => {
		ws.send(JSON.stringify({
			status: MAKE_ROUTE_STATUS_UPDATE,
			status,
			requestKey,
		}));
	}

	makeRoute(origin, destination, updateProgress, options).then((result) => {
		ws.send(JSON.stringify({
			status: MAKE_ROUTE_COMPLETE,
			result,
			requestKey,
		}));
	});
}
