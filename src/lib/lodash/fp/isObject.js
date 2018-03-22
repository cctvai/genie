import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isObject from '../isObject.js';
let func = convert('isObject', isObject, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;