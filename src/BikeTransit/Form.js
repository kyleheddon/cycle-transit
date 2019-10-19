import React from 'react';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Progress } from '../constants/route-progress';

export default ({
	onChange,
	origin,
	destination,
	onSubmit,
	loading,
	loadingStep,
}) => {
	const loadingProgress = ((loadingStep + 1) / Progress.length) * 100;

	return (
		<React.Fragment>
			{(loading &&
				<LinearProgress variant="determinate" value={loadingProgress} />
			)}
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
		</React.Fragment>
	);
}