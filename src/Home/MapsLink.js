import React from 'react';
import Button from '@material-ui/core/Button';
import { getRouteMapUrl } from './util';

const openMaps = (route, travelMode) => () => {
	window.location = getRouteMapUrl(route, travelMode);
}

const MapsLink = ({
	route,
	travelMode,
	children,
}) => {
	return (
		<Button
			onClick={openMaps(route, travelMode)}
			color="primary"
		>
			{children}
		</Button>
	);
}

export default MapsLink;