import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
	origin: null,
	destination: null,
	bikeRoute: null,
	mixedRoute: null,
	placeDetails: {},
	travelMode: 'bike',
}

const slice = createSlice({
	name: 'directions',
	initialState,
	reducers: {
		setOrigin(state, action) {
			state.origin = action.payload;
		},
		setDestination(state, action) {
			state.destination = action.payload;
		},
		setBikeRoute(state, action) {
			state.bikeRoute = action.payload;
		},
		setMixedRoute(state, action) {
			state.mixedRoute = action.payload;
		},
		setPlaceDetails(state, action) {
			state.placeDetails = {
				...state.placeDetails,
				[action.payload.placeId]: action.payload.place,
			};
		},
		setTravelMode(state, action) {
			state.travelMode = action.payload;
		},
	}
});

export const {
	setOrigin,
	setDestination,
	setBikeRoute,
	setMixedRoute,
	setPlaceDetails,
	setTravelMode,
} = slice.actions;

export default slice.reducer