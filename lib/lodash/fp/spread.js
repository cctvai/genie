import convert from './convert.js';
import spread from '../spread.js';
var func = convert('spread', spread);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
