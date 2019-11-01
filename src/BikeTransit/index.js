import React, { useState, useCallback } from 'react';
import Form from './Form';
import RouteList from './RouteList';
import {
	makeRoute,
	locationAutoComplete,
	reverseGeocode,
} from './api';
import { Progress } from '../constants/route-progress';
import { debounce } from './util';

export default () => {
	const [formParams, setFormParams] = useState({
		origin: '',
		destination: '',
	});
	const [mixedRoute, setMixedRoute] = useState(null);
	const [bikeRoute, setBikeRoute] = useState(null);
	const [loading, setLoading] = useState(false);
	const [loadingStep, setLoadingStep] = useState(0);
	const [originOptions, setOriginOptions] = useState([]);
	const [destinationOptions, setDestinationOptions] = useState([]);
	const debounceOnTextInput = useCallback(debounce(onTextInput, 400), []);
	
	function onTextInput(key, value) {
		if (!value.trim()) {
			return;
		}
		locationAutoComplete(value.trim()).then((results) => {
			if (results.status !== 'OK') {
				return;
			}
			if (key === 'origin') {
				setOriginOptions(results.predictions);
			} else {
				setDestinationOptions(results.predictions);
			}
		})
	}
	
	function handleUseCurrentLocationClick() {
		window.navigator.geolocation.getCurrentPosition((position) => {
			const {
				latitude,
				longitude,
			} = position.coords;
			reverseGeocode(latitude, longitude).then((result) => {
				const {
					city,
					state,
					street,
				} = result;
				
				setFormParams({
					...formParams,
					origin: `${street}, ${city}, ${state}`,
				});
			});
		});
	}

	const {
		origin,
		destination,
		includeTransitMode,
	} = formParams;

	return (
		<>
			<Form
				origin={origin}
				originOptions={originOptions}
				destination={destination}
				destinationOptions={destinationOptions}
				loading={loading}
				loadingStep={loadingStep}
				bikeRoute={bikeRoute}
				mixedRoute={mixedRoute}
				onChange={(updates) => setFormParams({
					...formParams,
					...updates,
				})}
				onSelectOption={(key, value) => {
					setFormParams({
						...formParams,
						[key]: value,
					});
					if (key === 'origin') {
						setOriginOptions([]);
					} else {
						setDestinationOptions([]);
					}
				}}
				onTextInput={debounceOnTextInput}
				onSubmit={() => {
					setLoading(true);
					const onUpdate = () => {
						setLoadingStep(loadingStep + 1);
					}
					return Promise.all([
						makeRoute(origin, destination, onUpdate, { bikeOnly: true }).then((route) => {
							setBikeRoute(route);
						}),
						makeRoute(origin, destination, onUpdate, { bikeOnly: false }).then((route) => {
							setMixedRoute(route);
						})
					]);
				}}
				onUseCurrentLocationClick={handleUseCurrentLocationClick}
			/>
			{(() => {
				if (loading || bikeRoute && mixedRoute) {
					return (
						<RouteList
							bikeRoute={bikeRoute}
							mixedRoute={mixedRoute}
							origin={origin}
							destination={destination}
						/>
					);
				}
			})()}
		</>
	);
}