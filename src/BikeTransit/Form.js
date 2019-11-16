import React, { useState } from 'react';
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
import { blue, } from '@material-ui/core/colors';

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
	const [value, setValue] = useState('');
	if (loading || bikeRoute || mixedRoute) {
		return (
			<Typography variant="h5" component="h2">
				<TripOriginIcon /> {origin}
				<br />
				<PlaceIcon /> {destination}
			</Typography>
		);
	}

	return (
		<form
			id="route_form"
			onSubmit={(event) => {
				event.preventDefault();
				onSubmit();
			}}
		>
			<FormGroup>
				<div>
					<LocationAutocomplete
						getOptionLabel={option => option.description}
						options={originOptions}
						onOptionChange={(option) => {
							onSelectOption('origin', option ? option.description : '');
						}}
						label="Origin"
						onChange={(value) => {
							onChange('origin', value);
							onTextInput('origin', value);
						}}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label="use current location"
									onClick={onUseCurrentLocationClick}
									style={{ color: blue[600] }}
								>
									{loadingCurrentPosition ? <CircularProgress size="1rem" /> : <NearMeIcon />}
								</IconButton>
							</InputAdornment>
						}
					/>
				</div>
				<div>
					<LocationAutocomplete
						getOptionLabel={option => option.description}
						options={destinationOptions}
						onOptionChange={(option) => {
							onSelectOption('destination', option ? option.description : '');
						}}
						label="Destination"
						onChange={(value) => {
							onChange('destination', value);
							onTextInput('destination', value);
						}}
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