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
			<Route route={firstBikeRoute} nextRoute={transitRoute} icon={'🚲'} />
			<Route route={transitRoute} icon={'🚈'} isTransit={true} />
			<Route route={lastBikeRoute} lastRoute={transitRoute} destination={destination} icon={'🚲'} />
		</div>
	);
}