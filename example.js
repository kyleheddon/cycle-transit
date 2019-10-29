function getAllTheThings() {
	return getThings().then((things) => {
		return getOtherThings().then((others) => {
			return {
				otherThings,
				things,
			}
		});
	}).then((alltheThings) => {
		console.log(alltheThings);
		return alltheThings;
	});
}

async function getAllTheThings_v2() {
	const things = await getThings();
	const otherthings = await getOtherThings();
	
	return {
		otherThings,
		things,
	};
}