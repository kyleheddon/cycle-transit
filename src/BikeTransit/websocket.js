export default () => {
	if(typeof(window) === 'undefined') {
		return;
	}
	const {
		WebSocket,
		location,
	} = window;
	const host = location.origin.replace(/^http/, 'ws');
	const socket = new WebSocket(host);

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