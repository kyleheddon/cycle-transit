import { combineReducers } from '@reduxjs/toolkit';
import directionsReducer from './directionsSlice';
import mapReducer from './mapSlice';

const rootReducer = combineReducers({
	directions: directionsReducer,
	map: mapReducer,
});

export default rootReducer;
