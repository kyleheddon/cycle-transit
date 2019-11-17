import React from 'react';

const Map = ({
	route,
}) => {
	const polyline = route.routes[0].overview_polyline.points;
	const markers = getMarkers(route);
	const key = "AIzaSyCe6EI5E5YOtMtdFmQvLsrt2SC--srIy-w";
	const url = `https://maps.googleapis.com/maps/api/staticmap
?key=${key}&size=400x400&path=color:red|weight:5|enc:${polyline}&markers=${markers}`;
	return (
		<img src={url} />
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