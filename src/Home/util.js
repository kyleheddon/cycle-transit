export function getPolylinePath(google, route) {
	return google.maps.geometry.encoding.decodePath(route.routes[0].overview_polyline.points);
}