import * as path from 'path';
import { SetupFunction } from '@zenweb/core';
export { Form, FormBase } from './form';
export { Field } from './field';
export * from './fields';
export * from './types';

/**
 * form html template library
 */
export const formTemplate = path.join(__dirname, '..', 'template');

/**
 * zenweb module setup
 */
export default function setup(): SetupFunction {
  return function form(setup) {
    setup.assertModuleExists('messagecode', 'need to setup @zenweb/messagecode');
    setup.core.messageCodeResolver.assign(require('../message-codes.json'));
  }
}
