'use strict';

const { Form } = require('./lib/form');
const { formRouter } = require('./lib/router');
const fields = require('./lib/field/index');

/**
 * 安装
 * @param {import('@zenweb/core').Core} core
 */
function setup(core) {
  core.check('@zenweb/router');
  core.check('@zenweb/body');
  core.check('@zenweb/messagecode');
  Object.defineProperty(core, 'formRouter', { value: formRouter });
}

module.exports = {
  setup,
  fields,
  Form,
};
