import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	img: {
		width: '100%',
	}
}));

const Map = ({
	route,
}) => {
	const classes = useStyles();

	const polyline = route.routes[0].overview_polyline.points;
	const markers = getMarkers(route);
	const url = `${route.image_base_url}&size=400x400&path=color:red|weight:5|enc:${polyline}&markers=${markers}`;
	return (
		<div>
			<img
				className={classes.img}
				src={url}
			/>
		</div>
	);
}

function getMarkers(route) {
	const { legs } = route.routes[0];
	const start = joinLatLng(legs[0].start_location);
	const end = joinLatLng(legs[legs.length - 1].end_location);

	return start + '|' + end;
}

function joinLatLng({ lat, lng }) {
	return lat + ',' + lng;
}

export default Map;