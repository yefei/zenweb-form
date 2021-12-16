import { Form } from './form.js';

/**
 * @param {import('..').FormController} controller 
 * @param {import('koa').Context} ctx 
 * @returns 
 */
async function formInit(controller, ctx, data) {
  /** @type {import('./form').FormInit} */
  const init = {};
  await controller.init(ctx, init);
  const form = new Form();
  form.init(init, data);
  return form;
}

/**
 * @param {import('@zenweb/router').Router} router
 * @param {string | RegExp | (string | RegExp)[]} path 
 * @param {import('..').FormController} controller 
 */
export function formRouter(router, path, controller) {
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
    const out = { errors: form.errorMessages(ctx.core.messageCodeResolver) };
    if (ctx.fail) {
      return ctx.fail({ message: 'form valid error', data: out });
    }
    ctx.body = out;
    ctx.status = 422;
  });
}
