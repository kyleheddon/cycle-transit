import React from 'react';
const MODE_TRANSIT = 'transit';
const MODE_BICYCLING = 'bicycling';

export default ({
	route,
	icon,
}) => {
	return (
		<div>
			<h3><span style={{ fontSize: '2rem' }}>{icon}</span> {route.routes[0].summary} ({route.routes[0].legs[0].distance.text})</h3>
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

function travelModeEmoji(mode) {
	switch (mode.toLowerCase()) {
		case MODE_BICYCLING:
			return '🚲';
		case MODE_TRANSIT:
			return '🚋';
		default:
			return '⤳';
	}
}
