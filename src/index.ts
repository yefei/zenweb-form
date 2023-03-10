import { SetupFunction } from '@zenweb/core';
export { Form } from './form';
export { fields } from './field/index';
export * from './types';

export default function setup(): SetupFunction {
  return function form(setup) {
    setup.assertModuleExists('messagecode', 'need to setup @zenweb/messagecode');
    setup.core.messageCodeResolver.assign(require('../message-codes.json'));
  }
}
