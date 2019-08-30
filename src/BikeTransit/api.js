export function makeRoute(origin, destination) {
	return fetch(`/route?origin=${origin}&destination=${destination}`).then((response) => {
		return response.json();
	});
}

export function makeRouteV2(origin, destination, options = { includeTransitMode: true }) {
	const { includeTransitMode } = options;
	return fetch(`route-v2?origin=${origin}&destination=${destination}&includeTransitMode=${includeTransitMode}`).then((response) => {
		return response.json();
	});
}
