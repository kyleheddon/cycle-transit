import React from 'react';
import Route from './Route';

export default ({
	firstBikeRoute,
	bikeRoute,
	transitRoute,
	lastBikeRoute,
	arrivalTime,
	duration,
	origin,
	destination,
}) => {
	return (
		<div>
			<h2>From <u>{origin}</u> to <u>{destination}</u></h2>
			<div>Arrival Time: <b>{arrivalTime}</b> ({duration})</div>
			<Route route={firstBikeRoute} icon={'🚲'} />
			<Route route={transitRoute} icon={'🚈'} />
			<Route route={lastBikeRoute} icon={'🚲'} />
		</div>
	);
}