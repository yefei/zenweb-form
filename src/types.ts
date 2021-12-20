import { castTypeOption } from 'typecasts';
import { Input } from './field/input';

export type Fields = { [name: string]: FormField | Input };
export type FormData = { [name: string]: any };
export type Layout = string | Layout[];

export interface FormField extends castTypeOption {
  /** 显示标签 */
  label?: string;

  /** 帮助信息 */
  help?: string;
}
