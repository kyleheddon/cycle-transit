import React, { forwardRef } from 'react';
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
import { red } from '@material-ui/core/colors';
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


const MixedRouteCard = forwardRef(({
	route,
	origin,
	destination,
	isExpanded,
	onToggle,
	activeStep,
	setActiveStep,
	error,
}, ref) => {
	const classes = useStyles();
	
	const onChange = (event, isExpanded) => {
		onToggle(event, isExpanded, ref);
	}

	return (
		<ExpansionPanel
			className={classes.card}
			onChange={onChange}
			expanded={isExpanded}
		>
			<ExpansionPanelSummary
				className={classes.summary}
				expandIcon={route ? <ExpandMoreIcon /> : null}
			>
				<div ref={ref}>
					<DirectionsBikeIcon />
					<AddIcon />
					<span title={route ? `${route.stations.origin} to ${route.stations.destination}` : ''}>
						<TrainIcon />
					</span>
					{(() => {
						if (error) {
							return <b style={{ color: red[500], marginLeft: '1rem ' }}>{error}</b>;
						} else if (!route) {
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
				</div>
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
});

export default MixedRouteCard;