import React, { useMemo, useEffect } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper, Polyline } from 'google-maps-react';
import { runtimeConfig } from '../config';
import PlaceDetails from './PlaceDetails';
import BikeRoutePolyline from './BikeRoutePolyline';
import MixedRoutePolyline from './MixedRoutePolyline';
import { getPolylinePath } from './util';
import { ATLANTA_LOCATION } from '../constants';

const MapContainer = ({
	google,
	markers,
	travelMode,
	bikeRoute,
	mixedRoute,
	onBoundsChange,
	ne,
	sw,
}) => {
	useEffect(() => {
		if (markers.length === 0) {
			return;
		}

		const newBounds = getBounds(markers, travelMode, bikeRoute, mixedRoute, google);
		if (!pointEquals(getLatLng(newBounds.getNorthEast()), ne) || !pointEquals(getLatLng(newBounds.getSouthWest()), sw)) {
			onBoundsChange(newBounds);
		}
	}, [markers, travelMode, bikeRoute, mixedRoute]);

	const bounds = new google.maps.LatLngBounds(sw, ne);
	return (
		<Map
			google={google}
			initialCenter={getLatLng(bounds.getCenter())}
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
					return <BikeRoutePolyline bikeRoute={bikeRoute} />
				} else if (travelMode === 'mixed' && mixedRoute) {
					return <MixedRoutePolyline mixedRoute={mixedRoute} />
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

function getLatLng(point) {
	return {
		lat: point.lat(),
		lng: point.lng(),
	}
}

function pointEquals(p1, p2) {
	return p1.lat === p2.lat && p2.lng === p1.lng;
}

export default GoogleApiWrapper({
	apiKey: (runtimeConfig.googleMapsApiKey),
	libraries: ['geometry'],
})(MapContainer);