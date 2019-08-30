import React, { Fragment } from 'react';
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
	includeTransitMode,
}) => {
	return (
		<div>
			<h2>From <u>{origin}</u> to <u>{destination}</u></h2>
				<Fragment>
					{includeTransitMode ? (
						<Fragment>
							<div>Arrival Time: <b>{arrivalTime}</b> ({duration})</div>
							<Route route={firstBikeRoute} icon={'🚲'} />
							<Route route={transitRoute} icon={'🚈'} />
							<Route route={lastBikeRoute} icon={'🚲'} />
						</Fragment>
					) : (
						<Fragment>
							<div>Arrival Time: <b></b> ({bikeRoute.routes[0].legs[0].duration.text})</div>
							<Route route={bikeRoute} icon={'🚲'} />
						</Fragment>
					)}
				</Fragment>
			
		</div>
	);
}