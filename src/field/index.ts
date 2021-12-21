import { Input, simple } from './input';
import * as select from './select';
import * as datetime from './datetime';
import * as upload from './upload';
import * as text from './text';
import { castType } from 'typecasts';

/**
 * 带有类型的简单字段
 */
export function typeInput(type: castType) {
  return function (label: string) {
    return new Input(label).type(type);
  };
}

export const fields = {
  Input,
  input: simple(Input),
  number: typeInput('number'),
  int: typeInput('int'),
  float: typeInput('float'),
  bool: typeInput('bool'),
  trim: typeInput('trim'),
  ...select,
  ...datetime,
  ...upload,
  ...text,
};
