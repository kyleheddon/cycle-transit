import React, { useState } from 'react';
import { ATLANTA_LOCATION } from '../constants';
import SearchBar from './SearchBar';
import PlaceIcon from '@material-ui/icons/Place';
import { getPlaceDetails } from '../api';
import { makeRoute } from '../BikeTransit/api';
import GoogleMapsContainer from './GoogleMapsContainer';
import Directions from './Directions';
import MapFrame from './MapFrame';
import PlaceDetails from './PlaceDetails';
import RouteDetails from './RouteDetails';

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
		if (origin) {
			fetchPlaceDetails(origin);
			if (destination) {
				fetchRoutes(origin, destination);
			}
		}
	}

	const handleSelectDestination = (destination) => {
		setDestination(destination);
		if (destination) {
			fetchPlaceDetails(destination);
			if (origin) {
				fetchRoutes(origin, destination);
			}
		}
	}
	
	const fetchRoutes = (origin, destination) => {
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

	const selectedDestination = destination && placeDetails[destination.place_id] ? placeDetails[destination.place_id] : null;
	const markers = [];
	if (selectedDestination) {
		markers.push({
			name: selectedDestination.name,
			position: selectedDestination.geometry.location,
			title: selectedDestination.name,
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
		<MapFrame
			header={
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
			}
			main={
				<GoogleMapsContainer
					center={center}
					zoom={zoom}
					markers={markers}
					travelMode={travelMode}
					bikeRoute={bikeRoute}
					mixedRoute={mixedRoute}
				/>
			}
			footer={(() => {
				if (selectedOrigin && selectedDestination) {
					return <RouteDetails
						bikeRoute={bikeRoute}
						mixedRoute={mixedRoute}
						travelMode={travelMode}
					/>;
				}

				const place = selectedOrigin || selectedDestination;
				if (place) {
					return <PlaceDetails place={place} />;
				}
				return null;
			})()}
		/>
	);
}

export default Home;
