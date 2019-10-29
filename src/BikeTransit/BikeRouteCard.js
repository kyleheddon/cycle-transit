import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	card: {
		marginTop: theme.spacing(1),
	},
	cardContent: {
		paddingLeft: theme.spacing(3),
		paddingRight: theme.spacing(3),
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		display: 'flex',
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
	progress: {
		marginLeft: theme.spacing(1.75),
	}
}));

const BikeRouteCard = ({
	route,
}) => {
	const classes = useStyles();

	let onClickProp = {};
	
	if (route) {
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
				<CardContent className={classes.cardContent}>
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
				</CardContent>
			</CardActionArea>
		</Card>	
	);
}

export default BikeRouteCard;