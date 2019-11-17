import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import NearMeIcon from '@material-ui/icons/NearMe';
import Typography from '@material-ui/core/Typography';
import TripOriginIcon from '@material-ui/icons/TripOrigin';
import PlaceIcon from '@material-ui/icons/Place';
import { Progress } from '../constants/route-progress';
import CircularProgress from '@material-ui/core/CircularProgress';
import LocationAutocomplete from './LocationAutocomplete';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	nearMeButton: {
		marginLeft: theme.spacing(1),
	},
}));

const Form = ({
	onChange,
	onTextInput,
	origin,
	originOptions,
	destinationOptions,
	onSelectOption,
	destination,
	onSubmit,
	loading,
	loadingStep,
	bikeRoute,
	mixedRoute,
	onUseCurrentLocationClick,
	loadingCurrentPosition,
}) => {
	if (loading || bikeRoute || mixedRoute) {
		return (
			<Typography variant="h5" component="h2">
				<TripOriginIcon /> {origin}
				<br />
				<PlaceIcon /> {destination}
			</Typography>
		);
	}
	
	const classes = useStyles();

	return (
		<form
			id="route_form"
			onSubmit={(event) => {
				event.preventDefault();
				onSubmit();
			}}
			autoComplete="disabled"
		>
			<FormGroup>
				<Grid container alignItems="flex-end">
					<Grid item xs>
						<LocationAutocomplete
							options={originOptions}
							onOptionChange={(option) => {
								onSelectOption('origin', option ? option.description : '');
							}}
							label="Origin"
							onChange={(value) => {
								onChange('origin', value);
								onTextInput('origin', value);
							}}
							value={origin}
							id="origin_autocomplete"
						/>
					</Grid>
					<Grid item>
						<Button
							aria-label="use current location"
							onClick={onUseCurrentLocationClick}
							color="primary"
							variant="contained"
							className={classes.nearMeButton}
						>
							
							{loadingCurrentPosition ? <CircularProgress color="white" size="1rem" /> : <NearMeIcon fontSize="small" />}
						</Button>
					</Grid>
				</Grid>
				<div>
					<LocationAutocomplete
						options={destinationOptions}
						onOptionChange={(option) => {
							onSelectOption('destination', option ? option.description : '');
						}}
						label="Destination"
						onChange={(value) => {
							onChange('destination', value);
							onTextInput('destination', value);
						}}
						id="destination_autocomplete"
						value={destination}
					/>
				</div>
				<div style={{ marginTop: '1rem' }}>
					<Button
						form="route_form"
						type="submit"
						variant="contained"
						disabled={!origin || !destination}
					>
						Route
					</Button>
				</div>
			</FormGroup>
		</form>
	);
}

export default Form;