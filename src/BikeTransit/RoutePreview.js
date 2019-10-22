import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Route from './Route';

const useStyles = makeStyles(theme => ({
	root: {
		marginTop: theme.spacing(1),
	},
}));

export default ({
	firstBikeRoute,
	bikeRoute,
	transitRoute,
	lastBikeRoute,
	arrivalTime,
	duration,
	origin,
	destination,
}) => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Typography variant="h4" component="h2">
				From <u>{origin}</u> to <u>{destination}</u>
			</Typography>
			<p>
				Arrival Time: <b>{arrivalTime}</b> ({duration})
			</p>
			<Route route={firstBikeRoute} nextRoute={transitRoute} icon={'🚲'} />
			<Route route={transitRoute} icon={'🚈'} isTransit={true} />
			<Route route={lastBikeRoute} lastRoute={transitRoute} destination={destination} icon={'🚲'} />
		</div>
	);
}