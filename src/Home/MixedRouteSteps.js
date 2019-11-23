import React from 'react';
import Typography from '@material-ui/core/Typography';
import TripOriginIcon from '@material-ui/icons/TripOrigin';
import PlaceIcon from '@material-ui/icons/Place';

const MixedRouteSteps = ({
	route,
}) => {
	const {
		firstBikeRoute,
		transitRoute,
		lastBikeRoute,
		stations,
	} = route;
	return (
		<>
			<div>All the steps</div>
		</>
	);
}

export default MixedRouteSteps;