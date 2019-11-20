import './hacks';
import React from 'react';
import { Route, Switch } from 'react-router-dom'; 
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';
import Home from './Home/index';
import { runtimeConfig } from './config';

const theme = createMuiTheme({
	palette: {
		primary: blue,
	},
});

const App = ({
}) => (
	<Switch>
		<Route exact path="/" 
			component={(props) => {
				return (
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<Home {...props} googleMapsApiKey={runtimeConfig.googleMapsApiKey} />
					</ThemeProvider>
				);
			}}
		/>
	</Switch>
);

export default App;
