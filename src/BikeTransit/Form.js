import React from 'react';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import NearMeIcon from '@material-ui/icons/NearMe';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TripOriginIcon from '@material-ui/icons/TripOrigin';
import PlaceIcon from '@material-ui/icons/Place';
import { Progress } from '../constants/route-progress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

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
					<TextField
						type="text"
						value={origin}
						label="Origin"
						disabled={loading}
						fullWidth
						onChange={(event) => {
							const { value } = event.target;
							onChange({
								origin: value,
							});
							onTextInput('origin', value);
						}}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="use current location"
										onClick={onUseCurrentLocationClick}
									>
										<NearMeIcon />
									</IconButton>
								</InputAdornment>
							)
						}}
					/>
					<List>
						{originOptions.map(option => (
							<ListItem
								key={option.id}
								button
								onClick={() => {
									onSelectOption('origin', option.description);
								}}
							>
								{option.description}
							</ListItem>
						))}
					</List>
				</div>
				<div>
					<TextField
						type="text"
						value={destination}
						label="Destination"
						fullWidth
						onChange={(event) => {
							const { value } = event.target;
							onChange({
								destination: value,
							});
							onTextInput('destination', value);
						}}
					/>
				
					<List>
						{destinationOptions.map(option => (
							<ListItem
								key={option.id}
								button
								onClick={() => {
									onSelectOption('destination', option.description);
								}}
							>
								{option.description}
							</ListItem>
						))}
					</List>
				</div>
				<div style={{ marginTop: '1rem' }}>
					<Button
						form="route_form"
						type="submit"
						variant="contained"
					>
						Route
					</Button>
				</div>
			</FormGroup>
		</form>
	);
}

export default Form;