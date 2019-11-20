export function getPlaceDetails(placeId) {
	return fetch(`/getPlaceDetails?placeId=${placeId}`).then(response => response.json());
}