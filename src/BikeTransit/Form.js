import React from 'react';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default ({
	onChange,
	origin,
	destination,
	onSubmit,
	loading,
	includeTransitMode,
}) => {
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
				<div>
					<FormControlLabel
						control={
							<Checkbox
								color="primary"
								onChange={(event) => {
									onChange({
										includeTransitMode: !includeTransitMode
									});
								}}
								checked={includeTransitMode}
							/>
						}
						label="Include transit mode"
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
					{loading && (
						<div>
							loading...
						</div>
					)}
					
				</div>
			</FormGroup>
		</form>
	);
}