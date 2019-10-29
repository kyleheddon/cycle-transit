import React from 'react';
import BikeRouteCard from './BikeRouteCard';
import MixedRouteCard from './MixedRouteCard';

const RouteList = ({
	bikeRoute,
	mixedRoute,
	origin,
	destination,
}) => {

	return (
		<>
			<BikeRouteCard route={bikeRoute} />
			<MixedRouteCard
				route={mixedRoute}
				origin={origin}
				destination={destination}
			/>
		</>
	);
}

export default RouteList;