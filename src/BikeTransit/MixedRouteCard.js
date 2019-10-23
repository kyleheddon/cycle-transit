import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepIcon from '@material-ui/core/StepIcon';
import StepContent from '@material-ui/core/StepContent';
import StepButton from '@material-ui/core/StepButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import TrainIcon from '@material-ui/icons/Train';
import TripOriginIcon from '@material-ui/icons/TripOrigin';
import PlaceIcon from '@material-ui/icons/Place';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	card: {
		marginTop: theme.spacing(1),
	},
	distance: {
		marginLeft: theme.spacing(0.5),
		fontSize: '0.75rem',
	},
	arrivalTime: {
		marginLeft: theme.spacing(0.5),
		fontSize: '0.9rem',
	},
	duration: {
		marginLeft: theme.spacing(1),
		fontWeight: 700,
	},
}));


const MixedRouteCard = ({
	route,
	origin,
	destination,
}) => {
	const [activeStep, setActiveStep] = useState(0);
	const classes = useStyles();
	let duration, distance, arrivalTime, iconTitle, onClick;

	if (route) {
		duration = route.duration;
		arrivalTime = route.arrivalTime;
		iconTitle = `${route.stations.origin} to ${route.stations.destination}`;
	}

	return (
		<ExpansionPanel>
			<ExpansionPanelSummary
				expandIcon={route ? <ExpandMoreIcon /> : null}
			>
				<Typography>
					<>
						<>
							<DirectionsBikeIcon />
							<span title={iconTitle}>
								<TrainIcon />
							</span>
						</>
						<span className={classes.duration}>{duration}</span>
						<span className={classes.arrivalTime}>{arrivalTime}</span>
						{distance
							? <span className={classes.distance}>({distance})</span>
							: null
						}
					</>
				</Typography>
			</ExpansionPanelSummary>
			{(() => {
				if (!route) {
					return null;
				}
				
				const {
					firstBikeRoute,
					transitRoute,
					lastBikeRoute,
					stations,
				} = route;
				
				const firstBikeRouteLeg = firstBikeRoute.routes[0].legs[0];
				const lastBikeRouteLeg = lastBikeRoute.routes[0].legs[0];
				const numStops = 6;
				
				const handleStep = (step) => () => {
					setActiveStep(step);
				}
				
				const openTab = (origin, destination, travelMode) => () => {
					const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${travelMode}`;

					const win = window.open(url, '_blank');
					win.focus();
				}

				return (
					<ExpansionPanelDetails>
						<Stepper activeStep={activeStep} orientation="vertical" nonLinear>
							<Step>
								
								{activeStep === 0
									? (
										<StepLabel icon={<DirectionsBikeIcon />}>
											{firstBikeRouteLeg.distance.text}
										</StepLabel>
									)
									: (
										<StepButton icon={<DirectionsBikeIcon />} onClick={handleStep(0)}>
											{firstBikeRouteLeg.distance.text}
										</StepButton>
									)
								}
								<StepContent>
									<StepButton onClick={openTab(origin, stations.origin, 'bicycling')}>
										<Typography>
											<TripOriginIcon fontSize="small" /> {origin}
											<br />
											<PlaceIcon fontSize="small" /> {stations.origin}
										</Typography>
									</StepButton>
								</StepContent>
							</Step>
							<Step>
								{activeStep === 1
									? (
										<StepLabel icon={<TrainIcon />}>
											{numStops} stops
										</StepLabel>
									)
									: (
										<StepButton icon={<TrainIcon />} onClick={handleStep(1)}>
											{numStops} stops
										</StepButton>
									)
								}
								<StepContent>
									<StepButton onClick={openTab(stations.origin, stations.destination, 'transit')}>
										<Typography>
											<TripOriginIcon fontSize="small" /> {stations.origin}
											<br />
											<PlaceIcon fontSize="small" /> {stations.destination}
										</Typography>
									</StepButton>
								</StepContent>
							</Step>
							<Step>
								{activeStep === 2
									? (
										<StepLabel icon={<DirectionsBikeIcon />}>
											{lastBikeRouteLeg.distance.text}
										</StepLabel>
									)
									: (
										<StepButton icon={<DirectionsBikeIcon />} onClick={handleStep(2)}>
											{lastBikeRouteLeg.distance.text}
										</StepButton>
									)
								}
								<StepContent>
									<StepButton onClick={openTab(stations.destination, destination, 'bicycling')}>
										<Typography>
											<TripOriginIcon fontSize="small" /> {stations.destination}
											<br />
											<PlaceIcon fontSize="small" /> {destination}
										</Typography>
									</StepButton>
								</StepContent>
							</Step>
						</Stepper>
					</ExpansionPanelDetails>
				);
			})()}
		</ExpansionPanel>
	);
}

export default MixedRouteCard;