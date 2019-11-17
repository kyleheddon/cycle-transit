import React, { forwardRef } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Map from './Map';

const useStyles = makeStyles(theme => ({
	card: {
		marginTop: theme.spacing(1),
	},
	summary: {
		paddingTop: theme.spacing(0.5),
		paddingBottom: theme.spacing(0),
	},
	duration: {
		marginLeft: theme.spacing(1),
		fontWeight: 700,
	},
	arrivalTime: {
		marginLeft: theme.spacing(0.5),
		fontSize: '0.9rem',
	},
	progress: {
		marginLeft: theme.spacing(1.75),
	},
	distance: {
		marginLeft: theme.spacing(0.5),
		fontSize: '0.75rem',
	},
}));

const BikeRouteCard = forwardRef(({
	route,
	isExpanded,
	onToggle,
}, ref) => {
	const classes = useStyles();
	
	const onChange = (event, isExpanded) => {
		onToggle(event, isExpanded, ref);
	}

	return (
		<ExpansionPanel
			className={classes.card}
			expanded={isExpanded}
			onChange={onChange}
		>
			<ExpansionPanelSummary
				className={classes.summary}
				expandIcon={route ? <ExpandMoreIcon /> : null}
			>
				<span ref={ref}>
					<DirectionsBikeIcon />
					{(() => {
						if (!route) {
							return <CircularProgress
								className={classes.progress}
								color="inherit"
								size="1.75rem"
							/>;
						}

						const leg = route.routes[0].legs[0];
						const duration = leg.duration.text;
						const distance = leg.distance.text;
						const arrivalTime = route.arrivalTime;
						
						return (
							<Typography component="span">
								<>
									<span className={classes.duration}>{duration}</span>
									<span className={classes.arrivalTime}>{arrivalTime}</span>
									<span className={classes.distance}>({distance})</span>
								</>
							</Typography>
						);
					})()}
				</span>
			</ExpansionPanelSummary>
			{route && (
				<ExpansionPanelDetails>
					<a href={getUrl(route)}>
						<Map route={route} />
					</a>
				</ExpansionPanelDetails>
			)}
		</ExpansionPanel>
	);
});

function getUrl(route) {
	const {
		start_address,
		end_address,
	} = route.routes[0].legs[0];

	return `https://www.google.com/maps/dir/?api=1&origin=${start_address}&destination=${end_address}&travelmode=bicycling`;
}

export default BikeRouteCard;