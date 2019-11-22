import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const PlaceDetails = ({
	place,
}) => {
	return (
		<Card>
			<CardContent>
				<Typography variant="h5" component="h3">
					{place.name}
				</Typography>
				<Typography component="p">
					{place.formatted_address}
				</Typography>
			</CardContent>
		</Card>
	);
}

export default PlaceDetails;