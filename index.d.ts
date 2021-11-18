import { Context } from 'koa';
import * as Router from 'koa-router';
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
  middleware?: Router.IMiddleware[];

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
  export declare class Input {
    constructor(label: string);
    get options(): FormField;
    type(type: castType | castTypeFunc): this;
    help(help: string): this;
    required(is: boolean | string): this;
    validate(validate: validates): this;
    build(): Promise<FormField & { widget: string }>;
    attr(): Promise<{}>;
    postValidate(data: any): Promise<void>;
    fail(code: string, params?: any): void;
  }

  export declare function number(label: string): Input;
  export declare function int(label: string): Input;
  export declare function float(label: string): Input;
  export declare function bool(label: string): Input;
  export declare function trim(label: string): Input;
  export declare function string(label: string): Input;
  export declare function origin(label: string): Input;

  export declare class Select extends Input {
    choices(choices: {value: any, label: string}[]): this;
    choicesMap(choices: {}[], valueKey: string, labelKey: string): this;
  }

  export declare function select(label: string): Select;

  export declare class Radio extends Select {}
  export declare function radio(label: string): Radio;

  export declare class Multiple extends Select {
    max(v: number): this;
    min(v: number): this;
  }

  export declare function multiple(label: string): Multiple;

  export declare class Checkbox extends Multiple {}
  export declare function checkbox(label: string): Checkbox;

  export declare class Date extends Input {
  }

  export declare function date(label: string): Date;
}

declare module '@zenweb/core' {
  interface Core {
    formRouter(
      path: string | RegExp | (string | RegExp)[],
      controller: FormController
    ): Router;
  }
}
