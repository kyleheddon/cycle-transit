import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';

const useStyles = makeStyles((theme) => ({
	button: {
		width: '100%',
		textAlign: 'center',
		color: 'white',
	},
	fab: {
		width: '100%',
		textAlign: 'center',
		backgroundColor: 'white !important',
		borderRadius: '16px',
		color: '#4285F4',
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
			<Button
				className={classes.fab}
				onClick={onClick}
			>
				{icon}
				<span> {text}</span>
			</Button>
		);
	} else {
		return (
			<Button
				className={classes.button}
				onClick={onClick}
			>
				{icon}
				<span> {text}</span>
			</Button>
		);
	}
}

export default TravelMode;