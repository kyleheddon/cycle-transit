export function routeToSteps(route) {
	return route.routes[0].legs[0].steps.map(flattenSteps).reduce((acc, curr) => {
		return acc.concat(curr);
	}, []);
}

function flattenSteps(step) {
	if (step.steps) {
		return step.steps.reduce((acc, curr) => {
			return acc.concat(flattenSteps(curr))
		}, []);
	} else {
		return step;
	}
}

export function debounce(func, timeout) {
	let timeoutId = null;
	return (...args) => {
		window.clearTimeout(timeoutId);
		timeoutId = window.setTimeout(() => {
			func(...args);
		}, timeout);
	}
}