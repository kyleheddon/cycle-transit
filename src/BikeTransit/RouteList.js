import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import TrainIcon from '@material-ui/icons/Train';
import RouteCard from './RouteCard';

const RouteList = ({
	bikeRoute,
	mixedRoute,
}) => {
	let bikeRouteDuration, bikeRouteDistance, bikeRouteArrivalTime;
	let mixedRouteDuration, mixedRouteDistance, mixedRouteArrivalTime;
	
	if (bikeRoute) {
		const bikeRouteLeg = bikeRoute.routes[0].legs[0];
		bikeRouteDuration = bikeRouteLeg.duration.text;
		bikeRouteDistance = bikeRouteLeg.distance.text;
		bikeRouteArrivalTime = bikeRoute.arrivalTime;
	}
	
	if (mixedRoute) {
		mixedRouteDuration = mixedRoute.duration;
		mixedRouteArrivalTime = mixedRoute.arrivalTime;
	}

	return (
		<>
			<RouteCard
				distance={bikeRouteDistance}
				duration={bikeRouteDuration}
				arrivalTime={bikeRouteArrivalTime}
				icon={<DirectionsBikeIcon />}
			/>
			<RouteCard
				duration={mixedRouteDuration}
				arrivalTime={mixedRouteArrivalTime}
				icon={
					<>
						<DirectionsBikeIcon />
						<TrainIcon />
					</>
				}
			/>
		</>
	);
}

export default RouteList;