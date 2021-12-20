import * as Koa from 'koa';
import * as Router from '@koa/router';
import { Form } from './form';
import { Fields, FormData, Layout } from './types';

type RouterPath = string | RegExp | (string | RegExp)[];

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
  middleware?: Router.Middleware[];

  /** 表单初始化 */
  init?(ctx: Koa.BaseContext, init: FormInit): void | Promise<void>;

  /** 覆盖默认表单 get 请求 */
  get?(ctx: Koa.BaseContext, form: Form): void | Promise<void>;

  /** 表单提交时调用 */
  post?(ctx: Koa.BaseContext, form: Form): void | Promise<void>;

  /** 表单验证失败时调用 */
  fail?(ctx: Koa.BaseContext, form: Form): void | Promise<void>;
}

async function formInit(controller: FormController, ctx: Koa.BaseContext, data?: FormData) {
  const init: FormInit = {
    fields: {},
  };
  await controller.init(ctx, init);
  const form = new Form();
  form.init(init, data);
  return form;
}

/**
 * 表单控制器, 从创建到校验
 */
export function formRouter(router: Router, path: RouterPath, controller: FormController) {
  router.get(path, ...controller.middleware || [], async ctx => {
    const form = await formInit(controller, ctx);
    if (controller.get) {
      return controller.get(ctx, form);
    }
    const out = { fields: form.fields, layout: form.layout };
    if (ctx.success) {
      return ctx.success(out);
    }
    ctx.body = out;
  });

  router.post(path, ...controller.middleware || [], async ctx => {
    const form = await formInit(controller, ctx, ctx.request.body);
    if (form.valid) {
      return controller.post(ctx, form);
    }
    if (controller.fail) {
      return controller.fail(ctx, form);
    }
    const out = { errors: form.errorMessages(ctx.messageCodeResolver) };
    if (ctx.fail) {
      return ctx.fail({ message: 'form valid error', data: out });
    }
    ctx.body = out;
    ctx.status = 422;
  });
}
