import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
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

const BikeRouteCard = ({
	route,
}) => {
	const classes = useStyles();

	let duration, distance, arrivalTime, onClickProp = {};
	
	if (route) {
		const leg = route.routes[0].legs[0];
		duration = leg.duration.text;
		distance = leg.distance.text;
		arrivalTime = route.arrivalTime;
		onClickProp.onClick = () => {
			const {
				start_address,
				end_address,
			} = route.routes[0].legs[0];
			const url = `https://www.google.com/maps/dir/?api=1&origin=${start_address}&destination=${end_address}&travelmode=bicycling`;

			const win = window.open(url, '_blank');
			win.focus();
		};
	}

	return (
		<Card className={classes.card}>
			<CardActionArea {...onClickProp}>
				<CardContent>
					<Typography>
						<>
							<DirectionsBikeIcon />
							<span className={classes.duration}>{duration}</span>
							<span className={classes.arrivalTime}>{arrivalTime}</span>
							{distance
								? <span className={classes.distance}>({distance})</span>
								: null
							}
						</>
					</Typography>
				</CardContent>
			</CardActionArea>
		</Card>	
	);
}

export default BikeRouteCard;