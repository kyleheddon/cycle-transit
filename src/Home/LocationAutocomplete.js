import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const LocationAutocomplete = ({
	options,
	onOptionChange,
	label,
	onChange,
	value,
	id,
	inputProps,
	renderOption,
	isOpen,
	onOpen,
	onClose,
	loading,
}) => {
	return (
		<Autocomplete
			disableOpenOnFocus
			id={id}
			options={options}
			value={value}
			freeSolo
			open={isOpen}
			onOpen={onOpen}
			onClose={onClose}
			renderInput={params => (
				<TextField
					{...params}
					label={label}
					onChange={(event) => {
						onChange(event.target.value);
					}}
					fullWidth
					inputProps={{
						...params.inputProps,
						...inputProps,
						autoComplete: "off",
					}}
				/>
			)}
			renderOption={renderOption}
			onChange={(event, option) => {
				onOptionChange(option);
			}}
			loading={loading}
		/>
	);
}

LocationAutocomplete.defaultProps = {
	inputProps: {},
}

export default LocationAutocomplete;