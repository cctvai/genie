import convert from './convert.js';
import unionWith from '../unionWith.js';
var func = convert('unionWith', unionWith);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
