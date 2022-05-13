import { CastOption } from 'typecasts';
import { Input } from './field/input';

export type FieldType = FieldOption | Input;
export type Fields = { [name: string]: FieldType };
export type FormData = { [name: string]: any };
export type Layout = string | Layout[];

export interface FieldOption extends CastOption {
  /** 显示标签 */
  label?: string;

  /** 帮助信息 */
  help?: string;

  /** 只读字段，不可修改值 */
  readonly?: boolean;
}
