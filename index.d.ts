import { Context } from 'koa';
import Router from '@koa/router';
import { castTypeOption, castType, castTypeFunc, validates } from 'typecasts';
import { Core } from '@zenweb/core';

interface FormField extends castTypeOption {
  /** 显示标签 */
  label?: string;

  /** 帮助信息 */
  help?: string;
}

type Fields = { [name: string]: FormField };
type Layout = string | Layout[];

interface FormInit {
  /** 表单字段 */
  fields: Fields;

  /** 表单布局，如果不设置或者缺少字段，则自动按顺序追加到结尾 */
  layout?: Layout[];

  /** 表单字段初始值 */
  initial?: { [name: string]: any };
}

declare class Form {
  constructor(
    core: Core,
    init: FormInit,
    data: { [name: string]: any },
  );
  get fileds(): Fields;
  get initial(): { [name: string]: any };
  get valid(): boolean;
  get data(): { [name: string]: any };
  get errors(): { [name: string]: any };
  get layout(): Layout[];
}

interface FormController {
  /** koa 中间件 */
  middleware?: Router.Middleware[];

  /** 表单初始化 */
  init(ctx: Context, init: FormInit): Promise<void>;

  /** 覆盖默认表单 get 请求 */
  get(ctx: Context, form: Form): Promise<void>;

  /** 表单提交时调用 */
  post(ctx: Context, form: Form): Promise<void>;

  /** 表单验证失败时调用 */
  fail(ctx: Context, form: Form): Promise<void>;
}

export interface FormOption {
}

export namespace fields {
  export class Input {
    constructor(label: string);
    get options(): FormField;
    type(type: castType | castTypeFunc): this;
    help(help: string): this;
    required(is: boolean | string): this;
    default(value: any): this;
    validate(validate: validates): this;
    build(): Promise<FormField & { name: string }>;
    attr(): Promise<{}>;
    postValidate(data: any): Promise<void>;
    fail(code: string, params?: any): void;
  }

  export function number(label: string): Input;
  export function int(label: string): Input;
  export function float(label: string): Input;
  export function bool(label: string): Input;
  export function trim(label: string): Input;
  export function string(label: string): Input;
  export function origin(label: string): Input;

  export class Select extends Input {
    choices(choices: {value: any, label: string}[]): this;
    choicesMap(choices: {}[], valueKey: string, labelKey: string): this;
  }

  export function select(label: string): Select;

  export class Radio extends Select {}
  export function radio(label: string): Radio;

  export class Multiple extends Select {
    max(v: number): this;
    min(v: number): this;
  }

  export function multiple(label: string): Multiple;

  export class Checkbox extends Multiple {}
  export function checkbox(label: string): Checkbox;

  export class Datetime extends Input {
    format(fmt: string): this;
  }
  export class Date extends Datetime {}
  export class Time extends Datetime {}

  export function datetime(label: string): Datetime;
  export function date(label: string): Date;
  export function time(label: string): Time;

  export class Upload extends Input {
    action(url: string): this;
    limit(limit: number): this;
  }
  export function upload(label: string): Upload;

  export class Text extends Input {
    length(minLength: number, maxLength: number): this;
  }
  export class Textarea extends Text {
    rows(min: number, max: number): this;
  }
  export function text(label: string): Text;
  export function textarea(label: string): Textarea;
}

/**
 * 表单控制器, 从创建到校验
 * @param router 
 * @param path 
 * @param controller 
 */
export declare function formRouter(
  router: Router,
  path: string | RegExp | (string | RegExp)[],
  controller: FormController,
): void;
