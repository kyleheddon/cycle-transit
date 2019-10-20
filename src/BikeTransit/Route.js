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
}) => {
	const summary = route.routes[0].summary;
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
