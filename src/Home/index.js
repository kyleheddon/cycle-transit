import React, { useState } from 'react';
import { ATLANTA_LOCATION } from '../constants';
import SearchBar from './SearchBar';
import PlaceIcon from '@material-ui/icons/Place';
import { getPlaceDetails } from '../api';
import { makeRoute } from '../BikeTransit/api';
import GoogleMapsContainer from './GoogleMapsContainer';
import Directions from './Directions';
const Home = ({
	googleMapsApiKey,
}) => {
	const [bikeRoute, setBikeRoute] = useState(null);
	const [loading, setLoading] = useState(false);
	const [mixedRoute, setMixedRoute] = useState(null);
	const [origin, setOrigin] = useState(null);
	const [destination, setDestination] = useState(null);
	const [center, setCenter] = useState(ATLANTA_LOCATION);
	const [zoom, setZoom] = useState(11);
	const [placeDetails, setPlaceDetails] = useState({});
	const [travelMode, setTravelMode] = useState('bike');

	const handleSelectOrigin = (origin) => {
		setOrigin(origin);
		fetchPlaceDetails(origin);
		if (destination) {
			fetchRoute(origin, destination);
		}
	}

	const handleSelectDestination = (destination) => {
		setDestination(destination);
		fetchPlaceDetails(destination);
		if (origin) {
			fetchRoute(origin, destination);
		}
	}
	
	const fetchRoute = (origin, destination) => {
		setLoading(true);
		return Promise.all([
			makeRoute(origin.description, destination.description, () => {}, { bikeOnly: true })
				.then((route) => {
					setBikeRoute(route);
				}),
			makeRoute(origin.description, destination.description, () => {}, { bikeOnly: false })
				.then((route) => {
					setMixedRoute(route);
				})
		]);
	}
	
	const fetchPlaceDetails = (option) => {
		return getPlaceDetails(option.place_id).then((results) => {
			setPlaceDetails({
				...placeDetails,
				[option.place_id]: results.result,
			});
		});
	}

	const selectedPlace = destination && placeDetails[destination.place_id] ? placeDetails[destination.place_id] : null;
	const markers = [];
	if (selectedPlace) {
		markers.push({
			name: selectedPlace.name,
			position: selectedPlace.geometry.location,
			title: selectedPlace.name,
		})
	}
	const selectedOrigin = origin && placeDetails[origin.place_id] ? placeDetails[origin.place_id] : null;
	if (selectedOrigin) {
		markers.push({
			name: selectedOrigin.name,
			position: selectedOrigin.geometry.location,
			title: selectedOrigin.name,
		})
	}

	const onBoundsChange = (center, zoom) => {
		setZoom(zoom);
		setCenter(center);
	}
	return (
		<div style={{ height: '90vh', width: '100%' }}>
			<Directions
				destination={destination}
				origin={origin}
				onSetOrigin={handleSelectOrigin}
				onSetDestination={handleSelectDestination}
				bikeRoute={bikeRoute}
				mixedRoute={mixedRoute}
				travelMode={travelMode}
				setTravelMode={setTravelMode}
			/>
			<GoogleMapsContainer
				center={center}
				zoom={zoom}
				markers={markers}
				travelMode={travelMode}
				bikeRoute={bikeRoute}
				mixedRoute={mixedRoute}
			/>
		</div>
	);
}

export default Home;
