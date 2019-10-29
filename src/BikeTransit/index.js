import React, { useState, Fragment } from 'react';
import Form from './Form';
import RouteList from './RouteList';
import { makeRoute } from './api';
import { Progress } from '../constants/route-progress';

export default () => {
	const [formParams, setFormParams] = useState({
		origin: 'Willow Lane, Decatur',
		destination: 'Ponce City Market',
	});
	const [mixedRoute, setMixedRoute] = useState(null);
	const [bikeRoute, setBikeRoute] = useState(null);
	const [loading, setLoading] = useState(false);
	const [loadingStep, setLoadingStep] = useState(0);

	const {
		origin,
		destination,
		includeTransitMode,
	} = formParams;

	return (
		<>
			<Form
				origin={origin}
				destination={destination}
				loading={loading}
				loadingStep={loadingStep}
				bikeRoute={bikeRoute}
				mixedRoute={mixedRoute}
				onChange={(updates) => setFormParams({
					...formParams,
					...updates,
				})}
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