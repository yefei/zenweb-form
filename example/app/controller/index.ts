import { Context, inject, mapping } from 'zenweb';
import { ExampleForm } from '../form/example';

export class IndexController {
  @inject
  ctx: Context

  @mapping({ method: 'POST' })
  upload() {
    this.ctx.success({
      url: (<any>this.ctx.request.files.file).originalFilename,
    });
  }

  @inject
  form: ExampleForm;

  @mapping({ path: '/form' })
  formGet() {
    this.form.data = { name: '默认名字' };
    this.ctx.success(this.form.result);
  }

  @mapping({ path: '/form', method: 'POST' })
  formPost() {
    this.form.assert(this.ctx.request.body);
    this.ctx.success(this.form.data);
  }

  /**
   * 合并处理
   */
  @mapping({ method: ['GET', 'POST'] })
  merge(ctx: Context, form: ExampleForm) {
    if (ctx.method === 'GET') {
      form.data = { name: '默认名字' };
    } else {
      form.assert(ctx.request.body);
      return ctx.success(form.data);
    }
    ctx.success(form.result);
  }
}
