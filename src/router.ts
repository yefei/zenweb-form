import * as Koa from 'koa';
import * as Router from '@koa/router';
import { Form } from './form';
import { FormController, FormData, FormInit, RouterPath } from './types';

async function formInit(controller: FormController, ctx: Koa.Context, data?: FormData) {
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
