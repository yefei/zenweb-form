import { Input } from './input.js';
import * as select from './select.js';
import * as datetime from './datetime.js';
import * as upload from './upload.js';
import * as text from './text.js';

/**
 * 带有类型的简单字段
 * @param {*} type 
 * @returns {(label) => Input}
 */
export function typeInput(type) {
  return function (label) {
    return new Input(label).type(type);
  };
}

export const fields = {
  Input,
};

for (const type of ['number', 'int', 'float', 'bool', 'trim', 'string', 'origin']) {
  fields[type] = typeInput(type);
}

// field function
for (const [name, clazz] of Object.entries(Object.assign({}, select, datetime, upload, text))) {
  fields[name] = clazz;
  fields[name.charAt(0).toLowerCase() + name.slice(1)] = function (options) {
    return new clazz(options);
  };
}
