import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ATLANTA_BOUNDS } from '../constants';

const initialState = {
	bounds: {
		ne: {
			lat: 33.7489954,
			lng: -84.3879824,
		},
		sw: {
			lat: 33.7489954,
			lng: -84.3879824,
		},
	},
	zoom: 11,
}

const slice = createSlice({
	name: 'map',
	initialState,
	reducers: {
		setBounds(state, action) {
			state.bounds = action.payload;
		},
		setZoom(state, action) {
			state.zoom = action.payload;
		},
	}
});

export const {
	setBounds,
	setZoom,
} = slice.actions;

export default slice.reducer