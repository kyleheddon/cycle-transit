import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';

const render = () => {
	const App = require('./App').default;

	hydrate(
		<BrowserRouter>
			<Provider store={store}>
				<App />
			</Provider>
		</BrowserRouter>,
		document.getElementById('root')
	);
}

render();

if (module.hot) {
	module.hot.accept('./App', render);
}
