'use strict';

const typecastsMap = require('typecasts/lib/types');
const { Input, InputFail } = require('./input');
const select = require('./select');
const datetime = require('./datetime');
const upload = require('./upload');

/**
 * 带有类型的简单字段
 * @param {*} type 
 * @returns {(label) => Input}
 */
function typeInput(type) {
  return function (label) {
    return new Input(label).type(type);
  };
}

module.exports = {
  Input,
  InputFail,
  typeInput,
};

for (const type of Object.keys(typecastsMap)) {
  module.exports[type] = typeInput(type);
}

// field function
for (const [name, clazz] of Object.entries(Object.assign(select, datetime, upload))) {
  module.exports[name] = clazz;
  module.exports[name.charAt(0).toLowerCase() + name.slice(1)] = function (options) {
    return new clazz(options);
  };
}
