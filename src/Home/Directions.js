import React, { useState } from 'react';
import DebouncedLocationAutocomplete from './DebouncedLocationAutocomplete';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import NavigationIcon from '@material-ui/icons/Navigation';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import TrainIcon from '@material-ui/icons/Train';
import AddIcon from '@material-ui/icons/Add';
import TravelMode from './TravelMode';

// TODO: use current location
const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(0, 1),
		backgroundColor: 'white',
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
			<div position="static" className={classes.root}>
				<DebouncedLocationAutocomplete
					label="Origin"
					id="origin_autocomplete"
					onSelectOption={onSetOrigin}
					selectedOption={origin}
					canSelectUserLocation
				/>
				<DebouncedLocationAutocomplete
					label="Destination"
					id="destination_autocomplete"
					onSelectOption={onSetDestination}
					selectedOption={destination}
				/>
				{(() => {
					if (!bikeRoute && !mixedRoute) {
						return null;
					}

					const bikeDuration = bikeRoute ? bikeRoute.routes[0].legs[0].duration.text : '';
					const mixedDuration = mixedRoute ? mixedRoute.duration : '';
					const noop = () => {};

					return (
						<div>
							<TravelMode
								icon={
									<DirectionsBikeIcon className={classes.extendedIcon} />
								}
								text={bikeDuration}
								isSelected={travelMode === 'bike'}
								onClick={bikeRoute ? handleTravelModeClick('bike') : noop}
							/>
							<TravelMode
								icon={
									<span>
										<DirectionsBikeIcon />
										<AddIcon />
										<TrainIcon className={classes.extendedIcon} />
									</span>
								}
								text={mixedDuration}
								isSelected={travelMode === 'mixed'}
								onClick={mixedRoute ? handleTravelModeClick('mixed') : noop}
							/>
						</div>
					);
				})()}
			</div>
		</>
	);
}

export default Directions;