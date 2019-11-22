import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

/*
 Todo: 
	<BikeRouteDetails /> 
		open route in maps
	<MixedRouteDetails /> 
		show steps
		
*/

const useStyles = makeStyles((theme) => ({
}));

const RouteDetails = ({
	bikeRoute,
	mixedRoute,
	travelMode,
}) => {
	const classes = useStyles();
	
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
		</Card>
	);
}

function getMiles(route) {
	return route.routes[0].legs[0].distance.value * 0.00062137
}

export default RouteDetails;