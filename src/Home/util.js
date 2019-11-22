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