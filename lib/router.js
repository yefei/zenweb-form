'use strict';

const { Form } = require('./form');

/**
 * @param {import('@zenweb/core').Core} core 
 * @param {import('..').FormController} controller 
 * @param {import('koa').Context} ctx 
 * @returns 
 */
async function formInit(core, controller, ctx, data) {
  /** @type {import('./form').FormInit} */
  const init = {};
  await controller.init(ctx, init);
  const form = new Form(core);
  form.init(init, data);
  return form;
}

/**
 * @param {string | RegExp | (string | RegExp)[]} path 
 * @param {import('..').FormController} controller 
 */
function formRouter(path, controller) {
  this.router.get(path, ...controller.middleware || [], async ctx => {
    const form = await formInit(this, controller, ctx);
    if (controller.get) {
      return controller.get(ctx, form);
    }
    const out = { fields: form.fields, layout: form.layout };
    if (ctx.success) {
      return ctx.success(out);
    }
    ctx.body = out;
  });

  this.router.post(path, ...controller.middleware || [], async ctx => {
    const form = await formInit(this, controller, ctx, ctx.request.body);
    if (form.valid) {
      return controller.post(ctx, form);
    }
    if (controller.fail) {
      return controller.fail(ctx, form);
    }
    const out = { errors: form.errorMessages };
    if (ctx.fail) {
      return ctx.fail({ message: 'form valid error', data: out });
    }
    ctx.body = out;
    ctx.status = 422;
  });
}

module.exports = {
  formRouter,
};
