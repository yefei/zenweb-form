export { Form } from './lib/form.js';
export { formRouter } from './lib/router.js';
export { fields } from './lib/field/index.js';

/**
 * 安装
 * @param {import('@zenweb/core').Core} core
 */
export function setup(core) {
  core.check('@zenweb/router');
  core.check('@zenweb/body');
}
