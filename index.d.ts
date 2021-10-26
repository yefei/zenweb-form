import { Context } from 'koa';
import * as Router from 'koa-router';
import { castTypeOption } from 'typecasts';

interface FormField extends castTypeOption {
  label?: string;
  help?: string;
}

type Fields = { [name: string]: FormField };

declare class Form {
  constructor(data: { [name: string]: any }, initial: { [name: string]: any });
  get fileds(): Fields;
  get initial(): { [name: string]: any };
  get valid(): boolean;
  get data(): { [name: string]: any };
  get errors(): { [name: string]: any };
}

interface FormController {
  middleware?: Router.IMiddleware[];
  fields: Fields;
  initial(ctx: Context): Promise<{ [name: string]: any }>;
  get(ctx: Context, form: Form): Promise<void>;
  post(ctx: Context, form: Form): Promise<void>;
  fail(ctx: Context, form: Form): Promise<void>;
}

declare module '@zenweb/core' {
  interface Core {
    formRouter(
      path: string | RegExp | (string | RegExp)[],
      controller: FormController
    ): Router;
  }
}
