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
	const key = "AIzaSyCe6EI5E5YOtMtdFmQvLsrt2SC--srIy-w";
	const url = `https://maps.googleapis.com/maps/api/staticmap
?key=${key}&size=400x400&path=color:red|weight:5|enc:${polyline}&markers=${markers}`;
	return <img
		className={classes.img}
		src={url}
	/>;
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