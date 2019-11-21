import React, { useMemo } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper, Polyline } from 'google-maps-react';
import { runtimeConfig } from '../config';
import PlaceDetails from './PlaceDetails';
import BikeRoute from './BikeRoute';
import MixedRoute from './MixedRoute';
import { getPolylinePath } from './util';

const MapContainer = ({
	google,
	center,
	zoom,
	markers,
	travelMode,
	bikeRoute,
	mixedRoute,
}) => {
	const bounds = useMemo(() => (
		getBounds(markers, travelMode, bikeRoute, mixedRoute, google)
	), [markers, travelMode, bikeRoute, mixedRoute]);

	return (
		<Map
			google={google}
			initialCenter={center}
			initialZoom={zoom}
			bounds={bounds}
			style={{ height: '100%', position: 'relative', width: '100%' }}
		>
			{markers.map(marker => (
				<Marker
					key={JSON.stringify(marker.position)}
					name={marker.name}
					position={marker.position}
					title={marker.title}
				/>
			))}
			{(() => {
				if (travelMode === 'bike' && bikeRoute) {
					return <BikeRoute bikeRoute={bikeRoute} />
				} else if (travelMode === 'mixed' && mixedRoute) {
					return <MixedRoute mixedRoute={mixedRoute} />
				}
				return null;
			})()}
		</Map>
	);
}

function getBounds(markers, travelMode, bikeRoute, mixedRoute, google) {
	const bounds = new google.maps.LatLngBounds();
	markers.forEach(marker =>
		bounds.extend(marker.position)
	);

	let path = [];
	if (travelMode === 'bike' && bikeRoute) {
		path = getPolylinePath(google, bikeRoute);
	} else if (travelMode === 'mixed' && mixedRoute) {
		path = [
			mixedRoute.firstBikeRoute,
			mixedRoute.transitRoute,
			mixedRoute.lastBikeRoute,
		].reduce((path, route) => (
			[...path, ...getPolylinePath(google, route)]
		), []);
	}
	path.forEach(point =>
		bounds.extend(point)
	);

	return bounds;
}

export default GoogleApiWrapper({
	apiKey: (runtimeConfig.googleMapsApiKey),
	libraries: ['geometry'],
})(MapContainer);