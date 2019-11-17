import React, { Component } from 'react';
import BikeTransit from './BikeTransit';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	logo: {
		padding: theme.spacing(0.5),
		paddingLeft: theme.spacing(1),
	}
}));

const Home = () => {
	const classes = useStyles();
	return (
		<div>
			<CssBaseline />
			<AppBar color="default" className={classes.logo}>
				<Typography variant="h4" component="h1">
					<Link href="/" color="inherit">
						Atl Bike + Transit
					</Link>
				</Typography>
			</AppBar>
			<Container
				style={{
					paddingTop: '4rem',
				}}
			>
				<BikeTransit />
			</Container>
		</div>
	);
}

export default Home;
