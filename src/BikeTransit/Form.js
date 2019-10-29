import React from 'react';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TripOriginIcon from '@material-ui/icons/TripOrigin';
import PlaceIcon from '@material-ui/icons/Place';
import { Progress } from '../constants/route-progress';

export default ({
	onChange,
	origin,
	destination,
	onSubmit,
	loading,
	loadingStep,
	bikeRoute,
	mixedRoute,
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
						onChange={(event) => onChange({
							origin: event.target.value,
						})}
					/>
				</div>
				<div>
					<TextField
						type="text"
						value={destination}
						label="Destination"
						onChange={(event) => onChange({
							destination: event.target.value,
						})}
					/>
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