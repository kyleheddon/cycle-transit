import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import DebouncedLocationAutocomplete from './DebouncedLocationAutocomplete';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import NavigationIcon from '@material-ui/icons/Navigation';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import TrainIcon from '@material-ui/icons/Train';
import AddIcon from '@material-ui/icons/Add';
import TravelMode from './TravelMode';

const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(0, 1),
		color: 'white',
	},
	margin: {
		margin: theme.spacing(1),
	},
	fab: {
		margin: theme.spacing(1),
		backgroundColor: 'white',
	},
	white: {
		color: 'white',
	},
	extendedIcon: {
		marginRight: theme.spacing(1),
	},
	blackText: {
		color: 'lightblue',
	}
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
			<AppBar position="static" className={classes.root}>
				<DebouncedLocationAutocomplete
					label="Origin"
					id="origin_autocomplete"
					onSelectOption={onSetOrigin}
					selectedOption={origin}
				/>
				<DebouncedLocationAutocomplete
					label="Destination"
					id="destination_autocomplete"
					onSelectOption={onSetDestination}
					selectedOption={destination}
				/>
				{(() => {
					if (!bikeRoute || !mixedRoute) {
						return;
					}

					const bikeDuration = bikeRoute.routes[0].legs[0].duration.text;
					const mixedDuration = mixedRoute.duration;

					return (
						<div>
							<TravelMode
								icon={
									<DirectionsBikeIcon className={classes.extendedIcon} />
								}
								text={bikeDuration}
								isSelected={travelMode === 'bike'}
								onClick={handleTravelModeClick('bike')}
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
								onClick={handleTravelModeClick('mixed')}
							/>
						</div>
					);
				})()}
			</AppBar>
		</>
	);
}

export default Directions;