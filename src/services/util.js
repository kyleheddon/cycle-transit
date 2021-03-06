export function asyncCache(func, useCache) {
	if (useCache) {
		const Cache = {}

		return (...args) => {
			const key = JSON.stringify(args.filter(arg => typeof arg !== 'function'));
			if (Cache[key]) {
				return Promise.resolve(Cache[key]);
			}

			return func(...args).then((result) => {
				Cache[key] = result;
				return result;
			});
		}
	} else {
		return func;
	}
}
