import React from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import { runtimeConfig } from '../config';
import PlaceDetails from './PlaceDetails';
import BikeRoute from './BikeRoute';
import MixedRoute from './MixedRoute';

const MapContainer = ({
	google,
	center,
	zoom,
	markers,
	selectedPlace,
	onDirectionsClick,
	travelMode,
	bikeRoute,
	mixedRoute,
}) => {
	const bounds = new google.maps.LatLngBounds();
	markers.forEach(marker =>
		bounds.extend(marker.position)
	);

	return (
		<Map
			google={google}
			initialCenter={center}
			initialZoom={zoom}
			bounds={bounds}
			style={{ height: selectedPlace ? '80%' : '90%', position: 'relative', width: '100%' }}
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
				} else if (selectedPlace) {
					return <PlaceDetails
						place={selectedPlace}
						onDirectionsClick={onDirectionsClick}
					/>;
				}
				return null;
			})()}
		</Map>
	);
}

				// {...placeDetails[selectedOption.place_id].geometry.location}
				// text={placeDetails[selectedOption.place_id].name}
export default GoogleApiWrapper({
	apiKey: (runtimeConfig.googleMapsApiKey)
})(MapContainer);