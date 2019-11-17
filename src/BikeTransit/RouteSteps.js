import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepIcon from '@material-ui/core/StepIcon';
import StepContent from '@material-ui/core/StepContent';
import StepButton from '@material-ui/core/StepButton';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import TrainIcon from '@material-ui/icons/Train';
import TripOriginIcon from '@material-ui/icons/TripOrigin';
import PlaceIcon from '@material-ui/icons/Place';
import { makeStyles } from '@material-ui/core/styles';
import { Transit } from '../constants/travel-modes';
import Map from './Map';
import RouteStep from './RouteStep';

const useStyles = makeStyles(theme => ({
	button: {
		textAlign: 'left',
	},
	stepper: {
		padding: 0,
		paddingLeft: theme.spacing(2)
	},
}));

const RouteSteps = ({
	route,
	origin,
	destination,
}) => {
	const [activeStep, setActiveStep] = useState(0);
	const classes = useStyles();

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

	const handleStep = (step) => () => {
		setActiveStep(step);
	}

	return (
		<Stepper
			className={classes.stepper}
			activeStep={activeStep}
			orientation="vertical"
			nonLinear
		>
			<RouteStep
				isActive={activeStep === 0}
				label={firstBikeRouteLeg.distance.text}
				onClick={handleStep(0)}
				icon={<DirectionsBikeIcon />}
				origin={origin}
				destination={stations.origin}
				url={routeUrl(origin, stations.origin, 'bicycling')}
				route={firstBikeRoute}
			/>
			<RouteStep
				isActive={activeStep === 1}
				icon={<TrainIcon />}
				label={`${numStops} stops`}
				onClick={handleStep(1)}
				origin={stations.origin}
				destination={stations.destination}
				url={routeUrl(stations.origin, stations.destination, 'transit')}
				route={transitRoute}
			/>
			<RouteStep
				isActive={activeStep === 2}
				icon={<DirectionsBikeIcon />}
				label={lastBikeRouteLeg.distance.text}
				onClick={handleStep(2)}
				origin={stations.destination}
				destination={destination}
				url={routeUrl(stations.destination, destination, 'bicycling')}
				route={lastBikeRoute}
			/>
		</Stepper>
	);
}

function routeUrl(origin, destination, travelMode) {
	return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${travelMode}`;
}

function getTransitSteps(transitRoute) {
	return transitRoute.routes[0].legs[0].steps;
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

export default RouteSteps;