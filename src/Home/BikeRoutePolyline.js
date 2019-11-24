import React  from 'react';
import { Polyline } from 'google-maps-react';
import { getPolylinePath } from './util';

const BikeRoutePolyline = ({
	bikeRoute,
	google,
	...props,
}) => {
	const path = getPolylinePath(google, bikeRoute);

	return (
		<Polyline
			path={path}
			strokeColor="#0000FF"
			strokeOpacity={0.8}
			strokeWeight={5}
			google={google}
			{...props}
		/>
	);
}

export default BikeRoutePolyline;