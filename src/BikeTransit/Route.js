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
}) => {
	const classes = useStyles();

	return (
		<Paper className={classes.root}>
			<Typography variant="h5" component="h3">
				{icon} {route.routes[0].summary} ({route.routes[0].legs[0].distance.text})
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
