import React from 'react';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	icon: {
		color: theme.palette.text.secondary,
		marginRight: theme.spacing(2),
	},
}));

const CurrentLocationOption = ({
	option,
}) => {
	const classes = useStyles();

	return (
		<Grid container alignItems="center">
			<Grid item>
				<MyLocationIcon className={classes.icon} />
			</Grid>
			<Grid item xs>
				{option.text}
				<Typography variant="body2" color="textSecondary">
					{option.description}
				</Typography>
			</Grid>
		</Grid>
	);
}

export default CurrentLocationOption;