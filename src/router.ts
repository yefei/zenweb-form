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
    controller.form = new Form();
    controller.form.init(controller, null);
    if (controller.get) {
      return controller.get();
    }
    const out = { fields: controller.form.fields, layout: controller.form.layout };
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
    controller.form = new Form();
    controller.form.init(controller, data);
    if (controller.form.valid) {
      return controller.post();
    }
    if (controller.fail) {
      return controller.fail();
    }
    const out = { errors: controller.form.errorMessages(ctx.messageCodeResolver) };
    if (ctx.fail) {
      return ctx.fail({ message: 'form valid error', data: out });
    }
    ctx.body = out;
    ctx.status = 422;
  });
}
