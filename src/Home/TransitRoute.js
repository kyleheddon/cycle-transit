import React  from 'react';
import { Polyline } from 'google-maps-react';
import { getPolylinePath } from './util';
import { Walking, Transit } from '../constants/travel-modes';

const TransitRoute = ({
	route,
	google,
	...props,
}) => {
	return route.routes[0].legs[0].steps
		.filter(step => step.travel_mode === Transit)
		.map((step) => {
			const path = google.maps.geometry.encoding.decodePath(step.polyline.points);
			const color = step.transit_details.line.color;
			return (
				<Polyline
					key={step.polyline.points}
					path={path}
					strokeColor={color}
					strokeOpacity={0.9}
					strokeWeight={7}
					google={google}
					{...props}
				/>
			);
		});
}

export default TransitRoute;