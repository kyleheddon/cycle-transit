import React, { forwardRef } from 'react';
import Typography from '@material-ui/core/Typography';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepIcon from '@material-ui/core/StepIcon';
import StepContent from '@material-ui/core/StepContent';
import StepButton from '@material-ui/core/StepButton';
import TripOriginIcon from '@material-ui/icons/TripOrigin';
import PlaceIcon from '@material-ui/icons/Place';
import Map from './Map';

const RouteStep = forwardRef(({
	isActive,
	label,
	icon,
	onClick,
	origin,
	destination,
	url,
	route,
	...props,
}, ref) => {
	const handleClick = () => {
		onClick(ref);
	}

	return (
		<Step {...props} ref={ref}>
			{isActive
				? (
					<StepLabel icon={icon}>
						{label}
					</StepLabel>
				)
				: (
					<StepButton icon={icon} onClick={handleClick}>
						{label}
					</StepButton>
				)
			}
			<StepContent>
				<Typography component="span">
					<TripOriginIcon fontSize="small" /> {origin}
					<br />
					<PlaceIcon fontSize="small"/> {destination}
				</Typography>
				<a href={url}>
					<Map route={route} />
				</a>
			</StepContent>
		</Step>
	);
});

export default RouteStep;