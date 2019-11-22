import React from 'react';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import parse from 'autosuggest-highlight/parse';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	icon: {
		color: theme.palette.text.secondary,
		marginRight: theme.spacing(2),
	},
}));

const AutocompleteOption = ({
	option,
}) => {
	const classes = useStyles();

	const matches = option.structured_formatting.main_text_matched_substrings;
	const parts = parse(
		option.structured_formatting.main_text,
		matches.map(match => [match.offset, match.offset + match.length]),
	);
	return (
		<Grid container alignItems="center">
			<Grid item>
				<LocationOnIcon className={classes.icon} />
			</Grid>
			<Grid item xs>
				{parts.map((part, index) => (
					<span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
						{part.text}
					</span>
				))}
				<Typography variant="body2" color="textSecondary">
					{option.structured_formatting.secondary_text}
				</Typography>
			</Grid>
		</Grid>
	);
}

export default AutocompleteOption;