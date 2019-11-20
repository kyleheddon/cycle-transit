import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	root: {
		position: 'absolute',
		bottom: 0,
	}
}));

const PlaceDetails = ({
	place,
	onDirectionsClick,
}) => {
	const classes = useStyles();
	return (
		<Card className={classes.root}>
			<CardContent>
				<Typography variant="h5" component="h3">
					{place.name}
				</Typography>
				<Typography component="p">
					{place.formatted_address}
				</Typography>
			</CardContent>
			<CardActions disableSpacing>
				<Button
					aria-label={`directions to ${place.name}`}
					color="primary"
					variant="contained"
					onClick={onDirectionsClick}
				>
					Directions
				</Button>
			</CardActions>
		</Card>
	);
}

export default PlaceDetails;