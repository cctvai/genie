import convert from './convert.js';
import findLast from '../findLast.js';
var func = convert('findLast', findLast);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
