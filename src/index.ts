import { SetupFunction } from '@zenweb/core';
export { Form } from './form';
export { formRouter } from './router';
export { fields } from './field/index';
export * from './types';

export default function setup(): SetupFunction {
  return function form(setup) {
    setup.checkCoreProperty('messageCodeResolver', 'need to setup @zenweb/messagecode');
    setup.core.messageCodeResolver.assign(require('../message-codes.json'));
  }
}
