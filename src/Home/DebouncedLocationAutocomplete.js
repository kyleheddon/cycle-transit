import React, { useState, useCallback } from 'react';
import LocationAutocomplete from '../BikeTransit/LocationAutocomplete';
import { debounce } from '../BikeTransit/util';
import { locationAutoComplete } from '../BikeTransit/api';

const DebouncedLocationAutocomplete = ({
	label,
	id,
	onSelectOption,
	selectedOption,
	inputProps,
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

	return (
		<LocationAutocomplete
			options={options}
			onOptionChange={onSelectOption}
			label={label}
			onChange={(value) => {
				setValue(value);
				debounceOnTextInput(value);
			}}
			value={selectedOption ? selectedOption.structured_formatting.main_text : value}
			id={id}
			inputProps={inputProps}
		/>
	);
}

export default DebouncedLocationAutocomplete;