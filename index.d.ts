import { Context } from 'koa';
import * as Router from 'koa-router';
import { castTypeOption } from 'typecasts';
import { Core } from '@zenweb/core';

interface FormField extends castTypeOption {
  label?: string;
  help?: string;
}

type Fields = { [name: string]: FormField };
type Layout = string | Layout[];

declare class Form {
  constructor(
    core: Core,
    fileds: Fields,
    data: { [name: string]: any },
    initial: { [name: string]: any },
    layout: Layout[],
  );
  get fileds(): Fields;
  get initial(): { [name: string]: any };
  get valid(): boolean;
  get data(): { [name: string]: any };
  get errors(): { [name: string]: any };
  get layout(): Layout[];
}

interface FormController {
  middleware?: Router.IMiddleware[];
  fields: Fields;
  layout?: Layout[];
  initial(ctx: Context): Promise<{ [name: string]: any }>;
  get(ctx: Context, form: Form): Promise<void>;
  post(ctx: Context, form: Form): Promise<void>;
  fail(ctx: Context, form: Form): Promise<void>;
}

export interface FormOption {
}

declare module '@zenweb/core' {
  interface Core {
    formRouter(
      path: string | RegExp | (string | RegExp)[],
      controller: FormController
    ): Router;
  }
}
