import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	card: {
		marginTop: theme.spacing(1),
	},
	distance: {
		marginLeft: theme.spacing(0.5),
		fontSize: '0.75rem',
	},
	arrivalTime: {
		marginLeft: theme.spacing(0.5),
		fontSize: '0.9rem',
	},
	duration: {
		marginLeft: theme.spacing(1),
		fontWeight: 700,
	},
}));

const RouteCard = ({
	distance,
	duration,
	arrivalTime,
	icon,
}) => {
	const classes = useStyles();

	return (
		<Card className={classes.card}>
			<CardContent>
				<Typography>
					<>
						{icon}
						<span className={classes.duration}>{duration}</span>
						<span className={classes.arrivalTime}>{arrivalTime}</span>
						{distance
							? <span className={classes.distance}>({distance})</span>
							: null
						}
					</>
				</Typography>
			</CardContent>
		</Card>
	);
}

export default RouteCard;