/*
 * BEGIN HACK
 * TextField must be imported before Autocomplete for unknown reasons.
 * If Autocomplete is imported first, the endAdornment icon gets placed
 * below the TextField. In order to fix this across the entire app,
 * the imports have been moved to this root level component.
*/
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
/* END HACK */
