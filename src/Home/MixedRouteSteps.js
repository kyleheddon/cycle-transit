import React from 'react';
import Typography from '@material-ui/core/Typography';
import MapsLink from './MapsLink';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import TrainIcon from '@material-ui/icons/Train';

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
			<div>
				<DirectionsBikeIcon />
				<MapsLink route={firstBikeRoute} travelMode="bicycling">
					{firstBikeRoute.routes[0].summary}
				</MapsLink>
			</div>
			<div>
				<TrainIcon />
				<MapsLink route={transitRoute} travelMode="transit" >
					Marta
				</MapsLink>
			</div>
			<div>
				<DirectionsBikeIcon />
				<MapsLink route={lastBikeRoute} travelMode="bicycling" >
					{lastBikeRoute.routes[0].summary}
				</MapsLink>
			</div>
		</>
	);
}

export default MixedRouteSteps;