import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import valuesIn from '../valuesIn.js';
var func = convert('valuesIn', valuesIn, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
