import * as Koa from 'koa';
import { CastOption } from 'typecasts';
import { Input } from './field/input';
import { Form } from './form';

export type FieldType = FieldOption | Input;
export type Fields = { [name: string]: FieldType };
export type FormData = { [name: string]: any };
export type Layout = string | Layout[];

export interface FieldOption extends CastOption {
  /** 显示标签 */
  label?: string;

  /** 帮助信息 */
  help?: string;
}

export type RouterPath = string | RegExp | (string | RegExp)[];

export interface FormInit {
  /** 表单字段 */
  fields: Fields;

  /** 表单布局，如果不设置或者缺少字段，则自动按顺序追加到结尾 */
  layout?: Layout[];

  /** 表单字段初始值 */
  initial?: FormData;
}

export interface FormController {
  /** koa 中间件 */
  middleware?: Koa.Middleware[];

  /** 表单初始化 */
  init?(ctx: Koa.Context, init: FormInit): void | Promise<void>;

  /** 覆盖默认表单 get 请求 */
  get?(ctx: Koa.Context, form: Form): void | Promise<void>;

  /** 表单提交时调用 */
  post?(ctx: Koa.Context, form: Form): void | Promise<void>;

  /** 表单验证失败时调用 */
  fail?(ctx: Koa.Context, form: Form): void | Promise<void>;
}
