import convert from './convert.js';
import pad from '../pad.js';
var func = convert('pad', pad);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
