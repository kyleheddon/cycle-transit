import {
	locationAutoComplete,
	reverseGeocode,
} from '../BikeTransit/api';

export function getUserLocation() {
	return new Promise((resolve, reject) => {
		window.navigator.geolocation.getCurrentPosition((position) => {
			const {
				latitude,
				longitude,
			} = position.coords;
			reverseGeocode(latitude, longitude).then((result) => {
				resolve(result);
			});
		});
	});
}

export function getPolylinePath(google, route) {
	return google.maps.geometry.encoding.decodePath(route.routes[0].overview_polyline.points);
}

export function getRouteMapUrl(route, travelMode) {
	const {
		start_address,
		end_address,
	} = route.routes[0].legs[0];

	return `https://www.google.com/maps/dir/?api=1&origin=${start_address}&destination=${end_address}&travelmode=${travelMode}`;
}
