import React, { useState, Fragment } from 'react';
import Form from './Form';
import Route from './Route';
import RoutePreview from './RoutePreview';
import { makeRoute, makeRouteV2 } from './api';

export default () => {
	const [state, setState] = useState({
		showForm: true,
		origin: '417 Willow Decatur',
		destination: 'Derry Ave Atlanta',
		includeTransitMode: true,
		loading: false,
		route: null,
	});
	
	const {
		showForm,
		origin,
		destination,
		loading,
		route,
		includeTransitMode,
	} = state;

	if (route === null) {
		return (
			<Fragment>
				<Form
					origin={origin}
					destination={destination}
					includeTransitMode={includeTransitMode}
					loading={loading}
					onChange={(updates) => setState({
						...state,
						...updates,
					})}
					onSubmit={() => {
						setState({
							...state,
							loading: true,
						});
						
						makeRouteV2(origin, destination, { includeTransitMode }).then((route) => {
							setState({
								...state,
								route,
								loading: false,
							});
						});
					}}
				/>
			</Fragment>
		);
	} else {
		return (
			<RoutePreview
				{...route}
				includeTransitMode={includeTransitMode}
				origin={origin}
				destination={destination}
			/>
		);
	}
}