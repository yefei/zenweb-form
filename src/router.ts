import '@zenweb/body';
import { Router } from '@zenweb/router';
import { Form } from './form';
import { FormController, FormControllerClass, RouterPath } from './types';

/**
 * 表单控制器, 从创建到校验
 */
export function formRouter<C extends FormController>(router: Router, path: RouterPath, controllerClass: FormControllerClass<C>) {
  router.get(path, ...controllerClass.middleware || [], async ctx => {
    const controller = new controllerClass(ctx);
    if (controller.init) {
      await controller.init();
    }
    const form = new Form();
    form.init(controller, null);
    if (controller.get) {
      return controller.get(form);
    }
    const out = { fields: form.fields, layout: form.layout };
    if (ctx.success) {
      return ctx.success(out);
    }
    ctx.body = out;
  });

  router.post(path, ...controllerClass.middleware || [], async ctx => {
    let data = ctx.request.body;
    if (ctx.request.bodyType === 'text') {
      data = {};
    }
    const controller = new controllerClass(ctx);
    if (controller.init) {
      await controller.init();
    }
    const form = new Form();
    form.init(controller, data);
    if (form.valid) {
      return controller.post(form);
    }
    if (controller.fail) {
      return controller.fail(form);
    }
    const out = { errors: form.errorMessages(ctx.messageCodeResolver) };
    if (ctx.fail) {
      return ctx.fail({ message: 'form valid error', data: out });
    }
    ctx.body = out;
    ctx.status = 422;
  });
}
