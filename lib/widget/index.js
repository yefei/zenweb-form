'use strict';

const typecastsMap = require('typecasts/lib/types');
const { Widget, WidgetFail } = require('./base');
const select = require('./select');

/**
 * 带有类型的简单 widget
 * @param {*} type 
 * @returns {(label) => Widget}
 */
function typeWidget(type) {
  return function (label) {
    return new Widget(label).type(type);
  };
}

module.exports = {
  Widget,
  WidgetFail,
  typeWidget,
};

for (const type of Object.keys(typecastsMap)) {
  module.exports[type] = typeWidget(type);
}

// widget function
for (const [name, clazz] of Object.entries(select)) {
  module.exports[name.charAt(0).toLowerCase() + name.slice(1)] = function (options) {
    return new clazz(options);
  };
}
