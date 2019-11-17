import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import TrainIcon from '@material-ui/icons/Train';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import RouteSteps from './RouteSteps';

const useStyles = makeStyles(theme => ({
	card: {
		marginTop: theme.spacing(1),
	},
	summary: {
		paddingTop: theme.spacing(0.5),
		paddingBottom: theme.spacing(0),
	},
	arrivalTime: {
		marginLeft: theme.spacing(0.5),
		fontSize: '0.9rem',
	},
	duration: {
		marginLeft: theme.spacing(1),
		fontWeight: 700,
	},
	progress: {
		marginLeft: theme.spacing(1.75),
	},
}));


const MixedRouteCard = ({
	route,
	origin,
	destination,
}) => {
	const [activeStep, setActiveStep] = useState(-1);
	const classes = useStyles();
	const closeStepper = () => {
		setActiveStep(-1);
	}

	return (
		<ExpansionPanel
			className={classes.card}
			onChange={closeStepper}
		>
			<ExpansionPanelSummary
				className={classes.summary}
				expandIcon={route ? <ExpandMoreIcon /> : null}
			>
					<DirectionsBikeIcon />
					<AddIcon />
					<span title={route ? `${route.stations.origin} to ${route.stations.destination}` : ''}>
						<TrainIcon />
					</span>
					{(() => {
						if (!route) {
							return <CircularProgress
								className={classes.progress}
								color="inherit"
								size="1.75rem"
							/>;
						}

						return (
							<Typography component="span">
								<>
									<span className={classes.duration}>
										{route.duration}
									</span>
									<span className={classes.arrivalTime}>
										{route.arrivalTime}
									</span>
								</>
							</Typography>
						);
					})()}
			</ExpansionPanelSummary>
			{route && (
				<ExpansionPanelDetails>
					<RouteSteps
						route={route}
						origin={origin}
						destination={destination}
						activeStep={activeStep}
						setActiveStep={setActiveStep}
					/>
				</ExpansionPanelDetails>
			)}
		</ExpansionPanel>
	);
}

export default MixedRouteCard;