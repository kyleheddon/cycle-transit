import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ATLANTA_BOUNDS } from '../constants';

const initialState = {
	ne: {
		lat: 33.7489954,
		lng: -84.3879824,
	},
	sw: {
		lat: 33.7489954,
		lng: -84.3879824,
	},
}

const slice = createSlice({
	name: 'map',
	initialState,
	reducers: {
		setBoundsNe(state, action) {
			state.ne = action.payload;
		},
		setBoundsSw(state, action) {
			state.sw = action.payload;
		},
	}
});

export const {
	setBoundsNe,
	setBoundsSw,
} = slice.actions;

export default slice.reducer