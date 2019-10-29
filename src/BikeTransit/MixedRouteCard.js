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
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import {
	Walking,
	Transit,
} from '../constants/travel-modes';

const useStyles = makeStyles(theme => ({
	card: {
		marginTop: theme.spacing(1),
	},
	summary: {
		paddingTop: theme.spacing(0.5),
		paddingBottom: theme.spacing(0),
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
	button: {
		textAlign: 'left',
	},
	progress: {
		marginLeft: theme.spacing(1.75),
	},
	stepper: {
		padding: 0,
		paddingLeft: theme.spacing(2)
	},
}));


const MixedRouteCard = ({
	route,
	origin,
	destination,
}) => {
	const [activeStep, setActiveStep] = useState(0);
	const classes = useStyles();

	return (
		<ExpansionPanel className={classes.card}>
			<ExpansionPanelSummary
				className={classes.summary}
				expandIcon={route ? <ExpandMoreIcon /> : null}
			>
					<DirectionsBikeIcon />
					<AddIcon />
					<span title={route ? `${route.stations.origin} to ${route.stations.destination}` : ''}>
						<TrainIcon />
					</span>
					{(() => {
						if (!route) {
							return <CircularProgress
								className={classes.progress}
								color="inherit"
								size="1.75rem"
							/>;
						}

						return (
							<Typography component="span">
								<>
									<span className={classes.duration}>
										{route.duration}
									</span>
									<span className={classes.arrivalTime}>
										{route.arrivalTime}
									</span>
								</>
							</Typography>
						);
					})()}
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
				const numStops = getNumberOfStops(transitRoute);
				const originStationLine = getLine(stations.origin, transitRoute);
				const destinationStationLine = getLine(stations.destination, transitRoute);
				
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
						<Stepper
							className={classes.stepper}
							activeStep={activeStep}
							orientation="vertical"
							nonLinear
						>
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
									<StepButton
										className={classes.button}
										onClick={openTab(origin, stations.origin, 'bicycling')}
									>
										<Typography component="span">
											<TripOriginIcon fontSize="small" /> {origin}
											<br />
											<PlaceIcon fontSize="small"/> {stations.origin}
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
									<StepButton
										className={classes.button}
										onClick={openTab(stations.origin, stations.destination, 'transit')}
									>
										<Typography component="span">
											<span title={`${originStationLine.name} Line`}>
												<TripOriginIcon fontSize="small" style={{ color: originStationLine.color }}/>
												<span> {stations.origin}</span>
											</span>
											<br />
											<span title={`${destinationStationLine.name} Line`}>
												<PlaceIcon fontSize="small" style={{ color: destinationStationLine.color }} />
												<span> {stations.destination}</span>
											</span>
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
									<StepButton
										className={classes.button}
										onClick={openTab(stations.destination, destination, 'bicycling')}
									>
										<Typography component="span">
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

function getLine(stationName, transitRoute) {
	const steps = getTransitSteps(transitRoute);
	for (let step of steps) {
		if (step.travel_mode !== Transit) {
			continue;
		}
		const {
			departure_stop,
			arrival_stop,
			line,
		} = step.transit_details;
		if (departure_stop.name === stationName || arrival_stop.name === stationName) {
			return line;
		}
	}

	return 'initial';
}

function getNumberOfStops(transitRoute) {
	const steps = getTransitSteps(transitRoute);
	
	return steps.reduce((numStops, step) => {
		if (step.travel_mode === Transit) {
			return numStops + step.transit_details.num_stops;
		}
		return numStops;
	}, 0);
}

function getTransitSteps(transitRoute) {
	return transitRoute.routes[0].legs[0].steps;
}

export default MixedRouteCard;