import { Context } from 'koa';
import * as Router from 'koa-router';
import { castTypeOption } from 'typecasts';
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

export namespace widget {
  interface WidgetAttr {
    type: string;
  }

  export declare class Widget {
    constructor(options: FormField);
    build(): Promise<FormField & { widget: WidgetAttr }>;
    attr(): Promise<WidgetAttr>;
    validate(data: any): Promise<void>;
    fail(code: string, params?: any): void;
  }

  export declare function widget(options: FormField): Widget;

  export declare class Select extends Widget {
    choices(...choices: { label: string, value: any }[]): Select;
  }

  export declare function select(options: FormField): Select;
}

declare module '@zenweb/core' {
  interface Core {
    formRouter(
      path: string | RegExp | (string | RegExp)[],
      controller: FormController
    ): Router;
  }
}
