import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';

const useStyles = makeStyles((theme) => ({
	margin: {
		margin: theme.spacing(1),
	},
	fab: {
		margin: theme.spacing(1),
		backgroundColor: 'white',
		color: 'blue',
	},
	white: {
		color: 'white',
	},
	extendedIcon: {
		marginRight: theme.spacing(1),
	},
	blackText: {
		color: 'blue',
	},
}));

const TravelMode = ({
	icon,
	text,
	isSelected,
	onClick,
}) => {
	const classes = useStyles();
	if (isSelected) {
		return (
			<Fab
				variant="extended"
				size="small"
				color="primary"
				aria-label="add"
				className={classes.fab}
				onClick={onClick}
			>
				{icon}
				<span className={classes.blackText}> {text}</span>
			</Fab>
		);
	} else {
		return (
			<Button
				className={classes.margin}
				onClick={onClick}
			>
				<span className={classes.white}>
					{icon}
					<span> {text}</span>
				</span>
			</Button>
		);
	}
}

export default TravelMode;