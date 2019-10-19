export default () => {
	if(typeof(window) === 'undefined') {
		return;
	}
	const {
		WebSocket,
		location,
	} = window;
	const port = process.env.WEBSOCKET_PORT || '8080'; // TODO fix this
	
	const hostname = location.host.split(':')[0];
	const socket = new WebSocket(`ws://${hostname}:${port}`);

	return {
		send: (endpoint, payload) => {
			socket.send(JSON.stringify({
				endpoint,
				payload,
			}));
		},
		onMessage: (handleMessage) => {
			socket.addEventListener('message', (event) => {
				try {
					handleMessage(JSON.parse(event.data));
				} catch (e) {
					console.error('Error parsing: ', event.data)
				};
			});
		}
	};
}