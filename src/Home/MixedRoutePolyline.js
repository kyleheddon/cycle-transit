import React  from 'react';
import { Polyline } from 'google-maps-react';
import TransitRoute from './TransitRoute';
import { getPolylinePath } from './util';

const MixedRoutePolyline = ({
	mixedRoute,
	google,
	...props,
}) => {
	const {
		firstBikeRoute,
		transitRoute,
		lastBikeRoute,
		stations,
	} = mixedRoute;

	const firstBikePath = getPolylinePath(google, firstBikeRoute);
	const transitPath = getPolylinePath(google, transitRoute);
	const lastBikePath = getPolylinePath(google, lastBikeRoute);

	return (
		<>
			<Polyline
				path={firstBikePath}
				strokeColor="#0000FF"
				strokeOpacity={0.8}
				strokeWeight={5}
				google={google}
				{...props}
			/>
			<TransitRoute
				route={transitRoute}
				google={google}
				{...props}
			/>
			<Polyline
				path={lastBikePath}
				strokeColor="#0000FF"
				strokeOpacity={0.8}
				strokeWeight={5}
				google={google}
				{...props}
			/>
		</>
	);
}

export default MixedRoutePolyline;