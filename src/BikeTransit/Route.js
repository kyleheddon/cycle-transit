import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
const MODE_TRANSIT = 'transit';
const MODE_BICYCLING = 'bicycling';

const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(3, 2),
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
}));

export default ({
	route,
	icon,
	isTransit,
	nextRoute,
	lastRoute,
	destination,
}) => {
	const classes = useStyles();

	const summary = getSummary(route.routes[0], nextRoute, lastRoute, destination, isTransit);
	const distance = route.routes[0].legs[0].distance.text;

	return (
		<Paper className={classes.root}>
			<Typography variant="h5" component="h3">
				{icon} {summary} ({distance})
			</Typography>
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
		</Paper>
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
