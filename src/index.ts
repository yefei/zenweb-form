import { Core } from '@zenweb/core';
export { Form } from './form';
export { formRouter } from './router';
export { fields } from './field/index';

/**
 * 安装
 */
export function setup(core: Core, option?: any) {
  core.check('@zenweb/router');
  core.check('@zenweb/body');
}
