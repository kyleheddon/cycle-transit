import React, { useState, useCallback } from 'react';
import AppBar from '@material-ui/core/AppBar';
import FormGroup from '@material-ui/core/FormGroup';
import { makeStyles } from '@material-ui/core/styles';

import LocationAutocomplete from '../BikeTransit/LocationAutocomplete';
import { debounce } from '../BikeTransit/util';
import {
	makeRoute,
	locationAutoComplete,
	reverseGeocode,
} from '../BikeTransit/api';

const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(0, 1),
		backgroundColor: 'white',
	}
}));

const SearchBar = ({
	onSelectOption,
	selectedOption,
}) => {
	const [value, setValue] = useState('');
	const [options, setOptions] = useState([]);
	const debounceOnTextInput = useCallback(debounce((value) => {
		if (!value.trim()) {
			return;
		}
		locationAutoComplete(value.trim()).then((results) => {
			if (results.status !== 'OK') {
				return;
			}
			setOptions(results.predictions);
		});
	}, 250), []);
	const classes = useStyles();

	return (
		<AppBar position="static" className={classes.root}>
			<LocationAutocomplete
				options={options}
				onOptionChange={onSelectOption}
				label="Find a place"
				onChange={(value) => {
					setValue(value);
					debounceOnTextInput(value);
				}}
				value={selectedOption ? selectedOption.structured_formatting.main_text : value}
				id="search_bar_autocomplete"
			/>
		</AppBar>
	);
}

export default SearchBar;