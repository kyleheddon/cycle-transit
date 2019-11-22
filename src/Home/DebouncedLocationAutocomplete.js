import React, { useState, useCallback } from 'react';
import LocationAutocomplete from './LocationAutocomplete';
import { debounce } from '../BikeTransit/util';
import { getUserLocation } from './util';
import {
	locationAutoComplete,
	reverseGeocode,
	findPlace,
} from '../BikeTransit/api';
import AutocompleteOption from './AutocompleteOption';

const OptionTypes = {
	CurrentLocation: 'current_location',
	AutocompleteResult: 'autocomplete_result',
}

const userLocationOption = {
	type: OptionTypes.CurrentLocation,
	text: 'Your Location',
}

const DebouncedLocationAutocomplete = ({
	label,
	id,
	onSelectOption,
	selectedOption,
	canSelectUserLocation,
}) => {
	const [value, setValue] = useState('');
	const [loadingCurrentPosition, setLoadingCurrentPosition] = useState(false);
	const [userLocation, setUserLocation] = useState({});
	const [options, setOptions] = useState([]);
	const debounceOnTextInput = useCallback(debounce((value) => {
		if (!value.trim()) {
			return;
		}
		getAutocompleteResults(value.trim()).then((results) => {
			setOptions(results);
		});
	}, 250), []);

	const handleSelectOption = (option) => {
		if (option && option.type === OptionTypes.CurrentLocation) {
			setLoadingCurrentPosition(true);
			setValue(option.text);
			getUserPlace()
				.then((result) => {
					setLoadingCurrentPosition(false);
					setValue('');
					onSelectOption({
						...result,
						...option,
						description: result.formatted_address,
					});
				});
		} else {
			setValue('');
			onSelectOption(option);
		}
	}

	let selectedValue = value;
	if (selectedOption) {
		if (selectedOption.type === OptionTypes.AutocompleteResult) {
			selectedValue = selectedOption.structured_formatting.main_text;
		} else {
			selectedValue = selectedOption.text;
		}
	}

	let allOptions = options;
	if (options.length === 0 && canSelectUserLocation) {
		allOptions = [userLocationOption];
	}

	return (
		<LocationAutocomplete
			options={allOptions}
			onOptionChange={handleSelectOption}
			label={label}
			onChange={(value) => {
				setValue(value);
				debounceOnTextInput(value);
			}}
			value={selectedValue}
			id={id}
			renderOption={(option) => {
				if (option.type === OptionTypes.AutocompleteResult) {
					return <AutocompleteOption option={option} />
				} else if (option.type === OptionTypes.CurrentLocation) {
					return <div>{option.text}</div>
				}
			}}
		/>
	);
}

async function getUserPlace() {
	const result = await getUserLocation();
	return result.results[0];
}

async function getAutocompleteResults(str) {
	const results = await locationAutoComplete(str);
	if (results.status !== 'OK') {
		console.log('unexpected autoComplete results');
		return [];
	}
	return results.predictions.map(p => ({
		...p,
		type: OptionTypes.AutocompleteResult,
	}));
}

export default DebouncedLocationAutocomplete;