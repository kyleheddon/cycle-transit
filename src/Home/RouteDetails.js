import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ListIcon from '@material-ui/icons/List';
import MixedRouteSteps from './MixedRouteSteps';
import MapsLink from './MapsLink';
import { makeStyles } from '@material-ui/core/styles';
import { getRouteMapUrl } from './util';

const useStyles = makeStyles((theme) => ({
	actions: {
		background: '#f5f5f5',
	},
	padding: {
		padding: theme.spacing(1),
	},
	panel: {
		width: '100%',
		background: 'inherit',
		boxShadow: 'none',
		'& .MuiExpansionPanelSummary-root': {
			padding: 0,
		},
		'& .MuiExpansionPanelDetails-root': {
			padding: 0,
		},
	},
}));

const RouteDetails = ({
	bikeRoute,
	mixedRoute,
	travelMode,
}) => {
	const classes = useStyles();
	const openMaps = (route, travelMode) => () => {
		window.location = getRouteMapUrl(route, travelMode);
	}
	return (
		<Card>
			<CardContent>
				{(() => {
					if (travelMode === 'bike') {
						if (bikeRoute) {
							const leg = bikeRoute.routes[0].legs[0];
							return (
								<>
									<Typography variant="h5" component="h3">
										<span>
											<span>{leg.duration.text} </span>
											<span style={{ color: 'grey' }}>
												({leg.distance.text})
											</span>
										</span>
									</Typography>
									<Typography component="p">
										Via {bikeRoute.routes[0].summary}
									</Typography>
								</>
							);
						}
					} else if (mixedRoute) {
						const {
							firstBikeRoute,
							transitRoute,
							lastBikeRoute,
							stations,
						} = mixedRoute;
						const distance = getMiles(firstBikeRoute) + getMiles(lastBikeRoute);
						
						return (
							<>
								<Typography variant="h5" component="h3">
									<span>
										<span>{mixedRoute.duration} </span>
										<span style={{ color: 'grey' }}>
											({Number((distance).toFixed(1))} mi)
										</span>
									</span>
								</Typography>
								<Typography component="p">
									Via {firstBikeRoute.routes[0].summary}, Marta, {lastBikeRoute.routes[0].summary}
								</Typography>
							</>
						);
					}

					return null;
				})()}
			</CardContent>
			{(() => {
				if (bikeRoute && travelMode === 'bike') {
					return (
						<CardActions className={classes.actions}>
							<MapsLink route={bikeRoute} travelMode="bicycling">
								Open in Google Maps
							</MapsLink>
						</CardActions>
					);
				} else if (mixedRoute && travelMode === 'mixed') {
					return (
						<div className={classes.actions}>
							<CardActions>
								<ExpansionPanel className={classes.panel}>
									<ExpansionPanelSummary>
										<ListIcon />
										<span> Stepz</span>
									</ExpansionPanelSummary>
									<ExpansionPanelDetails>
										<div className={classes.padding}>
											<MixedRouteSteps route={mixedRoute} />
										</div>
									</ExpansionPanelDetails>
								</ExpansionPanel>
							</CardActions>
						</div>
					);
				}
			})()}
		</Card>
	);
}

function getMiles(route) {
	return route.routes[0].legs[0].distance.value * 0.00062137
}

export default RouteDetails;