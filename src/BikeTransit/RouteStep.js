import React from 'react';
import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepIcon from '@material-ui/core/StepIcon';
import StepContent from '@material-ui/core/StepContent';
import StepButton from '@material-ui/core/StepButton';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import TrainIcon from '@material-ui/icons/Train';
import TripOriginIcon from '@material-ui/icons/TripOrigin';
import PlaceIcon from '@material-ui/icons/Place';
import { makeStyles } from '@material-ui/core/styles';
import { Transit } from '../constants/travel-modes';
import Map from './Map';

const RouteStep = ({
	isActive,
	label,
	icon,
	onClick,
	origin,
	destination,
	url,
	route,
	...props,
}) => {
	return (
		<Step {...props}>
			{isActive
				? (
					<StepLabel icon={icon}>
						{label}
					</StepLabel>
				)
				: (
					<StepButton icon={icon} onClick={onClick}>
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
}

export default RouteStep;