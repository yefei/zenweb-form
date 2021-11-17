'use strict';

const typecastsMap = require('typecasts/lib/types');
const { Field, FieldFail } = require('./base');
const select = require('./select');

/**
 * 带有类型的简单字段
 * @param {*} type 
 * @returns {(label) => Field}
 */
function typeField(type) {
  return function (label) {
    return new Field(label).type(type);
  };
}

module.exports = {
  Field,
  FieldFail,
  typeField,
};

for (const type of Object.keys(typecastsMap)) {
  module.exports[type] = typeField(type);
}

// widget function
for (const [name, clazz] of Object.entries(select)) {
  module.exports[name.charAt(0).toLowerCase() + name.slice(1)] = function (options) {
    return new clazz(options);
  };
}
