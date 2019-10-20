import React from 'react';
const MODE_TRANSIT = 'transit';
const MODE_BICYCLING = 'bicycling';

export default ({
	route,
	icon,
	isTransit,
	nextRoute,
	lastRoute,
	destination,
}) => {
	return (
		<div>
			<h3><span style={{ fontSize: '2rem' }}>{icon}</span> {getSummary(route.routes[0], nextRoute, lastRoute, destination, isTransit)} ({route.routes[0].legs[0].distance.text})</h3>
			<ol>
				{route.routes[0].legs[0].steps.map((step, i) =>
					<li key={i}>
						<span dangerouslySetInnerHTML={{ __html: step.html_instructions }} />
						<span> ({step.distance.text})</span>
					</li>
				)}
			</ol>
		</div>
	);
}

function getSummary(route, nextRoute, lastRoute, destination, isTransit) {
	if (isTransit) {
		try {
			const steps = route.legs[0].steps;
			const transitDetails = steps[steps.length - 1].transit_details;
			const start = transitDetails.departure_stop.name;
			const end = transitDetails.arrival_stop.name;

			return `${start} to ${end}`;
		} catch (e) {
			console.log(e);
			return route.summary;
		}
	} else if (nextRoute) {
		try {
			const steps = nextRoute.routes[0].legs[0].steps;
			const start = steps[steps.length - 1].transit_details.departure_stop.name;
			return `${route.summary} to ${start}`;
		} catch (e) {
			console.log(e);
			return route.summary;
		}
	} else if (lastRoute) {
		try {
			const steps = lastRoute.routes[0].legs[0].steps;
			const end = steps[steps.length - 1].transit_details.arrival_stop.name;
			return `${end} to ${destination} via ${route.summary}`;
		} catch (e) {
			console.log(e);
			return route.summary;
		}
	} else {
		return route.summary;
	}
}
