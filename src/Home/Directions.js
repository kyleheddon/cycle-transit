import React from 'react';
import DebouncedLocationAutocomplete from './DebouncedLocationAutocomplete';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import NavigationIcon from '@material-ui/icons/Navigation';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import TrainIcon from '@material-ui/icons/Train';
import TravelMode from './TravelMode';

const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(0, 1),
		backgroundColor: '#4285F4',
		color: 'white',
		'& input, & .MuiAutocomplete-root': {
			color: 'white',
			backgroundColor: '#5E97F6',
		},
		'& input': {
			marginLeft: theme.spacing(1),
		},
		'& .MuiInput-underline:before': {
			borderBottom: 'none !important',
		},
	},
	marginBottom: {
		marginBottom: theme.spacing(1),
	},
	padding: {
		padding: theme.spacing(1, 1),
	},
	paddingBottom: {
		paddingBottom: theme.spacing(1),
	},
	extendedIcon: {
		marginRight: theme.spacing(1),
	},
}));

const Directions = ({
	origin,
	destination,
	onSetOrigin,
	onSetDestination,
	bikeRoute,
	mixedRoute,
	travelMode,
	setTravelMode,
}) => {
	const classes = useStyles();

	const handleTravelModeClick = (mode) => () => {
		setTravelMode(mode);
	}

	return (
		<>
			<div className={classes.root}>
				<div className={classes.padding}>
					<div className={classes.marginBottom}>
						<DebouncedLocationAutocomplete
							placeholder="Choose starting point"
							id="origin_autocomplete"
							onSelectOption={onSetOrigin}
							selectedOption={origin}
							canSelectUserLocation
						/>
					</div>
					<div>
						<DebouncedLocationAutocomplete
							placeholder="Choose destination"
							id="destination_autocomplete"
							onSelectOption={onSetDestination}
							selectedOption={destination}
						/>
					</div>
				</div>
				{(() => {
					if (!bikeRoute && !mixedRoute) {
						return null;
					}

					const bikeDuration = bikeRoute ? bikeRoute.routes[0].legs[0].duration.text : '';
					const mixedDuration = mixedRoute ? mixedRoute.duration : '';
					const noop = () => {};

					return (
						<Grid container alignItems="center" className={classes.paddingBottom}>
							<Grid item xs={6}>
								<TravelMode
									icon={
										<DirectionsBikeIcon className={classes.extendedIcon} />
									}
									text={bikeDuration}
									isSelected={travelMode === 'bike'}
									onClick={bikeRoute ? handleTravelModeClick('bike') : noop}
								/>
							</Grid>
							<Grid item xs={6}>
								<TravelMode
									icon={
										<>
											<DirectionsBikeIcon />
											<TrainIcon className={classes.extendedIcon} />
										</>
									}
									text={mixedDuration}
									isSelected={travelMode === 'mixed'}
									onClick={mixedRoute ? handleTravelModeClick('mixed') : noop}
								/>
							</Grid>
						</Grid>
					);
				})()}
			</div>
		</>
	);
}

export default Directions;