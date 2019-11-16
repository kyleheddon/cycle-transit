import './hacks';
import React from 'react';
import { Route, Switch } from 'react-router-dom'; 
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';
import Home from './Home';

const theme = createMuiTheme({
	palette: {
		primary: blue,
	},
});

const Component = (props) => (
	<ThemeProvider theme={theme}>
		<Home {...props} />
	</ThemeProvider>
)

const App = () => (
	<Switch>
		<Route exact path="/" component={Component} />
	</Switch>
);

export default App;
