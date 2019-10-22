import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
	const summary = route.routes[0].summary;
	const distance = route.routes[0].legs[0].distance.text;

	const summary = getSummary(route.routes[0], nextRoute, lastRoute, destination, isTransit);
	const distance = route.routes[0].legs[0].distance.text;

	return (
		<ExpansionPanel>
			<ExpansionPanelSummary
				expandIcon={<ExpandMoreIcon />}
			>
				<Typography variant="h5" component="h3">
					{icon} {summary} ({distance})
				</Typography>
			</ExpansionPanelSummary>
			<ExpansionPanelDetails>
				<Stepper activeStep={-1} orientation="vertical">
					{route.routes[0].legs[0].steps.map((step, i) =>
						<Step key={i}>
							<StepLabel>
								<span dangerouslySetInnerHTML={{ __html: step.html_instructions }} />
								<span> ({step.distance.text})</span>
							</StepLabel>
						</Step>
					)}
				</Stepper>
			</ExpansionPanelDetails>
		</ExpansionPanel>
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
