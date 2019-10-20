import React, { useState, Fragment } from 'react';
import Form from './Form';
import Route from './Route';
import RoutePreview from './RoutePreview';
import { makeRoute } from './api';
import { Progress } from '../constants/route-progress';

export default () => {
	const [formParams, setFormParams] = useState({
		origin: 'Willow Lane, Decatur',
		destination: 'Ponce City Market',
	});
	const [route, setRoute] = useState(null);
	const [loading, setLoading] = useState(false);
	const [loadingStep, setLoadingStep] = useState(0);

	const {
		origin,
		destination,
		includeTransitMode,
	} = formParams;

	if (route === null) {
		return (
			<Fragment>
				<Form
					origin={origin}
					destination={destination}
					loading={loading}
					loadingStep={loadingStep}
					onChange={(updates) => setFormParams({
						...formParams,
						...updates,
					})}
					onSubmit={() => {
						setLoading(true);
						const onUpdate = ({ status }) => {
							const step = Progress.indexOf(status);
							if (step > -1) {
								setLoadingStep();
							}
						}
						makeRoute(origin, destination, onUpdate).then((route) => {
							setRoute(route);
							setLoading(false);
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