export function asyncCache(func, useCache) {
	if (useCache) {
		const Cache = {}

		return (...args) => {
			const key = JSON.stringify(args.filter(arg => typeof arg !== 'function'));
			if (Cache[key]) {
				console.log('cache hit')
				return Promise.resolve(Cache[key]);
			}

			return func(...args).then((result) => {
				console.log('cache miss')
				
				Cache[key] = result;
				return result;
			});
		}
	} else {
		console.log('no cache')
		
		return func;
	}
}
