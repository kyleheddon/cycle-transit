import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/rootReducer';
import { ATLANTA_LOCATION } from '../constants';
import PlaceIcon from '@material-ui/icons/Place';
import { getPlaceDetails, makeRoute } from '../api';
import GoogleMapsContainer from './GoogleMapsContainer';
import Directions from './Directions';
import MapFrame from './MapFrame';
import PlaceDetails from './PlaceDetails';
import RouteDetails from './RouteDetails';
import {
	setOrigin,
	setDestination,
	setBikeRoute,
	setMixedRoute,
	setPlaceDetails,
	setTravelMode,
} from '../store/directionsSlice';
import {
	setBoundsNe,
	setBoundsSw,
} from '../store/mapSlice';

const Home = ({
	googleMapsApiKey,
}) => {
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const {
		origin,
		destination,
		bikeRoute,
		mixedRoute,
		placeDetails,
		travelMode,
	} = useSelector(state => state.directions);
	const {
		ne,
		sw,
	} = useSelector(state => state.map);
	
	useEffect(() => {
		const originDetails = getPlaceDetailsObj(origin, placeDetails);
		const destinationDetails = getPlaceDetailsObj(destination, placeDetails);
		if (originDetails && destinationDetails) {
			const title = `From ${originDetails.name} to ${destinationDetails.name}`;
			document.title = title;
		}
	}, [origin, destination, placeDetails]);

	const handleSelectOrigin = (origin) => {
		dispatch(setOrigin(origin));
		if (origin) {
			fetchPlaceDetails(origin);
			if (destination) {
				fetchRoutes(origin, destination);
			}
		} else {
			dispatch(setBikeRoute(null));
			dispatch(setMixedRoute(null));
		}
	}

	const handleSelectDestination = (destination) => {
		dispatch(setDestination(destination));
		if (destination) {
			fetchPlaceDetails(destination);
			if (origin) {
				fetchRoutes(origin, destination);
			}
		} else {
			dispatch(setBikeRoute(null));
			dispatch(setMixedRoute(null));
		}
	}

	const fetchRoutes = (origin, destination) => {
		setLoading(true);
		return Promise.all([
			makeRoute(origin.description, destination.description, () => {}, { bikeOnly: true })
				.then((route) => {
					dispatch(setBikeRoute(route));
				}),
			makeRoute(origin.description, destination.description, () => {}, { bikeOnly: false })
				.then((route) => {
					dispatch(setMixedRoute(route));
				})
		]);
	}

	const fetchPlaceDetails = (option) => {
		return getPlaceDetails(option.place_id).then((results) => {
			dispatch(setPlaceDetails({
				placeId: option.place_id,
				place: results.result,
			}));
		});
	}

	const selectedDestination = getPlaceDetailsObj(destination, placeDetails);
	const markers = [];
	if (selectedDestination) {
		markers.push({
			name: selectedDestination.name,
			position: selectedDestination.geometry.location,
			title: selectedDestination.name,
		})
	}
	const selectedOrigin = getPlaceDetailsObj(origin, placeDetails);
	if (selectedOrigin) {
		markers.push({
			name: selectedOrigin.name,
			position: selectedOrigin.geometry.location,
			title: selectedOrigin.name,
		})
	}

	const onBoundsChange = (bounds) => {
		dispatch(setBoundsNe(getLatLng(bounds.getNorthEast())))
		dispatch(setBoundsSw(getLatLng(bounds.getSouthWest())))
	};

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
					setTravelMode={(mode) => {
						dispatch(setTravelMode(mode));
					}}
				/>
			}
			main={
				<GoogleMapsContainer
					ne={ne}
					sw={sw}
					markers={markers}
					travelMode={travelMode}
					bikeRoute={bikeRoute}
					mixedRoute={mixedRoute}
					onBoundsChange={onBoundsChange}
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

function getLatLng(point) {
	return {
		lat: point.lat(),
		lng: point.lng(),
	}
}


function getPlaceDetailsObj(place, placeDetails) {
	return place && placeDetails[place.place_id] ? placeDetails[place.place_id] : null;
}

export default Home;
