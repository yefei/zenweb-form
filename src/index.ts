import path from 'node:path';
import { SetupFunction } from '@zenweb/core';
import { fileURLToPath } from 'node:url';
import mcodes from './message-codes.js';

export { Form, FormBase } from './form.js';
export { Field } from './field.js';
export * from './fields/index.js';
export * from './types.js';


const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
    setup.core.messageCodeResolver.assign(mcodes);
  }
}
